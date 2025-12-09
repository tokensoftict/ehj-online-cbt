<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StudentLoginRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * @return Response
     */
    public final function index() : Response
    {
        return Inertia::render('welcome');
    }


    /**
     * @return Response
     */
    public final function login() : Response
    {
        return Inertia::render('student/auth/login');
    }

    /**
     * @param StudentLoginRequest $request
     * @return RedirectResponse
     */
    public final function processLogin(StudentLoginRequest $request) : RedirectResponse
    {
        $request->session()->regenerate();
        return redirect()->intended(route('student.dashboard', absolute: false));
    }
}
