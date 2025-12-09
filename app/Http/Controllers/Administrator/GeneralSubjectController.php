<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\GeneralSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class GeneralSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $url = route("admin.general-subjects.datatable");
        return Inertia::render('admin/general_subject_management/pages/general_subject', compact('url'));
    }


    public function data_table(Request $request)
    {
        $subjects = GeneralSubject::query();
        return Datatables::of($subjects)
            ->addIndexColumn()
            ->make(true);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        GeneralSubject::create($request->only('name'));
        return back()->with('success', 'General Subject created successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $generalSubject = GeneralSubject::query()->find($id);
        if ($generalSubject) {
            $generalSubject->update($request->only('name'));
        }

        return back()->with('success', 'General Subject updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $generalSubject = GeneralSubject::query()->find($id);
        if ($generalSubject) {
            $generalSubject->delete();
        }

        return back()->with('success', 'General Subject deleted successfully');
    }
}
