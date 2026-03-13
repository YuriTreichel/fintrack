import React, { useState, useMemo, useCallback, useEffect } from "react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  Trash2,
  Calendar,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "../utils/classNames";
import CustomSelect from "../components/ui/CustomSelect";
import CustomDatePicker from "../components/ui/CustomDatePicker";
import TransactionRow from "../components/ui/TransactionRow";
import QuickEffectiveModal from "../modals/QuickEffectiveModal";

export default function TransactionsView({
  transactions,
  setTransactions,
  fetchData,
  onEdit,
  showToast,
  showConfirm,
  initialFilters,
  categories,
  accounts,
  user,
  selectedProfile,
  isReadOnly,
  searchTerm,
}) {
  const profileTransactions = useMemo(
    () =>
      transactions.filter(
        (t) => t.user_id === selectedProfile?.id && !t.ignore_in_reports,
      ),
    [transactions, selectedProfile],
  );
  const profileAccounts = useMemo(
    () => accounts.filter((a) => a.user_id === selectedProfile?.id),
    [accounts, selectedProfile],
  );

  const [filter, setFilter] = useState({
    status: initialFilters?.status || "all",
    type: initialFilters?.type || "all",
    month: initialFilters?.month || format(new Date(), "yyyy-MM"),
    category: initialFilters?.category || "all",
    account: "all",
    dateStart: "",
    dateEnd: "",
    sortOrder: "desc",
  });

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [quickEffectiveTransaction, setQuickEffectiveTransaction] =
    useState(null);
  const [pickerYear, setPickerYear] = useState(() => {
    return initialFilters?.month && initialFilters.month !== "all"
      ? parseInt(initialFilters.month.split("-")[0])
      : new Date().getFullYear();
  });

  const getFilterDate = useCallback(() => {
    if (!filter.month || filter.month === "all") return new Date();
    return parseISO(`${filter.month}-01`);
  }, [filter.month]);

  const handlePrevMonth = useCallback(() => {
    const d = getFilterDate();
    d.setMonth(d.getMonth() - 1);
    setFilter((prev) => ({ ...prev, month: format(d, "yyyy-MM") }));
  }, [getFilterDate]);

  const handleNextMonth = useCallback(() => {
    const d = getFilterDate();
    d.setMonth(d.getMonth() + 1);
    setFilter((prev) => ({ ...prev, month: format(d, "yyyy-MM") }));
  }, [getFilterDate]);

  const hasActiveFilters =
    filter.status !== "all" ||
    filter.category !== "all" ||
    filter.account !== "all" ||
    filter.dateStart ||
    filter.dateEnd;

  const [showProjectedBalance, setShowProjectedBalance] = useState(() => {
    const saved = localStorage.getItem("fin_show_projected_balance");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "fin_show_projected_balance",
      JSON.stringify(showProjectedBalance),
    );
  }, [showProjectedBalance]);

  const activeFiltersCount = useMemo(
    () =>
      [
        filter.status !== "all",
        filter.category !== "all",
        filter.account !== "all",
        filter.dateStart,
        filter.dateEnd,
        filter.month !== format(new Date(), "yyyy-MM") &&
          filter.month !== "all",
      ].filter(Boolean).length,
    [
      filter.status,
      filter.category,
      filter.account,
      filter.dateStart,
      filter.dateEnd,
      filter.month,
    ],
  );

  // Performance optimized filtering and balance calculation
  const { filtered, sortedDates, groupedTransactions } = useMemo(() => {
    const filteredList = profileTransactions
      .filter((t) => {
        if (filter.status !== "all" && t.status !== filter.status) return false;
        if (filter.type !== "all" && t.type !== filter.type) return false;
        if (filter.dateStart || filter.dateEnd) {
          if (filter.dateStart && t.date < filter.dateStart) return false;
          if (filter.dateEnd && t.date > filter.dateEnd) return false;
        } else {
          if (filter.month !== "all" && !t.date.startsWith(filter.month))
            return false;
        }
        if (filter.category !== "all" && t.category_name !== filter.category)
          return false;
        if (
          filter.account !== "all" &&
          String(t.account_id) !== String(filter.account)
        )
          return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesDescription = t.description.toLowerCase().includes(term);
          const matchesCategory = t.category_name?.toLowerCase().includes(term);
          const matchesAmount = String(t.amount).includes(term);
          const matchesAccount = t.account_name?.toLowerCase().includes(term);
          if (
            !matchesDescription &&
            !matchesCategory &&
            !matchesAmount &&
            !matchesAccount
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return filter.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });

    const baseInitialBalance = profileAccounts
      ? profileAccounts.reduce(
          (acc, a) => acc + parseFloat(a.initial_balance || 0),
          0,
        )
      : 0;

    // Efficient single-pass ledger balance calculation
    const dailyNet = {};
    const datesSet = new Set();

    profileTransactions.forEach((t) => {
      const d = t.date;
      datesSet.add(d);
      if (t.type === "Transfer") return;
      const val = Number(t.amount) * (t.type === "Income" ? 1 : -1);
      dailyNet[d] = (dailyNet[d] || 0) + val;
    });

    const allSortedDates = Array.from(datesSet).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    // Ledger logic: Balance(D) = Initial Balance + Sum of all transactions (<=D)
    let runningTotal = baseInitialBalance;
    const cumulativeBalances = {};

    allSortedDates.forEach((date) => {
      runningTotal += dailyNet[date] || 0;
      cumulativeBalances[date] = runningTotal;
    });

    const grouped = filteredList.reduce((groups, t) => {
      const date = t.date;
      if (!groups[date]) {
        groups[date] = {
          transactions: [],
          balance: cumulativeBalances[date] || 0,
        };
      }
      groups[date].transactions.push(t);
      return groups;
    }, {});

    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      return filter.sortOrder === "desc"
        ? new Date(b) - new Date(a)
        : new Date(a) - new Date(b);
    });

    return {
      filtered: filteredList,
      sortedDates: sortedGroups,
      groupedTransactions: grouped,
    };
  }, [profileTransactions, filter, profileAccounts]);

  const handleDelete = (transaction) => {
    let mode = "only";
    let message = "Tem certeza que deseja excluir esta transação?";
    let title = "Excluir Transação";

    if (transaction.total_installments) {
      mode = "all";
      message =
        "Esta é uma transação parcelada. Isso excluirá todas as parcelas. Deseja continuar?";
    }

    showConfirm(title, message, async () => {
      // Optimistic update
      const previousState = [...transactions];
      if (mode === "all") {
        setTransactions((prev) =>
          prev.filter(
            (t) =>
              t.parent_id !== transaction.parent_id && t.id !== transaction.id,
          ),
        );
      } else {
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      }

      try {
        const res = await fetch(
          `/api/transactions/${transaction.id}?mode=${mode}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (res.ok) {
          showToast("Transação excluída com sucesso!", "success");
          fetchData(); // Sync up background state (dashboard numbers etc)
        } else {
          setTransactions(previousState); // Revert on failure
          showToast("Erro ao excluir transação.", "error");
        }
      } catch (e) {
        setTransactions(previousState); // Revert on failure
        showToast("Erro de conexão.", "error");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-[60]">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
          Transações
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Navigation - Back to primary row */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-zinc-900/10 dark:bg-white/5 rounded-full p-1 border border-zinc-900/10 dark:border-white/5 relative z-10 transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => {
                  setPickerYear(getFilterDate().getFullYear());
                  setIsMonthPickerOpen(!isMonthPickerOpen);
                }}
                className="text-sm font-bold min-w-[140px] text-center capitalize hover:text-fin-mint transition-colors py-2 px-3 rounded-xl hover:bg-zinc-900/5 dark:hover:bg-white/5"
              >
                {filter.month !== "all"
                  ? format(getFilterDate(), "MMMM yyyy", { locale: ptBR })
                  : "Todos os Meses"}
              </button>

              <button
                onClick={handleNextMonth}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronRight size={20} />
              </button>

              {filter.month !== "all" && (
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
              )}
              {filter.month !== "all" && (
                <button
                  onClick={() => setFilter({ ...filter, month: "all" })}
                  className="p-2 text-[#ff7b7b] hover:bg-[#ff7b7b]/10 rounded-full transition-all mr-1"
                  title="Limpar Mês"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {isMonthPickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMonthPickerOpen(false)}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-5 bg-fin-surface border border-zinc-900/10 dark:border-white/10 rounded-3xl shadow-2xl z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setPickerYear((y) => y - 1)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">
                      {pickerYear}
                    </span>
                    <button
                      onClick={() => setPickerYear((y) => y + 1)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const m = new Date(pickerYear, i, 1);
                      const isSelected = filter.month === format(m, "yyyy-MM");
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setFilter({
                              ...filter,
                              month: format(m, "yyyy-MM"),
                            });
                            setIsMonthPickerOpen(false);
                          }}
                          className={cn(
                            "py-3 rounded-2xl text-sm font-semibold capitalize transition-all duration-200",
                            isSelected
                              ? "bg-fin-mint text-fin-bg shadow-lg shadow-fin-mint/30 hover:scale-105"
                              : "hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-105",
                          )}
                        >
                          {format(m, "MMM", { locale: ptBR })}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <CustomSelect
            value={filter.type}
            onChange={(val) =>
              setFilter({ ...filter, type: val, category: "all" })
            }
            options={[
              { value: "all", label: "Todos os Tipos" },
              { value: "Income", label: "Receita" },
              { value: "Expense", label: "Despesa" },
              { value: "Transfer", label: "Transferência" },
            ]}
            triggerClassName="bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/20 dark:hover:bg-white/10 min-w-[170px]"
          />
          <CustomSelect
            value={filter.sortOrder}
            onChange={(val) => setFilter({ ...filter, sortOrder: val })}
            options={[
              { value: "desc", label: "Ordem Decrescente" },
              { value: "asc", label: "Ordem Crescente" },
            ]}
            triggerClassName="bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/20 dark:hover:bg-white/10 min-w-[170px]"
          />
          <button
            onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border",
              isMoreFiltersOpen || activeFiltersCount > 0
                ? "bg-fin-mint/10 border-fin-mint/30 text-fin-mint"
                : "bg-zinc-900/10 dark:bg-white/5 border-zinc-900/10 dark:border-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/20 dark:hover:bg-white/10",
            )}
          >
            <Filter size={18} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-fin-mint text-fin-bg text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-300",
                isMoreFiltersOpen && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {isMoreFiltersOpen && (
        <div className="bg-zinc-900/5 dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/5 rounded-[32px] p-6 animate-in slide-in-from-top-4 fade-in duration-300 mb-2 relative z-[50]">
          <div className="flex flex-wrap items-center gap-4">
            <CustomSelect
              value={filter.status}
              onChange={(val) => setFilter({ ...filter, status: val })}
              options={[
                { value: "all", label: "Todos os Status" },
                {
                  value: "Paid",
                  label: filter.type === "Income" ? "Recebido" : "Pago",
                },
                { value: "Pending", label: "Pendente" },
              ]}
              triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[170px]"
            />

            {categories && (
              <CustomSelect
                value={filter.category}
                onChange={(val) => setFilter({ ...filter, category: val })}
                options={[
                  { value: "all", label: "Todas as Categorias" },
                  ...(() => {
                    const filteredCats =
                      filter.type !== "all" && filter.type !== "Transfer"
                        ? categories.filter((c) => c.type === filter.type)
                        : categories;
                    const parentCats = filteredCats.filter((c) => !c.parent_id);
                    const grouped = [];
                    parentCats.forEach((parent) => {
                      const children = filteredCats.filter(
                        (c) => c.parent_id === parent.id,
                      );
                      grouped.push({ value: parent.name, label: parent.name });
                      children.forEach((child) => {
                        grouped.push({
                          value: child.name,
                          label: `↳ ${child.name}`,
                          indent: true,
                        });
                      });
                    });
                    return grouped;
                  })(),
                ]}
                triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[190px]"
              />
            )}

            {accounts && (
              <CustomSelect
                value={filter.account}
                onChange={(val) => setFilter({ ...filter, account: val })}
                options={[
                  { value: "all", label: "Todas as Contas" },
                  ...profileAccounts.map((a) => ({
                    value: a.id,
                    label: a.name,
                  })),
                ]}
                triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[170px]"
              />
            )}

            <div className="flex items-center gap-5 bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full px-6 py-[11px] transition-all hover:bg-zinc-900/5 dark:hover:bg-white/5 group min-w-[280px]">
              <CustomDatePicker
                value={filter.dateStart}
                onChange={(val) => setFilter({ ...filter, dateStart: val })}
                label="De"
                placeholder="Início"
              />
              <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700/50 mx-2"></div>
              <CustomDatePicker
                value={filter.dateEnd}
                onChange={(val) => setFilter({ ...filter, dateEnd: val })}
                label="Até"
                placeholder="Fim"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={() =>
                  setFilter({
                    ...filter,
                    status: "all",
                    type: "all",
                    category: "all",
                    account: "all",
                    dateStart: "",
                    dateEnd: "",
                    sortOrder: "desc",
                  })
                }
                className="text-[#ff7b7b] text-xs font-bold uppercase tracking-wider hover:bg-[#ff7b7b]/10 px-5 py-3 rounded-full transition-colors flex items-center gap-1.5 ml-auto"
              >
                <Trash2 size={14} /> Limpar Filtros
              </button>
            )}

            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-2 ml-auto"></div>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showProjectedBalance}
                  onChange={(e) => setShowProjectedBalance(e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-300 dark:bg-zinc-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fin-mint"></div>
              </div>
              <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Saldo Projetado
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {filter.type !== "all" &&
        filter.type !== "Transfer" &&
        (() => {
          const typeFiltered = profileTransactions.filter((t) => {
            if (filter.month !== "all" && !t.date.startsWith(filter.month))
              return false;
            return t.type === filter.type;
          });
          const total = typeFiltered.reduce((s, t) => s + Number(t.amount), 0);
          const paid = typeFiltered
            .filter((t) => t.status === "Paid")
            .reduce((s, t) => s + Number(t.amount), 0);
          const pending = typeFiltered
            .filter((t) => t.status === "Pending")
            .reduce((s, t) => s + Number(t.amount), 0);
          const isIncome = filter.type === "Income";
          const accentColor = isIncome ? "fin-mint" : "[#ff7b7b]";
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Total {isIncome ? "Receitas" : "Despesas"}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    isIncome ? "text-fin-mint" : "text-[#ff7b7b]",
                  )}
                >
                  R${" "}
                  {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {typeFiltered.length} transações
                </p>
              </div>
              <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  {isIncome ? "Recebido" : "Pago"}
                </p>
                <p className="text-2xl font-bold tabular-nums text-fin-mint">
                  R${" "}
                  {paid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {typeFiltered.filter((t) => t.status === "Paid").length}{" "}
                  transações
                </p>
              </div>
              <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Pendente
                </p>
                <p className="text-2xl font-bold tabular-nums text-fin-peach">
                  R${" "}
                  {pending.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {typeFiltered.filter((t) => t.status === "Pending").length}{" "}
                  transações
                </p>
              </div>
            </div>
          );
        })()}

      <div className="bg-fin-surface rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl overflow-hidden mt-6">
        <div className="divide-y divide-white/5">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <div key={date} className="relative">
                <div className="sticky top-0 z-10 bg-zinc-100/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between border-y border-zinc-900/5 dark:border-white/5">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-fin-mint" />
                    {format(parseISO(date), "EEEE, dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                  {showProjectedBalance && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">
                        {filter.type === "all"
                          ? "Saldo Projetado:"
                          : "Total do Dia:"}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold tabular-nums min-w-[80px] text-right",
                          filter.type === "all"
                            ? groupedTransactions[date].balance > 0
                              ? "text-fin-mint"
                              : groupedTransactions[date].balance < 0
                                ? "text-[#ff7b7b]"
                                : "text-zinc-500"
                            : filter.type === "Income"
                              ? "text-fin-mint"
                              : "text-[#ff7b7b]",
                        )}
                      >
                        R${" "}
                        {(filter.type === "all"
                          ? groupedTransactions[date].balance
                          : groupedTransactions[date].transactions.reduce(
                              (s, t) => s + Number(t.amount),
                              0,
                            )
                        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="divide-y divide-zinc-900/5 dark:divide-white/5">
                  {groupedTransactions[date].transactions.map((t, index) => (
                    <div
                      key={t.id}
                      className="animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                      style={{
                        animationDuration: "400ms",
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <TransactionRow
                        transaction={t}
                        onDelete={handleDelete}
                        onEdit={onEdit}
                        onQuickEffective={setQuickEffectiveTransaction}
                        currentUser={user}
                        isReadOnly={isReadOnly}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-zinc-900/10 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600 dark:text-zinc-500">
                <ArrowRightLeft size={32} />
              </div>
              <p className="text-zinc-600 dark:text-zinc-500 font-medium text-sm">
                Nenhuma transação encontrada com esses filtros.
              </p>
            </div>
          )}
        </div>
      </div>

      {quickEffectiveTransaction && (
        <QuickEffectiveModal
          transaction={quickEffectiveTransaction}
          onClose={() => setQuickEffectiveTransaction(null)}
          onSuccess={fetchData}
          accounts={profileAccounts}
          showToast={showToast}
        />
      )}
    </div>
  );
}
