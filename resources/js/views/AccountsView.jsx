import React, { useState, useMemo } from "react";
import {
  Plus,
  Wallet,
  Trash2,
  Settings,
  Landmark,
  PiggyBank,
} from "lucide-react";
import AccountModal from "../modals/AccountModal";

export default function AccountsView({
  accounts,
  setAccounts,
  fetchData,
  showToast,
  showConfirm,
  selectedProfile,
  isReadOnly,
  searchTerm,
}) {
  const profileAccounts = useMemo(
    () => accounts.filter((a) => a.user_id === selectedProfile?.id),
    [accounts, selectedProfile],
  );

  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleEdit = (acc) => {
    setEditingAccount(acc);
    setIsAccModalOpen(true);
  };

  const handleClose = () => {
    setEditingAccount(null);
    setIsAccModalOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Excluir Conta",
      "Tem certeza que deseja excluir esta conta? Isso não poderá ser desfeito.",
      async () => {
        const previousState = [...accounts];
        setAccounts((prev) => prev.filter((a) => a.id !== id));

        try {
          const res = await fetch(`/api/accounts/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (res.ok) {
            showToast("Conta excluída com sucesso!", "success");
            fetchData();
          } else {
            setAccounts(previousState);
            showToast("Erro ao excluir conta.", "error");
          }
        } catch (e) {
          setAccounts(previousState);
          showToast("Erro de conexão.", "error");
        }
      },
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
            Contas
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerencie todas as suas origens de fundos e contas correntes.
          </p>
        </div>
        <div className="flex gap-3">
          {!isReadOnly && (
            <button
              onClick={() => setIsAccModalOpen(true)}
              className="bg-fin-mint text-fin-bg px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:brightness-110 tracking-tight text-sm transition-all shadow-lg shadow-fin-mint/10"
            >
              <Plus size={18} strokeWidth={3} /> Add Conta
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileAccounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:border-zinc-900/10 dark:border-white/10 transition-all"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Wallet size={80} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10 w-full">
              <div className="w-12 h-12 bg-fin-mint/10 text-fin-mint rounded-[16px] flex items-center justify-center border border-fin-mint/20">
                <Wallet size={20} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">
                  {acc.name}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium uppercase tracking-wider">
                  {acc.type === "Bank"
                    ? "Banco"
                    : acc.type === "Cash"
                      ? "Dinheiro"
                      : "Poupança"}
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between mt-8 relative z-10">
              <div>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Saldo Atual
                </p>
                <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  <span className="text-xl text-zinc-600 dark:text-zinc-500 mr-2 opacity-80">
                    R$
                  </span>
                  {(acc.current_balance !== undefined
                    ? acc.current_balance
                    : acc.initial_balance
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                  <>
                    <button
                      onClick={() => handleEdit(acc)}
                      className="p-2 border border-zinc-900/10 dark:border-white/5 bg-zinc-900/10 dark:bg-white/5 rounded-xl text-zinc-600 hover:text-fin-mint hover:bg-fin-mint/10 transition-all"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 border border-zinc-900/10 dark:border-white/5 bg-zinc-900/10 dark:bg-white/5 rounded-xl text-zinc-600 hover:text-[#ff7b7b] hover:bg-[#ff7b7b]/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {profileAccounts.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-900/10 dark:border-white/10 rounded-[24px]">
            <Wallet className="mx-auto text-zinc-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              Nenhuma conta encontrada
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Comece adicionando sua conta principal bancária ou carteira.
            </p>
            <button
              onClick={() => setIsAccModalOpen(true)}
              className="bg-fin-surface border border-zinc-900/10 dark:border-white/10 hover:bg-zinc-900/10 dark:hover:bg-white/10 dark:bg-white/5 transition-colors px-6 py-3 rounded-xl font-bold text-zinc-900 dark:text-white text-sm"
            >
              + Criar Conta Inicial
            </button>
          </div>
        )}
      </div>

      {isAccModalOpen && (
        <AccountModal
          onClose={handleClose}
          onSuccess={() => fetchData()}
          initialData={editingAccount}
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setAccounts((prev) =>
                prev.map((a) => (a.id === data.id ? { ...a, ...data } : a)),
              );
            } else {
              setAccounts((prev) => [
                ...prev,
                {
                  ...data,
                  id: Date.now(),
                  current_balance: parseFloat(data.initial_balance),
                },
              ]);
            }
          }}
        />
      )}
    </div>
  );
}
