<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('admin/profile/edit', [
            // Inertia usually shares auth.admin globally, but we can pass explicit user data if needed.
            // Assuming global sharing works here since it's already used across the app, 
            // but we can also explicitly inject it to be safe or rely on HandleInertiaRequests.
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::guard('admin')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully');
    }

    public function editPassword()
    {
        return Inertia::render('admin/profile/password');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $user = Auth::guard('admin')->user();
        
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully');
    }
}
