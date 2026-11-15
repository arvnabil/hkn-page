<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Livewire\Livewire;
use Modules\SEO\Filament\Widgets\SeoContentTypeChart;
use Modules\SEO\Filament\Widgets\SeoIndexStatusChart;
use Modules\SEO\Models\SeoMonitoringRecord;
use Modules\SEO\Services\ActivePublicRouteDetector;
use Modules\SEO\Services\SeoMonitoringService;
use Tests\TestCase;

class SeoMonitoringTest extends TestCase
{
    use RefreshDatabase;

    public function test_sync_populates_monitoring_without_duplicate_records(): void
    {
        $publicPath = storage_path('framework/testing/seo-monitoring');
        File::ensureDirectoryExists($publicPath);
        $this->app->usePublicPath($publicPath);
        File::put($publicPath.'/sitemap.xml', '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url></urlset>');
        $routes = collect([
            ['url' => 'https://example.test/', 'model' => 'Static:Home', 'seo_score' => 80],
            ['url' => 'https://example.test/private', 'model' => 'Static:Private', 'seo_score' => 50, 'is_noindex' => true],
        ]);
        $this->mock(ActivePublicRouteDetector::class)->shouldReceive('detect')->with(true)->twice()->andReturn($routes);
        try {
            app(SeoMonitoringService::class)->sync();
            app(SeoMonitoringService::class)->sync();
            $this->assertDatabaseCount('seo_monitoring_records', 2);
            $home = SeoMonitoringRecord::where('path', '/')->firstOrFail();
            $this->assertTrue($home->in_sitemap);
            $this->assertFalse($home->is_noindex);
            $this->assertInstanceOf(\Carbon\CarbonInterface::class, $home->last_modified);
            $this->assertTrue(SeoMonitoringRecord::where('path', '/private')->firstOrFail()->is_noindex);
        } finally {
            File::delete($publicPath.'/sitemap.xml');
        }
    }

    public function test_charts_show_empty_state_and_refresh_after_sync_event(): void
    {
        $status = Livewire::test(SeoIndexStatusChart::class);
        $types = Livewire::test(SeoContentTypeChart::class);
        $this->assertTrue($status->instance()->isEmpty());
        $this->assertTrue($types->instance()->isEmpty());
        $checksum = $status->get('dataChecksum');
        SeoMonitoringRecord::create(['url' => 'https://example.test/product', 'path' => '/product', 'model' => 'Product']);
        $status->dispatch('seo-monitoring-synced')->assertDispatched('updateChartData');
        $types->dispatch('seo-monitoring-synced')->assertDispatched('updateChartData');
        $this->assertFalse($status->instance()->isEmpty());
        $this->assertNotSame($checksum, $status->get('dataChecksum'));
        $method = new \ReflectionMethod(SeoIndexStatusChart::class, 'getData');
        $this->assertSame(['Boleh diindeks', 'Noindex'], $method->invoke($status->instance())['labels']);
    }
}
