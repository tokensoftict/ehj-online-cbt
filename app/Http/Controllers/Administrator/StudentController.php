<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessStudentExcelFile;
use App\Models\FileUpload;
use App\Models\Student;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class StudentController extends Controller
{

    public function index()
    {
        $url = route("admin.students.datatable");
        $classes = StudentClass::query()->with(['class_group', 'class_name', 'class_section'])->get();
        $sex = collect([
            ['name' => 'Male', 'value' => "M"],
            ['name' => 'Female', 'value' => "F"],
        ]);
        return Inertia::render('admin/student/index', compact('url', 'classes', 'sex'));
    }


    public function data_table()
    {
        $students = Student::query()->with(['student_class.class_name', 'student_class.class_section', 'student_class'])->orderByDesc('created_at');
        return Datatables::of($students)
            ->addIndexColumn()
            ->addColumn("class", function (Student $row) {
            return $row->student_class->class_name->name . " " . $row->student_class->class_section->name;
        })
            ->make(true);
    }



    public function store(Request $request)
    {
        $request->validate([
            'reg_no' => 'required|unique:students,reg_no',
            'surname' => 'required',
            'firstname' => 'required',
            'lastname' => 'required',
            'age' => 'required',
            'sex' => 'required',
            'student_class_id' => 'required',
        ], [
            'reg_no.required' => 'Please enter student registration number.',
            'reg_no.unique' => 'This Registration number has already exist.',
            'surname.required' => 'Please enter student surname',
            'firstname.required' => 'Please enter student firstname',
            'lastname.required' => 'Please enter student lastname',
            'age.required' => 'Please enter student age',
            'sex.required' => 'Please select student gender',
            'student_class_id.required' => 'Please select student class',
        ]);

        $data = $request->only(['firstname', 'surname', 'reg_no', 'lastname', 'age', 'sex', 'student_class_id']);
        $data['password'] = bcrypt(strtolower($request->surname));

        Student::create($data);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'reg_no' => [
                'required',
                Rule::unique('students', 'reg_no')->ignore($id),
            ],
            'surname' => 'required',
            'firstname' => 'required',
            'lastname' => 'required',
            'age' => 'required',
            'sex' => 'required',
            'student_class_id' => 'required',
        ], [
            'reg_no.required' => 'Please enter student registration number.',
            'reg_no.unique' => 'This Registration number has already exist.',
            'surname.required' => 'Please enter student surname',
            'firstname.required' => 'Please enter student firstname',
            'lastname.required' => 'Please enter student lastname',
            'age.required' => 'Please enter student age',
            'sex.required' => 'Please select student gender',
            'student_class_id.required' => 'Please select student class',
        ]);

        $data = $request->only(['firstname', 'surname', 'reg_no', 'lastname', 'age', 'sex', 'student_class_id']);
        $data['password'] = bcrypt(strtolower($request->surname));

        $student = Student::query()->find($id);
        if ($student) {
            $student->update($data);
        }

        return back()->with('success', 'Student has updated successfully');
    }


    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|max:8000000|mimes:xlsx,xls',
            'student_class_id' => 'required',
            'filename' => 'required',
        ], [
            'file.required' => 'Please upload a valid excel file.',
            'file.file' => 'Please upload a valid excel file.',
            'file.mimes' => 'Please upload a valid excel file.',
            'student_class_id.required' => 'Please select a student class.',
        ]);

        $filepath = time() . '.' . $request->file->getClientOriginalExtension();
        $request->file->move(public_path('file_uploads'), $filepath);
        $data['filepath'] = $filepath;
        $data['filename'] = $request->filename;
        $data['type'] = "Student";
        $data['student_class_id'] = $request->student_class_id;
        $class = StudentClass::query()->find($request->student_class_id);
        $data['info'] = json_encode(['class_id' => $request->student_class_id, "name" => $class->class_name->name . " " . $class->class_section->name]);

        $data['uploaded_by'] = auth()->id() ?? 1;

        $data['status_id'] = 1;

        $file = FileUpload::create($data);

        dispatch(new ProcessStudentExcelFile($file->id));

        $file->status_id = 2;
        $file->update();

        return back()->with('success', 'Student file has uploaded successfully');
    }


    public function destroy(Request $request, string $id)
    {
        $student = Student::query()->find($id);
        if ($student) {
            $student->delete();
        }

        return back()->with('success', 'Student has deleted successfully');
    }
}