<?php

namespace Modules\News\Http\Controllers\Api;

use App\Helpers\ImageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Modules\News\Models\News;

class NewsImageSyncController
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'news_id' => ['required_without:slug', 'integer', 'exists:news,id'],
            'slug' => ['required_without:news_id', 'string', 'exists:news,slug'],
            'url' => ['required_without:image', 'nullable', 'url', 'max:2048'],
            'image' => ['required_without:url', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif,avif', 'max:20480'],
        ]);

        $news = isset($validated['news_id'])
            ? News::findOrFail($validated['news_id'])
            : News::where('slug', $validated['slug'])->firstOrFail();

        if ($request->hasFile('image')) {
            $contents = file_get_contents($request->file('image')->getRealPath());
            $extension = $request->file('image')->extension();
            $source = 'upload';
        } else {
            $url = $validated['url'];
            $host = strtolower((string) parse_url($url, PHP_URL_HOST));
            if (!in_array($host, ['harrykusumo.com', 'www.harrykusumo.com'], true)
                || strtolower((string) parse_url($url, PHP_URL_SCHEME)) !== 'https') {
                throw ValidationException::withMessages([
                    'url' => 'URL harus HTTPS dan berasal dari harrykusumo.com.',
                ]);
            }

            try {
                $response = Http::withHeaders([
                    'Accept' => '*/*',
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36',
                ])->connectTimeout(10)->timeout(30)->withOptions([
                    'allow_redirects' => ['max' => 3, 'protocols' => ['https']],
                ])->get($url);
            } catch (\Throwable $exception) {
                return response()->json([
                    'message' => 'Server tidak dapat mengunduh URL sumber.',
                    'error' => $exception->getMessage(),
                    'hint' => 'Gunakan field image untuk mengunggah file gambar yang sudah bisa dibuka di browser.',
                ], 422);
            }

            $mime = strtolower(trim(explode(';', $response->header('Content-Type', ''))[0]));
            if (!$response->successful() || !str_starts_with($mime, 'image/')) {
                return response()->json([
                    'message' => 'URL tidak mengembalikan gambar.',
                    'http_status' => $response->status(),
                    'content_type' => $mime ?: null,
                    'hint' => 'Gunakan field image untuk mengunggah file gambar yang sudah bisa dibuka di browser.',
                ], 422);
            }

            $contents = $response->body();
            if (strlen($contents) > 20 * 1024 * 1024) {
                return response()->json(['message' => 'Ukuran gambar melebihi 20 MB.'], 422);
            }
            $extension = match ($mime) {
                'image/jpeg', 'image/jpg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif',
                'image/avif' => 'avif',
                default => null,
            };
            if (!$extension) {
                return response()->json(['message' => 'Format gambar tidak didukung.', 'content_type' => $mime], 422);
            }
            $source = 'url';
        }

        $target = 'news/'.$news->slug.'/featured-'.Str::uuid();
        $path = ImageHelper::processAndConvert($contents, $target, 'public');
        if (!$path || !Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Gagal menyimpan atau memproses gambar.'], 500);
        }

        $news->update(['featured_image' => $path]);

        return response()->json([
            'message' => 'Gambar berita berhasil disimpan ke public storage.',
            'data' => [
                'news_id' => $news->id,
                'slug' => $news->slug,
                'featured_image' => $path,
                'image_url' => Storage::disk('public')->url($path),
                'source' => $source,
            ],
        ]);
    }
}
