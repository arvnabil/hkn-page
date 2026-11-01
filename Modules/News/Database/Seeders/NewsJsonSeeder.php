<?php

namespace Modules\News\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Seed News, Categories, Tags, and pivot tables from JSON export files
 * located in the /data directory.
 *
 * Strategy (idempotent / safe to re-run):
 *  1. Upsert news_categories by slug
 *  2. Upsert news_tags by slug
 *  3. Upsert news by slug  (maps JSON thumbnail → DB featured_image)
 *  4. Re-sync news_category_post pivots
 *  5. Re-sync news_tag_post pivots
 *
 * JSON IDs are WordPress export IDs and are NOT the same as Laravel DB IDs.
 * We always resolve real DB IDs via slug maps before inserting pivots.
 */
class NewsJsonSeeder extends Seeder
{
    private string $dataPath;

    public function __construct()
    {
        $this->dataPath = base_path('data');
    }

    public function run(): void
    {
        $this->command->info('📰 NewsJsonSeeder: starting import from data/ JSON files …');

        $this->seedCategories();
        $this->seedTags();
        $this->seedNews();
        $this->seedCategoryPivots();
        $this->seedTagPivots();

        $this->command->info('✅ NewsJsonSeeder: import complete.');
    }

    // -------------------------------------------------------------------------
    // 1. Categories
    // -------------------------------------------------------------------------

