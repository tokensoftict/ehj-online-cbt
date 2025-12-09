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
        Schema::create('question_instructions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->longText('instruction');
            $table->foreignId('student_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_info_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_instructions');
    }
};
