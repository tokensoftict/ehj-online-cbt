<?php

namespace App\Jobs;

use App\Imports\QuestionImport;
use App\Models\FileUpload;
use App\Models\QuestionInfo;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Maatwebsite\Excel\Facades\Excel;

class ProcessQuestionExcelFile implements ShouldQueue
{
    use Queueable;
    var $uploads;
    /**
     * Create a new job instance.
     */
    public function __construct($upload_id)
    {
        $this->uploads = FileUpload::find($upload_id);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        set_time_limit(0);
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '2556M');


        if ($this->uploads->type == "Question") {
            $order_info = json_decode($this->uploads->info);
            $question_info = QuestionInfo::find($order_info->question_info_id);
            if ($question_info) {

            }

            $this->uploads->status_id = 3;
            $this->uploads->update();

            try {
                Excel::import(new QuestionImport($this->uploads, $order_info), public_path('file_uploads/' . $this->uploads->filepath), null, \Maatwebsite\Excel\Excel::XLSX);
            }
            catch (Exception $e) {
                report($e);
                $this->uploads->status_id = 4;
                $this->uploads->update();
            }

        }

    }
}