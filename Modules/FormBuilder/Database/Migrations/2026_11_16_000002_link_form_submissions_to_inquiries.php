<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('form_submissions', function (Blueprint $table) {
            $table->foreignId('inquiry_id')->nullable()->unique()->constrained('inquiries')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('form_submissions', fn (Blueprint $table) => $table->dropConstrainedForeignId('inquiry_id'));
    }
};
