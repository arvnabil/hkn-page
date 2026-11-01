<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Modules\News\Database\Seeders\NewsDatabaseSeeder;
use Modules\News\Models\News;
use Modules\News\Models\NewsCategory;
use Modules\News\Models\NewsTag;
use Tests\TestCase;

class NewsJsonSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_news_json_seeder_imports_data_correctly(): void
    {
        // 1. Run the seeder
        $this->seed(NewsDatabaseSeeder::class);

        // 2. Verify categories
        $categoriesCount = NewsCategory::count();
        $this->assertGreaterThanOrEqual(40, $categoriesCount, 'Should import at least 40 categories');

        // Check HTML entity decoding in category names (e.g. "Mouse &amp; Keyboard" -> "Mouse & Keyboard")
        $mouseKeyboardCategory = NewsCategory::where('slug', 'mouse-keyboard')->first();
        $this->assertNotNull($mouseKeyboardCategory, 'Category mouse-keyboard should exist');
        $this->assertEquals('Mouse & Keyboard', $mouseKeyboardCategory->name);

        // 3. Verify tags
        $tagsCount = NewsTag::count();
        $this->assertGreaterThan(100, $tagsCount, 'Should import news tags');

        // 4. Verify news
        $newsCount = News::count();
        $this->assertGreaterThanOrEqual(700, $newsCount, 'Should import around 716 news articles');

        // Verify sample news item
        $sampleNews = News::whereNotNull('slug')->first();
        $this->assertNotNull($sampleNews);
        $this->assertNotEmpty($sampleNews->title);
        $this->assertNotEmpty($sampleNews->slug);

        // Verify status is valid
        $this->assertTrue(in_array($sampleNews->status, ['published', 'draft'], true));

        // 5. Verify pivot relations (category post & tag post)
        $categoryPostCount = DB::table('news_category_post')->count();
        $this->assertGreaterThan(500, $categoryPostCount, 'Should import category pivots');

        $tagPostCount = DB::table('news_tag_post')->count();
        $this->assertGreaterThan(500, $tagPostCount, 'Should import tag pivots');

        // Check Eloquent relationship works
        $newsWithCategory = News::has('categories')->with('categories')->first();
        $this->assertNotNull($newsWithCategory, 'Should have news with attached categories');
        $this->assertTrue($newsWithCategory->categories->isNotEmpty());

        // 6. Test Idempotency: running seeder again should not throw duplicate key errors or duplicate records
        $this->seed(NewsDatabaseSeeder::class);

        $this->assertEquals($categoriesCount, NewsCategory::count(), 'Category count should remain unchanged after re-seed');
        $this->assertEquals($tagsCount, NewsTag::count(), 'Tag count should remain unchanged after re-seed');
        $this->assertEquals($newsCount, News::count(), 'News count should remain unchanged after re-seed');
        $this->assertEquals($categoryPostCount, DB::table('news_category_post')->count(), 'Category pivot count should remain unchanged after re-seed');
        $this->assertEquals($tagPostCount, DB::table('news_tag_post')->count(), 'Tag pivot count should remain unchanged after re-seed');
    }
}
