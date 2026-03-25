<?php

use App\Http\Controllers\Administrator\ClassGroupController;
use App\Http\Controllers\Administrator\ClassManagementController;
use App\Http\Controllers\Administrator\ClassNameController;
use App\Http\Controllers\Administrator\ClassSectionController;
use App\Http\Controllers\Administrator\AdminManagementController;
use App\Http\Controllers\Administrator\DashboardController as AdminDashboard;
use App\Http\Controllers\Administrator\FileUploadController;
use App\Http\Controllers\Administrator\GeneralSubjectController;
use App\Http\Controllers\Administrator\QuestionBanksController;
use App\Http\Controllers\Administrator\QuestionController;
use App\Http\Controllers\Administrator\QuestionInstructionController;
use App\Http\Controllers\Administrator\StudentController;
use App\Http\Controllers\AdministratorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Student\DashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class , 'index'])->name('home')->defaults('appearance', 'ehj');
Route::prefix('student')->name('student.')->group(function () {
    Route::get('/login', [HomeController::class , 'login'])->name('login')->defaults('appearance', 'ehj');
    Route::post('/processLogin', [HomeController::class , 'processLogin'])->name('processLogin')->defaults('appearance', 'ehj');
    Route::get('/dashboard', [DashboardController::class , 'index'])->name('dashboard')->defaults('appearance', 'ehj')->middleware('auth:student');
    Route::get('/history', [DashboardController::class , 'history'])->name('history')->defaults('appearance', 'ehj')->middleware('auth:student');
    Route::get('/logout', [DashboardController::class , 'logout'])->name('logout')->defaults('appearance', 'ehj')->middleware('auth:student');

    // Test Module Routes
    Route::get('/practice/{id}/take-test', [\App\Http\Controllers\Student\TestController::class , 'instructions'])->name('practice.instructions')->defaults('appearance', 'ehj')->middleware('auth:student');
    Route::get('/practice/{id}/start', [\App\Http\Controllers\Student\TestController::class , 'start'])->name('practice.start')->defaults('appearance', 'ehj')->middleware('auth:student');
    Route::post('/practice/{id}/submit', [\App\Http\Controllers\Student\TestController::class , 'submit'])->name('practice.submit')->middleware('auth:student');
    Route::post('/practice/{id}/save-progress', [\App\Http\Controllers\Student\TestController::class , 'saveProgress'])->name('practice.save-progress')->middleware('auth:student');
    Route::get('/practice/{id}/results/{attempt_id?}', [\App\Http\Controllers\Student\TestController::class , 'results'])->name('practice.results')->defaults('appearance', 'ehj')->middleware('auth:student');

});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdministratorController::class , 'login'])->name('login')->defaults('appearance', 'ehj');
    Route::post('/processLogin', [AdministratorController::class , 'processLogin'])->name('processLogin')->defaults('appearance', 'ehj');
    Route::get('/dashboard', [AdminDashboard::class , 'index'])->name('dashboard')->defaults('appearance', 'ehj')->middleware(['auth:admin', 'permission:view_dashboard']);
    Route::post('/logout', [AdministratorController::class , 'logout'])->name('logout')->middleware('auth:admin');

    Route::group(['defaults' => ['appearance' => 'ehj'], 'middleware' => ['auth:admin']], function () {
        
        Route::group(['middleware' => ['permission:manage_admins']], function () {
            Route::get("admins/datatable", [AdminManagementController::class , 'data_table'])->name('admins.datatable');
            Route::resource("admins", AdminManagementController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::group(['middleware' => ['permission:manage_roles_permissions']], function () {
            Route::get("roles/datatable", [\App\Http\Controllers\Administrator\RoleController::class , 'datatable'])->name('roles.datatable');
            Route::resource("roles", \App\Http\Controllers\Administrator\RoleController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::group(['middleware' => ['permission:manage_classes']], function () {
            Route::resource("class-groups", ClassGroupController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource("class-names", ClassNameController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource("class-sections", ClassSectionController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource("student-classes", ClassManagementController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::group(['middleware' => ['permission:manage_subjects']], function () {
            Route::resource("general-subjects", GeneralSubjectController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::get("general-subjects/datatable", [GeneralSubjectController::class , 'data_table'])->name('general-subjects.datatable');
        });

        Route::group(['middleware' => ['permission:manage_students']], function () {
            Route::get("students/datatable", [StudentController::class , 'data_table'])->name('students.datatable');
            Route::post("students/upload", [StudentController::class , 'upload'])->name('student.upload');
            Route::resource("students", StudentController::class)->only(['index', 'store', 'update', 'destroy', 'show']);
        });

        Route::group(['middleware' => ['permission:manage_question_banks']], function () {
            Route::get("question-banks/datatable", [QuestionBanksController::class , 'data_table'])->name('question-banks.datatable');
            Route::get("question-banks/{id}/questions-data-table", [QuestionBanksController::class , 'questions_data_table'])->name('question-banks.questions_datatable');
            Route::post("question-banks/{id}/toggle-status", [QuestionBanksController::class , 'toggle_status'])->name('question-banks.toggle_status');
            Route::resource("question-banks", QuestionBanksController::class)->only(['index', 'store', 'update', 'destroy', 'show']);

            Route::post("question/{question_info_id}/upload", [QuestionController::class , 'upload'])->name('questions.upload');
            Route::resource("question/{question_info_id}/question", QuestionController::class)->only(['store', 'create', 'update', 'edit', 'destroy']);

            Route::get("question/{question_info_id}/instruction/data_table", [QuestionInstructionController::class , 'data_table'])->name('instruction.datatable');
            Route::resource("question/{question_info_id}/instruction", QuestionInstructionController::class)->only(['store', 'create', 'update', 'edit', 'destroy', 'index']);
        });

        Route::group(['middleware' => ['permission:manage_practice_questions']], function () {
            Route::get("practice-questions/datatable", [\App\Http\Controllers\Administrator\PracticeQuestionController::class , 'data_table'])->name('practice-questions.datatable');
            Route::post("practice-questions/{id}/toggle-approve", [\App\Http\Controllers\Administrator\PracticeQuestionController::class , 'toggle_approve'])->name('practice-questions.toggle-approve');
            
            Route::get("practice-questions/{id}/results", [\App\Http\Controllers\Administrator\PracticeQuestionController::class, 'results'])->name('practice-questions.results');
            Route::get("practice-questions/{id}/results/datatable", [\App\Http\Controllers\Administrator\PracticeQuestionController::class, 'results_datatable'])->name('practice-questions.results_datatable');
            Route::get("practice-questions/{id}/results/export", [\App\Http\Controllers\Administrator\PracticeQuestionController::class, 'export_results'])->name('practice-questions.export_results');
            Route::get("practice-questions/{id}/results/{result_id}/pdf", [\App\Http\Controllers\Administrator\PracticeQuestionController::class, 'download_pdf'])->name('practice-questions.download_pdf');
            Route::delete("practice-questions/{id}/results/{result_id}", [\App\Http\Controllers\Administrator\PracticeQuestionController::class, 'delete_result'])->name('practice-questions.delete_result');
            
            Route::resource("practice-questions", \App\Http\Controllers\Administrator\PracticeQuestionController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::group(['middleware' => ['permission:manage_file_uploads']], function () {
            Route::get("file-uploads/datatable", [FileUploadController::class , 'data_table'])->name('file-uploads.datatable');
            Route::get("file-uploads/template/student", [FileUploadController::class , 'student_template'])->name('file-uploads.student_template');
            Route::get("file-uploads/template/question", [FileUploadController::class , 'question_template'])->name('file-uploads.question_template');
            Route::get("file-uploads/{id}/download", [FileUploadController::class , 'download_file'])->name('file-uploads.download');
            Route::get("file-uploads/{id}/re_run", [FileUploadController::class , 're_run'])->name('file-uploads.re_run');
            Route::resource("file-uploads", FileUploadController::class)->only(['index', 'destroy']);
        });

        Route::get("profile", [\App\Http\Controllers\Administrator\ProfileController::class , 'edit'])->name('profile.edit');
        Route::patch("profile", [\App\Http\Controllers\Administrator\ProfileController::class , 'update'])->name('profile.update');

        Route::get("password", [\App\Http\Controllers\Administrator\ProfileController::class , 'editPassword'])->name('password.edit');
        Route::patch("password", [\App\Http\Controllers\Administrator\ProfileController::class , 'updatePassword'])->name('password.update');
    });

    });