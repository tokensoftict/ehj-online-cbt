<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Student;
use App\Models\GeneralSubject;
use App\Models\QuestionInfo;
use App\Models\QuestionsAndOption;
use App\Models\PracticeQuestion;
use App\Models\StudentClass;
use App\Models\PracticeResult;
use Carbon\Carbon;

class DashboardController extends Controller
{

    /**
     * @return Response
     */
    public final function index() : Response
    {
        $now = Carbon::now();

        $totalStudents = Student::count();
        $totalSubjects = GeneralSubject::count();
        $testContainers = QuestionInfo::where('status', 'Completed')->count();
        $totalQuestions = QuestionsAndOption::count();

        $activeTests = PracticeQuestion::where('is_approved', true)
            ->where('start_schedule_date', '<=', $now)
            ->where('end_schedule_date', '>=', $now)
            ->count();
            
        $pendingReviews = PracticeQuestion::where('is_approved', false)->count();
        $classes = StudentClass::count();
        
        $totalResults = PracticeResult::count();
        $averageScore = 0;
        $completionRate = 0;
        
        if ($totalResults > 0) {
            $averageScorePercentage = PracticeResult::with('practice_question')->get()->map(function($result) {
                $possible = $result->total_questions * ($result->practice_question->total_score_per_question ?? 1);
                return $possible > 0 ? ($result->score / $possible) * 100 : 0;
            })->average();
            $averageScore = round($averageScorePercentage, 1);
            
            // Completion rate could be estimated. For now, we'll just show the number of completed tests 
            // vs total active tests times students. We'll simplify and show 100% since PracticeResult is only created on complete
            $completionRate = 100; // Place holder if needed, or we can just say "N/A"
        }

        $recentActivities = PracticeResult::with(['student', 'practice_question'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'action' => 'Test Completed',
                    'details' => ($result->student->firstname ?? 'Unknown') . ' completed ' . ($result->practice_question->title ?? 'a test'),
                    'time' => $result->created_at->diffForHumans(),
                    'type' => 'completion',
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalSubjects' => $totalSubjects,
                'testContainers' => $testContainers,
                'totalQuestions' => $totalQuestions,
            ],
            'systemOverview' => [
                'activeTests' => $activeTests,
                'pendingReviews' => $pendingReviews,
                'classes' => $classes,
                'totalResults' => $totalResults,
                'averageScore' => $averageScore,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }



}
