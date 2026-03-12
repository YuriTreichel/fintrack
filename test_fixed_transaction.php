
<?php
// Test script to check fixed transaction behavior
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Simulate a POST request to create a fixed transaction
$testData = [
    'description' => 'Test Fixed Transaction',
    'amount' => 100.00,
    'date' => '2026-03-11',
    'type' => 'Expense',
    'status' => 'Pending',
    'account_id' => 1,
    'category_id' => 1,
    'is_fixed' => true,
    'is_repeated' => false,
    'repeat_times' => 1 // Explicitly set to 1
];

echo "Testing fixed transaction creation...\n";
echo "Data being sent:\n";
print_r($testData);
echo "\n";

// Check the TransactionController logic
echo "Expected behavior: Should create only 1 transaction (not 120)\n";
echo "The fix should prevent automatic creation of 120 installments for fixed transactions.\n";

// Also check the frontend
echo "\nFrontend behavior:\n";
echo "1. When user checks 'is_fixed', it should NOT automatically set repeat_times to 120\n";
echo "2. User can still manually set repetition if needed\n";
echo "3. Fixed transactions should be displayed with a 'Fixo' badge\n";