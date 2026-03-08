<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CardController extends Controller
{
    public function index()
    {
        try {
            $cards = DB::table('cards')->where('user_id', auth()->id())->get();
            return response()->json($cards);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'closing_day' => 'nullable|integer|min:1|max:31',
                'due_day' => 'nullable|integer|min:1|max:31',
                'account_id' => 'required|exists:accounts,id'
            ]);
            $data['user_id'] = auth()->id();
            
            $id = DB::table('cards')->insertGetId($data);
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
                'closing_day' => 'nullable|integer|min:1|max:31',
                'due_day' => 'nullable|integer|min:1|max:31',
                'account_id' => 'sometimes|required|exists:accounts,id'
            ]);
            
            $updated = DB::table('cards')
                ->where('id', $id)
                ->where('user_id', auth()->id())
                ->update($data);
                
            if (!$updated) return response()->json(['error' => 'Card not found or unauthorized'], 404);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = DB::table('cards')
                ->where('id', $id)
                ->where('user_id', auth()->id())
                ->delete();
                
            if (!$deleted) return response()->json(['error' => 'Card not found or unauthorized'], 404);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
