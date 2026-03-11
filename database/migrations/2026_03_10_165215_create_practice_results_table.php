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
        Schema::create('practice_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('practice_question_id')->constrained('practice_questions')->onDelete('cascade');
            $table->integer('total_questions')->default(0);
            $table->integer('answered_questions')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->decimal('score', 5, 2)->default(0);
            $table->integer('time_taken')->default(0)->comment('Time taken in seconds');
            $table->json('answers_data')->nullable();
            $table->json('subject_scores')->nullable()->comment('Detailed breakdown of scores per subject');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_results');
    }
};
