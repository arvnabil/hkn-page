<?php

namespace Modules\News\Database\Seeders;

use Illuminate\Database\Seeder;

class NewsDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Import news, categories, tags, and pivot relations from JSON export files
     * in the data/ directory. Legacy hardcoded seeders (ActivNewsSeeder, NewsSeeder,
     * NewsTaxonomySeeder) are kept on disk but are no longer called here.
     */
    public function run(): void
    {
        $this->call([
            NewsJsonSeeder::class,
        ]);
    }
}
