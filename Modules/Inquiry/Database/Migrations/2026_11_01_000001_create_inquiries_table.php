<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('company');
            $table->enum('room_type', ['huddle', 'medium', 'boardroom', 'auditorium']);
            $table->unsignedInteger('participant_count')->nullable();
            $table->enum('current_platform', ['teams', 'zoom', 'meet', 'other'])->nullable();
            $table->string('budget_range')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['new', 'in_review', 'contacted', 'follow_up', 'closed'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
