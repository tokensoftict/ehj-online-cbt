<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view_dashboard',
            'manage_admins',
            'manage_classes',
            'manage_subjects',
            'manage_students',
            'manage_question_banks',
            'manage_practice_questions',
            'manage_roles_permissions',
            'manage_file_uploads',
            'view_results',
            'reset_practice_attempts',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'admin');
        }

        // Create roles and assign created permissions
        $role = Role::findOrCreate('Super Admin', 'admin');
        $role->givePermissionTo(Permission::all());

        // Assign to first admin if exists
        $user = User::first();
        if ($user) {
            $user->assignRole($role);
        }
    }
}
