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

Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
