<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\ClassSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = ClassSection::query()->orderBy('name')->get();
        return Inertia::render('admin/class_management/pages/sections', compact('sections'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ClassSection::create($request->only('name'));
        return back()->with('success', 'Class section created successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $section = ClassSection::query()->find($id);
        if ($section) {
            $section->update($request->only('name'));
        }

        return back()->with('success', 'Class section updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $section = ClassSection::query()->find($id);
        if ($section) {
            $section->delete();
        }
        return back()->with('success', 'Class section deleted successfully');
    }
}
