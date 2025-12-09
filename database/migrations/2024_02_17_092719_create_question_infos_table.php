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
        Schema::create('question_infos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('name', 100);
            $table->string('status', 50)->default('Draft');
            $table->foreignId('student_class_id')->constrained();
            $table->foreignId('general_subject_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_infos');
    }
};
