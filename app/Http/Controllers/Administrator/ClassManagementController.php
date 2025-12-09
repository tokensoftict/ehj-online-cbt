<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\ClassGroup;
use App\Models\ClassName;
use App\Models\ClassSection;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classNames = ClassName::query()->where('status', '1')->orderBy('name')->get();
        $sections = ClassSection::query()->where('status', '1')->orderBy('name')->get();
        $classGroups = ClassGroup::query()->where('status', '1')->orderBy('name')->get();
        $student_classes = StudentClass::query()->with(['class_group', 'class_name', 'class_section'])->where('status', '1')->orderBy('id')->get();
        return Inertia::render('admin/class_management/pages/student_class', compact('classNames', 'sections', 'classGroups', 'student_classes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_group_id' => 'required',
            'class_name_id' => 'required',
            'class_section_id' => 'required',
        ], [
            'class_group_id.required'   => 'Please select a class group.',
            'class_name_id.required'    => 'Please select a class name.',
            'class_section_id.required' => 'Please select a class section.',
        ]);


        StudentClass::create($request->only(['class_group_id', 'class_name_id', 'class_section_id']));
        return back()->with('success', 'Student Class created successfully');

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'class_group_id' => 'required',
            'class_name_id' => 'required',
            'class_section_id' => 'required',
        ], [
            'class_group_id.required'   => 'Please select a class group.',
            'class_name_id.required'    => 'Please select a class name.',
            'class_section_id.required' => 'Please select a class section.',
        ]);


        $studentClass = StudentClass::query()->find($id);
        if($studentClass){
            $studentClass->update($request->only(['class_group_id', 'class_name_id', 'class_section_id']));
        }

        return back()->with('success', 'Student Class updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $studentClass = StudentClass::query()->find($id);
        if($studentClass){
            $studentClass->delete();
        }

        return back()->with('success', 'Student Class deleted successfully');
    }

}
