import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';

export default function CardModal({
  onClose,
  onSuccess,
  accounts,
  initialData,
  onOptimisticUpdate,
}) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      closing_day: "1",
      due_day: "10",
      account_id: accounts[0]?.id || "",
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/cards/${initialData.id}` : "/api/cards";
    const method = isEditing ? "PUT" : "POST";

    if (onOptimisticUpdate)
      onOptimisticUpdate({ ...form, id: initialData?.id }, isEditing);

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-md rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {initialData ? "Editar Cartão" : "Novo Cartão"}
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
              Nome do Cartão
            </label>
            <input
              required
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="Ex: Visa Infinite"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Fechamento
              </label>
              <input
                type="number"
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
                placeholder="Dia"
                value={form.closing_day}
                onChange={(e) =>
                  setForm({ ...form, closing_day: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Vencimento
              </label>
              <input
                type="number"
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
                placeholder="Dia"
                value={form.due_day}
                onChange={(e) => setForm({ ...form, due_day: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
              Debitar em
            </label>
            <CustomSelect
              value={form.account_id}
              onChange={(val) => setForm({ ...form, account_id: val })}
              options={accounts.map((a) => ({
                value: a.id,
                label: `Pagar com: ${a.name}`,
              }))}
            />
          </div>
          <button className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all mt-2">
            Salvar Cartão
          </button>
        </form>
      </div>
    </div>
  );
}