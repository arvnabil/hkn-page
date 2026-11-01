<?php

return [
    App\Providers\AppServiceProvider::class,
    Spatie\Permission\PermissionServiceProvider::class,
    App\MCP\MCPServiceProvider::class,
    Modules\Settings\Providers\SettingsServiceProvider::class,
    Modules\SEO\Providers\SEOServiceProvider::class,
    Modules\Menu\Providers\MenuServiceProvider::class,
    Modules\FormBuilder\Providers\FormBuilderServiceProvider::class,
    Modules\WhatsApp\Providers\WhatsAppServiceProvider::class,
    Modules\News\Providers\NewsServiceProvider::class,
    Modules\Search\Providers\SearchServiceProvider::class,
    Modules\ProductCatalog\Providers\ProductCatalogServiceProvider::class,
    Modules\Analytics\Providers\AnalyticsServiceProvider::class,
    Modules\Inquiry\Providers\InquiryServiceProvider::class,

    // CMS MUST BE REGISTERED LAST for catch-all route to work properly
    Modules\CMS\Providers\CMSServiceProvider::class,

    App\Providers\Filament\ActivioncmsPanelProvider::class,
    App\Providers\AuthServiceProvider::class,
];
