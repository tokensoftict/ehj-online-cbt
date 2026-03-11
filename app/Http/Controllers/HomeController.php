<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StudentLoginRequest;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
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
        $student = Student::where('reg_no', $request->reg_number)
            ->where('surname', $request->surname)
            ->first();

        if ($student) {
            Auth::guard('student')->login($student);
            $request->session()->regenerate();
            return redirect()->intended(route('student.dashboard', absolute: false));
        }

        return back()->withErrors([
            'reg_number' => 'Invalid registration number or surname.',
        ]);
    }
}