<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Checkout\Session as StripeSession;
use App\Models\User;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $user = Auth::user();
        $plan = $request->input('plan');
        $paymentMethod = $request->input('payment_method'); // 'card' or 'pix'

        Stripe::setApiKey(config('services.stripe.secret'));

        $successUrl = url('/subscription/success?session_id={CHECKOUT_SESSION_ID}');
        $cancelUrl = url('/subscription/cancel');

        $paymentMethods = ['card'];
        if ($paymentMethod === 'pix') {
            $paymentMethods[] = 'pix';
        }

        $session = StripeSession::create([
            'customer_email' => $user->email,
            'payment_method_types' => $paymentMethods,
            'line_items' => [[
                'price' => $plan, // Stripe Price ID
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'subscription_data' => [
                'trial_period_days' => 14,
            ],
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
        ]);

        return response()->json(['id' => $session->id, 'url' => $session->url]);
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('stripe-signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        // Lógica para eventos relevantes
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $customerEmail = $session->customer_email;
                $user = User::where('email', $customerEmail)->first();
                if ($user) {
                    $user->stripe_id = $session->customer;
                    $user->subscription_status = 'active';
                    
                    // Obter o ID do plano da assinatura
                    if ($session->subscription) {
                        $subscription = \Stripe\Subscription::retrieve($session->subscription);
                        $user->plan = $subscription->items->data[0]->price->id ?? null;
                        $user->trial_ends_at = $subscription->trial_end ? \Carbon\Carbon::createFromTimestamp($subscription->trial_end) : null;
                    } else {
                        $user->plan = null;
                        $user->trial_ends_at = now()->addDays(14);
                    }
                    
                    $user->subscription_ends_at = null;
                    $user->save();
                }
                break;
            case 'invoice.paid':
                $invoice = $event->data->object;
                $user = User::where('stripe_id', $invoice->customer)->first();
                if ($user) {
                    $user->subscription_status = 'active';
                    $user->subscription_ends_at = null;
                    $user->save();
                }
                break;
            case 'invoice.payment_failed':
                $invoice = $event->data->object;
                $user = User::where('stripe_id', $invoice->customer)->first();
                if ($user) {
                    $user->subscription_status = 'past_due';
                    $user->save();
                }
                break;
            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                $user = User::where('stripe_id', $subscription->customer)->first();
                if ($user) {
                    $user->subscription_status = 'canceled';
                    $user->subscription_ends_at = now();
                    $user->save();
                }
                break;
        }

        return response('Webhook handled', 200);
    }
}
