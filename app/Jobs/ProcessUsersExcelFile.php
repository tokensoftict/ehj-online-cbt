<?php

namespace App\Jobs;


use App\Imports\ImportUsers;
use App\Models\FileUpload;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;

class ProcessUsersExcelFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    var $uploads;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($upload_id)
    {
        $this->uploads = FileUpload::find($upload_id);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if($this->uploads->type == "Users"){

            $order_info = json_decode($this->uploads->info);
            $this->uploads->status_id = 3;
            $this->uploads->update();

            try{
                Excel::import(new ImportUsers($this->uploads, $order_info), public_path('file_uploads/'.$this->uploads->filepath,null,\Maatwebsite\Excel\Excel::XLSX));
            }catch (Exception $e){
                $this->uploads->status_id = 4;
                $this->uploads->update();
            }

        }
    }
}
