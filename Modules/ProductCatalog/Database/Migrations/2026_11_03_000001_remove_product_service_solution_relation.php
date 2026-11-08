<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('product_service_solution');

        if (Schema::hasTable('products') && Schema::hasColumn('products', 'service_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('service_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('products') && !Schema::hasColumn('products', 'service_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->unsignedBigInteger('service_id')->nullable();
            });
        }
    }
};
