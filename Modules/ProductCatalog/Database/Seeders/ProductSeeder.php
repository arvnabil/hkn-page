<?php

namespace Modules\ProductCatalog\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\ProductCatalog\Models\Brand;
use Modules\ProductCatalog\Models\Product;
use Modules\ProductCatalog\Models\ProductCategory;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = resource_path('js/data/products.json');
        $json = file_get_contents($jsonPath);
        $json = preg_replace('/^\xEF\xBB\xBF/', '', $json);
        $products = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        $brand = Brand::updateOrCreate(['slug' => 'aver'], ['name' => 'AVer']);

        DB::transaction(function () use ($products, $brand): void {
            $categoryIds = [];
            foreach (collect($products)->pluck('categoryLabel')->filter()->unique() as $sort => $label) {
                $category = ProductCategory::updateOrCreate(
                    ['slug' => \Illuminate\Support\Str::slug($label)],
                    ['name' => $label, 'sort_order' => $sort, 'is_active' => true]
                );
                $categoryIds[$label] = $category->id;
            }

            $slugs = collect($products)->pluck('id')->all();
            Product::whereNotIn('slug', $slugs)->delete();

            foreach ($products as $item) {
                $product = Product::updateOrCreate(['slug' => $item['id']], [
                    'brand_id' => $brand->id,
                    'name' => $item['name'],
                    'description' => $item['tagline'] ?? null,
                    'image_path' => $item['image'] ?? null,
                    'thumbnail_path' => $item['image'] ?? null,
                    'tags' => array_values(array_unique(array_merge($item['certifications'] ?? [], [$item['badge'] ?? '']))),
                    'specs' => $item['specs'] ?? [],
                    'features' => $item['features'] ?? [],
                    'specification_text' => json_encode(array_intersect_key($item, array_flip(['roomSize','zoom','fov','resolution','warranty','bestFor'])), JSON_UNESCAPED_UNICODE),
                    'features_text' => implode("\n", $item['features'] ?? []),
                    'is_active' => true,
                    'is_featured' => in_array($item['id'], ['cam550','cam570'], true),
                ]);

                if (isset($categoryIds[$item['categoryLabel'] ?? ''])) {
                    $product->categories()->sync([$categoryIds[$item['categoryLabel']]]);
                }
            }
        });
    }
}
