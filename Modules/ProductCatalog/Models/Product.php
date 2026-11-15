<?php

namespace Modules\ProductCatalog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\SEO\Traits\HasSeoMeta;
use App\Traits\HasImageCleanup;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Modules\ProductCatalog\Support\ProductContent;

#[Fillable([
    'brand_id', 'name', 'slug',
    'description', 'short_description', 'image_path', 'image_paths', 'thumbnail_path', 'sku', 'solution_type',
    'datasheet_url', 'tags', 'specs', 'specification_text',
    'features', 'features_text', 'is_active', 'is_featured', 'is_new',
    'breadcrumb_image', 'show_breadcrumb',
    'price', 'link_accommerce', 'whatsapp_note'
])]
class Product extends Model
{
    use HasFactory, HasSeoMeta, HasImageCleanup;

    protected $cleanupFields = ['image_path', 'image_paths', 'thumbnail_path', 'breadcrumb_image', 'datasheet_url'];
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
            'image_paths'    => 'array',
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
        $firstCategory = $this->categories->first();

        $images = collect(array_merge([$this->image_path], $this->image_paths ?? []))
            ->filter()->map(fn ($path) => self::imageUrl($path))->filter()->unique()->values()->all();
        $image = $images[0] ?? self::imageUrl($this->thumbnail_path);

        // Extract nested specs or direct keys
        $roomSize = $specs['roomSize'] ?? null;
        $zoom = $specs['zoom'] ?? null;
        $resolution = $specs['resolution'] ?? null;
        $fov = $specs['fov'] ?? null;
        $bestFor = $specs['bestFor'] ?? null;
        $warranty = $specs['warranty'] ?? null;
        $badge = $specs['badge'] ?? null;
        $categoryLabel = $specs['categoryLabel'] ?? $firstCategory?->name;
        $certifications = !empty($specs['certifications']) && is_array($specs['certifications'])
            ? $specs['certifications']
            : array_values(array_filter($tags, fn ($t) => in_array($t, ['Microsoft Teams', 'Zoom Rooms', 'Google Meet'], true)));

        return [
            'id'             => $this->slug ?: (string) $this->id,
            'databaseId'     => $this->id,
            'slug'           => $this->slug,
            'name'           => $this->name,
            'tagline'        => $this->short_description ?: Str::limit(trim(html_entity_decode(strip_tags($this->description ?? ''), ENT_QUOTES, 'UTF-8')), 240),
            'descriptionHtml' => Str::sanitizeHtml($this->description ?? ''),
            'specificationHtml' => $this->richContent($this->specification_text),
            'featuresHtml'   => $this->richContent($this->features_text),
            'sku'           => $this->sku,
            'badge'          => $badge,
            'category'       => $firstCategory?->slug,
            'categoryLabel'  => $categoryLabel,
            'image'          => $image,
            'images'         => $images ?: ($image ? [$image] : []),
            'certifications' => $certifications,
            'specs'          => $specs,
            'technicalSpecs' => $specs['technical'] ?? Arr::except($specs, ProductContent::SUMMARY_KEYS),
            'features'       => array_values(array_filter(array_map(ProductContent::featureText(...), $features))),
            'roomSize'       => $roomSize,
            'zoom'           => $zoom,
            'resolution'     => $resolution,
            'fov'            => $fov,
            'bestFor'        => $bestFor,
            'warranty'       => $warranty,
            'price'          => $this->price,
            'link_accommerce'=> Str::sanitizeUrl($this->link_accommerce),
            'whatsapp_note'  => $this->whatsapp_note,
            'datasheet_url'  => Str::sanitizeUrl($this->datasheet_url),
            'breadcrumb_image' => self::imageUrl($this->breadcrumb_image),
            'show_breadcrumb' => $this->show_breadcrumb ?? true,
        ];
    }

    public static function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, '/') && ! str_starts_with($path, '//')) {
            return $path;
        }
        if (preg_match('~^https?://~i', $path)) {
            return $path;
        }
        if (str_contains($path, ':') || str_contains($path, '..') || str_starts_with($path, '//')) {
            return null;
        }

        return '/storage/'.ltrim($path, '/');
    }

    private function richContent(?string $content): string
    {
        // Legacy seed data stored JSON / duplicate plain text here.
        return $content && str_contains($content, '<') ? Str::sanitizeHtml($content) : '';
    }
}
