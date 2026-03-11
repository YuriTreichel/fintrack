<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    // Listar todos os usuários
    public function listUsers(Request $request)
    {
        $adminEmail = 'yuriinfo15@gmail.com';
        if ($request->user()->email !== $adminEmail) {
            return response()->json(['error' => 'Acesso negado'], 403);
        }
        return User::all();
    }

    // Atualizar assinatura do usuário (liberar recursos, etc)
    public function updateSubscription(Request $request, $id)
    {
        $adminEmail = 'yuriinfo15@gmail.com';
        if ($request->user()->email !== $adminEmail) {
            return response()->json(['error' => 'Acesso negado'], 403);
        }
        $user = User::findOrFail($id);
        $data = $request->validate([
            'subscription_status' => 'required|string',
            'plan' => 'nullable|string',
            'trial_ends_at' => 'nullable|date',
            'subscription_ends_at' => 'nullable|date',
        ]);
        $user->update($data);
        return response()->json(['success' => true, 'user' => $user]);
    }
}
