<?php

namespace Modules\Inquiry\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Modules\Inquiry\Models\Inquiry;

class InquiryStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $total       = Inquiry::count();
        $todayCount  = Inquiry::whereDate('created_at', today())->count();
        $newCount    = Inquiry::where('status', 'new')->count();
        $closedCount = Inquiry::where('status', 'closed')->count();

        return [
            Stat::make('Total Penawaran', $total)
                ->description('Semua penawaran masuk')
                ->descriptionIcon('heroicon-o-inbox-arrow-down')
                ->color('primary'),

            Stat::make('Masuk Hari Ini', $todayCount)
                ->description('Penawaran baru hari ini')
                ->descriptionIcon('heroicon-o-calendar-days')
                ->color('info'),

            Stat::make('Belum Ditindaklanjuti', $newCount)
                ->description('Status: New – perlu respons segera')
                ->descriptionIcon('heroicon-o-exclamation-circle')
                ->color($newCount > 0 ? 'danger' : 'success'),

            Stat::make('Closed Deal', $closedCount)
                ->description('Penawaran berhasil ditutup')
                ->descriptionIcon('heroicon-o-check-badge')
                ->color('success'),
        ];
    }
}
