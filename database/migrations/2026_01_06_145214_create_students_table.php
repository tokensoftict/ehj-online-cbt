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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('reg_no');
            $table->string('surname', 100);
            $table->string('firstname', 100);
            $table->string('lastname', 100)->nullable();
            $table->text('password');
            $table->integer('age');
            $table->string('sex')->comment('M=>male, F=>Female');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('student_class_id')->nullable()->constrained('id')->on('student_classes')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
