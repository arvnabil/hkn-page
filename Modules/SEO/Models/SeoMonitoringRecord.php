<?php

namespace Modules\SEO\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMonitoringRecord extends Model
{
    protected function casts(): array
    {
        return ['is_noindex' => 'boolean', 'in_sitemap' => 'boolean', 'canonical_valid' => 'boolean', 'last_modified' => 'datetime'];
    }

    protected $fillable = [
        'url',
        'path',
        'model',
        'model_id',
        'is_noindex',
        'in_sitemap',
        'canonical_valid',
        'seo_score',
        'priority',
        'changefreq',
        'last_modified',
    ];
}
