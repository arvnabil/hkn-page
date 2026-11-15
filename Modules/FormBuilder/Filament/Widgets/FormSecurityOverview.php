<?php

namespace Modules\FormBuilder\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class FormSecurityOverview extends BaseWidget
{
    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        // 1. Total Views (Last 30 Days)
        $totalViews = DB::table('form_analytics')
            ->where('form_key', 'inquiry')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // 2. Total Submissions (Last 30 Days - Allowed + Blocked)
        $totalSubmissions = DB::table('form_security_logs')
            ->where('form_key', 'inquiry')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // 3. Blocked Spam
        $blockedSpam = DB::table('form_security_logs')
            ->where('form_key', 'inquiry')
            ->where('decision', 'block')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // 4. Spam Rate
        $spamRate = $totalSubmissions > 0 ? round(($blockedSpam / $totalSubmissions) * 100, 1) : 0;

        // 5. Conversion Rate (Allowed Submissions / Views)
        $allowedSubmissions = DB::table('form_security_logs')->where('form_key', 'inquiry')
            ->where('decision', 'allow')->where('created_at', '>=', now()->subDays(30))->count();
        $conversionRate = $totalViews > 0 ? round(($allowedSubmissions / $totalViews) * 100, 1) : 0;

        $config = app(\Modules\FormBuilder\Services\FormSecurity::class)->configuration('inquiry');
        $securityMode = ! $config['captcha_enabled'] ? 'Honeypot + limit'
            : ($config['configured'] ? 'reCAPTCHA aktif' : 'Konfigurasi belum lengkap');

        return [
            Stat::make('Tampilan penawaran (30 hari)', number_format($totalViews))
                ->description('Form terlihat; sesi/halaman unik per 30 menit')
                ->descriptionIcon('heroicon-m-eye')
                ->color('gray'),

            Stat::make('Konversi penawaran', $conversionRate . '%')
                ->description("$allowedSubmissions kiriman berhasil disimpan")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Spam diblokir', number_format($blockedSpam))
                ->description("Spam Rate: $spamRate%")
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('danger'),

            Stat::make('Keamanan penawaran', $securityMode)
                ->description('Honeypot dan pembatasan kiriman selalu aktif')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->color('primary'),
        ];
    }
}
