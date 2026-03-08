<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $followedUserIds = $user->following()->pluck('users.id')->toArray();
            $userIds = array_merge([$user->id], $followedUserIds);

            $accounts = DB::table('accounts as a')
                ->whereIn('a.user_id', $userIds)
                ->leftJoin('users as u', 'a.user_id', '=', 'u.id')
                ->select('a.*', 'u.name as owner_name')
                ->get();

            foreach ($accounts as $account) {
                $income = DB::table('transactions')
                    ->where('account_id', $account->id)
                    ->where('type', 'Income')
                    ->where('status', 'Paid')
                    ->sum('amount');

                $expense = DB::table('transactions')
                    ->where('account_id', $account->id)
                    ->where('type', 'Expense')
                    ->where('status', 'Paid')
                    ->sum('amount');

                $transferIn = DB::table('transactions')
                    ->where('to_account_id', $account->id)
                    ->where('type', 'Transfer')
                    ->where('status', 'Paid')
                    ->sum('amount');

                $transferOut = DB::table('transactions')
                    ->where('account_id', $account->id)
                    ->where('type', 'Transfer')
                    ->where('status', 'Paid')
                    ->sum('amount');

                $account->current_balance = $account->initial_balance + $income - $expense + $transferIn - $transferOut;
            }

            return response()->json($accounts);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|in:Cash,Bank,Savings',
                'initial_balance' => 'numeric'
            ]);
            $data['user_id'] = Auth::id();

            $id = DB::table('accounts')->insertGetId($data);
            return response()->json(['id' => $id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|in:Cash,Bank,Savings',
                'initial_balance' => 'sometimes|numeric'
            ]);

            $updated = DB::table('accounts')
                ->where('id', $id)
                ->where('user_id', Auth::id())
                ->update($data);

            if (!$updated) return response()->json(['error' => 'Account not found or unauthorized'], 404);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = DB::table('accounts')
                ->where('id', $id)
                ->where('user_id', Auth::id())
                ->delete();

            if (!$deleted) return response()->json(['error' => 'Account not found or unauthorized'], 404);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
