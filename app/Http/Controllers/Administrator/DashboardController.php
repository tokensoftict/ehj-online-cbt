<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    /**
     * @return Response
     */
    public final function index() : Response
    {
        return Inertia::render('admin/dashboard', []);
    }



}
