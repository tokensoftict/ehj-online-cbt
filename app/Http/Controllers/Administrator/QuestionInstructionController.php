<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\QuestionInfo;
use App\Models\QuestionInstruction;
use App\Models\QuestionsAndOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\MessageBag;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;
use Yajra\DataTables\DataTables;

class QuestionInstructionController extends Controller
{

    public function index(string $question_info_id)
    {
        $url = route("admin.instruction.datatable", $question_info_id);
        $questionInfo = QuestionInfo::find($question_info_id);
        return Inertia::render("admin/question_banks/questions/instructions/index", compact('url', 'questionInfo'));
    }


    public function data_table(string $question_info_id)
    {
        $questionInstruction = QuestionInstruction::query()->where("question_info_id", $question_info_id)->orderBy("id", "desc");
        return DataTables::of($questionInstruction)
            ->addIndexColumn()
            ->make(true);
    }


    public function create(string $question_info_id)
    {
        $url = route("admin.instruction.store", $question_info_id);
        $instruction = new QuestionInstruction();
        $questionInfo = QuestionInfo::find($question_info_id);
        return Inertia::render("admin/question_banks/questions/instructions/form", compact('url', 'questionInfo', 'instruction'));
    }


    public function edit(string $question_info_id, string $id)
    {
        $url = route("admin.instruction.update", [$question_info_id, $id]);
        $instruction =  QuestionInstruction::find($id);
        $questionInfo = QuestionInfo::find($question_info_id);
        return Inertia::render("admin/question_banks/questions/instructions/form", compact('url', 'questionInfo', 'instruction'));
    }



    public function update(Request $request, string $question_info_id, string $id)
    {
        $request->validate([
            'title' => 'required',
            'instruction' => 'required',
        ]);

        $data = $request->only(['title','instruction']);
        $data = $this->parseDomQuestion($data);

        $instruction =  QuestionInstruction::find($id);
        if(!$instruction){
            return back()->withErrors(
                new MessageBag([
                    'question' => ['The instruction you are trying to edit does not exist.'],
                ])
            )->withInput();
        }

        if(is_array($data)){
            $instruction->update($data);
            return back()->with('success', 'Question has been added successfully');
        }

        return $data;
    }

    public function store(Request $request, string $question_info_id)
    {
        $request->validate([
            'title' => 'required',
            'instruction' => 'required',
        ]);

        $data = $request->only(['title','instruction']);
        $data = $this->parseDomQuestion($data);

        $questionInfo = QuestionInfo::find($question_info_id);

        $data['student_class_id'] = $questionInfo->student_class_id;
        $data['question_info_id'] = $questionInfo->id;

        if(is_array($data)){
            QuestionInstruction::create($data);
            return back()->with('success', 'Question has been added successfully');
        }

        return $data;
    }


    public function destroy(string $question_info_id, int $id)
    {
        return DB::transaction(function () use ($id) {
            $instruction = QuestionInstruction::find($id);
            if($instruction){
                QuestionsAndOption::query()->where("question_instruction_id", $id)->update(["question_instruction_id" => null]);
                $instruction->delete();
            }

            return back()->with('success', 'Instruction has been delete successfully');
        });

    }


    private function parseDomQuestion(array $data)
    {
        $dom = new \DomDocument('1.0', 'utf-8');
        $load = $dom->loadHtml(mb_convert_encoding($data['instruction'], 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        if(!$load){
            return back()->withErrors(
                new MessageBag([
                    'instruction' => ['There was an error parsing instruction text.'],
                ])
            )->withInput();
        }

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $image) {
            $imageSrc = $image->getAttribute('src');

            if (preg_match('/data:image/', $imageSrc)) {

                preg_match('/data:image\/(?<mime>.*?)\;/', $imageSrc, $mime);
                $mimeType = $mime['mime'];          // png, jpeg, webp, etc.

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
