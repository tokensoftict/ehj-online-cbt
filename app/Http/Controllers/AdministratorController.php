<?php

namespace App\Http\Controllers;

use App\Http\Requests\Administrator\AdminLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $request->session()->regenerate();
        return redirect()->intended(route('admin.dashboard', absolute: false));
    }
}
