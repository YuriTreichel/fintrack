import React, { useState, useMemo } from "react";
import { 
  ArrowDownLeft, 
  ArrowRightLeft, 
  ArrowUpRight, 
  BarChart3, 
  CheckCircle2, 
  LineChart as LineChartIcon, // Avisamos que o LineChart do Lucide vai chamar-se LineChartIcon
  Tag, 
  Wallet 
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart, // Agora sim, o BarChart correto dos gráficos!
  Bar,
  LineChart, // E o LineChart correto dos gráficos!
  Line,
} from "recharts";

import { COLORS } from "../constants/theme";
import { format, parseISO, isPast, isToday, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "../utils/classNames";

export default function ReportsView({
  data,
  user,
  selectedProfile,
  transactions,
  categories,
  accounts,
  cards,
}) {
  const [reportType, setReportType] = useState("monthly");
  const [refDate, setRefDate] = useState(new Date());
  const [activeReport, setActiveReport] = useState("fluxo-caixa");

  const profileTransactions = useMemo(
    () =>
      transactions.filter(
        (t) => t.user_id === selectedProfile?.id && !t.ignore_in_reports,
      ),
    [transactions, selectedProfile],
  );
  const profileCategories = useMemo(
    () => categories.filter((c) => c.user_id === selectedProfile?.id),
    [categories, selectedProfile],
  );
  const profileAccounts = useMemo(
    () => accounts.filter((a) => a.user_id === selectedProfile?.id),
    [accounts, selectedProfile],
  );
  const profileCards = useMemo(
    () => cards.filter((c) => c.user_id === selectedProfile?.id),
    [cards, selectedProfile],
  );

  // 1. Fluxo de Caixa (Receitas vs Despesas) - Últimos 6 meses
  const incomeVsExpenses = useMemo(() => {
    const last6Months = Array.from({ length: 6 })
      .map((_, i) => subMonths(new Date(), i))
      .reverse();
    return last6Months.map((monthDate) => {
      const monthStr = format(monthDate, "yyyy-MM");
      const monthTxs =
        profileTransactions?.filter((t) => t?.date?.startsWith?.(monthStr)) ||
        [];
      return {
        month: format(monthDate, "MMM yy", { locale: ptBR }),
        income: monthTxs
          .filter((t) => t.type === "Income")
          .reduce((s, t) => s + Number(t.amount || 0), 0),
        expenses: monthTxs
          .filter((t) => t.type === "Expense")
          .reduce((s, t) => s + Number(t.amount || 0), 0),
      };
    });
  }, [profileTransactions]);

  // 2. Receitas por Categoria
  const incomeByCategory = useMemo(() => {
    const currentMonthStr = format(new Date(), "yyyy-MM");
    const monthTxs =
      profileTransactions?.filter(
        (t) => t?.date?.startsWith?.(currentMonthStr) && t.type === "Income",
      ) || [];
    const categoriesMap =
      profileCategories?.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {}) || {};

    const agg = monthTxs.reduce((acc, t) => {
      const name = categoriesMap[t.category_id] || "Outros";
      acc[name] = (acc[name] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    return Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [profileTransactions, profileCategories]);

  // 3. Despesas por Categoria
  const expensesByCategory = useMemo(() => {
    const currentMonthStr = format(new Date(), "yyyy-MM");
    const monthTxs =
      profileTransactions?.filter(
        (t) => t?.date?.startsWith?.(currentMonthStr) && t.type === "Expense",
      ) || [];
    const categoriesMap =
      profileCategories?.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {}) || {};

    const agg = monthTxs.reduce((acc, t) => {
      const name = categoriesMap[t.category_id] || "Outros";
      acc[name] = (acc[name] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    return Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [profileTransactions, profileCategories]);

  // 4. Despesas Fixas vs Variáveis
  const fixedVsVariable = useMemo(() => {
    const currentMonthStr = format(new Date(), "yyyy-MM");
    const monthTxs = profileTransactions.filter(
      (t) => t.date.startsWith(currentMonthStr) && t.type === "Expense",
    );

    const fixed = monthTxs
      .filter((t) => t.is_fixed)
      .reduce((s, t) => s + Number(t.amount), 0);
    const variable = monthTxs
      .filter((t) => !t.is_fixed)
      .reduce((s, t) => s + Number(t.amount), 0);

    return [
      { name: "Fixas", value: fixed, color: "#98e5dd" },
      { name: "Variáveis", value: variable, color: "#ff7b7b" },
    ];
  }, [profileTransactions]);

  // 5. Evolução do Saldo
  const balanceEvolution = useMemo(() => {
    const last12Months = Array.from({ length: 12 })
      .map((_, i) => subMonths(new Date(), i))
      .reverse();

    return last12Months.map((monthDate) => {
      const monthStr = format(monthDate, "yyyy-MM");
      const monthTxs = profileTransactions.filter((t) =>
        t.date.startsWith(monthStr),
      );

      const income = monthTxs
        .filter((t) => t.type === "Income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthTxs
        .filter((t) => t.type === "Expense")
        .reduce((s, t) => s + Number(t.amount), 0);
      const balance = income - expense;

      return {
        month: format(monthDate, "MMM yy", { locale: ptBR }),
        saldo: balance,
        receitas: income,
        despesas: expense,
      };
    });
  }, [profileTransactions]);

  // 6. Saldo por Conta
  const balanceByAccount = useMemo(() => {
    return profileAccounts
      .map((acc) => ({
        name: acc.name,
        saldo:
          acc.current_balance !== undefined
            ? acc.current_balance
            : acc.initial_balance,
      }))
      .sort((a, b) => b.saldo - a.saldo);
  }, [profileAccounts]);

  // 7. Contas a Pagar
  const accountsPayable = useMemo(() => {
    return profileTransactions
      .filter((t) => t.type === "Expense" && t.status === "Pending")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [profileTransactions]);

  // 8. Contas a Receber
  const accountsReceivable = useMemo(() => {
    return profileTransactions
      .filter((t) => t.type === "Income" && t.status === "Pending")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [profileTransactions]);

  // 9. Relatório de Cartão de Crédito
  const cardReport = useMemo(() => {
    const currentMonthStr = format(new Date(), "yyyy-MM");
    const monthTxs = profileTransactions.filter(
      (t) =>
        t.date.startsWith(currentMonthStr) && t.type === "Expense" && t.card_id,
    );

    const byCard = monthTxs.reduce((acc, t) => {
      const card = profileCards.find((c) => c.id === t.card_id);
      const cardName = card ? card.name : "Cartão Desconhecido";
      acc[cardName] = (acc[cardName] || 0) + Number(t.amount);
      return acc;
    }, {});

    return Object.entries(byCard).map(([name, value]) => ({ name, value }));
  }, [profileTransactions, profileCards]);

  // 10. Limite Utilizado do Cartão
  const cardLimitUsage = useMemo(() => {
    return profileCards.map((card) => {
      const currentMonthStr = format(new Date(), "yyyy-MM");
      const monthTxs = profileTransactions.filter(
        (t) =>
          t.date.startsWith(currentMonthStr) &&
          t.type === "Expense" &&
          t.card_id === card.id,
      );

      const totalSpent = monthTxs.reduce((s, t) => s + Number(t.amount), 0);
      const limit = card.limit || 5000; // Valor padrão se não houver limite definido
      const usagePercentage = limit > 0 ? (totalSpent / limit) * 100 : 0;

      return {
        name: card.name,
        gasto: totalSpent,
        limite: limit,
        utilizacao: usagePercentage,
      };
    });
  }, [profileTransactions, profileCards]);

  // 11. Metas Financeiras
  const financialGoals = useMemo(() => {
    const totalIncome = profileTransactions
      .filter((t) => t.type === "Income")
      .reduce((s, t) => s + Number(t.amount), 0);

    const totalExpense = profileTransactions
      .filter((t) => t.type === "Expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return [
      {
        meta: "Taxa de Poupança",
        atual: savingsRate.toFixed(1),
        objetivo: 20,
        unidade: "%",
      },
      {
        meta: "Receita Mensal",
        atual: totalIncome,
        objetivo: 10000,
        unidade: "R$",
      },
      {
        meta: "Despesas Controladas",
        atual: totalExpense,
        objetivo: 7000,
        unidade: "R$",
      },
    ];
  }, [profileTransactions]);

  // 12. Comparação Mensal de Receitas e Despesas
  const monthlyComparison = useMemo(() => {
    const last3Months = Array.from({ length: 3 })
      .map((_, i) => subMonths(new Date(), i))
      .reverse();
    return last3Months.map((monthDate) => {
      const monthStr = format(monthDate, "yyyy-MM");
      const monthTxs = profileTransactions.filter((t) =>
        t.date.startsWith(monthStr),
      );
      return {
        month: format(monthDate, "MMM yy", { locale: ptBR }),
        receitas: monthTxs
          .filter((t) => t.type === "Income")
          .reduce((s, t) => s + Number(t.amount), 0),
        despesas: monthTxs
          .filter((t) => t.type === "Expense")
          .reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  }, [profileTransactions]);

  const reportComponents = {
    "fluxo-caixa": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Fluxo de Caixa (Últimos 6 Meses)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpenses}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ffffff0a"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#ffffff0a" }}
                contentStyle={{
                  backgroundColor: "#1a1c1c",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
              />
              <Bar
                dataKey="income"
                fill={user?.theme_color || "#98e5dd"}
                radius={[4, 4, 0, 0]}
                name="Receitas"
              />
              <Bar
                dataKey="expenses"
                fill="#ff7b7b"
                radius={[4, 4, 0, 0]}
                name="Despesas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    "receitas-categoria": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Receitas por Categoria (Mês Atual)
        </h3>
        <div className="h-80">
          {incomeByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {incomeByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1c",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <ArrowUpRight size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma receita este mês</p>
            </div>
          )}
        </div>
      </div>
    ),
    "despesas-categoria": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Despesas por Categoria (Mês Atual)
        </h3>
        <div className="h-80">
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1c",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <ArrowDownLeft size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma despesa este mês</p>
            </div>
          )}
        </div>
      </div>
    ),
    "fixas-vs-variaveis": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Despesas Fixas vs Variáveis (Mês Atual)
        </h3>
        <div className="h-80">
          {fixedVsVariable.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fixedVsVariable}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {fixedVsVariable.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1c",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <Tag size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma despesa este mês</p>
            </div>
          )}
        </div>
      </div>
    ),
    "evolucao-saldo": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Evolução do Saldo (Últimos 12 Meses)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceEvolution}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ffffff0a"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1c1c",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={user?.theme_color || "#98e5dd"}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Saldo"
              />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Receitas"
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ff7b7b"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Despesas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    "saldo-contas": (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
          Saldo por Conta
        </h3>
        <div className="h-80">
          {balanceByAccount.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceByAccount}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff0a"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1c",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                />
                <Bar
                  dataKey="saldo"
                  fill={user?.theme_color || "#98e5dd"}
                  radius={[4, 4, 0, 0]}
                  name="Saldo"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <Wallet size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma conta cadastrada</p>
            </div>
          )}
        </div>
      </div>
    ),
  };

  const reportTabs = [
    {
      id: "fluxo-caixa",
      label: "Fluxo de Caixa",
      icon: <ArrowRightLeft size={16} />,
    },
    {
      id: "receitas-categoria",
      label: "Receitas por Categoria",
      icon: <ArrowUpRight size={16} />,
    },
    {
      id: "despesas-categoria",
      label: "Despesas por Categoria",
      icon: <ArrowDownLeft size={16} />,
    },
    {
      id: "fixas-vs-variaveis",
      label: "Fixas vs Variáveis",
      icon: <Tag size={16} />,
    },
    {
      id: "evolucao-saldo",
      label: "Evolução do Saldo",
      icon: <LineChartIcon size={16} />,
    },
    {
      id: "saldo-contas",
      label: "Saldo por Conta",
      icon: <Wallet size={16} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
          Relatórios
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Análises detalhadas e insights sobre suas finanças.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              activeReport === tab.id
                ? "bg-fin-surface shadow-sm text-fin-mint"
                : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {reportComponents[activeReport]}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
            Contas a Pagar
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {accountsPayable.length > 0 ? (
              accountsPayable.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {t.description}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {format(parseISO(t.date), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <span className="font-bold text-[#ff7b7b]">
                    R${" "}
                    {Number(t.amount).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Nenhuma conta a pagar</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
            Contas a Receber
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {accountsReceivable.length > 0 ? (
              accountsReceivable.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {t.description}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {format(parseISO(t.date), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <span className="font-bold text-fin-mint">
                    R${" "}
                    {Number(t.amount).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Nenhuma conta a receber</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
