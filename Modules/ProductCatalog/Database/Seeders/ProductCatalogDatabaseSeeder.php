<?php

namespace Modules\ProductCatalog\Database\Seeders;

use Illuminate\Database\Seeder;

class ProductCatalogDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            BrandSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
