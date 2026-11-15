<?php

namespace Modules\SEO\Filament\Widgets;

use Modules\SEO\Models\SeoMonitoringRecord;
use Filament\Widgets\ChartWidget;

class SeoIndexStatusChart extends ChartWidget
{
    protected ?string $heading = 'Aturan indeks lokal';
    protected ?string $description = 'Konfigurasi noindex di website, bukan status indeks Google.';
    protected ?string $emptyStateHeading = 'Belum disinkronkan';
    protected ?string $emptyStateDescription = 'Klik Sync Data untuk mengisi grafik.';
    protected ?string $maxHeight = '250px';

    protected function getData(): array
    {
        $indexed = SeoMonitoringRecord::where('is_noindex', false)->count();
        $noindex = SeoMonitoringRecord::where('is_noindex', true)->count();

        return [
            'datasets' => [
                [
                    'label' => 'Pages',
                    'data' => [$indexed, $noindex],
                    'backgroundColor' => ['#10b981', '#f43f5e'],
                ],
            ],
            'labels' => ['Boleh diindeks', 'Noindex'],
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }

    public function isEmpty(): bool
    {
        return ! SeoMonitoringRecord::exists();
    }

    #[\Livewire\Attributes\On('seo-monitoring-synced')]
    public function refreshMonitoring(): void
    {
        $this->cachedData = null;
        $this->updateChartData();
    }
}
