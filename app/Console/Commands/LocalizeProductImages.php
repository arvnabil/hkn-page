<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\ProductCatalog\Models\Product;
use Modules\ProductCatalog\Services\ProductImageLocalizer;
use Throwable;

class LocalizeProductImages extends Command
{
    protected $signature = 'products:localize-images {--dry-run : Periksa URL tanpa mengunduh atau mengubah database}';

    protected $description = 'Salin gambar produk seed ke storage lokal dan simpan path-nya di database';

    public function handle(ProductImageLocalizer $localizer): int
    {
        $failed = false;
        foreach (Product::query()->orderBy('id')->cursor() as $product) {
            $updates = [];
            $downloaded = [];
            try {
                foreach (['image_path', 'thumbnail_path', 'breadcrumb_image', 'image_paths'] as $field) {
                    $original = $product->getAttribute($field);
                    $paths = $field === 'image_paths' ? ($original ?? []) : [$original];
                    $converted = [];
                    foreach ($paths as $path) {
                        if (is_string($path) && preg_match('~^https?://~i', $path)) {
                            $this->line($product->slug.': '.$field.' → local storage');
                            if (! $this->option('dry-run')) {
                                $downloaded[$path] ??= $localizer->store($path, $product->slug);
                                $path = $downloaded[$path];
                            }
                        }
                        $converted[] = $path;
                    }
                    $value = $field === 'image_paths' ? $converted : ($converted[0] ?? null);
                    if ($value !== $original && ! ($original === null && $value === [])) {
                        $updates[$field] = $value;
                    }
                }
                if ($updates && ! $this->option('dry-run')) {
                    // Update all image fields together so shared files remain referenced.
                    $product->update($updates);
                }
            } catch (Throwable $e) {
                $this->error($product->slug.': '.$e->getMessage());
                $failed = true;
            }
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
