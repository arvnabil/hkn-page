<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\ProductCatalog\Models\Brand;
use Modules\ProductCatalog\Models\Product;
use Modules\ProductCatalog\Models\ProductCategory;
use Modules\News\Models\News;
use Modules\News\Models\NewsCategory;
use Modules\News\Models\NewsTag;
use App\Models\User;

class RestApiComprehensiveRegressionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run main migrations
        $this->artisan('migrate');

        // Load all module migrations dynamically
        $moduleDirs = glob(base_path('Modules/*/Database/Migrations'));
        foreach ($moduleDirs as $dir) {
            $relativePath = str_replace(base_path() . '/', '', $dir);
            $this->artisan('migrate', ['--path' => $relativePath]);
        }
    }

    public function test_products_index_endpoint()
    {
        $brand = Brand::create(['name' => 'Brand A', 'slug' => 'brand-a']);
        $category = ProductCategory::create(['name' => 'Cat A', 'slug' => 'cat-a', 'is_active' => true]);

        $activeProduct = Product::create([
            'name' => 'Active Product',
            'slug' => 'active-product',
            'brand_id' => $brand->id,
            'is_active' => true,
        ]);
        $activeProduct->categories()->sync([$category->id]);

        $inactiveProduct = Product::create([
            'name' => 'Inactive Product',
            'slug' => 'inactive-product',
            'brand_id' => $brand->id,
            'is_active' => false,
        ]);

        // 1. Basic index (only active)
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
        $response->assertJsonPath('data.0.attributes.name', 'Active Product');
        $response->assertJsonCount(1, 'data');

        // 2. Filter by category
        $responseCat = $this->getJson('/api/products?category=cat-a');
        $responseCat->assertStatus(200);
        $responseCat->assertJsonCount(1, 'data');

        $responseCatEmpty = $this->getJson('/api/products?category=non-existent');
        $responseCatEmpty->assertStatus(200);
        $responseCatEmpty->assertJsonCount(0, 'data');

        // 3. Filter by brand
        $responseBrand = $this->getJson('/api/products?brand=brand-a');
        $responseBrand->assertStatus(200);
        $responseBrand->assertJsonCount(1, 'data');
    }

    public function test_products_show_endpoint()
    {
        $brand = Brand::create(['name' => 'Yealink', 'slug' => 'yealink']);
        $product = Product::create([
            'name' => 'MeetingBoard 65',
            'slug' => 'meetingboard-65',
            'brand_id' => $brand->id,
            'is_active' => true,
        ]);

        // Success
        $response = $this->getJson('/api/products/meetingboard-65');
        $response->assertStatus(200);
        $response->assertJsonPath('data.attributes.name', 'MeetingBoard 65');
        $response->assertJsonPath('data.type', 'products');

        // 404
        $notFound = $this->getJson('/api/products/does-not-exist');
        $notFound->assertStatus(404);
        $notFound->assertJson(['message' => 'Product not found']);
    }

    public function test_products_import_endpoint_unauthenticated()
    {
        $response = $this->postJson('/api/products/import', [
            'name' => 'Test Product',
            'slug' => 'test-product',
            'brand_name' => 'Test Brand',
        ]);

        $response->assertStatus(401);
    }

    public function test_products_import_endpoint_validation_errors()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/products/import', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'slug', 'brand_name']);
    }

    public function test_products_import_endpoint_successful_upsert()
    {
        $user = User::factory()->create();

        $payload = [
            'name' => 'Smart Hub Pro',
            'slug' => 'smart-hub-pro',
            'sku' => 'SHP-001',
            'price' => 12500000,
            'description' => 'Enterprise conference hub',
            'brand_name' => 'Logitech Enterprise',
            'category_name' => ['Video Hardware', 'Smart Office'],
            'specs' => json_encode(['ports' => '4x HDMI', 'power' => '65W']),
            'features' => json_encode(['AI Framing', 'Noise Cancellation']),
            'tags' => 'hardware, room-kit',
            'seo_title' => 'Buy Smart Hub Pro Online',
            'seo_description' => 'Best enterprise hub for your meeting rooms.',
            'seo_keywords' => 'smart hub, logitech, conference',
        ];

        // 1. First import creates
        $response = $this->actingAs($user, 'api')->postJson('/api/products/import', $payload);

        $response->assertStatus(200);
        $response->assertJsonPath('message', 'Product imported successfully');
        $response->assertJsonPath('product.data.attributes.name', 'Smart Hub Pro');
        $response->assertJsonPath('product.data.attributes.sku', 'SHP-001');

        $this->assertDatabaseHas('products', [
            'slug' => 'smart-hub-pro',
            'name' => 'Smart Hub Pro',
        ]);
        $this->assertDatabaseHas('brands', [
            'name' => 'Logitech Enterprise',
            'slug' => 'logitech-enterprise',
        ]);
        $this->assertDatabaseHas('product_categories', [
            'name' => 'Video Hardware',
            'slug' => 'video-hardware',
        ]);

        // 2. Second import updates existing
        $updatePayload = array_merge($payload, [
            'name' => 'Smart Hub Pro Gen 2',
            'price' => 14000000,
        ]);

        $updateResponse = $this->actingAs($user, 'api')->postJson('/api/products/import', $updatePayload);
        $updateResponse->assertStatus(200);
        $updateResponse->assertJsonPath('product.data.attributes.name', 'Smart Hub Pro Gen 2');

        $this->assertDatabaseHas('products', [
            'slug' => 'smart-hub-pro',
            'name' => 'Smart Hub Pro Gen 2',
            'price' => 14000000,
        ]);
    }

    public function test_products_delete_endpoint()
    {
        $user = User::factory()->create();

        $brand = Brand::create(['name' => 'To Delete Brand', 'slug' => 'to-delete-brand']);
        $product = Product::create([
            'name' => 'To Delete Product',
            'slug' => 'to-delete-product',
            'brand_id' => $brand->id,
            'is_active' => true,
        ]);

        // Unauthenticated delete fails
        $unauth = $this->deleteJson('/api/products/to-delete-product');
        $unauth->assertStatus(401);

        // Authenticated delete succeeds
        $response = $this->actingAs($user, 'api')->deleteJson('/api/products/to-delete-product');
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Product deleted successfully']);

        $this->assertDatabaseMissing('products', ['slug' => 'to-delete-product']);

        // Delete non-existent 404
        $notFound = $this->actingAs($user, 'api')->deleteJson('/api/products/not-found');
        $notFound->assertStatus(404);
    }

    public function test_news_index_endpoint()
    {
        $cat = NewsCategory::create(['name' => 'Tech', 'slug' => 'tech']);

        $published = News::create([
            'title' => 'Published Article',
            'slug' => 'published-article',
            'status' => 'published',
            'published_at' => now(),
            'category_id' => $cat->id,
        ]);

        $draft = News::create([
            'title' => 'Draft Article',
            'slug' => 'draft-article',
            'status' => 'draft',
            'published_at' => null,
            'category_id' => $cat->id,
        ]);

        $response = $this->getJson('/api/news');
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.attributes.title', 'Published Article');

        // Filter by category
        $responseCat = $this->getJson('/api/news?category=tech');
        $responseCat->assertStatus(200);
        $responseCat->assertJsonCount(1, 'data');
    }

    public function test_news_show_endpoint()
    {
        $news = News::create([
            'title' => 'AVer AI Technology',
            'slug' => 'aver-ai-technology',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->getJson('/api/news/aver-ai-technology');
        $response->assertStatus(200);
        $response->assertJsonPath('data.attributes.title', 'AVer AI Technology');
        $response->assertJsonPath('data.type', 'news');

        $notFound = $this->getJson('/api/news/non-existent-news');
        $notFound->assertStatus(404);
    }
}
