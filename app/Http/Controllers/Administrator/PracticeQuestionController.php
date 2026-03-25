<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\GeneralSubject;
use App\Models\PracticeQuestion;
use App\Models\QuestionInfo;
use App\Models\StudentClass;
use App\Models\PracticeResult;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use App\Exports\PracticeResultsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class PracticeQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $url = route("admin.practice-questions.datatable");
        // Also fetch classes for the new form
        $classes = StudentClass::query()->where('status', '1')->with(['class_name', 'class_section'])->get();

        $questionBanks = QuestionInfo::query()->where('status', 'Completed')->with(['general_subject', 'student_class.class_name', 'student_class.class_section'])->get();

        return Inertia::render('admin/practice_questions/index', compact('url', 'questionBanks', 'classes'));
    }

    public function data_table()
    {
        $practiceQuestions = PracticeQuestion::query()->with(['general_subject', 'student_class.class_name', 'student_class.class_section', 'question_infos']);

        return Datatables::of($practiceQuestions)
            ->addIndexColumn()

            ->addColumn("class", function ($row) {
            return $row->student_class ? $row->student_class->class_name->name . " " . $row->student_class->class_section->name : '-';
        })
            ->addColumn("question_banks", function ($row) {
            return $row->question_infos->count() . " Banks";
        })
            ->addColumn("schedule", function ($row) {
            return $row->start_schedule_date && $row->end_schedule_date ?\Carbon\Carbon::parse($row->start_schedule_date)->format('d M Y H:i') . ' - ' . \Carbon\Carbon::parse($row->end_schedule_date)->format('d M Y H:i') : '-';
        })
            ->addColumn("status", function ($row) {
            return $row->is_approved ? 'Approved' : 'Pending';
        })
            ->make(true);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'student_class_id' => 'required|exists:student_classes,id',
            'question_info_ids' => 'required|array',
            'question_info_ids.*' => 'exists:question_infos,id',
            'start_schedule_date' => 'required|date',
            'end_schedule_date' => 'required|date|after:start_schedule_date',
            'duration' => 'required|integer|min:1',
            'total_score_per_question' => 'required|integer|min:1',
            'instruction' => 'nullable|string',
            'practice_limit' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $practice = PracticeQuestion::create([
                'title' => $request->title,
                'student_class_id' => $request->student_class_id,
                'start_schedule_date' => \Carbon\Carbon::parse($request->start_schedule_date)->format('Y-m-d H:i:s'),
                'end_schedule_date' => \Carbon\Carbon::parse($request->end_schedule_date)->format('Y-m-d H:i:s'),
                'duration' => $request->duration,
                'total_score_per_question' => $request->total_score_per_question,
                'instruction' => $request->instruction,
                'practice_limit' => $request->practice_limit,
                'show_result' => $request->show_result ?? true,
                'is_approved' => false, // default
            ]);

            $practice->question_infos()->sync($request->question_info_ids);
        });

        return back()->with('success', 'Practice Question created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'student_class_id' => 'required|exists:student_classes,id',
            'question_info_ids' => 'required|array',
            'question_info_ids.*' => 'exists:question_infos,id',
            'start_schedule_date' => 'required|date',
            'end_schedule_date' => 'required|date|after:start_schedule_date',
            'duration' => 'required|integer|min:1',
            'total_score_per_question' => 'required|integer|min:1',
            'instruction' => 'nullable|string',
            'practice_limit' => 'required|integer|min:0',
        ]);

        $practice = PracticeQuestion::find($id);
        if ($practice) {
            DB::transaction(function () use ($request, $practice) {
                $practice->update([
                    'title' => $request->title,
                    'student_class_id' => $request->student_class_id,
                    'start_schedule_date' => \Carbon\Carbon::parse($request->start_schedule_date)->format('Y-m-d H:i:s'),
                    'end_schedule_date' => \Carbon\Carbon::parse($request->end_schedule_date)->format('Y-m-d H:i:s'),
                    'duration' => $request->duration,
                    'total_score_per_question' => $request->total_score_per_question,
                    'instruction' => $request->instruction,
                    'practice_limit' => $request->practice_limit,
                    'show_result' => $request->show_result ?? $practice->show_result,
                ]);

                $practice->question_infos()->sync($request->question_info_ids);
            });
        }

        return back()->with('success', 'Practice Question updated successfully');
    }

    public function toggle_approve(string $id)
    {
        $practice = PracticeQuestion::find($id);
        if ($practice) {
            $practice->update([
                'is_approved' => !$practice->is_approved,
            ]);
            $status = $practice->is_approved ? 'approved' : 'unapproved';
            return back()->with('success', "Practice Question $status successfully");
        }
        return back()->with('error', 'Practice Question not found');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $practice = PracticeQuestion::find($id);
        if ($practice) {
            $practice->delete(); // Pivot table records cascade
        }

        return back()->with('success', 'Practice Question deleted successfully');
    }

    public function results(string $id)
    {
        $practice = PracticeQuestion::findOrFail($id);
        $url = route('admin.practice-questions.results_datatable', $id);
        
        return Inertia::render('admin/practice_questions/results/index', compact('practice', 'url'));
    }

    public function results_datatable(string $id)
    {
        $results = PracticeResult::with('student')->where('practice_question_id', $id);

        return Datatables::of($results)
            ->addIndexColumn()
            ->addColumn('student_name', function ($row) {
                return $row->student ? $row->student->firstname . ' ' . $row->student->lastname : 'Unknown';
            })
            ->addColumn('reg_no', function ($row) {
                return $row->student ? $row->student->reg_no : 'Unknown';
            })
            ->addColumn('score_formatted', function ($row) {
                return $row->score . '/' . ($row->total_questions * $row->practice_question->total_score_per_question);
            })
            ->addColumn('time_formatted', function ($row) {
                return gmdate("H:i:s", $row->time_taken);
            })
            ->addColumn('date', function ($row) {
                return $row->created_at->format('d M Y, h:i A');
            })
            ->make(true);
    }

    public function export_results(string $id)
    {
        $practice = PracticeQuestion::findOrFail($id);
        $cleanTitle = str_replace(['/', '\\'], '_', strtolower($practice->title));
        $fileName = 'practice_results_' . str_replace(' ', '_', $cleanTitle) . '.xlsx';
        return Excel::download(new PracticeResultsExport($id), $fileName);
    }

    public function download_pdf(string $id, string $result_id)
    {
        $result = PracticeResult::with(['student', 'practice_question'])->findOrFail($result_id);
        
        $pdf = Pdf::loadView('pdf.practice_result', compact('result'));
        
        $cleanRegNo = str_replace(['/', '\\'], '_', $result->student->reg_no);
        $fileName = 'result_' . $cleanRegNo . '.pdf';
        return $pdf->download($fileName);
    }

    public function delete_result(string $id, string $result_id)
    {
        $result = PracticeResult::where('practice_question_id', $id)->findOrFail($result_id);
        
        DB::transaction(function () use ($result, $id) {
            // Also delete the test session to allow a clean restart
            \App\Models\TestSession::where('student_id', $result->student_id)
                ->where('practice_question_id', $id)
                ->delete();
            
            $result->delete();
        });

        return back()->with('success', 'Practice attempt deleted and reset successfully');
    }
}