<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert(
            [
                [
                    'name' => 'CBT Administrator',
                    'email' => 'user@user.com',
                    'username' => 'user',
                    'password' =>  bcrypt('user'),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]
            ]
        );
    }
}