    private function seedCategories(): void
    {
        $rows = $this->loadJson('news_categories.json');
        $now  = now();

        $upsertRows = [];
        foreach ($rows as $row) {
            $slug = trim($row['slug'] ?? '');
            $name = html_entity_decode(trim($row['name'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');

            if ($slug === '' || $name === '') {
                continue;
            }

            $upsertRows[] = [
                'name'       => $name,
                'slug'       => $slug,
                'created_at' => $row['created_at'] ?? $now,
                'updated_at' => $row['updated_at'] ?? $now,
            ];
        }

        // Upsert in chunks to avoid hitting SQLite/MySQL limits
        foreach (array_chunk($upsertRows, 100) as $chunk) {
            DB::table('news_categories')->upsert(
                $chunk,
                ['slug'],           // unique key
                ['name', 'updated_at']
            );
        }

        $count = DB::table('news_categories')->count();
        $this->command->info("  → news_categories: {$count} rows in DB (upserted " . count($upsertRows) . ' from JSON)');
    }

    // -------------------------------------------------------------------------
    // 2. Tags
    // -------------------------------------------------------------------------

    private function seedTags(): void
    {
        $rows = $this->loadJson('news_tags.json');
        $now  = now();

        $upsertRows = [];
        foreach ($rows as $row) {
            $slug = trim($row['slug'] ?? '');
            $name = html_entity_decode(trim($row['name'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');

            if ($slug === '' || $name === '') {
                continue;
            }

            $upsertRows[] = [
                'name'       => $name,
                'slug'       => $slug,
                'created_at' => $row['created_at'] ?? $now,
                'updated_at' => $row['updated_at'] ?? $now,
            ];
        }

        foreach (array_chunk($upsertRows, 200) as $chunk) {
            DB::table('news_tags')->upsert(
                $chunk,
                ['slug'],
                ['name', 'updated_at']
            );
        }

        $count = DB::table('news_tags')->count();
        $this->command->info("  → news_tags: {$count} rows in DB (upserted " . count($upsertRows) . ' from JSON)');
    }

    // -------------------------------------------------------------------------
    // 3. News articles
    // -------------------------------------------------------------------------

    private function seedNews(): void
    {
        $rows = $this->loadJson('news.json');
        $now  = now();

        // Detect which optional columns exist in the news table
        $hasBreadcrumbImage = Schema::hasColumn('news', 'breadcrumb_image');
        $hasShowBreadcrumb  = Schema::hasColumn('news', 'show_breadcrumb');
        $hasUserId          = Schema::hasColumn('news', 'user_id');

        // featured_image vs thumbnail column name
        $hasFeaturedImage   = Schema::hasColumn('news', 'featured_image');
        $imageColumn        = $hasFeaturedImage ? 'featured_image' : 'thumbnail';

        $upsertRows = [];
        $skipped    = 0;
        $seenSlugs  = [];

        foreach ($rows as $row) {
            $slug = trim($row['slug'] ?? '');

            if ($slug === '') {
                $skipped++;
                continue;
            }

            // Deduplicate within the JSON file itself
            if (isset($seenSlugs[$slug])) {
                $skipped++;
                continue;
            }
            $seenSlugs[$slug] = true;

            $record = [
                'title'        => html_entity_decode(trim($row['title'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'slug'         => $slug,
                'excerpt'      => $row['excerpt'] ?? null,
                'content'      => $row['content'] ?? null,
                $imageColumn   => $row['thumbnail'] ?? null,   // JSON field is always "thumbnail"
                'status'       => $row['status'] ?? 'draft',
                'published_at' => $row['published_at'] ?? null,
                'created_at'   => $row['created_at'] ?? $now,
                'updated_at'   => $row['updated_at'] ?? $now,
            ];

            if ($hasBreadcrumbImage) {
                $record['breadcrumb_image'] = $row['breadcrumb_image'] ?? null;
            }
            if ($hasShowBreadcrumb) {
                $record['show_breadcrumb'] = isset($row['show_breadcrumb'])
                    ? (bool) $row['show_breadcrumb']
                    : true;
            }
            if ($hasUserId) {
                // Default to user_id = 1 (super admin); skip if user 1 doesn't exist
                $record['user_id'] = $row['user_id'] ?? 1;
            }

            $upsertRows[] = $record;
        }

        // Determine which columns to update on conflict
        $updateColumns = ['title', 'excerpt', 'content', $imageColumn, 'status', 'published_at', 'updated_at'];
        if ($hasBreadcrumbImage) $updateColumns[] = 'breadcrumb_image';
        if ($hasShowBreadcrumb)  $updateColumns[] = 'show_breadcrumb';
        if ($hasUserId)          $updateColumns[] = 'user_id';

        foreach (array_chunk($upsertRows, 50) as $chunk) {
            DB::table('news')->upsert(
                $chunk,
                ['slug'],
                $updateColumns
            );
        }

        $count = DB::table('news')->count();
        $this->command->info("  → news: {$count} rows in DB (upserted " . count($upsertRows) . ", skipped {$skipped} from JSON)");
    }

    // -------------------------------------------------------------------------
    // 4. Category pivots
    // -------------------------------------------------------------------------

    private function seedCategoryPivots(): void
    {
        $pivotRows = $this->loadJson('news_category_post.json');

        // Build JSON-id → DB-id maps using slugs
        $jsonCategories = $this->indexById($this->loadJson('news_categories.json'), 'id');
        $jsonNews       = $this->indexById($this->loadJson('news.json'), 'id');

        // DB slug → id maps
        $dbCategoryMap = DB::table('news_categories')->pluck('id', 'slug')->toArray();
        $dbNewsMap     = DB::table('news')->pluck('id', 'slug')->toArray();

        // Clear existing pivots and re-insert (idempotent reset)
        DB::table('news_category_post')->delete();

        $insertRows = [];
        $skipped    = 0;
        $seenPairs  = [];
        $now        = now();

        foreach ($pivotRows as $row) {
            $jsonNewsId     = $row['news_id']          ?? null;
            $jsonCategoryId = $row['news_category_id'] ?? null;

            if (! $jsonNewsId || ! $jsonCategoryId) {
                $skipped++;
                continue;
            }

            // Resolve slugs from JSON, then DB ids from slugs
            $newsSlug     = $jsonNews[$jsonNewsId]['slug']          ?? null;
            $categorySlug = $jsonCategories[$jsonCategoryId]['slug'] ?? null;

            if (! $newsSlug || ! $categorySlug) {
                $skipped++;
                continue;
            }

            $dbNewsId     = $dbNewsMap[$newsSlug]         ?? null;
            $dbCategoryId = $dbCategoryMap[$categorySlug] ?? null;

            if (! $dbNewsId || ! $dbCategoryId) {
                $skipped++;
                continue;
            }

            $pairKey = "{$dbNewsId}:{$dbCategoryId}";
            if (isset($seenPairs[$pairKey])) {
                $skipped++;
                continue;
            }
            $seenPairs[$pairKey] = true;

            $insertRows[] = [
                'news_id'          => $dbNewsId,
                'news_category_id' => $dbCategoryId,
                'created_at'       => $row['created_at'] ?? $now,
                'updated_at'       => $row['updated_at'] ?? $now,
            ];
        }

        foreach (array_chunk($insertRows, 500) as $chunk) {
            DB::table('news_category_post')->insert($chunk);
        }

        $count = DB::table('news_category_post')->count();
        $this->command->info("  → news_category_post: {$count} rows inserted (skipped {$skipped})");
    }

    // -------------------------------------------------------------------------
    // 5. Tag pivots
    // -------------------------------------------------------------------------

    private function seedTagPivots(): void
    {
        $pivotRows = $this->loadJson('news_tag_post.json');

        $jsonTags = $this->indexById($this->loadJson('news_tags.json'), 'id');
        $jsonNews = $this->indexById($this->loadJson('news.json'), 'id');

        $dbTagMap  = DB::table('news_tags')->pluck('id', 'slug')->toArray();
        $dbNewsMap = DB::table('news')->pluck('id', 'slug')->toArray();

        DB::table('news_tag_post')->delete();

        $insertRows = [];
        $skipped    = 0;
        $seenPairs  = [];
        $now        = now();

        foreach ($pivotRows as $row) {
            $jsonNewsId = $row['news_id']     ?? null;
            $jsonTagId  = $row['news_tag_id'] ?? null;

            if (! $jsonNewsId || ! $jsonTagId) {
                $skipped++;
                continue;
            }

            $newsSlug = $jsonNews[$jsonNewsId]['slug'] ?? null;
            $tagSlug  = $jsonTags[$jsonTagId]['slug']  ?? null;

            if (! $newsSlug || ! $tagSlug) {
                $skipped++;
                continue;
            }

            $dbNewsId = $dbNewsMap[$newsSlug] ?? null;
            $dbTagId  = $dbTagMap[$tagSlug]   ?? null;

            if (! $dbNewsId || ! $dbTagId) {
                $skipped++;
                continue;
            }

            $pairKey = "{$dbNewsId}:{$dbTagId}";
            if (isset($seenPairs[$pairKey])) {
                $skipped++;
                continue;
            }
            $seenPairs[$pairKey] = true;

            $insertRows[] = [
                'news_id'     => $dbNewsId,
                'news_tag_id' => $dbTagId,
                'created_at'  => $row['created_at'] ?? $now,
                'updated_at'  => $row['updated_at'] ?? $now,
            ];
        }

        foreach (array_chunk($insertRows, 500) as $chunk) {
            DB::table('news_tag_post')->insert($chunk);
        }

        $count = DB::table('news_tag_post')->count();
        $this->command->info("  → news_tag_post: {$count} rows inserted (skipped {$skipped})");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Load and JSON-decode a file from the data/ directory.
     *
     * @return array<int, array<string, mixed>>
     */
    private function loadJson(string $filename): array
    {
        $path = $this->dataPath . DIRECTORY_SEPARATOR . $filename;

        if (! file_exists($path)) {
            $this->command->warn("  ⚠ File not found: {$path} — skipping.");
            return [];
        }

        $data = json_decode(file_get_contents($path), true);

        if (! is_array($data)) {
            $this->command->warn("  ⚠ Failed to parse JSON: {$path} — skipping.");
            return [];
        }

        return $data;
    }

    /**
     * Re-index an array of associative rows by a given key.
     *
     * @param  array<int, array<string, mixed>> $rows
     * @return array<int|string, array<string, mixed>>
     */
    private function indexById(array $rows, string $key): array
    {
        $indexed = [];
        foreach ($rows as $row) {
            if (isset($row[$key])) {
                $indexed[$row[$key]] = $row;
            }
        }
        return $indexed;
    }
}

