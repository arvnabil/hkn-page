<?php

namespace Modules\ProductCatalog\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ProductImageLocalizer
{
    public function store(string $url, string $slug): string
    {
        // Existing seed images come from this public image host only.
        $parts = parse_url($url);
        if (($parts['scheme'] ?? '') !== 'https' || ($parts['host'] ?? '') !== 'lh3.googleusercontent.com'
            || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])) {
            throw new RuntimeException('Sumber gambar belum didukung; unggah file melalui form produk.');
        }
        $response = Http::connectTimeout(10)->timeout(30)->withOptions([
            'allow_redirects' => false,
            'progress' => function ($total, $downloaded): void {
                if ($total > 5 * 1024 * 1024 || $downloaded > 5 * 1024 * 1024) {
                    throw new RuntimeException('Gambar melebihi 5 MB.');
                }
            },
        ])->get($url)->throw();
        $body = $response->body();
        $info = @getimagesizefromstring($body);
        $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        $extension = $extensions[$info['mime'] ?? ''] ?? null;
        if (! $response->successful() || ! $extension || strlen($body) > 5 * 1024 * 1024) {
            throw new RuntimeException('Respons bukan gambar JPG, PNG, atau WebP yang valid.');
        }
        $path = 'products/'.(Str::slug($slug) ?: 'import').'/'.hash('sha256', $url).'.'.$extension;
        if (! Storage::disk('public')->put($path, $body)) {
            throw new RuntimeException('Gambar gagal disimpan ke storage lokal.');
        }

        return $path;
    }
}
