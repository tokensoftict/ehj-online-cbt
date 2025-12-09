<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    /**
     * @return Response
     */
    public final function index() : Response
    {
        return Inertia::render('student/dashboard', []);
    }


    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public final function logout(Request $request) : RedirectResponse
    {
        $request->session()->invalidate();
        return redirect()->intended(route('studentlogin', absolute: false));
    }

    /**
     * @param string $subject
     * @return Response
     */
    public final function test(string $subject) : Response
    {
        return Inertia::render('student/test', ['subject' => $subject]);
    }
}
