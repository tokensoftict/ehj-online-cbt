<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PracticeQuestion;
use App\Models\PracticeResult;
use App\Models\TestSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TestController extends Controller
{
    public function instructions($id)
    {
        $student = Auth::guard('student')->user();
        $now = Carbon::now();
        $today = Carbon::today();

        $practice = PracticeQuestion::with([
            'general_subject',
            'question_infos' => function($query) {
                $query->where('status', 'Completed')->with('question_instructions');
            }
        ])
            ->where('id', $id)
            ->where('is_approved', true)
            ->where('student_class_id', $student->student_class_id)
            ->where('start_schedule_date', '<=', $now)
            ->where('end_schedule_date', '>=', $now)
            ->firstOrFail();

        $attemptsCount = PracticeResult::where('student_id', $student->id)
            ->where('practice_question_id', $practice->id)
            ->count();

        if ($practice->practice_limit > 0 && $attemptsCount >= $practice->practice_limit) {
            return redirect()->route('student.dashboard')->with('error', 'You have reached the maximum number of attempts for this practice.');
        }

        // Calculate total questions by summing counts from each info
        $totalQuestions = 0;
        foreach ($practice->question_infos as $info) {
            $totalQuestions += $info->questions_and_options()->count();
        }

        $hasActiveSession = \App\Models\TestSession::where('student_id', $student->id)
            ->where('practice_question_id', $practice->id)
            ->where('is_completed', false)
            ->exists();

        return Inertia::render('student/test/instructions', [
            'practice' => $practice,
            'totalQuestions' => $totalQuestions,
            'hasActiveSession' => $hasActiveSession,
            'attemptsCount' => $attemptsCount,
        ]);
    }

    public function start($id)
    {
        $student = Auth::guard('student')->user();
        $now = Carbon::now();
        $today = Carbon::today();

        $practice = PracticeQuestion::with([
            'general_subject',
            'question_infos' => function($query) {
                $query->where('status', 'Completed')->with(['general_subject', 'questions_and_options', 'question_instructions']);
            }
        ])
            ->where('id', $id)
            ->where('is_approved', true)
            ->where('student_class_id', $student->student_class_id)
            ->where('start_schedule_date', '<=', $now)
            ->where('end_schedule_date', '>=', $now)
            ->firstOrFail();

        $attemptsCount = PracticeResult::where('student_id', $student->id)
            ->where('practice_question_id', $practice->id)
            ->count();

        if ($practice->practice_limit > 0 && $attemptsCount >= $practice->practice_limit) {
            // Check if there's an active session they can resume
            $hasActiveSession = TestSession::where('student_id', $student->id)
                ->where('practice_question_id', $practice->id)
                ->where('is_completed', false)
                ->exists();

            if (!$hasActiveSession) {
                return redirect()->route('student.dashboard')->with('error', 'You have reached the maximum number of attempts for this practice.');
            }
        }

        // 1. Find existing session or create new one
        $session = TestSession::where('student_id', $student->id)
            ->where('practice_question_id', $practice->id)
            ->where('is_completed', false)
            ->first();

        // Create new session if none is currently active
        if (!$session) {
            $session = TestSession::create([
                'student_id' => $student->id,
                'practice_question_id' => $practice->id,
                'answers' => [],
                'current_subject' => null,
                'time_remaining' => $practice->duration * 60,
                'is_completed' => false,
            ]);
        }

        // 2. Format questions grouped by subject
        $questionsBySubject = [];
        $subjects = [];

        foreach ($practice->question_infos as $info) {
            $subjectName = $info->general_subject ? $info->general_subject->name : $info->name;

            if (!in_array($subjectName, $subjects)) {
                $subjects[] = $subjectName;
                $questionsBySubject[$subjectName] = [];
            }



            $formattedQuestions = $info->questions_and_options->map(function ($q) {
                return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => [
                'A' => $q->a,
                'B' => $q->b,
                'C' => $q->c,
                'D' => $q->d,
                ],
                'question_no' => $q->question_no,
                'passage' => $q->question_instruction->instruction ?? NULL,
                ];
            });

            $questionsBySubject[$subjectName] = array_merge($questionsBySubject[$subjectName], $formattedQuestions->toArray());
        }

        if (!$session->current_subject && count($subjects) > 0) {
            $session->current_subject = $subjects[0];
            $session->save();
        }

        return Inertia::render('student/test', [
            'practice' => $practice,
            'session' => $session,
            'subjects' => $subjects,
            'questionsBySubject' => $questionsBySubject,
        ]);
    }

    public function saveProgress(Request $request, $id)
    {
        $student = Auth::guard('student')->user();

        $session = TestSession::where('student_id', $student->id ?? clone $student->user_id)
            ->where('practice_question_id', $id)
            ->where('is_completed', false)
            ->firstOrFail();

        $validated = $request->validate([
            'answers' => 'nullable|array',
            'time_remaining' => 'required|integer|min:0',
            'current_subject' => 'nullable|string',
        ]);

        $session->update([
            'answers' => collect($session->answers)->merge($validated['answers'] ?? [])->toArray(),
            'time_remaining' => $validated['time_remaining'],
            'current_subject' => $validated['current_subject'] ?? $session->current_subject,
        ]);

        return response()->json(['status' => 'success']);
    }

    public function submit(Request $request, $id)
    {
        $student = Auth::guard('student')->user();
        $studentId = $student->id ?? clone $student->user_id;

        $session = TestSession::where('student_id', $studentId)
            ->where('practice_question_id', $id)
            ->where('is_completed', false)
            ->firstOrFail();

        $practice = PracticeQuestion::with([
            'question_infos.general_subject',
            'question_infos.questions_and_options'
        ])->findOrFail($id);

        $submittedAnswers = $request->input('answers', []);

        // Final sync of session answers before grading
        $allAnswers = collect($session->answers)->merge($submittedAnswers)->toArray();
        $session->update([
            'answers' => $allAnswers,
            'is_completed' => true,
            'completed_at' => Carbon::now(),
        ]);

        $totalQuestions = 0;
        $correctAnswers = 0;
        $subjectScores = [];

        foreach ($practice->question_infos as $info) {
            $subjectName = $info->general_subject ? $info->general_subject->name : $info->name;
            if (!isset($subjectScores[$subjectName])) {
                $subjectScores[$subjectName] = ['total' => 0, 'correct' => 0];
            }

            foreach ($info->questions_and_options as $q) {
                $totalQuestions++;
                $subjectScores[$subjectName]['total']++;

                $studentAnswer = $allAnswers[$q->id] ?? null;
                // Normalize case if needed
                if ($studentAnswer && strtolower($studentAnswer) === strtolower($q->correct_option)) {
                    $correctAnswers++;
                    $subjectScores[$subjectName]['correct']++;
                }
            }
        }

        $timeTaken = ($practice->duration * 60) - ($session->time_remaining ?? 0);
        $scoreWeight = $practice->total_score_per_question > 0 ? $practice->total_score_per_question : 1;
        $finalScore = $correctAnswers * $scoreWeight;

        // Store to PracticeResult
        $result = PracticeResult::create([
            'student_id' => $studentId,
            'practice_question_id' => $practice->id,
            'total_questions' => $totalQuestions,
            'answered_questions' => count($allAnswers),
            'correct_answers' => $correctAnswers,
            'score' => $finalScore,
            'time_taken' => $timeTaken > 0 ? $timeTaken : 0,
            'answers_data' => $allAnswers,
            'subject_scores' => $subjectScores,
        ]);

        if (!$practice->show_result) {
            return redirect()->route('student.dashboard')->with('success', 'Practice submitted successfully! Your results will be reviewed by the administrator.');
        }

        return redirect()->route('student.practice.results', ['id' => $practice->id, 'attempt_id' => $result->id]);
    }

    public function results($id, $attemptId = null)
    {
        $student = Auth::guard('student')->user();
        $studentId = $student->id ?? clone $student->user_id;

        $practice = PracticeQuestion::with(['question_infos.questions_and_options', 'question_infos.general_subject'])->findOrFail($id);

        if (!$practice->show_result) {
            return redirect()->route('student.dashboard')->with('error', 'Results for this practice are not viewable at this time.');
        }

        $query = PracticeResult::where('student_id', $studentId)
            ->where('practice_question_id', $id)
            ->orderBy('created_at', 'desc');

        $historicAttempts = clone $query;
        $allAttempts = $historicAttempts->get();

        if ($allAttempts->isEmpty()) {
            return redirect()->route('student.dashboard');
        }

        $latestAttempt = $attemptId
            ? $query->where('id', $attemptId)->firstOrFail()
            : $query->firstOrFail();

        // Format questions for review
        $reviewData = [];
        $answers = $latestAttempt->answers_data ?? [];

        foreach ($practice->question_infos as $info) {
            $subjectName = $info->general_subject ? $info->general_subject->name : $info->name;
            if (!isset($reviewData[$subjectName])) {
                $reviewData[$subjectName] = [];
            }

            foreach ($info->questions_and_options as $q) {
                // Determine if correct
                $studentAnswer = $answers[$q->id] ?? null;
                $isCorrect = false;
                if ($studentAnswer && strtolower($studentAnswer) === strtolower($q->correct_option)) {
                    $isCorrect = true;
                }

                $reviewData[$subjectName][] = [
                    'id' => $q->id,
                    'question' => $q->question,
                    'options' => [
                        'A' => $q->a,
                        'B' => $q->b,
                        'C' => $q->c,
                        'D' => $q->d,
                    ],
                    'correct_option' => $q->correct_option,
                    'student_answer' => $studentAnswer,
                    'is_correct' => $isCorrect,
                    'question_no' => $q->question_no,
                ];
            }
        }

        return Inertia::render('student/test/results', [
            'practice' => $practice,
            'latestAttempt' => $latestAttempt,
            'allAttempts' => $allAttempts,
            'reviewData' => $reviewData
        ]);
    }
}