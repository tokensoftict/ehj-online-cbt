<?php

namespace App\Http\Controllers;

use App\Http\Requests\Administrator\AdminLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdministratorController extends Controller
{

    /**
     * @return Response
     */
    public final function login() : Response
    {
        return Inertia::render('admin/auth/login');
    }


    public final function processLogin(AdminLoginRequest $request) : RedirectResponse
    {
        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ]);
    }

    public final function logout(Request $request) : RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->intended(route('admin.login', absolute: false));
    }
}