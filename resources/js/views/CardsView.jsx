import React, { useState, useMemo } from 'react';
import { Plus, CreditCard, Trash2, Settings, Calendar } from 'lucide-react';
import CardModal from '../modals/CardModal';

export default function CardsView({
  cards,
  setCards,
  accounts,
  fetchData,
  showToast,
  showConfirm,
  selectedProfile,
  isReadOnly,
  searchTerm,
}) {
  const profileCards = useMemo(
    () => cards.filter((c) => c.user_id === selectedProfile?.id),
    [cards, selectedProfile],
  );
  const profileAccounts = useMemo(
    () => accounts.filter((a) => a.user_id === selectedProfile?.id),
    [accounts, selectedProfile],
  );

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const handleEdit = (card) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleClose = () => {
    setEditingCard(null);
    setIsCardModalOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Excluir Cartão",
      "Tem certeza que deseja excluir este cartão?",
      async () => {
        const previousState = [...cards];
        setCards((prev) => prev.filter((c) => c.id !== id));

        try {
          const res = await fetch(`/api/cards/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (res.ok) {
            showToast("Cartão excluído com sucesso!", "success");
            fetchData();
          } else {
            setCards(previousState);
            showToast("Erro ao excluir cartão.", "error");
          }
        } catch (e) {
          setCards(previousState);
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
            Cartões de Crédito
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Controle de faturas e cartões vinculados.
          </p>
        </div>
        <div className="flex gap-3">
          {!isReadOnly && (
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="bg-fin-surface border border-zinc-900/10 dark:border-white/5 text-zinc-900 dark:text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-zinc-900/10 dark:hover:bg-white/10 dark:bg-white/5 text-sm transition-colors"
            >
              <CreditCard size={18} /> Novo Cartão
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileCards
          .filter((c) => {
            if (searchTerm) {
              return c.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
          })
          .map((card) => {
            const linkedAccount = profileAccounts.find(
              (a) => a.id === card.account_id,
            );
            return (
              <div key={card.id} className="col-span-1 group">
                <div className="bg-gradient-to-tr from-fin-surface to-[#161818] p-7 rounded-[24px] shadow-2xl text-zinc-900 dark:text-white relative overflow-hidden border border-zinc-900/10 dark:border-white/5 group-hover:border-zinc-900/10 dark:border-white/20 transition-all h-56 flex flex-col justify-between group-hover:-translate-y-1 duration-300">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-zinc-900/10 dark:bg-white/5 blur-3xl -mt-20 -mr-20"></div>

                  <div className="absolute bottom-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity translate-y-6">
                    <CreditCard size={120} />
                  </div>

                  <div className="flex items-center justify-between relative z-10 w-full">
                    <div className="w-12 h-8 bg-zinc-200/50 dark:bg-black/40 rounded flex items-center justify-center border border-zinc-900/10 dark:border-white/10 backdrop-blur-md">
                      <div className="w-4 h-4 bg-[#ff6b6b]/60 rounded-full -mr-1 mix-blend-screen"></div>
                      <div className="w-4 h-4 bg-[#feca57]/60 rounded-full mix-blend-screen"></div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                      {!isReadOnly && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(card);
                            }}
                            className="p-1.5 bg-zinc-900/10 dark:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-zinc-600 transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Settings size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(card.id);
                            }}
                            className="p-1.5 bg-zinc-900/10 dark:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-[#ff7b7b] transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 italic tracking-wider absolute right-0 group-hover:opacity-0 transition-opacity pointer-events-none">
                      FinTrack Card
                    </p>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-1 tracking-tight truncate">
                      {card.name}
                    </h4>
                    {linkedAccount && (
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-500 uppercase font-bold tracking-widest truncate">
                        Pago com: {linkedAccount.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-4 px-2">
                  <div>
                    <p className="mb-0.5 font-bold">Fechamento</p>
                    <p className="text-zinc-900 dark:text-white text-sm font-bold font-mono">
                      Dia {card.closing_day}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-zinc-900/10 dark:bg-white/5"></div>
                  <div className="text-right">
                    <p className="mb-0.5 font-bold text-fin-peach">
                      Vencimento
                    </p>
                    <p className="text-fin-peach text-sm font-bold font-mono">
                      Dia {card.due_day}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        {profileCards.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-900/10 dark:border-white/10 rounded-[24px]">
            <CreditCard className="mx-auto text-zinc-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              Nenhum cartão adicionado
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Gerencie suas faturas centralizando seus cartões aqui.
            </p>
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="bg-fin-surface border border-zinc-900/10 dark:border-white/10 hover:bg-zinc-900/10 dark:hover:bg-white/10 dark:bg-white/5 transition-colors px-6 py-3 rounded-xl font-bold text-zinc-900 dark:text-white text-sm"
            >
              + Adicionar Cartão
            </button>
          </div>
        )}
      </div>

      {isCardModalOpen && (
        <CardModal
          onClose={handleClose}
          onSuccess={() => fetchData()}
          accounts={accounts}
          initialData={editingCard}
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setCards((prev) =>
                prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)),
              );
            } else {
              setCards((prev) => [...prev, { ...data, id: Date.now() }]);
            }
          }}
        />
      )}
    </div>
  );
}