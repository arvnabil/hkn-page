<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Product-to-service-solution relation intentionally removed.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: this migration no longer creates a relation.
    }
};
