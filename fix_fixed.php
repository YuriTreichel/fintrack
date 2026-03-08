<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $transactions = \App\Models\Transaction::where('is_fixed', true)->whereNull('parent_id')->get();
    $count = 0;

    \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

    foreach ($transactions as $t) {
        if (\App\Models\Transaction::where('parent_id', $t->id)->exists()) {
            continue;
        }

        $groupId = time() . rand(100, 999);
        $t->parent_id = $groupId;
        $t->is_repeated = 1;
        $t->repeat_times = 120;
        $t->repeat_period = 'monthly';
        $t->repeat_frequency = 1;
        $t->save();

        $installments = [];
        for ($i = 2; $i <= 120; $i++) {
            $multiplier = $i - 1;
            $date = date('Y-m-d', strtotime($t->date . " + {$multiplier} months"));

            $newT = $t->toArray();
            unset($newT['id'], $newT['created_at'], $newT['updated_at']);

            $newT['date'] = $date;
            $newT['status'] = 'Pending';
            $newT['installment_number'] = $i;
            $newT['total_installments'] = 120;
            $newT['parent_id'] = $groupId;
            $newT['is_recurring'] = 0;
            $newT['created_at'] = now();
            $newT['updated_at'] = now();

            $installments[] = $newT;
        }

        \Illuminate\Support\Facades\DB::table('transactions')->insert($installments);
        $count++;
    }

    \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

    echo "Fixed {$count} old fixed transactions.\n";
} catch (\Exception $e) {
    file_put_contents('error.txt', $e->getMessage());
    echo "Error saved to error.txt";
}
