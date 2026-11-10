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

    public function toFrontendArray(): array
    {
        $specs = is_array($this->specs) ? $this->specs : [];
        $features = is_array($this->features) ? $this->features : [];
        $tags = is_array($this->tags) ? $this->tags : [];
        $specText = json_decode($this->specification_text ?? '{}', true) ?: [];
        $firstCategory = $this->categories->first();

        $image = $this->image_path ?: $this->thumbnail_path;
        if ($image && !str_starts_with($image, 'http') && !str_starts_with($image, '/')) {
            $image = asset('storage/' . ltrim($image, '/'));
        }

        return array_merge([
            'id'             => $this->slug ?: (string) $this->id,
            'slug'           => $this->slug,
            'name'           => $this->name,
            'tagline'        => $this->description,
            'badge'          => $tags[0] ?? 'ENTERPRISE',
            'category'       => $firstCategory ? $firstCategory->slug : 'ptz',
            'categoryLabel'  => $firstCategory ? $firstCategory->name : 'PTZ Pro AV',
            'image'          => $image,
            'images'         => $image ? [$image] : [],
            'certifications' => array_values(array_filter($tags, fn ($t) => in_array($t, ['Microsoft Teams', 'Zoom Rooms', 'Google Meet'], true))),
            'specs'          => $specs,
            'features'       => $features,
            'price'          => $this->price,
            'link_accommerce'=> $this->link_accommerce,
            'whatsapp_note'  => $this->whatsapp_note,
        ], $specText);
    }
}
