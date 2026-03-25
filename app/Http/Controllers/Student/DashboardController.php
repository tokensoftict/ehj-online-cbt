<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PracticeQuestion;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    /**
     * @return Response
     */
    public final function index() : Response
    {
        $student = Auth::guard('student')->user();
        $now = Carbon::now();
        $today = Carbon::today();

        $practiceQuestions = PracticeQuestion::with([
            'general_subject',
            'question_infos.general_subject'
        ])
            ->where('is_approved', true)
            ->where('student_class_id', $student->student_class_id)
            ->where('start_schedule_date', '<=', $now)
            ->where('end_schedule_date', '>=', $now)
            ->get();

        // Fetch attempt counts for these practice questions
        $resultsCount = \App\Models\PracticeResult::where('student_id', $student->id)
            ->whereIn('practice_question_id', $practiceQuestions->pluck('id'))
            ->groupBy('practice_question_id')
            ->selectRaw('practice_question_id, count(*) as count')
            ->pluck('count', 'practice_question_id');

        // Check for active sessions for these practice questions
        $activeSessionIds = \App\Models\TestSession::where('student_id', $student->id)
            ->whereIn('practice_question_id', $practiceQuestions->pluck('id'))
            ->where('is_completed', false)
            ->pluck('practice_question_id')
            ->toArray();

        // Filter out practice questions where limit is reached, unless there's an active session
        $practiceQuestions = $practiceQuestions->filter(function ($pq) use ($resultsCount, $activeSessionIds) {
            $hasActiveSession = in_array($pq->id, $activeSessionIds);
            if ($hasActiveSession) return true; // Always show if they can resume

            $count = $resultsCount[$pq->id] ?? 0;
            return $pq->practice_limit === 0 || $count < $pq->practice_limit;
        })->values();

        $practiceQuestions->map(function ($pq) use ($activeSessionIds) {
            $pq->has_active_session = in_array($pq->id, $activeSessionIds);
            return $pq;
        });

        return Inertia::render('student/dashboard', [
            'practiceQuestions' => $practiceQuestions
        ]);
    }

    /**
     * @return Response
     */
    public final function history() : Response
    {
        $student = Auth::guard('student')->user();
        
        $results = \App\Models\PracticeResult::with(['practice_question.general_subject'])
                    ->where('student_id', $student->id ?? clone $student->user_id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);

        return Inertia::render('student/history', [
            'results' => $results
        ]);
    }


    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public final function logout(Request $request) : RedirectResponse
    {
        Auth::guard('student')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->intended(route('student.login', absolute: false));
    }

    /**
     * @param string $subject
     * @return Response
     */
    public final function test(string $subject) : Response
    {
        return Inertia::render('student/test', ['subject' => $subject]);
    }
}