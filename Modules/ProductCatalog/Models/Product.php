<?php

namespace Modules\ProductCatalog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\SEO\Traits\HasSeoMeta;
use App\Traits\HasImageCleanup;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'brand_id', 'name', 'slug',
    'description', 'image_path', 'thumbnail_path', 'sku', 'solution_type',
    'datasheet_url', 'tags', 'specs', 'specification_text',
    'features', 'features_text', 'is_active', 'is_featured', 'is_new',
    'breadcrumb_image', 'show_breadcrumb',
    'price', 'link_accommerce', 'whatsapp_note'
])]
class Product extends Model
{
    use HasFactory, HasSeoMeta, HasImageCleanup;

    protected $cleanupFields = ['image_path', 'thumbnail_path', 'breadcrumb_image', 'datasheet_url'];
    protected $richEditorCleanupFields = ['description', 'specification_text', 'features_text'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'specs'          => 'array',
            'tags'           => 'array',
            'features'       => 'array',
            'is_active'      => 'boolean',
            'is_featured'    => 'boolean',
            'is_new'         => 'boolean',
            'show_breadcrumb'=> 'boolean',
        ];
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function categories()
    {
        return $this->belongsToMany(ProductCategory::class, 'product_category_product');
    }
}
