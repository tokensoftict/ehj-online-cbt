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
        Schema::create('questions_and_options', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->longText('question')->nullable();
            $table->foreignId('question_info_id');
            $table->foreignId('question_instruction_id')->nullable();
            $table->integer('question_no')->nullable();
            $table->text('a')->nullable();
            $table->text('b')->nullable();
            $table->text('c')->nullable();
            $table->text('d')->nullable();
            $table->string('correct_option')->nullable();
            $table->date('date_added')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions_and_options');
    }
};
