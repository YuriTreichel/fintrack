<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $followedUserIds = $user->following()->pluck('users.id')->toArray();
            $userIds = array_merge([$user->id], $followedUserIds);

            $transactions = DB::table('transactions as t')
                ->whereIn('t.user_id', $userIds)
                ->leftJoin('accounts as a', 't.account_id', '=', 'a.id')
                ->leftJoin('categories as c', 't.category_id', '=', 'c.id')
                ->leftJoin('cards as crd', 't.card_id', '=', 'crd.id')
                ->leftJoin('users as u', 't.user_id', '=', 'u.id')
                ->select('t.*', 'a.name as account_name', 'c.name as category_name', 'crd.name as card_name', 'u.name as owner_name')
                ->orderBy('t.date', 'desc')
                ->get();

            return response()->json($transactions);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'description' => 'required|string|max:255',
                'amount' => 'required|numeric',
                'date' => 'required|date',
                'type' => 'required|in:Income,Expense,Transfer',
                'status' => 'required|in:Paid,Pending',
                'account_id' => 'required|exists:accounts,id',
                'to_account_id' => 'nullable|exists:accounts,id',
                'category_id' => 'nullable|exists:categories,id',
                'card_id' => 'nullable|exists:cards,id',
                'is_recurring' => 'nullable|boolean',
                'frequency' => 'nullable|in:daily,weekly,monthly,yearly',
                'total_installments' => 'nullable|integer|min:1',
                'is_fixed' => 'nullable|boolean',
                'is_repeated' => 'nullable|boolean',
                'repeat_frequency' => 'nullable|integer|min:1',
                'repeat_period' => 'nullable|in:daily,weekly,monthly,yearly',
                'repeat_times' => 'nullable|integer|min:1',
                'notes' => 'nullable|string',
                'tags' => 'nullable|string',
                'attachment' => 'nullable|file',
                'ignore_in_reports' => 'nullable|boolean'
            ]);

            $data['user_id'] = Auth::id();

            if ($request->hasFile('attachment')) {
                $data['attachment_path'] = $request->file('attachment')->store('attachments', 'public');
            }
            unset($data['attachment']);

            $booleanFields = ['is_recurring', 'is_fixed', 'is_repeated', 'ignore_in_reports'];
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $data)) {
                    $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
                }
            }

            // Treat 'is_fixed' as a 10-year monthly repetition
            if (isset($data['is_fixed']) && $data['is_fixed']) {
                $data['is_repeated'] = true;
                $data['repeat_times'] = 120; // 10 years
                $data['repeat_period'] = 'monthly';
                $data['repeat_frequency'] = 1;
            }

            if (isset($data['is_repeated']) && $data['is_repeated'] && isset($data['repeat_times']) && $data['repeat_times'] > 1) {
                $groupId = time();
                $installments = [];
                $period = $data['repeat_period'] ?? 'monthly';
                $freq = $data['repeat_frequency'] ?? 1;

                for ($i = 1; $i <= $data['repeat_times']; $i++) {
                    $multiplier = ($i - 1) * $freq;
                    $periodStr = rtrim($period, 'ly') . 's';
                    if ($period === 'daily') $periodStr = 'days';
                    if ($period === 'weekly') $periodStr = 'weeks';

                    $date = date('Y-m-d', strtotime($data['date'] . " + {$multiplier} {$periodStr}"));
                    $installments[] = array_merge($data, [
                        'date' => $date,
                        'status' => $i === 1 ? $data['status'] : 'Pending',
                        'installment_number' => $i,
                        'total_installments' => $data['repeat_times'],
                        'is_recurring' => 0,
                        'parent_id' => $groupId
                    ]);
                }

                \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
                DB::table('transactions')->insert($installments);
                \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

                return response()->json(['message' => 'Repeated transactions created']);
            } elseif (isset($data['total_installments']) && $data['total_installments'] > 1) {
                // Generate a parent_id string or logic. For simplicity, we just use a group ID based on timestamp
                $groupId = time();

                $installments = [];
                for ($i = 1; $i <= $data['total_installments']; $i++) {
                    $date = date('Y-m-d', strtotime($data['date'] . " + " . ($i - 1) . " months"));
                    $installments[] = array_merge($data, [
                        'date' => $date,
                        'installment_number' => $i,
                        'is_recurring' => 0,
                        'parent_id' => $groupId
                    ]);
                }

                \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
                DB::table('transactions')->insert($installments);
                \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

                return response()->json(['message' => 'Installments created']);
            }

            $id = DB::table('transactions')->insertGetId($data);
            return response()->json(['id' => $id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'description' => 'sometimes|required|string|max:255',
                'amount' => 'sometimes|required|numeric',
                'date' => 'sometimes|required|date',
                'type' => 'sometimes|required|in:Income,Expense,Transfer',
                'status' => 'sometimes|required|in:Paid,Pending',
                'account_id' => 'sometimes|required|exists:accounts,id',
                'to_account_id' => 'nullable|exists:accounts,id',
                'category_id' => 'nullable|exists:categories,id',
                'card_id' => 'nullable|exists:cards,id',
                'is_fixed' => 'nullable|boolean',
                'is_repeated' => 'nullable|boolean',
                'repeat_frequency' => 'nullable|integer|min:1',
                'repeat_period' => 'nullable|in:daily,weekly,monthly,yearly',
                'repeat_times' => 'nullable|integer|min:1',
                'notes' => 'nullable|string',
                'tags' => 'nullable|string',
                'attachment' => 'nullable|file',
                'ignore_in_reports' => 'nullable|boolean'
            ]);

            if ($request->hasFile('attachment')) {
                $data['attachment_path'] = $request->file('attachment')->store('attachments', 'public');
            }
            unset($data['attachment']);

            $booleanFields = ['is_recurring', 'is_fixed', 'is_repeated', 'ignore_in_reports'];
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $data)) {
                    $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
                }
            }

            $updated = DB::table('transactions')
                ->where('id', $id)
                ->where('user_id', Auth::id())
                ->update($data);

            if (!$updated) return response()->json(['error' => 'Transaction not found or unauthorized'], 404);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $mode = $request->query('mode', 'only');

            $transaction = DB::table('transactions')
                ->where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$transaction) {
                return response()->json(['error' => 'Not found or unauthorized'], 404);
            }

            if ($mode === 'all' && $transaction->parent_id) {
                DB::table('transactions')
                    ->where('parent_id', $transaction->parent_id)
                    ->where('user_id', Auth::id())
                    ->delete();
            } else {
                DB::table('transactions')
                    ->where('id', $id)
                    ->where('user_id', Auth::id())
                    ->delete();
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
