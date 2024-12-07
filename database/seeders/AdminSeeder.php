<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */ public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Admin::create([
                'name' => 'Admin ' . $i,
                'role' => 'admin',
            ]);
        }
    }
}
