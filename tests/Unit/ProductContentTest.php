<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Modules\ProductCatalog\Filament\Resources\ProductResource\Schemas\ProductForm;
use Modules\ProductCatalog\Models\Product;
use Modules\ProductCatalog\Services\ProductImageLocalizer;
use Modules\ProductCatalog\Support\ProductContent;
use Tests\TestCase;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema as FormSchema;
use Illuminate\Http\UploadedFile;
use Livewire\Component;
use Livewire\Livewire;

class ProductContentTest extends TestCase
{
    public function test_filament_upload_saves_two_gallery_files_to_local_storage(): void
    {
        Storage::fake('public');
        $test = Livewire::test(ProductGalleryUploadForm::class)
            ->fillForm(['image_paths' => [
                UploadedFile::fake()->image('front.jpg', 100, 100),
                UploadedFile::fake()->image('side.png', 100, 100),
            ]])
            ->call('save')
            ->assertHasNoFormErrors();
        $paths = $test->get('savedPaths');
        $this->assertCount(2, $paths);
        foreach ($paths as $path) {
            $this->assertStringStartsWith('products/draft/gallery/', $path);
            Storage::disk('public')->assertExists($path);
        }
    }

    public function test_edit_round_trip_preserves_summary_certifications_and_grouped_specs(): void
    {
        $original = [
            'specs' => ['zoom' => '12x', 'certifications' => ['Microsoft Teams', 'Zoom Rooms'], 'Optics' => ['Sensor' => '4K']],
            'features' => ['Auto framing', ['name' => 'Tracking', 'value' => 'Speaker', 'additional' => 'AI']],
        ];
        $form = ProductContent::forForm($original);
        $this->assertSame('Auto framing', $form['features'][0]['name']);
        $stored = ProductContent::forStorage($form);
        $this->assertSame(['Microsoft Teams', 'Zoom Rooms'], $stored['specs']['certifications']);
        $this->assertSame('12x', $stored['specs']['zoom']);
        $this->assertSame(['Optics' => ['Sensor' => '4K']], $stored['specs']['technical']);
        $this->assertSame('Tracking — Speaker — AI', ProductContent::featureText($stored['features'][1]));
        $this->assertSame($stored['specs'], ProductContent::forStorage(ProductContent::forForm($stored))['specs']);
    }

    public function test_frontend_gallery_uses_main_then_ordered_local_images_and_safe_content(): void
    {
        $product = new Product([
            'name' => 'Test camera', 'slug' => 'camera', 'description' => '<p>Product <strong>details</strong><img src="x" onerror="alert(1)"></p>',
            'short_description' => 'Card summary', 'image_path' => 'products/main.webp',
            'image_paths' => ['products/side.webp', 'products/main.webp', 'products/back.webp'],
            'features' => [['name' => '4K', 'value' => 'Video']],
            'specs' => ['zoom' => '12x', 'technical' => ['Optics' => ['Sensor' => '4K']]],
        ]);
        $product->setRelation('categories', new Collection);
        $data = $product->toFrontendArray();
        $this->assertSame(['/storage/products/main.webp', '/storage/products/side.webp', '/storage/products/back.webp'], $data['images']);
        $this->assertSame('Card summary', $data['tagline']);
        $this->assertSame(['4K — Video'], $data['features']);
        $this->assertStringContainsString('<strong>details</strong>', $data['descriptionHtml']);
        $this->assertStringNotContainsString('onerror', $data['descriptionHtml']);
        $this->assertNull($data['warranty']);
        $this->assertSame(['Optics' => ['Sensor' => '4K']], $data['technicalSpecs']);
    }

    public function test_form_has_orderable_multi_image_upload_on_public_disk(): void
    {
        $find = function (array $components) use (&$find) {
            foreach ($components as $component) {
                if (method_exists($component, 'getName') && $component->getName() === 'image_paths') return $component;
                if (method_exists($component, 'getDefaultChildComponents')) {
                    $children = $component->getDefaultChildComponents();
                    if (is_array($children) && ($found = $find($children))) return $found;
                }
            }
            return null;
        };
        $gallery = $find(ProductForm::schema());
        $this->assertNotNull($gallery);
        $this->assertTrue($gallery->isMultiple());
        $this->assertTrue($gallery->isReorderable());
        $this->assertSame(10, $gallery->getMaxFiles());
        $this->assertSame('public', $gallery->getDiskName());
    }

    public function test_removing_gallery_image_keeps_file_still_used_as_main_image(): void
    {
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        Schema::create('products', function (Blueprint $table) {
            $table->id(); $table->string('name'); $table->string('slug');
            $table->string('image_path')->nullable(); $table->string('thumbnail_path')->nullable();
            $table->json('image_paths')->nullable(); $table->timestamps();
        });
        Storage::fake('public');
        Storage::disk('public')->put('products/main.webp', 'main');
        Storage::disk('public')->put('products/side.webp', 'side');
        $product = Product::create(['name' => 'Camera', 'slug' => 'camera', 'image_path' => 'products/main.webp',
            'image_paths' => ['products/main.webp', 'products/side.webp']]);
        $this->assertSame(['products/main.webp', 'products/side.webp'], $product->fresh()->image_paths);
        $product->update(['image_paths' => []]);
        Storage::disk('public')->assertExists('products/main.webp');
        Storage::disk('public')->assertMissing('products/side.webp');
    }

    public function test_remote_image_is_saved_locally_and_invalid_sources_are_rejected(): void
    {
        Storage::fake('public');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jrZkAAAAASUVORK5CYII=');
        Http::fake(['lh3.googleusercontent.com/*' => Http::response($png, 200, ['Content-Type' => 'image/png'])]);
        $path = app(ProductImageLocalizer::class)->store('https://lh3.googleusercontent.com/image', 'camera');
        $this->assertStringStartsWith('products/camera/', $path);
        Storage::disk('public')->assertExists($path);
        $this->expectException(\RuntimeException::class);
        app(ProductImageLocalizer::class)->store('http://127.0.0.1/private', 'camera');
    }
}

class ProductGalleryUploadForm extends Component implements HasForms
{
    use InteractsWithForms;

    public array $data = [];
    public array $savedPaths = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(FormSchema $schema): FormSchema
    {
        $find = function (array $components) use (&$find) {
            foreach ($components as $component) {
                if (method_exists($component, 'getName') && $component->getName() === 'image_paths') return $component;
                if (method_exists($component, 'getDefaultChildComponents')) {
                    $children = $component->getDefaultChildComponents();
                    if (is_array($children) && ($found = $find($children))) return $found;
                }
            }
            return null;
        };

        return $schema->components([$find(ProductForm::schema())])->statePath('data');
    }

    public function save(): void
    {
        $this->savedPaths = $this->form->getState()['image_paths'];
    }

    public function render(): string
    {
        return '<div>{{ $this->form }}</div>';
    }
}
