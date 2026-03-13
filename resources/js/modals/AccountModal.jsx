import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';

export default function AccountsModal({ onClose, onSuccess, initialData, onOptimisticUpdate }) {
  const [form, setForm] = useState(
    initialData || { name: "", type: "Bank", initial_balance: "0" },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/accounts/${initialData.id}` : "/api/accounts";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      ...form,
      initial_balance: parseFloat(form.initial_balance),
    };
    if (onOptimisticUpdate)
      onOptimisticUpdate({ ...payload, id: initialData?.id }, isEditing);

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-md rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {initialData ? "Editar Conta" : "Nova Conta"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
              Nome da Conta
            </label>
            <input
              required
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="Ex: Nubank"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
              Tipo
            </label>
            <CustomSelect
              value={form.type}
              onChange={(val) => setForm({ ...form, type: val })}
              options={[
                { value: "Bank", label: "Banco" },
                { value: "Cash", label: "Dinheiro" },
                { value: "Savings", label: "Poupança" },
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
              Saldo Inicial
            </label>
            <input
              type="number"
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="0,00"
              value={form.initial_balance}
              onChange={(e) =>
                setForm({ ...form, initial_balance: e.target.value })
              }
            />
          </div>
          <button className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all mt-2">
            Salvar Conta
          </button>
        </form>
      </div>
    </div>
  );
}