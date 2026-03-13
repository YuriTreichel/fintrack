import React from 'react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CreditCard, CheckCircle2, Settings, Trash2 } from 'lucide-react';
import { cn } from '../../utils/classNames';

export default function TransactionRow({
  transaction,
  onDelete,
  onEdit,
  onQuickEffective,
  currentUser,
  isReadOnly,
}) {
  const isIncome = transaction.type === "Income";
  const isTransfer = transaction.type === "Transfer";
  const isPending = transaction.status === "Pending";
  const isOverdue =
    isPending &&
    isPast(parseISO(transaction.date)) &&
    !isToday(parseISO(transaction.date));
  const isShared = currentUser && transaction.user_id !== currentUser.id;

  return (
    <div className="p-5 flex items-center hover:bg-zinc-900/10 dark:hover:bg-white/[0.03] transition-colors group gap-4">
      <div
        className={cn(
          "w-12 h-12 rounded-[16px] flex items-center justify-center border border-zinc-900/10 dark:border-white/5 flex-shrink-0",
          isIncome
            ? "bg-fin-mint/10 text-fin-mint"
            : isTransfer
              ? "bg-zinc-900/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-300"
              : "bg-transparent text-zinc-900 dark:text-white",
        )}
      >
        {isIncome ? (
          <ArrowDownLeft size={20} />
        ) : isTransfer ? (
          <ArrowRightLeft size={20} />
        ) : (
          <ArrowUpRight size={20} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
            {transaction.description}
          </p>
          {transaction.is_fixed ? (
            <span className="text-[10px] bg-fin-mint/10 text-fin-mint px-1.5 py-0.5 rounded border border-fin-mint/20 font-bold uppercase flex-shrink-0">
              Fixo
            </span>
          ) : (
            transaction.installment_number && (
              <span className="text-[10px] bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-900/10 dark:border-white/5 font-bold uppercase flex-shrink-0">
                {transaction.installment_number}/
                {transaction.total_installments}
              </span>
            )
          )}
          {isShared && (
            <span className="text-[10px] bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-900/10 dark:border-white/5 font-bold uppercase flex-shrink-0">
              {transaction.owner_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
          <span>
            {format(parseISO(transaction.date), "dd MMM yyyy", {
              locale: ptBR,
            })}
          </span>
          <span>•</span>
          <span className="text-zinc-500 dark:text-zinc-400 truncate">
            {transaction.category_name || "Sem Categoria"}
          </span>
          {transaction.card_id && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <CreditCard size={10} /> Cartão
              </span>
            </>
          )}
        </div>
      </div>
      <div className="text-right min-w-[100px] flex-shrink-0 mr-2">
        <p
          className={cn(
            "font-bold text-sm tabular-nums text-zinc-900 dark:text-white",
          )}
        >
          {isIncome ? "+" : "-"} R${" "}
          {Math.abs(transaction.amount).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          {isPending ? (
            <button
              onClick={() => onQuickEffective(transaction)}
              className={cn(
                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md hover:scale-105 transition-all",
                isOverdue
                  ? "bg-[#ff7b7b]/10 text-[#ff7b7b]"
                  : "bg-fin-peach/10 text-fin-peach hover:bg-fin-peach/20",
              )}
              title="Efetivar agora"
            >
              <CheckCircle2 size={12} />
              {isOverdue ? "Atraso" : "Pendente"}
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-fin-mint px-2 py-0.5 rounded-md bg-fin-mint/10">
              <CheckCircle2 size={12} />
              Pago
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5 min-w-[100px] flex-shrink-0 justify-end opacity-0 group-hover:opacity-100 transition-all duration-200">
        {!isReadOnly && isPending && (
          <button
            onClick={() => onQuickEffective(transaction)}
            className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-fin-mint hover:bg-fin-mint/10 rounded-xl transition-all"
            title="Efetivar agora"
          >
            <CheckCircle2 size={16} />
          </button>
        )}
        {!isReadOnly && onEdit && (
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-fin-mint hover:bg-fin-mint/10 rounded-xl transition-all"
            title="Editar"
          >
            <Settings size={16} />
          </button>
        )}
        {!isReadOnly && onDelete && (
          <button
            onClick={() => onDelete(transaction)}
            className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-[#ff7b7b] hover:bg-[#ff7b7b]/10 rounded-xl transition-all"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}