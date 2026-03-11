<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Yajra\DataTables\DataTables;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/admins/index', [
            'url' => route('admin.admins.datatable')
        ]);
    }

    public function data_table()
    {
        $admins = User::query()->orderBy('id', 'desc');
        return DataTables::of($admins)
            ->addIndexColumn()
            ->addColumn('action', function ($row) {
            return '';
        })

            ->rawColumns(['action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username|max:255',
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);
        return back()->with('success', 'Admin created successfully');
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'string', 'confirmed', Password::min(8)];
        }

        $validated = $request->validate($rules);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        }
        else {
            unset($validated['password']);
        }

        $user->update($validated);
        return back()->with('success', 'Admin updated successfully');
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting the only admin if necessary (optional)
        if (User::count() <= 1) {
            return back()->with('error', 'Cannot delete the only remaining administrator.');
        }

        $user->delete();
        return back()->with('success', 'Admin deleted successfully');
    }
}