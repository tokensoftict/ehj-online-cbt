<?php

use App\Http\Controllers\Administrator\ClassGroupController;
use App\Http\Controllers\Administrator\ClassManagementController;
use App\Http\Controllers\Administrator\ClassNameController;
use App\Http\Controllers\Administrator\ClassSectionController;
use App\Http\Controllers\Administrator\GeneralSubjectController;
use App\Http\Controllers\Administrator\QuestionBanksController;
use App\Http\Controllers\Administrator\QuestionController;
use App\Http\Controllers\AdministratorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Student\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administrator\DashboardController as AdminDashboard;


Route::get('/', [HomeController::class, 'index'])->name('home')->defaults('appearance', 'ehj');
Route::prefix('student')->name('student.')->group(function () {
    Route::get('/login', [HomeController::class, 'login'])->name('login')->defaults('appearance', 'ehj');
    Route::post('/processLogin', [HomeController::class, 'processLogin'])->name('processLogin')->defaults('appearance', 'ehj');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->defaults('appearance', 'ehj');
    Route::get('/{subject}/take-test', [DashboardController::class, 'test'])->name('test')->defaults('appearance', 'ehj');
    Route::get('/logout', [DashboardController::class, 'logout'])->name('logout')->defaults('appearance', 'ehj');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdministratorController::class, 'login'])->name('login')->defaults('appearance', 'ehj');
    Route::post('/processLogin', [AdministratorController::class, 'processLogin'])->name('processLogin')->defaults('appearance', 'ehj');
    Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard')->defaults('appearance', 'ehj');

    Route::group(['defaults' => ['appearance' => 'ehj']], function () {
        Route::resource("class-groups", ClassGroupController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource("class-names", ClassNameController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource("class-sections", ClassSectionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource("student-classes", ClassManagementController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    Route::group(['defaults' => ['appearance' => 'ehj']], function () {
        Route::resource("general-subjects", GeneralSubjectController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get("general-subjects/datatable", [GeneralSubjectController::class, 'data_table'])->name('general-subjects.datatable');
    });


    Route::group(['defaults' => ['appearance' => 'ehj']], function () {
        Route::get("question-banks/datatable", [QuestionBanksController::class, 'data_table'])->name('question-banks.datatable');
        Route::get("question-banks/{id}/questions-data-table", [QuestionBanksController::class, 'questions_data_table'])->name('question-banks.questions_datatable');
        Route::resource("question-banks", QuestionBanksController::class)->only(['index', 'store', 'update', 'destroy', 'show']);

        Route::resource("{question_info_id}/question", QuestionController::class)->only(['store','create', 'update', 'destroy']);
    });

});
