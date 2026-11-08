<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class SyncNewsImages extends Command
{
    protected $signature = 'news:sync-images
        {--dry-run : List local matches without copying or updating records}
        {--url= : Limit sync to one exact source URL or existing storage path}
        {--source=public/images/uploads : Local WordPress uploads directory}';

    protected $description = 'Sync downloaded Harry Kusumo news images into storage using each news slug';

    private const SOURCE_HOST = 'harrykusumo.com';

    private const UPLOADS_URL_PREFIX = '/wp-content/uploads/';

    public function handle(): int
    {
        $sourceRoot = $this->resolveSourceRoot((string) $this->option('source'));
        if (!$sourceRoot) {
            $this->error('Local uploads directory not found: '.$this->option('source'));

            return self::FAILURE;
        }

        $query = DB::table('news')
            ->where(function ($query) {
                $query->where('featured_image', 'like', 'http%')
                    ->orWhere('featured_image', 'like', 'news/remote/%')
                    ->orWhere('featured_image', 'like', 'news/%');
            })
            ->select('id', 'slug', 'featured_image')
            ->orderBy('id');

        if ($imageFilter = $this->option('url')) {
            $query->where('featured_image', $imageFilter);
        }

        $total = 0;
        $matched = 0;
        $syncedRows = 0;
        $missing = 0;
        $failed = 0;
        $alreadyInPlace = 0;
        $dryRun = (bool) $this->option('dry-run');
        $sourceUrlsBySlug = $this->loadSeederImageUrls();

        foreach ($query->get() as $news) {
            $featuredImage = trim((string) $news->featured_image);
            $isSlugPath = str_starts_with($featuredImage, 'news/') && !str_starts_with($featuredImage, 'news/remote/');
            if ($isSlugPath && Storage::disk('public')->exists($featuredImage)) {
                $alreadyInPlace++;
                continue;
            }

            $isPreviousSyncPath = str_starts_with($featuredImage, 'news/remote/');
            if (!$isPreviousSyncPath) {
                $sourceUrl = $isSlugPath
                    ? ($sourceUrlsBySlug[$news->slug] ?? '')
                    : $featuredImage;
                $parts = parse_url($sourceUrl);
                $host = strtolower($parts['host'] ?? '');
                if (!in_array($host, [self::SOURCE_HOST, 'www.'.self::SOURCE_HOST], true)) {
                    continue;
                }
            } else {
                $sourceUrl = $sourceUrlsBySlug[$news->slug] ?? '';
            }

            $total++;

            try {
                $localFile = $this->resolveImageFile($sourceRoot, $featuredImage);
                if (!$localFile && !empty($sourceUrl)) {
                    $localFile = $this->resolveImageFile($sourceRoot, $sourceUrl);
                }
                if (!$localFile) {
                    $missing++;
                    $this->warn("[MISSING] news/{$news->slug}: no local file for {$featuredImage}");
                    continue;
                }

                $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($localFile);
                $extension = $this->imageExtension($mime ?: '');
                if (!$extension) {
                    throw new RuntimeException('Unsupported image type: '.($mime ?: 'unknown'));
                }

                $slug = Str::slug((string) $news->slug) ?: 'news-'.$news->id;
                $storagePath = "news/{$slug}.{$extension}";
                $matched++;

                if ($dryRun) {
                    $this->line("[DRY RUN] {$featuredImage} → /storage/{$storagePath}");
                    continue;
                }

                $alreadyAtTarget = $featuredImage === $storagePath
                    && Storage::disk('public')->exists($storagePath);

                if (!$alreadyAtTarget) {
                    $stream = fopen($localFile, 'rb');
                    if ($stream === false) {
                        throw new RuntimeException('Could not open local image file');
                    }

                    try {
                        if (!Storage::disk('public')->put($storagePath, $stream)) {
                            throw new RuntimeException('Could not write image to the public storage disk');
                        }
                    } finally {
                        fclose($stream);
                    }

                    DB::table('news')->where('id', $news->id)->update([
                        'featured_image' => $storagePath,
                        'updated_at' => now(),
                    ]);
                    $syncedRows++;
                }

                $this->line("[SYNCED] news/{$slug} → /storage/{$storagePath}");
            } catch (\Throwable $exception) {
                $failed++;
                $this->error("[FAILED] news/{$news->slug}: {$exception->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("News images needing sync: {$total}; already in place: {$alreadyInPlace}; local matches: {$matched}; missing local files: {$missing}; failed: {$failed}");
        if (!$dryRun) {
            $this->info("Updated news rows: {$syncedRows}");
        }

        return ($missing > 0 || $failed > 0) ? self::FAILURE : self::SUCCESS;
    }

    private function resolveSourceRoot(string $source): ?string
    {
        $isAbsolute = str_starts_with($source, '/') || preg_match('/^[A-Za-z]:[\\\\\/]/', $source) === 1;
        $path = $isAbsolute ? $source : $this->laravel->basePath($source);
        $realPath = realpath($path);

        return $realPath !== false && is_dir($realPath) ? $realPath : null;
    }

    private function loadSeederImageUrls(): array
    {
        $seedFile = $this->laravel->basePath('data/news.json');
        if (!is_file($seedFile)) {
            return [];
        }

        $records = json_decode((string) file_get_contents($seedFile), true);
        if (!is_array($records)) {
            return [];
        }

        $urls = [];
        foreach ($records as $record) {
            $slug = $record['slug'] ?? null;
            $url = $record['thumbnail'] ?? null;
            if (is_string($slug) && is_string($url) && $url !== '') {
                $urls[$slug] = $url;
            }
        }

        return $urls;
    }

    private function resolveImageFile(string $sourceRoot, string $featuredImage): ?string
    {
        if (str_starts_with($featuredImage, 'news/remote/')) {
            $storageRoot = realpath(Storage::disk('public')->path(''));
            $storedFile = realpath(Storage::disk('public')->path($featuredImage));
            if (!$storageRoot || !$storedFile || !is_file($storedFile)) {
                return null;
            }

            return str_starts_with($storedFile, rtrim($storageRoot, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR)
                ? $storedFile
                : null;
        }

        $parts = parse_url($featuredImage);
        $host = strtolower($parts['host'] ?? '');
        if (!in_array($host, [self::SOURCE_HOST, 'www.'.self::SOURCE_HOST], true)) {
            return null;
        }

        $urlPath = $parts['path'] ?? '';
        if (!str_starts_with($urlPath, self::UPLOADS_URL_PREFIX)) {
            return null;
        }

        $relativePath = rawurldecode(substr($urlPath, strlen(self::UPLOADS_URL_PREFIX)));
        $segments = preg_split('~[\\\\/]~', $relativePath) ?: [];
        if ($relativePath === '' || in_array('..', $segments, true) || str_contains($relativePath, "\0")) {
            return null;
        }

        $candidate = $sourceRoot.DIRECTORY_SEPARATOR.implode(DIRECTORY_SEPARATOR, $segments);
        $realPath = realpath($candidate);
        if ($realPath === false || !is_file($realPath)) {
            return null;
        }

        $rootPrefix = rtrim($sourceRoot, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
        return str_starts_with($realPath, $rootPrefix) ? $realPath : null;
    }

    private function imageExtension(string $mime): ?string
    {
        return match (strtolower($mime)) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/avif' => 'avif',
            'image/svg+xml' => 'svg',
            default => null,
        };
    }
}
