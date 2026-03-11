<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessQuestionExcelFile;
use App\Jobs\ProcessStudentExcelFile;
use App\Jobs\ProcessUsersExcelFile;
use App\Models\FileUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class FileUploadController extends Controller
{

    public function index()
    {
        $url = route("admin.file-uploads.datatable");
        return Inertia::render('admin/file-uploads/index', compact('url'));
    }


    public function data_table(Request $request)
    {
        $files = FileUpload::query()->with(['user', 'status']);
        return Datatables::of($files)
            ->addColumn('user', function ($file) {
            return $file->user->name;
        })
            ->addColumn('status', function ($file) {
            return $file->status->name;
        })
            ->addIndexColumn()
            ->make(true);
    }


    public function student_template()
    {
        return response()->download(public_path("template/Student_Template.xlsx"));
    }

    public function question_template()
    {
        return response()->download(public_path("template/Question_Template.xlsx"));
    }


    public function destroy($id)
    {
        $file = FileUpload::find($id);
        $path = $file->filepath;
        @unlink(public_path('file_uploads/' . $path));
        $file->delete();

        return back()->with('success', 'File has uploaded successfully');
    }

    public function download_file($file_id)
    {
        $file = FileUpload::find($file_id);
        $path = $file->filepath;
        return response()->download(public_path('file_uploads/' . $path));
    }


    public function re_run($file_id)
    {
        $file = FileUpload::find($file_id);
        if ($file->type == "Question") {
            dispatch(new ProcessQuestionExcelFile($file_id));
        }
        else if ($file->type == "Student") {
            dispatch(new ProcessStudentExcelFile($file_id));
        }
        else if ($file->type == "Users") {
            dispatch(new ProcessUsersExcelFile($file_id));
        }
        $file->status_id = 2;
        $file->update();
        return back()->with('success', 'File has been queue successfully');
    }


}