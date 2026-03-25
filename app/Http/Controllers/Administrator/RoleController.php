<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class RoleController extends Controller
{
    public function index()
    {
        $url = route('admin.roles.datatable');
        $allPermissions = Permission::where('guard_name', 'admin')->get();
        return Inertia::render('admin/roles/index', compact('url', 'allPermissions'));
    }

    public function datatable()
    {
        $roles = Role::where('guard_name', 'admin')->with('permissions');
        return DataTables::of($roles)
            ->addIndexColumn()
            ->addColumn('permissions_list', function ($row) {
                return $row->permissions->pluck('name')->toArray();
            })
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'required|array',
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'admin']);
        $role->syncPermissions($request->permissions);

        return back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'required|array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return back()->with('success', 'Role updated successfully');
    }

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Super Admin role cannot be deleted');
        }
        $role->delete();
        return back()->with('success', 'Role deleted successfully');
    }
}
