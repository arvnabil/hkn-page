<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Modules\Analytics\Models\AnalyticsClickEvent;
use Modules\Analytics\Filament\Resources\WhatsAppAnalyticsResource;
use Modules\ProductCatalog\Models\Brand;
use Modules\ProductCatalog\Models\Product;
use Modules\WhatsApp\Models\WhatsAppSetting;
use Tests\TestCase;

class WhatsAppTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Bus::fake();
        WhatsAppSetting::create(['phone' => '081234567890', 'is_enabled' => true]);
    }

    private function link(array $overrides = []): string
    {
        return '/wa?'.http_build_query(array_replace([
            'text' => 'Halo, saya ingin konsultasi AVer & Teams.',
            'utm_source' => 'website', 'utm_medium' => 'whatsapp', 'utm_campaign' => 'product_consultation',
            'utm_content' => 'product_detail', 'cta_position' => 'product_detail',
            'cta_label' => 'Konsultasi Gratis', 'page_route' => '/produk/camera',
        ], $overrides));
    }

    public function test_redirect_uses_only_settings_number_and_logs_attribution(): void
    {
        $response = $this->get($this->link(['phone' => '629999999999']));
        $response->assertRedirect();
        $location = $response->headers->get('Location');
        $this->assertSame('/6281234567890', parse_url($location, PHP_URL_PATH));
        parse_str(parse_url($location, PHP_URL_QUERY), $query);
        $this->assertSame('Halo, saya ingin konsultasi AVer & Teams.', $query['text']);
        $event = AnalyticsClickEvent::firstOrFail();
        $this->assertSame('product_detail', $event->utm_content);
        $this->assertSame('/produk/camera', $event->page_url);
        $this->assertSame('product_consultation', $event->utm_campaign);
        $this->assertSame($event->id, WhatsAppAnalyticsResource::getEloquentQuery()->firstOrFail()->id);
        $this->assertSame(1, $event->click_count);
        Bus::assertNothingDispatched();
    }

    public function test_changing_settings_changes_destination_without_editing_buttons(): void
    {
        $this->get($this->link())->assertRedirect();
        WhatsAppSetting::query()->firstOrFail()->update(['phone' => '+62 811 222 3333']);
        $this->get($this->link())->assertRedirectContains('https://wa.me/628112223333');
        $this->assertDatabaseCount('analytics_click_events', 2);
    }

    public function test_repeated_clicks_merge_only_for_same_session_and_button_context(): void
    {
        $this->withSession(['analytics_session_id' => 'visitor-a'])->get($this->link());
        $this->get($this->link());
        $this->assertDatabaseCount('analytics_click_events', 1);
        $this->assertSame(2, AnalyticsClickEvent::firstOrFail()->click_count);
        $this->get($this->link(['utm_content' => 'floating_bubble', 'cta_position' => 'floating_bubble']));
        $this->assertDatabaseCount('analytics_click_events', 2);
        $this->withSession(['analytics_session_id' => 'visitor-b'])->get($this->link());
        $this->assertDatabaseCount('analytics_click_events', 3);
    }

    public function test_different_content_tags_are_not_merged(): void
    {
        $this->get($this->link());
        $this->get($this->link(['utm_content' => 'alternate_button']));
        $this->assertDatabaseCount('analytics_click_events', 2);
    }

    public function test_product_entity_is_safe_to_eager_load_in_click_events(): void
    {
        $brand = Brand::create(['name' => 'AVer', 'slug' => 'aver']);
        $product = Product::create(['name' => 'Camera', 'slug' => 'camera', 'brand_id' => $brand->id]);
        $this->get($this->link(['entity_type' => 'product', 'entity_slug' => 'camera', 'entity_id' => $product->id]))->assertRedirect();
        $event = AnalyticsClickEvent::with('entity')->firstOrFail();
        $this->assertInstanceOf(Product::class, $event->entity);
        $this->assertSame($product->id, $event->entity->id);
    }

    public function test_static_solution_context_does_not_create_invalid_morph_types(): void
    {
        $this->get($this->link(['entity_type' => 'solution', 'entity_slug' => 'huddle']))->assertRedirect();
        $event = AnalyticsClickEvent::with('entity')->firstOrFail();
        $this->assertNull($event->entity_type);
        $this->assertSame('huddle', $event->entity_slug);
        $this->assertSame('solution', $event->meta['entity_kind']);
    }

    public function test_missing_number_does_not_use_a_hardcoded_fallback(): void
    {
        WhatsAppSetting::query()->firstOrFail()->update(['phone' => null]);
        $this->get($this->link())->assertStatus(503);
        $this->assertDatabaseCount('analytics_click_events', 0);
    }
}
