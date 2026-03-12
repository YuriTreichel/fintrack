// Extraindo a função ReportsView do App.jsx
function ReportsView({ data, user, selectedProfile, transactions, categories }) {
  const [reportType, setReportType] = useState('monthly');
  const [refDate, setRefDate] = useState(new Date());

  const profileTransactions = useMemo(() => transactions.filter(t => t.user_id === selectedProfile?.id), [transactions, selectedProfile]);
  const profileCategories = useMemo(() => categories.filter(c => c.user_id === selectedProfile?.id), [categories, selectedProfile]);

  const incomeVsExpenses = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
    return last6Months.map(monthDate => {
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthTxs = profileTransactions.filter(t => t.date.startsWith(monthStr));
      return {
        month: format(monthDate, 'MMM yy', { locale: ptBR }),
        income: monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0),
        expenses: monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  }, [profileTransactions]);

  const expensesByCategory = useMemo(() => {
    const currentMonthStr = format(new Date(), 'yyyy-MM');
    const monthTxs = profileTransactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === 'Expense');
    const categoriesMap = profileCategories.reduce((acc, cat) => { acc[cat.id] = cat.name; return acc; }, {});
    
    const agg = monthTxs.reduce((acc, t) => {
      const name = categoriesMap[t.category_id] || 'Outros';
      acc[name] = (acc[name] || 0) + Number(t.amount);
      return acc;
    }, {});

    return Object.entries(agg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [profileTransactions, profileCategories]);

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Relatórios</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Análise detalhada do seu desempenho financeiro.</p>
      </header>

      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-fin-mint" />
            Fluxo de Caixa (Receitas vs Despesas)
          </h3>
        </div>
        <div className="h-96">
          {incomeVsExpenses && incomeVsExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'var(--border-color)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'var(--text-muted)', paddingTop: '20px' }} />
                <Bar dataKey="income" fill={user?.theme_color || '#98e5dd'} radius={[6, 6, 0, 0]} name="Receitas" />
                <Bar dataKey="expenses" fill="var(--peach)" radius={[6, 6, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <Filter size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhum fluxo de caixa para relatar</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
            <PieChart size={20} className="text-fin-peach" />
            Despesas por Categoria
          </h3>
          <div className="h-80">
            {expensesByCategory && expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                <Filter size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Nenhuma despesa para relatar</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-fin-mint/10 p-7 rounded-[24px] border border-fin-mint/20 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fin-mint/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
          <BarChart3 size={48} className="text-fin-mint mb-6 relative z-10" />
          <h3 className="text-2xl font-bold text-fin-mint mb-2 relative z-10">Mais relatórios em breve</h3>
          <p className="text-fin-mint/70 mb-8 max-w-sm relative z-10">Estamos preparando análises de evolução patrimonial e previsões via IA para as próximas atualizações.</p>
          <button className="bg-fin-mint text-fin-bg px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all relative z-10">
            Sugerir um Relatório
          </button>
        </div>
      </div>
    </div>
  );
}