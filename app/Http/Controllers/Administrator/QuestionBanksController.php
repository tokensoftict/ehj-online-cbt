<?php

namespace App\Http\Controllers\Administrator;

use App\Enums\StatusEnum;
use App\Http\Controllers\Controller;
use App\Models\GeneralSubject;
use App\Models\QuestionInfo;
use App\Models\QuestionsAndOption;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class QuestionBanksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $url = route("admin.question-banks.datatable");
        $subjects = GeneralSubject::query()->where('status', '1')->get();
        $student_classes = StudentClass::query()->with(['class_group', 'class_name', 'class_section'])->where('status', '1')->orderBy('id')->get();
        return Inertia::render('admin/question_banks/index',compact('url', 'subjects', 'student_classes'));
    }


    public function data_table()
    {
        $banks = QuestionInfo::query()
            ->withCount('questions_and_options')
            ->with(['question_instructions', 'general_subject', 'student_class', 'student_class.class_name',  'student_class.class_section', 'student_class.class_group']);

        return Datatables::of($banks)
            ->addIndexColumn()
            ->addColumn("subject", function ($row) {
                return $row->general_subject->name;
            })
            ->addColumn("class", function ($row) {
                return $row->student_class->class_name->name." ".$row->student_class->class_section->name;
            })
            ->addColumn("questions", function ($row) {
                return $row->questions_and_options_count;
            })
            ->addColumn("created_at", function ($row) {
                return $row->created_at->format('d F Y');
            })
            ->make(true);
    }


    public function questions_data_table(string $id)
    {
        $questions = QuestionsAndOption::query()->where('question_info_id', $id)->orderBy('question_no');
        return DataTables::of($questions)
            ->addIndexColumn()
            ->make(true);
    }


    public function show(string $id)
    {
        $info = QuestionInfo::query()->with(['question_instructions', 'general_subject', 'student_class', 'student_class.class_name',  'student_class.class_section', 'student_class.class_group'])->find($id);
        $questionInfo = array_merge($info->toArray(), [
            'subject' => $info->general_subject->name,
            'class' => $info->student_class->class_name->name." ".$info->student_class->class_section->name,
            'questions' => $info->questions_and_options_count,
        ]);
        $url = route("admin.question-banks.questions_datatable", $id);
        $questions = $info->questions_and_options;
        return Inertia::render('admin/question_banks/questions/index',compact('questionInfo', 'questions', 'url'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'student_class_id' => 'required', 'general_subject_id' => 'required']);
        QuestionInfo::create($request->only(['name', 'student_class_id', 'general_subject_id']));

        return back()->with('success', 'Test Container has created successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate(['name' => 'required', 'student_class_id' => 'required', 'general_subject_id' => 'required']);
        $question = QuestionInfo::query()->find($id);
        if ($question) {
            $question->update($request->only(['name', 'student_class_id', 'general_subject_id']));
        }

        return back()->with('success', 'Test Container has updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            $question = QuestionInfo::query()->find($id);
            if ($question) {
                $question->question_instructions()->delete();
                $question->questions_and_options()->delete();
                $question->delete();
            }
        });

        return back()->with('success', 'Test Container deleted successfully');
    }
}
