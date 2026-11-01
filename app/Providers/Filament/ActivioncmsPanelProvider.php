<?php

namespace App\Providers\Filament;

use App\Filament\Activioncms\Pages\Dashboard;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Modules\Inquiry\Filament\Widgets\InquiryStatsWidget;
use Modules\Settings\Models\Setting;

class ActivioncmsPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('activioncms')
            ->path('activioncms')
            ->login()
            ->databaseNotifications()
            ->colors([
                // AVer brand primary: red (#E52421)
                'primary' => Color::hex('#E52421'),
            ])

            // ─── Core App Resources ────────────────────────────────────────────
            ->discoverResources(in: app_path('Filament/Activioncms/Resources'), for: 'App\\Filament\\Activioncms\\Resources')
            ->resources([
                \App\Filament\Activioncms\Resources\UserResource::class,
                \App\Filament\Activioncms\Resources\RoleResource::class,
            ])

            // ─── Active Harry/AVer Modules ──────────────────────────────────────
            ->discoverResources(in: base_path('Modules/Inquiry/Filament/Resources'), for: 'Modules\\Inquiry\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/ProductCatalog/Filament/Resources'), for: 'Modules\\ProductCatalog\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/News/Filament/Resources'), for: 'Modules\\News\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/Services/Filament/Resources'), for: 'Modules\\Services\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/FormBuilder/Filament/Resources'), for: 'Modules\\FormBuilder\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/Settings/Filament/Resources'), for: 'Modules\\Settings\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/SEO/Filament/Resources'), for: 'Modules\\SEO\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/Menu/Filament/Resources'), for: 'Modules\\Menu\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/Analytics/Filament/Resources'), for: 'Modules\\Analytics\\Filament\\Resources')
            ->discoverResources(in: base_path('Modules/CMS/Filament/Resources'), for: 'Modules\\CMS\\Filament\\Resources')

            // ─── CLOSED/EXCLUDED Modules (Campaign, Events, Projects, Clients, AI) ──
            // Modules\Campaign, Modules\Events, Modules\Projects, Modules\Clients, Modules\AI
            // intentionally NOT registered — not relevant to AVer B2B advisor website

            // ─── Active Pages ───────────────────────────────────────────────────
            ->discoverPages(in: app_path('Filament/Activioncms/Pages'), for: 'App\\Filament\\Activioncms\\Pages')
            ->discoverPages(in: base_path('Modules/CMS/Filament/Pages'), for: 'Modules\\CMS\\Filament\\Pages')
            ->discoverPages(in: base_path('Modules/SEO/Filament/Pages'), for: 'Modules\\SEO\\Filament\\Pages')
            ->discoverPages(in: base_path('Modules/WhatsApp/Filament/Pages'), for: 'Modules\\WhatsApp\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])

            // ─── Active Widgets ─────────────────────────────────────────────────
            ->discoverWidgets(in: base_path('Modules/Inquiry/Filament/Widgets'), for: 'Modules\\Inquiry\\Filament\\Widgets')
            ->discoverWidgets(in: base_path('Modules/Analytics/Filament/Widgets'), for: 'Modules\\Analytics\\Filament\\Widgets')
            ->discoverWidgets(in: base_path('Modules/SEO/Filament/Widgets'), for: 'Modules\\SEO\\Filament\\Widgets')
            ->discoverWidgets(in: base_path('Modules/FormBuilder/Filament/Widgets'), for: 'Modules\\FormBuilder\\Filament\\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
                InquiryStatsWidget::class,
            ])

            // ─── Middleware ─────────────────────────────────────────────────────
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])

            // ─── Navigation Groups (Harry AVer CMS) ─────────────────────────────
            ->navigationGroups([
                'Dashboard',
                'Leads & Inquiries',       // NEW: penawaran B2B masuk
                'Product Catalog',          // Katalog kamera AVer
                'Content Management',       // News/Artikel & Panduan
                'Service Management',       // Solusi Ruang Rapat AVer
                'Form Management',          // FormBuilder submissions
                'Menu Management',
                'Seo Management',
                'Site Management',
                'Analytics',
                'Settings',
                'User Management',
            ])

            // ─── Render Hook: inject Vite assets for Filament SERP preview ──────
            ->renderHook(
                'panels::body.end',
                fn () => Blade::render("
                    @viteReactRefresh
                    @vite(['resources/js/filament-serp.jsx'])
                    <style>
                        .fi-wi-chart-filter {
                            min-width: 120px !important;
                        }
                    </style>
                ")
            );
    }

    public function boot(): void
    {
        try {
            // Server-side only: pull GA4 credentials & reCAPTCHA secret from the
            // database. Secret values are encrypted at rest and decrypted here;
            // they are NEVER shared with Inertia, Livewire or any browser payload.
            $propertyId = Setting::getValue('seo_ga4_property_id');
            $serviceAccountJson = Setting::getValue('seo_ga4_service_account_json');

            if ($propertyId) {
                config(['analytics.property_id' => $propertyId]);
            }

            if ($serviceAccountJson) {
                $json = json_decode($serviceAccountJson, true);
                if (is_array($json)) {
                    config(['analytics.service_account_credentials_json' => $json]);
                }
            }

            // Fall back to the DB-managed reCAPTCHA secret when no .env secret is
            // configured, so server-side verification keeps working.
            if (blank(config('services.recaptcha.secret'))) {
                $recaptchaSecret = Setting::getValue('recaptcha_secret_key');

                if (filled($recaptchaSecret)) {
                    config(['services.recaptcha.secret' => $recaptchaSecret]);
                }
            }
        } catch (\Throwable $e) {
            // Silently fail if database is not ready or table doesn't exist
        }
    }
}
