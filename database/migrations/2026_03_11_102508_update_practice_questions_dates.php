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
        Schema::table('practice_questions', function (Blueprint $table) {
            $table->dropColumn(['schedule_date', 'start_time', 'stop_time']);
            $table->dateTime('start_schedule_date')->nullable()->after('total_score_per_question');
            $table->dateTime('end_schedule_date')->nullable()->after('start_schedule_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('practice_questions', function (Blueprint $table) {
            $table->dropColumn(['start_schedule_date', 'end_schedule_date']);
            $table->date('schedule_date')->after('total_score_per_question');
            $table->time('start_time')->after('schedule_date');
            $table->time('stop_time')->after('start_time');
        });
    }
};