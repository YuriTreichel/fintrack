<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed initial data if needed
        DB::table('accounts')->insert([
            ['name' => 'Carteira', 'type' => 'Cash', 'initial_balance' => 0],
            ['name' => 'Conta Corrente', 'type' => 'Bank', 'initial_balance' => 0],
        ]);

        DB::table('categories')->insert([
            ['name' => 'Alimentação'],
            ['name' => 'Transporte'],
            ['name' => 'Lazer'],
            ['name' => 'Saúde'],
            ['name' => 'Educação'],
            ['name' => 'Moradia'],
            ['name' => 'Outros'],
        ]);
    }
}
