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
        Schema::create('practice_question_question_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_question_id')->constrained('practice_questions')->cascadeOnDelete();
            $table->foreignId('question_info_id')->constrained('question_infos')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_question_question_info');
    }
};
