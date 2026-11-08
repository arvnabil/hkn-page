<?php

namespace Modules\ProductCatalog\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\ProductCatalog\Models\Brand;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        Brand::updateOrCreate(['slug' => 'aver'], ['name' => 'AVer']);
    }
}
