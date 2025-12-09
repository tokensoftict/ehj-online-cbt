<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\ClassGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classGroups = ClassGroup::query()->orderBy('name')->get();
        return Inertia::render('admin/class_management/pages/groups', compact('classGroups'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ClassGroup::create($request->only('name'));
        return back()->with('success', 'Class group created successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $classGroup = ClassGroup::query()->find($id);
        if ($classGroup) {
            $classGroup->update($request->only('name'));
        }

        return back()->with('success', 'Class group updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $classGroup = ClassGroup::query()->find($id);
        if ($classGroup) {
            $classGroup->delete();
        }
        return back()->with('success', 'Class group deleted successfully');
    }
}
