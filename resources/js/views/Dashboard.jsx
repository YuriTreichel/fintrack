import React, { useState, useMemo } from 'react';
import { format, parseISO, isPast, isToday, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, AlertCircle, Wallet, LineChart as LineChartIcon, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../utils/classNames';
import { COLORS } from '../constants/theme';
import StatCard from '../components/ui/StatCard';
import TransactionRow from '../components/ui/TransactionRow';

export default function Dashboard({ data, transactions, accounts, categories, user, onEdit, onNavigate, selectedProfile, searchTerm }) {
  const profileTransactions = useMemo(() => 
    transactions.filter(t => t.user_id === selectedProfile?.id && !t.ignore_in_reports), 
    [transactions, selectedProfile]
  );
  const profileAccounts = useMemo(() => accounts.filter(a => a.user_id === selectedProfile?.id), [accounts, selectedProfile]);
  const profileCategories = useMemo(() => categories.filter(c => c.user_id === selectedProfile?.id), [categories, selectedProfile]);

  const [refDate, setRefDate] = useState(new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1));
  };

  const monthTxs = profileTransactions.filter(t => {
    const d = parseISO(t.date);
    return d.getMonth() === refDate.getMonth() && d.getFullYear() === refDate.getFullYear();
  });

  const mIncome = monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
  const mExpense = monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
  const mBalance = mIncome - mExpense;

  const pendingIncome = monthTxs.filter(t => t.type === 'Income' && t.status === 'Pending').filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.description.toLowerCase().includes(term) || (t.category_name && t.category_name.toLowerCase().includes(term));
  });
  const pendingExpense = monthTxs.filter(t => t.type === 'Expense' && t.status === 'Pending').filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.description.toLowerCase().includes(term) || (t.category_name && t.category_name.toLowerCase().includes(term));
  });

  const overdueCount = profileTransactions.filter(t => t.status === 'Pending' && isPast(parseISO(t.date)) && !isToday(parseISO(t.date))).length;
  
  const totalAccountsBalance = profileAccounts?.reduce((acc, curr) => acc + parseFloat(curr.current_balance !== undefined ? curr.current_balance : curr.initial_balance), 0) || 0;

  const endOfSelectedMonth = endOfMonth(refDate);
  const baseBalance = profileAccounts?.reduce((s, a) => s + parseFloat(a.initial_balance || 0), 0) || 0;
  
  const pastAndCurrentTxs = profileTransactions.filter(t => {
    const d = parseISO(t.date);
    return d <= endOfSelectedMonth;
  });
  
  const totalIncomeUpToMonth = pastAndCurrentTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenseUpToMonth = pastAndCurrentTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
  const projectedBalance = baseBalance + totalIncomeUpToMonth - totalExpenseUpToMonth;

  // Generate Month-scoped Chart Data
  const categoriesMap = profileCategories?.reduce((acc, cat) => { acc[cat.id] = cat.name; return acc; }, {}) || {};

  const expByCategoryAgg = monthTxs.filter(t => t.type === 'Expense').reduce((acc, t) => {
    const catName = categoriesMap[t.category_id] || 'Outros';
    acc[catName] = (acc[catName] || 0) + Number(t.amount);
    return acc;
  }, {});
  const monthExpensesByCategory = Object.entries(expByCategoryAgg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const incByCategoryAgg = monthTxs.filter(t => t.type === 'Income').reduce((acc, t) => {
    const catName = categoriesMap[t.category_id] || 'Outros';
    acc[catName] = (acc[catName] || 0) + Number(t.amount);
    return acc;
  }, {});
  const monthIncomeByCategory = Object.entries(incByCategoryAgg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const monthIncomeVsExpenses = [{
    month: format(refDate, 'MMM yyyy', { locale: ptBR }),
    income: mIncome,
    expenses: mExpense,
    balance: mBalance
  }];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Visão Geral</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Bem-vindo ao painel de {selectedProfile?.name}. Aqui está o resumo das finanças.</p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 bg-zinc-900/10 dark:bg-white/5 rounded-full p-1 border border-zinc-900/10 dark:border-white/5 relative z-10">
            <button onClick={handlePrevMonth} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"><ChevronLeft size={20} /></button>
            
            <button 
              onClick={() => {
                setPickerYear(refDate.getFullYear());
                setIsMonthPickerOpen(!isMonthPickerOpen);
              }}
              className="text-sm font-bold min-w-[140px] text-center capitalize hover:text-fin-mint transition-colors py-2 px-3 rounded-xl hover:bg-zinc-900/5 dark:hover:bg-white/5"
            >
              {format(refDate, 'MMMM yyyy', { locale: ptBR })}
            </button>

            <button onClick={handleNextMonth} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"><ChevronRight size={20} /></button>
          </div>

          {isMonthPickerOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMonthPickerOpen(false)} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-5 bg-fin-surface border border-zinc-900/10 dark:border-white/10 rounded-3xl shadow-2xl z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setPickerYear(y => y - 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><ChevronLeft size={18}/></button>
                  <span className="font-bold text-lg text-zinc-900 dark:text-white">{pickerYear}</span>
                  <button onClick={() => setPickerYear(y => y + 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><ChevronRight size={18}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({length: 12}).map((_, i) => {
                    const m = new Date(pickerYear, i, 1);
                    const isSelected = refDate.getMonth() === i && refDate.getFullYear() === pickerYear;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setRefDate(new Date(pickerYear, i, 1));
                          setIsMonthPickerOpen(false);
                        }}
                        className={cn(
                          "py-3 rounded-2xl text-sm font-semibold capitalize transition-all duration-200",
                          isSelected 
                            ? "bg-fin-mint text-fin-bg shadow-lg shadow-fin-mint/30 hover:scale-105" 
                            : "hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-105"
                        )}
                      >
                        {format(m, 'MMM', { locale: ptBR })}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {overdueCount > 0 && (
          <div className="bg-fin-peach/10 border border-fin-peach/20 p-3 rounded-2xl flex items-center gap-3 text-fin-peach shadow-lg">
            <AlertCircle size={20} />
            <span className="font-semibold text-sm">{overdueCount} pendentes atrasadas</span>
          </div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Atual"
          value={totalAccountsBalance}
          subtitle="Total nas Contas"
          icon={<Wallet size={20} className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />}
          color="surface"
          className="bg-fin-surface cursor-pointer hover:bg-zinc-900/5 dark:hover:bg-white/5"
          onClick={() => onNavigate && onNavigate('accounts')}
        />
        <StatCard
          title={`Previsão (${format(refDate, 'MMM', { locale: ptBR })})`}
          value={projectedBalance}
          subtitle="Projeção Fim do Mês"
          icon={<LineChartIcon size={20} className="text-[#a4bcf9]" />}
          color="surface"
          className="bg-fin-surface cursor-pointer hover:bg-zinc-900/5 dark:hover:bg-white/5"
          onClick={() => onNavigate && onNavigate('transactions', { type: 'all', month: format(refDate, 'yyyy-MM') })}
        />
        <StatCard
          title="Receita do Mês"
          value={mIncome}
          subtitle="Recebidas & Pendentes"
          icon={<ArrowUpRight size={24} className="text-fin-bg" />}
          color="mint"
          className="bg-fin-mint text-fin-bg cursor-pointer hover:brightness-110"
          onClick={() => onNavigate && onNavigate('transactions', { type: 'Income', month: format(refDate, 'yyyy-MM') })}
        />
        <StatCard
          title="Despesa do Mês"
          value={mExpense}
          subtitle="Pagas & Pendentes"
          icon={<ArrowDownLeft size={20} className="text-[#ff7b7b]" />}
          color="surface"
          className="cursor-pointer bg-fin-surface hover:bg-zinc-900/5 dark:hover:bg-white/5"
          onClick={() => onNavigate && onNavigate('transactions', { type: 'Expense', month: format(refDate, 'yyyy-MM') })}
        />
      </div>

      {/* Pending Section */}
      {(pendingIncome.length > 0 || pendingExpense.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingIncome.length > 0 && (
            <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
               <h3 className="text-lg font-bold text-fin-mint flex items-center gap-2 mb-4"><ArrowUpRight size={20} /> Receitas Pendentes</h3>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {pendingIncome.map(t => (
                    <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 transition-all hover:border-zinc-900/20 dark:hover:border-white/10">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-white">{t.description}</span>
                        <span className="text-xs text-zinc-500">{format(parseISO(t.date), 'dd MMM yyyy', { locale: ptBR })}</span>
                      </div>
                      <span className="font-bold text-fin-mint">R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                 ))}
               </div>
            </div>
          )}
          {pendingExpense.length > 0 && (
            <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
               <h3 className="text-lg font-bold text-[#ff7b7b] flex items-center gap-2 mb-4"><ArrowDownLeft size={20} /> Despesas Pendentes</h3>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {pendingExpense.map(t => (
                    <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 transition-all hover:border-zinc-900/20 dark:hover:border-white/10">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-white">{t.description}</span>
                        <span className="text-xs text-zinc-500">{format(parseISO(t.date), 'dd MMM yyyy', { locale: ptBR })}</span>
                      </div>
                      <span className="font-bold text-[#ff7b7b]">R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Receitas vs Despesas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthIncomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#ffffff0a' }}
                  contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                <Bar dataKey="income" fill={user?.theme_color || '#98e5dd'} radius={[4, 4, 0, 0]} name="Receitas" />
                <Bar dataKey="expenses" fill="#ff7b7b" radius={[4, 4, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Despesas por Categoria</h3>
          <div className="h-80">
            {monthExpensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthExpensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cursor="pointer"
                    onClick={(data) => onNavigate && onNavigate('transactions', { type: 'Expense', month: format(refDate, 'yyyy-MM'), category: data.name })}
                  >
                    {monthExpensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                <Filter size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Nenhuma despesa</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Receitas por Categoria</h3>
          <div className="h-80">
            {monthIncomeByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthIncomeByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cursor="pointer"
                    onClick={(data) => onNavigate && onNavigate('transactions', { type: 'Income', month: format(refDate, 'yyyy-MM'), category: data.name })}
                  >
                    {monthIncomeByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                <Filter size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Nenhuma receita</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Transactions & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-fin-surface rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-7 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Transações Recentes</h3>
            <button className="text-fin-mint font-semibold text-sm hover:text-zinc-900 dark:text-white transition-colors flex items-center gap-1">
              <Filter size={14} /> Filtrar
            </button>
          </div>
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto min-h-[300px]">
            {profileTransactions.slice(0, 5).map((t) => (
              <TransactionRow key={t.id} transaction={t} onEdit={onEdit} currentUser={user} isReadOnly={selectedProfile?.id !== user?.id} />
            ))}
          </div>
        </div>
        
        <div className="bg-fin-surface rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-7 border-b border-zinc-900/10 dark:border-white/5 flex flex-col gap-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Wallet size={20} className="text-fin-mint" /> Contas de {selectedProfile?.name}
            </h3>
            <p className="text-sm text-zinc-500 font-semibold mt-2">Saldo Global</p>
            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
               <span className="text-lg text-zinc-600 dark:text-zinc-500 mr-1 opacity-80">R$</span>
               {totalAccountsBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-5 flex-1 overflow-y-auto max-h-[350px] space-y-3 custom-scrollbar">
            {profileAccounts?.map(acc => (
              <div key={acc.id} className="p-4 bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 rounded-2xl flex items-center justify-between group hover:border-zinc-900/20 dark:hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fin-mint/10 rounded-xl flex items-center justify-center text-fin-mint">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">{acc.name}</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-500">{acc.type === 'Bank' ? 'Banco' : acc.type === 'Cash' ? 'Dinheiro' : 'Poupança'}</p>
                  </div>
                </div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">
                  R$ {(acc.current_balance !== undefined ? acc.current_balance : acc.initial_balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
            {(!accounts || accounts.length === 0) && (
              <div className="text-center py-8 text-zinc-500 text-sm">Nenhuma conta cadastrada.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}