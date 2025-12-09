<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Models\ClassName;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassNameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classNames = ClassName::query()->orderBy('name')->get();
        return Inertia::render('admin/class_management/pages/class-names', compact('classNames'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ClassName::create($request->only('name'));
        return back()->with('success', 'Class name created successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $className = ClassName::query()->find($id);
        if ($className) {
            $className->update($request->only('name'));
        }

        return back()->with('success', 'Class name updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $className = ClassName::query()->find($id);
        if ($className) {
            $className->delete();
        }
        return back()->with('success', 'Class name deleted successfully');
    }
}
