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
        Schema::create('file_uploads', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->text('filepath');
            $table->string('type', 30)->comment("Question, Student Data");
            $table->text('info');
            $table->unsignedBigInteger('uploaded_by');
            $table->unsignedBigInteger('status_id');
            $table->timestamps();
            $table->foreign('uploaded_by')->references('id')->on('users');
            $table->foreign('status_id')->references('id')->on('statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_uploads');
    }
};
