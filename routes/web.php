<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Stripe webhook (must be outside CSRF protection)
Route::post('/stripe/webhook', [SubscriptionController::class, 'webhook']);

// Subscription success and cancel pages
Route::get('/subscription/success', function () {
    return view('welcome');
});

Route::get('/subscription/cancel', function () {
    return view('welcome');
});

Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
