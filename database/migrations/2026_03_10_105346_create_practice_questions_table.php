<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('practice_questions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('student_class_id')->constrained('student_classes')->cascadeOnDelete();
            $table->date('schedule_date');
            $table->time('start_time');
            $table->time('stop_time');
            $table->integer('duration')->comment('Duration in minutes');
            $table->integer('total_score_per_question')->default(1);
            $table->text('instruction')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_questions');
    }
};