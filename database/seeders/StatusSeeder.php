<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('statuses')->insert(
            [
                [
                    'name' => 'PENDING',
                    'label' => 'default'
                ],
                [
                    'name' => 'SENT',
                    'label' => 'primary'
                ],
                [
                    'name' => 'IN PROGRESS',
                    'label' => 'warning'
                ],
                [
                    'name' => 'FAILED',
                    'label' => 'danger'
                ],
                [
                    'name' => 'SUCCESSFUL',
                    'label' => 'success'
                ],
                [
                    'name' => 'APPROVED',
                    'label' => 'info'
                ],
            ]
        );
    }
}
