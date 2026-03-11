<?php

namespace App\Imports;

use App\Models\QuestionInfo;
use App\Models\QuestionsAndOption;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Events\AfterImport;

class QuestionImport implements ToModel, WithHeadingRow, WithEvents
{
    use Importable, RegistersEventListeners;

    var $fileuploads;
    var $order_info;

    public function __construct($fileuploads, $order_info)
    {
        $this->order_info = $order_info;
        $this->fileuploads = $fileuploads;
    }

    public function model(array $row)
    {
        if (!empty($row['no']) && !empty($row['question']) && !empty($row['option_a']) && !empty($row['option_b']) && !empty($row['option_c'])
        && !empty($row['option_d']) && !empty($row['correct_option_abcd'])
        ) {
            $question_info = QuestionInfo::find($this->order_info->question_info_id);

            $question = new QuestionsAndOption();
            $question->question_no = $row['no'];
            $question->question = $row['question'];
            $question->a = $row['option_a'];
            $question->b = $row['option_b'];
            $question->c = $row['option_c'];
            $question->d = $row['option_d'];
            $question->correct_option = $row['correct_option_abcd'];
            $question->date_added = date('Y-m-d');
            $question->question_info_id = $this->order_info->question_info_id;
            //$question->created_by = $this->fileuploads->uploaded_by;

            $question->save();
        }
    }


    public static function afterImport(AfterImport $event)
    {
        $imports = $event->getConcernable();
        $imports->fileuploads->status_id = 5;
        $imports->fileuploads->update();
    }
}