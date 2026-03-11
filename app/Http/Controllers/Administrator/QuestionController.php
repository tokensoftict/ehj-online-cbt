<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessQuestionExcelFile;
use App\Models\FileUpload;
use App\Models\QuestionInfo;
use App\Models\QuestionInstruction;
use App\Models\QuestionsAndOption;
use Illuminate\Http\Request;
use Illuminate\Support\MessageBag;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class QuestionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(string $question_info_id)
    {
        $question_info = QuestionInfo::find($question_info_id);
        $createLink = route('admin.question.store', $question_info_id);
        $backLink = route('admin.question-banks.show', $question_info_id);
        $questionNumber = $question_info->questions_and_options()->count() + 1;
        $question = new QuestionsAndOption(['question_no' => $questionNumber]);
        $questionInstruction = QuestionInstruction::query()->where('question_info_id', $question_info_id)->get();
        return Inertia::render("admin/question_banks/questions/form", compact('question_info', 'createLink', 'questionNumber', 'question', 'backLink', 'questionInstruction'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $question_info_id)
    {
        $request->validate([
            'question' => 'required',
            'question_instruction_id' => 'sometimes|required|integer',
            'question_no' => 'required',
            'a' => 'required',
            'b' => 'required',
            'c' => 'required',
            'd' => 'required',
            'correct_option' => 'required',
        ]);

        $data = $request->only(['a', 'b', 'c', 'd', 'question_no', 'correct_option', 'question_instruction_id', 'question']);
        $data['question_info_id'] = $question_info_id;
        $data['date_added'] = today()->format('Y-m-d');
        $data = $this->parseDomQuestion($data);

        if (is_array($data)) {
            QuestionsAndOption::create($data);
            return back()->with('success', 'Question has been added successfully');
        }

        return $data;
    }


    public function edit(string $question_info_id, string $question_id)
    {
        $question_info = QuestionInfo::find($question_info_id);
        $createLink = route('admin.question.update', [$question_info_id, $question_id]);
        $question = QuestionsAndOption::query()->find($question_id);
        $backLink = route('admin.question-banks.show', $question_info_id);
        $questionNumber = $question->question_no;
        $questionInstruction = QuestionInstruction::query()->where('question_info_id', $question_info_id)->get();
        return Inertia::render("admin/question_banks/questions/form", compact('question_info', 'createLink', 'questionNumber', 'question', 'backLink', 'questionInstruction'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $question_info_id, string $id)
    {
        $request->validate([
            'question' => 'required',
            'question_no' => 'required',
            'a' => 'required',
            'b' => 'required',
            'c' => 'required',
            'd' => 'required',
            'correct_option' => 'required',
        ]);

        $data = $request->only(['a', 'b', 'c', 'd', 'question_no', 'correct_option', 'question_instruction_id', 'question']);
        $data = $this->parseDomQuestion($data);

        $question = QuestionsAndOption::query()->find($id);
        if (!$question) {
            return back()->withErrors(
                new MessageBag([
                'question' => ['The question you are trying to edit does not exist.'],
            ])
            )->withInput();
        }

        if (is_array($data)) {
            $question->update($data);
            return back()->with('success', 'Question has been updated successfully');
        }

        return $data;

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $question_info_id, string $question_id)
    {
        $question = QuestionsAndOption::query()->find($question_id);
        if ($question) {
            $question->delete();
        }
        return back()->with('success', 'Question has been deleted successfully');
    }


    public function upload(Request $request, string $id)
    {
        $request->validate([
            'file' => 'required|max:8000000|mimes:xlsx,xls,doc,docx,zip',
            'filename' => 'required',
        ], [
            'file.required' => 'Please upload a valid excel file.',
            'file.file' => 'Please upload a valid excel file.',
            'file.mimes' => 'Please upload a valid excel file.',
        ]);


        $data = [];
        $filepath = time() . '.' . $request->file->getClientOriginalExtension();
        $request->file->move(public_path('file_uploads'), $filepath);
        $data['filepath'] = $filepath;
        $data['filename'] = $request->filename;
        if ($request->file->getClientOriginalExtension() == "xls" || $request->file->getClientOriginalExtension() == "xlsx") {
            $data['type'] = "Question";
        }
        elseif ($request->file->getClientOriginalExtension() == "cbt") {

            $data['type'] = "CbtQuestionUpload";
        }


        $question_info = QuestionInfo::find($id);
        $data['info'] = json_encode(
        [
            'question_info_id' => $id,
            "name" => $question_info->name
        ]
        );

        $data['uploaded_by'] = auth()->id() ?? 1;
        $data['status_id'] = 1;


        $file = FileUpload::create($data);

        dispatch(new ProcessQuestionExcelFile($file->id));

        $file->status_id = 2;
        $file->update();

        return back()->with('success', 'Question file has uploaded successfully');
    }



    private function parseDomQuestion(array $data)
    {
        $dom = new \DomDocument('1.0', 'utf-8');
        $load = $dom->loadHtml(mb_convert_encoding($data['question'], 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        if (!$load) {
            return back()->withErrors(
                new MessageBag([
                'question' => ['There was an error parsing question text.'],
            ])
            )->withInput();
        }

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $image) {
            $imageSrc = $image->getAttribute('src');

            if (preg_match('/data:image/', $imageSrc)) {

                preg_match('/data:image\/(?<mime>.*?)\;/', $imageSrc, $mime);
                $mimeType = $mime['mime']; // png, jpeg, webp, etc.

                $filename = uniqid();
                $filePath = "post_image/$filename.$mimeType";

                // Create directory if not exists
                if (!file_exists(public_path('post_image'))) {
                    mkdir(public_path('post_image'), 0777, true);
                }

                Image::make($imageSrc)
                    ->encode($mimeType, 100)
                    ->save(public_path($filePath));

                $newImageSrc = asset($filePath);

                $image->removeAttribute('src');
                $image->setAttribute('src', $newImageSrc);
            }
        }

        return $data;
    }
}