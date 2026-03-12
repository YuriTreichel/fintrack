import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Wallet,
  CreditCard,
  Plus,
  Filter,
  Calendar,
  Tag,
  AlertCircle,
  MoreVertical,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Settings,
  BarChart3,
  User,
  LogOut,
  LineChart as LineChartIcon,
  ListTree,
  UserPlus,
  CornerDownLeft,
  ShoppingBag, Car, Home, Coffee, Utensils, Plane, Briefcase, Zap, Smartphone, Heart, Gift, Book, HelpCircle,
  ShoppingCart, Fuel, Bus, Bike, GraduationCap, Baby, PawPrint, Dumbbell, Music, Tv,
  Gamepad2, Scissors, Stethoscope, Pill, Building2, Landmark, HandCoins, PiggyBank,
  Banknote, Receipt, Shirt, Umbrella, Wrench, Paintbrush, Camera, TreePine, UtensilsCrossed,
  Wine, IceCream, Pizza, Salad, Droplets, Wifi, Globe, PartyPopper, Theater, Headphones,
  Church, Star,
  Menu, X
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { format, parseISO, isPast, isToday, endOfMonth, startOfWeek, startOfMonth, endOfWeek, isSameDay, isSameMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#98e5dd', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CATEGORY_ICONS = {
  // Finanças
  Wallet: <Wallet size={16} />,
  CreditCard: <CreditCard size={16} />,
  Banknote: <Banknote size={16} />,
  PiggyBank: <PiggyBank size={16} />,
  HandCoins: <HandCoins size={16} />,
  Receipt: <Receipt size={16} />,
  Landmark: <Landmark size={16} />,
  Building2: <Building2 size={16} />,
  // Compras & Varejo
  Tag: <Tag size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  ShoppingCart: <ShoppingCart size={16} />,
  Shirt: <Shirt size={16} />,
  // Transporte
  Car: <Car size={16} />,
  Fuel: <Fuel size={16} />,
  Bus: <Bus size={16} />,
  Bike: <Bike size={16} />,
  Plane: <Plane size={16} />,
  // Casa & Moradia
  Home: <Home size={16} />,
  Zap: <Zap size={16} />,
  Droplets: <Droplets size={16} />,
  Wifi: <Wifi size={16} />,
  Wrench: <Wrench size={16} />,
  Paintbrush: <Paintbrush size={16} />,
  Umbrella: <Umbrella size={16} />,
  // Alimentação
  Coffee: <Coffee size={16} />,
  Utensils: <Utensils size={16} />,
  UtensilsCrossed: <UtensilsCrossed size={16} />,
  Pizza: <Pizza size={16} />,
  Salad: <Salad size={16} />,
  Wine: <Wine size={16} />,
  IceCream: <IceCream size={16} />,
  // Trabalho & Educação
  Briefcase: <Briefcase size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  Book: <Book size={16} />,
  Globe: <Globe size={16} />,
  // Saúde & Bem-estar
  Heart: <Heart size={16} />,
  Stethoscope: <Stethoscope size={16} />,
  Pill: <Pill size={16} />,
  Dumbbell: <Dumbbell size={16} />,
  // Entretenimento & Lazer
  Tv: <Tv size={16} />,
  Gamepad2: <Gamepad2 size={16} />,
  Music: <Music size={16} />,
  Headphones: <Headphones size={16} />,
  Camera: <Camera size={16} />,
  Theater: <Theater size={16} />,
  PartyPopper: <PartyPopper size={16} />,
  // Família & Pessoal
  Baby: <Baby size={16} />,
  PawPrint: <PawPrint size={16} />,
  Gift: <Gift size={16} />,
  Scissors: <Scissors size={16} />,
  Church: <Church size={16} />,
  Star: <Star size={16} />,
  // Tecnologia
  Smartphone: <Smartphone size={16} />,
  TreePine: <TreePine size={16} />,
};

function CustomSelect({ value, onChange, options, placeholder = "Selecione...", className = "", triggerClassName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div 
        className={cn(
          "flex items-center justify-between cursor-pointer transition-all outline-none",
          triggerClassName || "w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-white/5 focus:ring-1 focus:ring-white/10"
        )}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span className={cn("truncate flex-1 text-left", !selectedOption && "text-zinc-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("text-zinc-500 transition-transform duration-200 ml-2 flex-shrink-0", isOpen ? "rotate-180" : "")} size={16} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-fin-surface border border-zinc-900/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {options.map((opt, idx) => (
              opt.isGroup ? (
                <div
                  key={`group-${idx}`}
                  className="px-3 pt-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none first:pt-1"
                >
                  {opt.label}
                </div>
              ) : (
              <div
                key={opt.value}
                className={cn(
                  "px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all truncate",
                  opt.indent && "pl-8",
                  String(value) === String(opt.value)
                    ? "bg-fin-mint/10 text-fin-mint" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
              )
            ))}
            {options.length === 0 && (
              <div className="px-4 py-2.5 text-sm text-zinc-500 text-center">Nenhuma opção</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomDatePicker({ value, onChange, placeholder = "Selecione...", className = "", label = "", triggerClassName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? parseISO(value) : new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDate = (date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const daysInMonth = () => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 0 });
    const days = [];
    let current = start;
    while (current <= end) {
      days.push(current);
      current = new Date(current.getTime() + 86400000);
    }
    return days;
  };

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const selectedDate = value ? parseISO(value) : null;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div 
        className={cn(
          "flex items-center gap-2 cursor-pointer outline-none group",
          triggerClassName
        )}
        onClick={() => {
          setIsOpen(!isOpen);
          if (value) setViewDate(parseISO(value));
        }}
        tabIndex={0}
      >
        <div className="flex flex-col flex-1">
          {label && <span className="text-[10px] font-bold text-zinc-500/50 uppercase tracking-tighter leading-none mb-0.5">{label}</span>}
          <span className={cn(
            "text-sm font-bold transition-colors",
            value ? "text-zinc-900 dark:text-white" : "text-zinc-500",
            isOpen && "text-fin-mint"
          )}>
            {value ? format(parseISO(value), 'dd/MM/yyyy') : placeholder}
          </span>
        </div>
        <Calendar size={16} className={cn("transition-colors", isOpen ? "text-fin-mint" : "text-zinc-500 group-hover:text-fin-mint")} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-4 bg-fin-surface border border-zinc-900/10 dark:border-white/10 rounded-[24px] shadow-2xl p-5 w-72 animate-in fade-in slide-in-from-top-2 duration-200 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-fin-mint"><ChevronLeft size={18}/></button>
            <span className="font-bold text-sm text-zinc-900 dark:text-white capitalize">
              {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-fin-mint"><ChevronRight size={18}/></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-[10px] font-bold text-zinc-500 text-center py-1 uppercase">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth().map((date, i) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, viewDate);
              const isTodayDate = isSameDay(date, new Date());
              
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center",
                    isSelected 
                      ? "bg-fin-mint text-fin-bg shadow-lg shadow-fin-mint/30 scale-110" 
                      : isCurrentMonth 
                        ? "text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-fin-mint" 
                        : "text-zinc-300 dark:text-zinc-600",
                    isTodayDate && !isSelected && "border border-fin-mint/30 text-fin-mint"
                  )}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-zinc-900/10 dark:border-white/5 flex justify-between">
            <button 
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="text-[10px] font-bold text-[#ff7b7b] uppercase tracking-wider hover:bg-[#ff7b7b]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Limpar
            </button>
            <button 
              type="button"
              onClick={() => handleSelectDate(new Date())}
              className="text-[10px] font-bold text-fin-mint uppercase tracking-wider hover:bg-fin-mint/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickEffectiveModal({ transaction, onClose, onSuccess, accounts, showToast }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    account_id: transaction.account_id || (accounts.length > 0 ? accounts[0].id : '')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...transaction,
          date: form.date,
          account_id: form.account_id,
          status: 'Paid'
        })
      });

      if (res.ok) {
        showToast(transaction.type === 'Income' ? "Recebido com sucesso!" : "Pago com sucesso!", "success");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.message || "Erro ao efetivar transação.", "error");
      }
    } catch (error) {
      showToast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-fin-bg border border-zinc-900/10 dark:border-white/5 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Efetivar {transaction.type === 'Income' ? 'Recebimento' : 'Pagamento'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors text-zinc-500">
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-zinc-900/5 dark:bg-white/5 p-4 rounded-2xl border border-zinc-900/10 dark:border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Transação</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{transaction.description}</p>
            <p className="text-xl font-bold text-fin-peach mt-1">R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Data do {transaction.type === 'Income' ? 'Recebimento' : 'Pagamento'}</label>
              <CustomDatePicker
                value={form.date}
                onChange={val => setForm({ ...form, date: val })}
                triggerClassName="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 focus:ring-1 focus:ring-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Conta</label>
              <CustomSelect
                value={form.account_id}
                onChange={val => setForm({ ...form, account_id: val })}
                options={accounts.map(a => ({ value: a.id, label: a.name }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900/10 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-fin-mint text-fin-bg px-6 py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-fin-mint/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-fin-bg/30 border-t-fin-bg rounded-full animate-spin"></div>
              ) : (
                <>Confirmar {transaction.type === 'Income' ? 'Recebimento' : 'Pagamento'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ShareModal({ user, following, onFollow, onUnfollow, onClose, authFetch, showToast }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.sharing_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Código copiado!');
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    try {
      const res = await authFetch('/api/share/follow', {
        method: 'POST',
        body: JSON.stringify({ sharing_code: code })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        setCode('');
        onFollow();
      } else {
        showToast(data.message || 'Erro ao seguir usuário', 'error');
      }
    } catch (error) {
      showToast('Erro de conexão', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-fin-bg border border-zinc-900/10 dark:border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Compartilhamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors">
            <Plus size={24} className="rotate-45 text-zinc-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* My Code */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Meu Código de Acesso</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 rounded-2xl px-5 py-4 font-mono font-bold text-lg tracking-wider text-fin-mint flex items-center justify-center">
                {user?.sharing_code || '------'}
              </div>
              <button 
                onClick={handleCopy}
                className="p-4 bg-fin-mint/10 text-fin-mint rounded-2xl hover:bg-fin-mint/20 transition-all border border-fin-mint/20"
              >
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              Compartilhe este código com outras pessoas para que elas possam visualizar seus dados financeiros.
            </p>
          </div>

          <div className="h-px bg-zinc-900/10 dark:bg-white/5" />

          {/* Follow User */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Seguir outro usuário</p>
            <form onSubmit={handleFollow} className="space-y-3">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Insira o código de 12 caracteres"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 rounded-2xl px-5 py-4 font-bold text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-fin-mint/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={loading || !code}
                  className="absolute right-2 top-2 bottom-2 bg-fin-mint text-fin-bg px-5 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Seguir'}
                </button>
              </div>
            </form>
          </div>

          {/* Following List */}
          {following.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Usuários que eu sigo</p>
              <div className="space-y-2">
                {following.map(follow => (
                  <div key={follow.id} className="flex items-center justify-between p-4 bg-zinc-900/10 dark:bg-white/5 rounded-2xl border border-zinc-900/10 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-fin-mint/20 text-fin-mint flex items-center justify-center font-bold text-xs">
                        {follow.name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">{follow.name}</span>
                    </div>
                    <button 
                      onClick={() => onUnfollow(follow.id)}
                      className="text-xs font-bold text-[#ff7b7b] hover:bg-[#ff7b7b]/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Parar de Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactionFilters, setTransactionFilters] = useState(null);
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bem-vindo!', message: 'Explore o seu novo painel financeiro.', type: 'system', date: new Date(), read: false },
    { id: 2, title: 'Atalho disponível', message: 'Dica: Aperte a tecla "F" para focar no campo de busca.', type: 'tip', date: new Date(), read: false },
  ]);

  const searchRef = useRef(null);
  const [searchIndex, setSearchIndex] = useState(0);

  const systemCommands = useMemo(() => [
    { id: 'dash', label: 'Ir para Dashboard', action: () => setActiveTab('dashboard'), icon: <LayoutDashboard size={16} />, keywords: 'inicio home painel' },
    { id: 'trans', label: 'Ir para Transações', action: () => setActiveTab('transactions'), icon: <ArrowRightLeft size={16} />, keywords: 'histórico extrato lançamentos' },
    { id: 'acc', label: 'Ir para Contas', action: () => setActiveTab('accounts'), icon: <Wallet size={16} />, keywords: 'bancos carteiras saldo' },
    { id: 'card', label: 'Ir para Cartões', action: () => setActiveTab('cards'), icon: <CreditCard size={16} />, keywords: 'crédito faturas' },
    { id: 'cat', label: 'Ir para Categorias', action: () => setActiveTab('categories'), icon: <ListTree size={16} />, keywords: 'grupos organização' },
    { id: 'rep', label: 'Ir para Relatórios', action: () => setActiveTab('reports'), icon: <BarChart3 size={16} />, keywords: 'gráficos análise estatísticas' },
    { id: 'sett', label: 'Ir para Configurações', action: () => setActiveTab('settings'), icon: <Settings size={16} />, keywords: 'perfil conta tema cores' },
    { id: 'new', label: 'Nova Transação', action: () => openTransactionModal(), icon: <Plus size={16} />, keywords: 'adicionar cadastrar receita despesa' },
    { id: 'share', label: 'Compartilhar Dados', action: () => setIsShareModalOpen(true), icon: <UserPlus size={16} />, keywords: 'convidar código esposa marido' },
  ], []);

  const filteredCommands = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return systemCommands.filter(c => 
      c.label.toLowerCase().includes(term) || 
      c.keywords.toLowerCase().includes(term)
    );
  }, [searchTerm, systemCommands]);

  useEffect(() => {
    setSearchIndex(0);
  }, [searchTerm]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const openTransactionModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  // Authenticated fetch helper
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }

    return response;
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchData(true);
    } else {
      setLoading(false);
      setSelectedProfile(null);
    }
  }, [token]);

  useEffect(() => {
    if (user && !selectedProfile) {
      setSelectedProfile(user);
    }
  }, [user]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Keyboard shortcut for search (F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'f' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inject custom theme color
  useEffect(() => {
    if (user?.theme_color) {
      document.documentElement.style.setProperty('--mint', user.theme_color);
    } else {
      document.documentElement.style.removeProperty('--mint');
    }
  }, [user?.theme_color]);

  // Automatic Transaction Notifications (Overdue & Today)
  useEffect(() => {
    if (!transactions.length || !user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setNotifications(prev => {
      const currentNotifIds = new Set(prev.map(n => n.id));
      const newNotifs = [];

      transactions.forEach(t => {
        if (t.status !== 'Pending') return;

        const tDate = parseISO(t.date);
        tDate.setHours(0, 0, 0, 0);

        const isOverdue = tDate < today;
        const isDueToday = tDate.getTime() === today.getTime();

        if (isOverdue || isDueToday) {
          const notifId = `notif-trans-${t.id}-${isOverdue ? 'overdue' : 'today'}`;
          if (!currentNotifIds.has(notifId)) {
            newNotifs.push({
              id: notifId,
              title: isOverdue ? '⚠️ Transação Atrasada' : '📅 Vence Hoje',
              message: `${t.type === 'Income' ? 'Receita' : 'Despesa'}: ${t.description} - R$ ${Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              type: isOverdue ? 'warning' : 'info',
              date: new Date(),
              read: false
            });
            currentNotifIds.add(notifId);
          }
        }
      });

      if (newNotifs.length === 0) return prev;
      // Filter out old notifications for the same transaction to only keep the latest status
      const filteredPrev = prev.filter(n => {
        if (!n.id?.toString().startsWith('notif-trans-')) return true;
        const transId = n.id.split('-')[2];
        return !newNotifs.some(nn => nn.id.split('-')[2] === transId);
      });

      return [...newNotifs, ...filteredPrev];
    });
  }, [transactions, user]);

  const fetchUser = async () => {
    try {
      const res = await authFetch('/api/me');
      if (res.ok) {
        setUser(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch user");
    }
  };

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const dashRes = await authFetch('/api/dashboard');
      if (!dashRes.ok) throw new Error('Falha no dashboard');
      const dash = await dashRes.json();

      const transRes = await authFetch('/api/transactions');
      if (!transRes.ok) throw new Error('Falha nas transactions');
      const trans = await transRes.json();

      const accRes = await authFetch('/api/accounts');
      if (!accRes.ok) throw new Error('Falha nas accounts');
      const acc = await accRes.json();

      const catRes = await authFetch('/api/categories');
      if (!catRes.ok) throw new Error('Falha nas categories');
      const cat = await catRes.json();

      const cardRes = await authFetch('/api/cards');
      if (!cardRes.ok) throw new Error('Falha nos cards');
      const card = await cardRes.json();

      const followRes = await authFetch('/api/share/following');
      if (followRes.ok) setFollowing(await followRes.json());

      setData(dash);
      setTransactions(trans);
      setAccounts(acc);
      setCategories(cat);
      setCards(card);
    } catch (error) {
      console.error("Falha ao buscar dados", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const res = await authFetch(`/api/share/unfollow/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Parou de seguir!');
        fetchData();
      } else {
        showToast('Erro ao parar de seguir', 'error');
      }
    } catch (error) {
      showToast('Erro de conexão', 'error');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 dark:bg-[#111313] z-[999] overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fin-mint/20 dark:bg-fin-mint/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fin-peach/20 dark:bg-fin-peach/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="flex flex-col items-center relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-[28px] border-2 border-transparent border-t-fin-mint border-r-fin-peach opacity-50 animate-spin" style={{ animationDuration: '3s' }}></div>
            {/* Inner pulsing logo */}
            <div className="w-20 h-20 bg-fin-surface rounded-[24px] shadow-2xl flex items-center justify-center border border-zinc-900/10 dark:border-white/5 animate-pulse-glow">
              <Wallet size={36} className="text-fin-mint" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">FinTrack<span className="text-zinc-400 dark:text-zinc-600">.</span></h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-fin-mint rounded-full animate-ping"></span>
            Sincronizando dados...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <AuthScreen setToken={(t) => {
      localStorage.setItem('token', t);
      setToken(t);
    }} />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 p-4">
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-zinc-800">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-zinc-100">Sem Dados</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">Não foi possível carregar os dados financeiros.</p>
          <button
            onClick={fetchData}
            className="w-full bg-fin-mint text-fin-bg font-bold py-4 rounded-2xl hover:brightness-110 transition-colors shadow-lg shadow-fin-mint/30"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const isReadOnly = selectedProfile && user && selectedProfile.id !== user.id;

  return (
    <div className="min-h-screen bg-fin-bg text-zinc-100 font-sans flex font-['Inter'] overflow-x-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-fin-bg border-r border-zinc-900/10 dark:border-white/5 z-20 hidden md:flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isSidebarCollapsed ? "w-20" : "w-[260px]"
      )}>
        <div className={cn("p-8 flex items-center gap-3", isSidebarCollapsed && "justify-center p-6")}>
          <div className="w-8 h-8 rounded-lg bg-fin-mint/10 flex flex-shrink-0 items-center justify-center text-fin-mint">
            <Wallet size={18} fill="currentColor" strokeWidth={0} />
          </div>
          {!isSidebarCollapsed && <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic transition-opacity duration-200">FinTrack<span className="text-zinc-400 dark:text-zinc-600">.</span></h1>}
        </div>

        <div className={cn(
          "px-8 mt-2 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200", 
          isSidebarCollapsed && "opacity-0 h-0 my-0 overflow-hidden"
        )}>Menu Principal</div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Wallet size={20} />}
            label="Contas"
            active={activeTab === 'accounts'}
            onClick={() => setActiveTab('accounts')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<ArrowRightLeft size={20} />}
            label="Transações"
            active={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<CreditCard size={20} />}
            label="Cartões de Crédito"
            active={activeTab === 'cards'}
            onClick={() => setActiveTab('cards')}
            collapsed={isSidebarCollapsed}
          />
          <div className={cn(
            "px-4 pt-6 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200",
            isSidebarCollapsed && "opacity-0 h-0 pt-0 pb-0 overflow-hidden"
          )}>Desempenho & Ajustes</div>
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Relatórios"
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Tag size={20} />}
            label="Categorias"
            active={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Configurações"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Compartilhar"
            active={isShareModalOpen}
            onClick={() => setIsShareModalOpen(true)}
            collapsed={isSidebarCollapsed}
          />

          <div className={cn(
            "px-8 pt-6 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200",
            isSidebarCollapsed && "opacity-0 h-0 pt-0 pb-0 overflow-hidden"
          )}>Perfis</div>
          <NavItem
            icon={<User size={20} />}
            label="Meu Painel"
            active={selectedProfile?.id === user?.id}
            onClick={() => setSelectedProfile(user)}
            collapsed={isSidebarCollapsed}
            variant="profile"
          />
          {following.map(follow => (
            <NavItem
              key={follow.id}
              icon={<div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors", selectedProfile?.id === follow.id ? "bg-fin-mint text-fin-bg" : "bg-fin-mint/20 text-fin-mint")}>{follow.name.charAt(0)}</div>}
              label={follow.name}
              active={selectedProfile?.id === follow.id}
              onClick={() => setSelectedProfile(follow)}
              collapsed={isSidebarCollapsed}
              variant="profile"
            />
          ))}
        </nav>

        <div className={cn("p-6 mt-auto border-t border-zinc-900/10 dark:border-white/5", isSidebarCollapsed && "p-4")}>
          <div className={cn("flex items-center gap-3", isSidebarCollapsed ? "justify-center" : "px-2")}>
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex flex-shrink-0 items-center justify-center font-bold text-fin-mint border-2 border-zinc-700">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 transition-opacity duration-200 flex items-center justify-between">
                <p className="font-semibold text-sm truncate text-zinc-900 dark:text-white mr-2">{user?.name || 'Usuário'}</p>
                <button
                  onClick={() => {
                    setToken(null);
                    setUser(null);
                    localStorage.setItem('token', '');
                  }}
                  title="Sair"
                  className="p-1.5 text-zinc-500 hover:text-[#ff7b7b] hover:bg-[#ff7b7b]/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-50 shadow-md"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-fin-bg z-[101] md:hidden flex flex-col shadow-2xl border-r border-zinc-900/10 dark:border-white/5"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fin-mint/10 flex items-center justify-center text-fin-mint">
                    <Wallet size={18} fill="currentColor" strokeWidth={0} />
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">FinTrack<span className="text-zinc-400 dark:text-zinc-600">.</span></h1>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-zinc-900/10 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Navegação</div>
                <NavItem
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  active={activeTab === 'dashboard'}
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<Wallet size={20} />}
                  label="Contas"
                  active={activeTab === 'accounts'}
                  onClick={() => { setActiveTab('accounts'); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<ArrowRightLeft size={20} />}
                  label="Transações"
                  active={activeTab === 'transactions'}
                  onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<CreditCard size={20} />}
                  label="Cartões"
                  active={activeTab === 'cards'}
                  onClick={() => { setActiveTab('cards'); setIsMobileMenuOpen(false); }}
                />
                
                <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recursos</div>
                <NavItem
                  icon={<BarChart3 size={20} />}
                  label="Relatórios"
                  active={activeTab === 'reports'}
                  onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<Tag size={20} />}
                  label="Categorias"
                  active={activeTab === 'categories'}
                  onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<Users size={20} />}
                  label="Compartilhar"
                  active={isShareModalOpen}
                  onClick={() => { setIsShareModalOpen(true); setIsMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<Settings size={20} />}
                  label="Configurações"
                  active={activeTab === 'settings'}
                  onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                />

                <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Perfis</div>
                <NavItem
                  icon={<User size={20} />}
                  label="Meu Painel"
                  active={selectedProfile?.id === user?.id}
                  onClick={() => { setSelectedProfile(user); setIsMobileMenuOpen(false); }}
                  variant="profile"
                />
                {following.map(follow => (
                  <NavItem
                    key={follow.id}
                    icon={<div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors", selectedProfile?.id === follow.id ? "bg-fin-mint text-fin-bg" : "bg-fin-mint/20 text-fin-mint")}>{follow.name.charAt(0)}</div>}
                    label={follow.name}
                    active={selectedProfile?.id === follow.id}
                    onClick={() => { setSelectedProfile(follow); setIsMobileMenuOpen(false); }}
                    variant="profile"
                  />
                ))}
              </div>

              <div className="p-6 border-t border-zinc-900/10 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex flex-shrink-0 items-center justify-center font-bold text-fin-mint border-2 border-zinc-700">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-zinc-900 dark:text-white">{user?.name || 'Usuário'}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToken(null);
                    setUser(null);
                    localStorage.setItem('token', '');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff7b7b]/10 text-[#ff7b7b] rounded-2xl font-bold text-sm border border-[#ff7b7b]/20 hover:bg-[#ff7b7b]/20 transition-all"
                >
                  <LogOut size={16} />
                  Sair do Sistema
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 p-4 md:p-10 pb-24 md:pb-10 min-w-0 max-w-[1400px] mx-auto transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-[260px]"
      )}>
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between mb-6">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors min-h-[44px] text-zinc-900 dark:text-white"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic">FinTrack</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </header>
        <header className="hidden md:flex items-center justify-between mb-10">
          <div className="flex-1 max-w-md relative group">
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (filteredCommands.length > 0) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSearchIndex(prev => (prev + 1) % filteredCommands.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSearchIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      filteredCommands[searchIndex].action();
                      setSearchTerm('');
                    } else if (e.key === 'Escape') {
                      setSearchTerm('');
                    }
                  }
                }}
                placeholder="Pesquisar ou digitar comando"
                className="w-full bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-2xl py-3 pl-12 pr-12 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-fin-mint/30 dark:focus:border-fin-mint/20 focus:ring-4 focus:ring-fin-mint/5 transition-all group-hover:bg-zinc-100 dark:group-hover:bg-white/[0.04]"
              />
              <LayoutDashboard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-500" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/10 dark:bg-white/5 rounded-md px-2 py-1 flex items-center border border-zinc-900/10 dark:border-white/5">
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-500">F</span>
              </div>
            </div>

            {filteredCommands.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-zinc-900/10 dark:border-white/5 bg-zinc-200/30 dark:bg-black/10">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-3">Comandos Sugeridos</span>
                </div>
                <div className="p-2">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setSearchTerm('');
                      }}
                      onMouseEnter={() => setSearchIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left",
                        idx === searchIndex 
                          ? "bg-fin-mint text-fin-bg" 
                          : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        idx === searchIndex ? "bg-fin-bg/10 text-fin-bg" : "bg-fin-mint/10 text-fin-mint"
                      )}>
                        {cmd.icon}
                      </div>
                      <span className="font-bold text-sm flex-1">{cmd.label}</span>
                      {idx === searchIndex && (
                        <div className="flex items-center gap-1 bg-fin-bg/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          <CornerDownLeft size={10} /> ENTER
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 ml-8 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "relative p-2.5 rounded-full transition-all border",
                isNotificationsOpen 
                  ? "bg-fin-mint text-fin-bg border-fin-mint" 
                  : "bg-fin-surface text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-900/10 dark:border-white/5 hover:bg-zinc-900/5 dark:hover:bg-white/5"
              )}
            >
              <AlertCircle size={20} />
              {notifications.some(n => !n.read) && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-fin-peach rounded-full border-2 border-fin-surface"></div>
              )}
            </button>

            {isNotificationsOpen && (
              <NotificationPopover 
                notifications={notifications} 
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAsRead={(id) => {
                  setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                }}
              />
            )}

            {!isReadOnly && (
              <button
                onClick={() => openTransactionModal()}
                className="bg-fin-mint text-fin-bg px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <Plus size={16} strokeWidth={3} />
                Novo
              </button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard data={data} transactions={transactions} accounts={accounts} categories={categories} user={user} onEdit={openTransactionModal} onNavigate={(tab, filters) => { setActiveTab(tab); setTransactionFilters(filters); }} selectedProfile={selectedProfile} searchTerm={searchTerm} />}
        {activeTab === 'transactions' && <TransactionsView transactions={transactions} setTransactions={setTransactions} fetchData={fetchData} onEdit={openTransactionModal} showToast={showToast} showConfirm={showConfirm} initialFilters={transactionFilters} categories={categories} accounts={accounts} user={user} selectedProfile={selectedProfile} isReadOnly={isReadOnly} searchTerm={searchTerm} />}
        {activeTab === 'accounts' && <AccountsView accounts={accounts} setAccounts={setAccounts} fetchData={fetchData} showToast={showToast} showConfirm={showConfirm} selectedProfile={selectedProfile} isReadOnly={isReadOnly} searchTerm={searchTerm} />}
        {activeTab === 'cards' && <CardsView cards={cards} setCards={setCards} accounts={accounts} fetchData={fetchData} showToast={showToast} showConfirm={showConfirm} selectedProfile={selectedProfile} isReadOnly={isReadOnly} searchTerm={searchTerm} />}
        {activeTab === 'categories' && <CategoriesView categories={categories} setCategories={setCategories} fetchData={fetchData} showToast={showToast} showConfirm={showConfirm} selectedProfile={selectedProfile} isReadOnly={isReadOnly} searchTerm={searchTerm} />}
        {activeTab === 'reports' && <ReportsView data={data} user={user} selectedProfile={selectedProfile} transactions={transactions} categories={categories} accounts={accounts} cards={cards} />}
        {activeTab === 'settings' && <SettingsView theme={theme} setTheme={setTheme} user={user} setToken={setToken} setUser={setUser} authFetch={authFetch} showToast={showToast} />}
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-fin-surface border-t border-zinc-900/10 dark:border-white/5 p-3 flex justify-around md:hidden z-30 pb-safe">
        <MobileNavItem icon={<LayoutDashboard size={24} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={<ArrowRightLeft size={24} />} active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <button
          onClick={() => openTransactionModal()}
          className="w-14 h-14 bg-fin-mint rounded-full flex items-center justify-center text-fin-bg -mt-8 shadow-2xl shadow-fin-mint/20 border-4 border-fin-bg"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
        <MobileNavItem icon={<CreditCard size={24} />} active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
        <MobileNavItem icon={<Settings size={24} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* Modals */}
      {isTransactionModalOpen && (
        <TransactionModal
          onClose={closeTransactionModal}
          onSuccess={() => fetchData()}
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setTransactions(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
            } else {
              setTransactions(prev => [{ ...data, id: Date.now() }, ...prev]);
            }
          }}
          accounts={accounts}
          categories={categories}
          cards={cards}
          initialData={editingTransaction}
        />
      )}

      <ConfirmModal 
        isOpen={confirmDialog.isOpen} 
        title={confirmDialog.title} 
        message={confirmDialog.message} 
        onConfirm={() => {
          if (confirmDialog.onConfirm) confirmDialog.onConfirm();
          closeConfirm();
        }} 
        onClose={closeConfirm} 
      />

      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100] border",
          toast.type === 'success' 
            ? "bg-fin-mint text-fin-bg border-fin-mint/30 shadow-fin-mint/20" 
            : "bg-[#ff7b7b] text-fin-bg border-[#ff7b7b]/30 shadow-[#ff7b7b]/20"
        )}>
          {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
      )}

      {isShareModalOpen && (
        <ShareModal 
          user={user} 
          following={following} 
          onFollow={() => fetchData()} 
          onUnfollow={handleUnfollow}
          onClose={() => setIsShareModalOpen(false)}
          authFetch={authFetch}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed, variant = 'nav' }) {
  const isProfile = variant === 'profile';
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "w-full flex items-center gap-3 py-3 rounded-2xl font-semibold transition-all duration-200 group relative",
        collapsed ? "justify-center px-0" : "px-4",
        active
          ? isProfile
            ? "bg-zinc-900/5 dark:bg-white/5 text-zinc-900 dark:text-white"
            : "bg-fin-mint text-fin-bg"
          : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-900/10 dark:hover:bg-white/5"
      )}
    >
      <div className={cn(
        "flex items-center justify-center min-w-[20px] transition-transform duration-200",
        active 
          ? isProfile ? "text-fin-mint" : "text-fin-bg" 
          : "text-zinc-600 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200",
        collapsed && !active && "group-hover:scale-110"
      )}>
        {icon}
      </div>
      {!collapsed && (
        <span className={cn(
          "transition-opacity duration-200 text-left flex-1 whitespace-nowrap overflow-hidden text-ellipsis",
          active && isProfile && "text-fin-mint"
        )}>
          {label}
        </span>
      )}
      {active && isProfile && !collapsed && (
        <div className="w-1.5 h-1.5 rounded-full bg-fin-mint absolute right-4 animate-in fade-in zoom-in duration-300"></div>
      )}
    </button>
  );
}

function NotificationPopover({ notifications, onClose, onMarkAsRead }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-5 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
        <h3 className="font-bold text-zinc-900 dark:text-white">Notificações</h3>
        <span className="text-[10px] font-bold bg-fin-mint/20 text-fin-mint px-2 py-0.5 rounded-full">
          {notifications.filter(n => !n.read).length} Novas
        </span>
      </div>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900/5 dark:divide-white/5">
            {notifications.map(n => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer relative group",
                  !n.read && "bg-fin-mint/5"
                )}
                onClick={() => onMarkAsRead(n.id)}
              >
                {!n.read && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fin-mint rounded-full"></div>}
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight pr-4">{n.title}</h4>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">{format(n.date, 'HH:mm', { locale: ptBR })}</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{n.message}</p>
                {n.type === 'tip' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-fin-mint uppercase tracking-wider">
                    <Star size={10} fill="currentColor" /> Dica do Sistema
                  </div>
                )}
                {n.type === 'warning' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#ff7b7b] uppercase tracking-wider">
                    <AlertCircle size={10} fill="currentColor" /> Urgente
                  </div>
                )}
                {n.type === 'info' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-fin-mint uppercase tracking-wider">
                    <Calendar size={10} fill="currentColor" /> Lembrete
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 bg-zinc-200/30 dark:bg-black/10 text-center">
        <button className="text-[11px] font-bold text-zinc-500 hover:text-fin-mint transition-colors uppercase tracking-widest">
          Ver todas as notificações
        </button>
      </div>
    </div>
  );
}


function MobileNavItem({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all duration-300",
        active ? "bg-fin-mint/10 text-fin-mint" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      )}
    >
      {icon}
    </button>
  );
}

function Dashboard({ data, transactions, accounts, categories, user, onEdit, onNavigate, selectedProfile, searchTerm }) {
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

function StatCard({ title, value, subtitle, icon, color, className, onClick }) {
  const numericValue = Number(value) || 0;
  const isMint = color === 'mint';

  return (
    <div 
      onClick={onClick}
      className={cn("p-7 rounded-[24px] border shadow-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-fin-mint/10",
      className || "bg-fin-surface border-zinc-900/10 dark:border-white/5 hover:border-zinc-900/20 dark:hover:border-white/10"
    )}>
      {isMint && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-900/10 dark:bg-white/20 blur-3xl rounded-full -mt-10 -mr-10 group-hover:blur-[50px] transition-all"></div>
      )}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h4 className={cn("font-medium text-sm transition-colors", isMint ? "text-fin-bg/70" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300")}>{title}</h4>
        <div className={cn("p-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", {
          "bg-fin-bg/10": isMint,
          "bg-zinc-900/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-900/20 dark:group-hover:bg-white/10": !isMint
        })}>
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <span className={cn("text-[32px] font-bold tracking-tight", isMint ? "text-fin-bg" : "text-zinc-900 dark:text-white")}>
          <span className={cn("text-xl mr-1 opacity-80", isMint ? "text-fin-bg/80" : "text-zinc-600 dark:text-zinc-500")}>R$</span>
          {numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <p className={cn("text-xs mt-3 flex items-center gap-2", isMint ? "text-fin-bg/70" : "text-zinc-600 dark:text-zinc-500")}>
        <span className={cn("w-2 h-2 rounded-full", isMint ? "bg-fin-bg/30" : "bg-zinc-700")}></span>
        {subtitle}
      </p>
    </div>
  );
}

function TransactionRow({ transaction, onDelete, onEdit, onQuickEffective, currentUser, isReadOnly }) {
  const isIncome = transaction.type === 'Income';
  const isTransfer = transaction.type === 'Transfer';
  const isPending = transaction.status === 'Pending';
  const isOverdue = isPending && isPast(parseISO(transaction.date)) && !isToday(parseISO(transaction.date));
  const isShared = currentUser && transaction.user_id !== currentUser.id;

  return (
    <div className="p-5 flex items-center hover:bg-zinc-900/10 dark:hover:bg-white/[0.03] transition-colors group gap-4">
      <div className={cn(
        "w-12 h-12 rounded-[16px] flex items-center justify-center border border-zinc-900/10 dark:border-white/5 flex-shrink-0",
        isIncome ? "bg-fin-mint/10 text-fin-mint" :
          isTransfer ? "bg-zinc-900/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-300" : "bg-transparent text-zinc-900 dark:text-white"
      )}>
        {isIncome ? <ArrowDownLeft size={20} /> :
          isTransfer ? <ArrowRightLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{transaction.description}</p>
          {transaction.is_fixed ? (
            <span className="text-[10px] bg-fin-mint/10 text-fin-mint px-1.5 py-0.5 rounded border border-fin-mint/20 font-bold uppercase flex-shrink-0">
              Fixo
            </span>
          ) : transaction.installment_number && (
            <span className="text-[10px] bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-900/10 dark:border-white/5 font-bold uppercase flex-shrink-0">
              {transaction.installment_number}/{transaction.total_installments}
            </span>
          )}
          {isShared && (
            <span className="text-[10px] bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-900/10 dark:border-white/5 font-bold uppercase flex-shrink-0">
              {transaction.owner_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
          <span>{format(parseISO(transaction.date), 'dd MMM yyyy', { locale: ptBR })}</span>
          <span>•</span>
          <span className="text-zinc-500 dark:text-zinc-400 truncate">{transaction.category_name || 'Sem Categoria'}</span>
          {transaction.card_id && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 flex-shrink-0"><CreditCard size={10} /> Cartão</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right min-w-[100px] flex-shrink-0 mr-2">
        <p className={cn(
          "font-bold text-sm tabular-nums text-zinc-900 dark:text-white"
        )}>
          {isIncome ? '+' : '-'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          {isPending ? (
            <button
              onClick={() => onQuickEffective(transaction)}
              className={cn(
                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md hover:scale-105 transition-all",
                isOverdue ? "bg-[#ff7b7b]/10 text-[#ff7b7b]" : "bg-fin-peach/10 text-fin-peach hover:bg-fin-peach/20"
              )}
              title="Efetivar agora"
            >
              <CheckCircle2 size={12} />
              {isOverdue ? 'Atraso' : 'Pendente'}
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

function TransactionsView({ transactions, setTransactions, fetchData, onEdit, showToast, showConfirm, initialFilters, categories, accounts, user, selectedProfile, isReadOnly, searchTerm }) {
const profileTransactions = useMemo(() => 
  transactions.filter(t => t.user_id === selectedProfile?.id && !t.ignore_in_reports), 
  [transactions, selectedProfile]
);
  const profileAccounts = useMemo(() => accounts.filter(a => a.user_id === selectedProfile?.id), [accounts, selectedProfile]);

  const [filter, setFilter] = useState({ 
    status: initialFilters?.status || 'all', 
    type: initialFilters?.type || 'all',
    month: initialFilters?.month || format(new Date(), 'yyyy-MM'),
    category: initialFilters?.category || 'all',
    account: 'all',
    dateStart: '',
    dateEnd: '',
    sortOrder: 'desc'
  });

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [quickEffectiveTransaction, setQuickEffectiveTransaction] = useState(null);
  const [pickerYear, setPickerYear] = useState(() => {
    return initialFilters?.month && initialFilters.month !== 'all' 
      ? parseInt(initialFilters.month.split('-')[0]) 
      : new Date().getFullYear();
  });

  const getFilterDate = useCallback(() => {
    if (!filter.month || filter.month === 'all') return new Date();
    return parseISO(`${filter.month}-01`);
  }, [filter.month]);

  const handlePrevMonth = useCallback(() => {
    const d = getFilterDate();
    d.setMonth(d.getMonth() - 1);
    setFilter(prev => ({ ...prev, month: format(d, 'yyyy-MM') }));
  }, [getFilterDate]);

  const handleNextMonth = useCallback(() => {
    const d = getFilterDate();
    d.setMonth(d.getMonth() + 1);
    setFilter(prev => ({ ...prev, month: format(d, 'yyyy-MM') }));
  }, [getFilterDate]);

  const hasActiveFilters = filter.status !== 'all' || filter.category !== 'all' || filter.account !== 'all' || filter.dateStart || filter.dateEnd;
  
  const [showProjectedBalance, setShowProjectedBalance] = useState(() => {
    const saved = localStorage.getItem('fin_show_projected_balance');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('fin_show_projected_balance', JSON.stringify(showProjectedBalance));
  }, [showProjectedBalance]);

  const activeFiltersCount = useMemo(() => [
    filter.status !== 'all',
    filter.category !== 'all',
    filter.account !== 'all',
    filter.dateStart,
    filter.dateEnd,
    filter.month !== format(new Date(), 'yyyy-MM') && filter.month !== 'all'
  ].filter(Boolean).length, [filter.status, filter.category, filter.account, filter.dateStart, filter.dateEnd, filter.month]);

  // Performance optimized filtering and balance calculation
  const { filtered, sortedDates, groupedTransactions } = useMemo(() => {
    const filteredList = profileTransactions.filter(t => {
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      if (filter.type !== 'all' && t.type !== filter.type) return false;
      if (filter.dateStart || filter.dateEnd) {
        if (filter.dateStart && t.date < filter.dateStart) return false;
        if (filter.dateEnd && t.date > filter.dateEnd) return false;
      } else {
        if (filter.month !== 'all' && !t.date.startsWith(filter.month)) return false;
      }
      if (filter.category !== 'all' && t.category_name !== filter.category) return false;
      if (filter.account !== 'all' && String(t.account_id) !== String(filter.account)) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesDescription = t.description.toLowerCase().includes(term);
        const matchesCategory = t.category_name?.toLowerCase().includes(term);
        const matchesAmount = String(t.amount).includes(term);
        const matchesAccount = t.account_name?.toLowerCase().includes(term);
        if (!matchesDescription && !matchesCategory && !matchesAmount && !matchesAccount) return false;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filter.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const baseInitialBalance = profileAccounts ? profileAccounts.reduce((acc, a) => acc + parseFloat(a.initial_balance || 0), 0) : 0;
    
    // Efficient single-pass ledger balance calculation
    const dailyNet = {};
    const datesSet = new Set();
    
    profileTransactions.forEach(t => {
      const d = t.date;
      datesSet.add(d);
      if (t.type === 'Transfer') return;
      const val = Number(t.amount) * (t.type === 'Income' ? 1 : -1);
      dailyNet[d] = (dailyNet[d] || 0) + val;
    });

    const allSortedDates = Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
    
    // Ledger logic: Balance(D) = Initial Balance + Sum of all transactions (<=D)
    let runningTotal = baseInitialBalance;
    const cumulativeBalances = {};
    
    allSortedDates.forEach(date => {
      runningTotal += (dailyNet[date] || 0);
      cumulativeBalances[date] = runningTotal;
    });

    const grouped = filteredList.reduce((groups, t) => {
      const date = t.date;
      if (!groups[date]) {
        groups[date] = { transactions: [], balance: cumulativeBalances[date] || 0 };
      }
      groups[date].transactions.push(t);
      return groups;
    }, {});

    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      return filter.sortOrder === 'desc' ? new Date(b) - new Date(a) : new Date(a) - new Date(b);
    });

    return { filtered: filteredList, sortedDates: sortedGroups, groupedTransactions: grouped };
  }, [profileTransactions, filter, profileAccounts]);

  const handleDelete = (transaction) => {
    let mode = 'only';
    let message = "Tem certeza que deseja excluir esta transação?";
    let title = "Excluir Transação";

    if (transaction.total_installments) {
      mode = 'all';
      message = "Esta é uma transação parcelada. Isso excluirá todas as parcelas. Deseja continuar?";
    }

    showConfirm(title, message, async () => {
      // Optimistic update
      const previousState = [...transactions];
      if (mode === 'all') {
        setTransactions(prev => prev.filter(t => t.parent_id !== transaction.parent_id && t.id !== transaction.id));
      } else {
        setTransactions(prev => prev.filter(t => t.id !== transaction.id));
      }

      try {
        const res = await fetch(`/api/transactions/${transaction.id}?mode=${mode}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
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
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Transações</h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Navigation - Back to primary row */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-zinc-900/10 dark:bg-white/5 rounded-full p-1 border border-zinc-900/10 dark:border-white/5 relative z-10 transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
              <button onClick={handlePrevMonth} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"><ChevronLeft size={20} /></button>
              
              <button 
                onClick={() => {
                  setPickerYear(getFilterDate().getFullYear());
                  setIsMonthPickerOpen(!isMonthPickerOpen);
                }}
                className="text-sm font-bold min-w-[140px] text-center capitalize hover:text-fin-mint transition-colors py-2 px-3 rounded-xl hover:bg-zinc-900/5 dark:hover:bg-white/5"
              >
                {filter.month !== 'all' ? format(getFilterDate(), 'MMMM yyyy', { locale: ptBR }) : 'Todos os Meses'}
              </button>

              <button onClick={handleNextMonth} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"><ChevronRight size={20} /></button>

              {filter.month !== 'all' && (
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
              )}
              {filter.month !== 'all' && (
                <button 
                  onClick={() => setFilter({ ...filter, month: 'all' })}
                  className="p-2 text-[#ff7b7b] hover:bg-[#ff7b7b]/10 rounded-full transition-all mr-1"
                  title="Limpar Mês"
                >
                  <Trash2 size={16} />
                </button>
              )}
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
                      const isSelected = filter.month === format(m, 'yyyy-MM');
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setFilter({ ...filter, month: format(m, 'yyyy-MM') });
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

          <CustomSelect
            value={filter.type}
            onChange={(val) => setFilter({ ...filter, type: val, category: 'all' })}
            options={[
              { value: 'all', label: 'Todos os Tipos' },
              { value: 'Income', label: 'Receita' },
              { value: 'Expense', label: 'Despesa' },
              { value: 'Transfer', label: 'Transferência' }
            ]}
            triggerClassName="bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/20 dark:hover:bg-white/10 min-w-[170px]"
          />
          <CustomSelect
            value={filter.sortOrder}
            onChange={(val) => setFilter({ ...filter, sortOrder: val })}
            options={[
              { value: 'desc', label: 'Ordem Decrescente' },
              { value: 'asc', label: 'Ordem Crescente' }
            ]}
            triggerClassName="bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/20 dark:hover:bg-white/10 min-w-[170px]"
          />
          <button
            onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border",
              isMoreFiltersOpen || activeFiltersCount > 0
                ? "bg-fin-mint/10 border-fin-mint/30 text-fin-mint"
                : "bg-zinc-900/10 dark:bg-white/5 border-zinc-900/10 dark:border-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/20 dark:hover:bg-white/10"
            )}
          >
            <Filter size={18} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-fin-mint text-fin-bg text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown size={16} className={cn("transition-transform duration-300", isMoreFiltersOpen && "rotate-180")} />
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
                { value: 'all', label: 'Todos os Status' },
                { value: 'Paid', label: filter.type === 'Income' ? 'Recebido' : 'Pago' },
                { value: 'Pending', label: 'Pendente' }
              ]}
              triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[170px]"
            />

            {categories && (
              <CustomSelect
                value={filter.category}
                onChange={(val) => setFilter({ ...filter, category: val })}
                options={[
                  { value: 'all', label: 'Todas as Categorias' },
                  ...(() => {
                    const filteredCats = filter.type !== 'all' && filter.type !== 'Transfer'
                      ? categories.filter(c => c.type === filter.type)
                      : categories;
                    const parentCats = filteredCats.filter(c => !c.parent_id);
                    const grouped = [];
                    parentCats.forEach(parent => {
                      const children = filteredCats.filter(c => c.parent_id === parent.id);
                      grouped.push({ value: parent.name, label: parent.name });
                      children.forEach(child => {
                        grouped.push({ value: child.name, label: `↳ ${child.name}`, indent: true });
                      });
                    });
                    return grouped;
                  })()
                ]}
                triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[190px]"
              />
            )}

            {accounts && (
              <CustomSelect
                value={filter.account}
                onChange={(val) => setFilter({ ...filter, account: val })}
                options={[
                  { value: 'all', label: 'Todas as Contas' },
                  ...profileAccounts.map(a => ({ value: a.id, label: a.name }))
                ]}
                triggerClassName="bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full pl-5 pr-4 py-3 text-sm font-bold focus:ring-1 focus:ring-fin-mint text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 min-w-[170px]"
              />
            )}

            <div className="flex items-center gap-5 bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-full px-6 py-[11px] transition-all hover:bg-zinc-900/5 dark:hover:bg-white/5 group min-w-[280px]">
              <CustomDatePicker value={filter.dateStart} onChange={val => setFilter({...filter, dateStart: val})} label="De" placeholder="Início" />
              <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700/50 mx-2"></div>
              <CustomDatePicker value={filter.dateEnd} onChange={val => setFilter({...filter, dateEnd: val})} label="Até" placeholder="Fim" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => setFilter({ ...filter, status: 'all', type: 'all', category: 'all', account: 'all', dateStart: '', dateEnd: '', sortOrder: 'desc' })}
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
              <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Saldo Projetado</span>
            </label>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {filter.type !== 'all' && filter.type !== 'Transfer' && (() => {
        const typeFiltered = profileTransactions.filter(t => {
          if (filter.month !== 'all' && !t.date.startsWith(filter.month)) return false;
          return t.type === filter.type;
        });
        const total = typeFiltered.reduce((s, t) => s + Number(t.amount), 0);
        const paid = typeFiltered.filter(t => t.status === 'Paid').reduce((s, t) => s + Number(t.amount), 0);
        const pending = typeFiltered.filter(t => t.status === 'Pending').reduce((s, t) => s + Number(t.amount), 0);
        const isIncome = filter.type === 'Income';
        const accentColor = isIncome ? 'fin-mint' : '[#ff7b7b]';
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total {isIncome ? 'Receitas' : 'Despesas'}</p>
              <p className={cn("text-2xl font-bold tabular-nums", isIncome ? "text-fin-mint" : "text-[#ff7b7b]")}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">{typeFiltered.length} transações</p>
            </div>
            <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{isIncome ? 'Recebido' : 'Pago'}</p>
              <p className="text-2xl font-bold tabular-nums text-fin-mint">
                R$ {paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">{typeFiltered.filter(t => t.status === 'Paid').length} transações</p>
            </div>
            <div className="bg-fin-surface p-5 rounded-[20px] border border-zinc-900/10 dark:border-white/5 shadow-lg">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Pendente</p>
              <p className="text-2xl font-bold tabular-nums text-fin-peach">
                R$ {pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">{typeFiltered.filter(t => t.status === 'Pending').length} transações</p>
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
                    {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  {showProjectedBalance && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">
                        {filter.type === 'all' ? 'Saldo Projetado:' : 'Total do Dia:'}
                      </span>
                      <span className={cn(
                        "text-xs font-bold tabular-nums min-w-[80px] text-right",
                        filter.type === 'all' 
                          ? (groupedTransactions[date].balance > 0 ? "text-fin-mint" : groupedTransactions[date].balance < 0 ? "text-[#ff7b7b]" : "text-zinc-500")
                          : (filter.type === 'Income' ? "text-fin-mint" : "text-[#ff7b7b]")
                      )}>
                        R$ {(filter.type === 'all' 
                          ? groupedTransactions[date].balance 
                          : groupedTransactions[date].transactions.reduce((s, t) => s + Number(t.amount), 0)
                        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="divide-y divide-zinc-900/5 dark:divide-white/5">
                  {groupedTransactions[date].transactions.map((t, index) => (
                    <div 
                      key={t.id} 
                      className="animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                      style={{ animationDuration: '400ms', animationDelay: `${index * 50}ms` }}
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
              <p className="text-zinc-600 dark:text-zinc-500 font-medium text-sm">Nenhuma transação encontrada com esses filtros.</p>
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

function AccountsView({ accounts, setAccounts, fetchData, showToast, showConfirm, selectedProfile, isReadOnly, searchTerm }) {
  const profileAccounts = useMemo(() => accounts.filter(a => a.user_id === selectedProfile?.id), [accounts, selectedProfile]);

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
    showConfirm("Excluir Conta", "Tem certeza que deseja excluir esta conta? Isso não poderá ser desfeito.", async () => {
      const previousState = [...accounts];
      setAccounts(prev => prev.filter(a => a.id !== id));

      try {
        const res = await fetch(`/api/accounts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Contas</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie todas as suas origens de fundos e contas correntes.</p>
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
        {profileAccounts.map(acc => (
          <div key={acc.id} className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:border-zinc-900/10 dark:border-white/10 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Wallet size={80} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10 w-full">
              <div className="w-12 h-12 bg-fin-mint/10 text-fin-mint rounded-[16px] flex items-center justify-center border border-fin-mint/20">
                <Wallet size={20} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{acc.name}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium uppercase tracking-wider">{acc.type === 'Bank' ? 'Banco' : acc.type === 'Cash' ? 'Dinheiro' : 'Poupança'}</p>
              </div>
            </div>

            <div className="flex items-end justify-between mt-8 relative z-10">
              <div>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Saldo Atual</p>
                <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  <span className="text-xl text-zinc-600 dark:text-zinc-500 mr-2 opacity-80">R$</span>
                  {(acc.current_balance !== undefined ? acc.current_balance : acc.initial_balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                  <>
                    <button onClick={() => handleEdit(acc)} className="p-2 border border-zinc-900/10 dark:border-white/5 bg-zinc-900/10 dark:bg-white/5 rounded-xl text-zinc-600 hover:text-fin-mint hover:bg-fin-mint/10 transition-all">
                      <Settings size={16} />
                    </button>
                    <button onClick={() => handleDelete(acc.id)} className="p-2 border border-zinc-900/10 dark:border-white/5 bg-zinc-900/10 dark:bg-white/5 rounded-xl text-zinc-600 hover:text-[#ff7b7b] hover:bg-[#ff7b7b]/10 transition-all">
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
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Nenhuma conta encontrada</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Comece adicionando sua conta principal bancária ou carteira.</p>
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
              setAccounts(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a));
            } else {
              setAccounts(prev => [...prev, { ...data, id: Date.now(), current_balance: parseFloat(data.initial_balance) }]);
            }
          }}
        />
      )}
    </div>
  );
}

function CardsView({ cards, setCards, accounts, fetchData, showToast, showConfirm, selectedProfile, isReadOnly, searchTerm }) {
  const profileCards = useMemo(() => cards.filter(c => c.user_id === selectedProfile?.id), [cards, selectedProfile]);
  const profileAccounts = useMemo(() => accounts.filter(a => a.user_id === selectedProfile?.id), [accounts, selectedProfile]);

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
    showConfirm("Excluir Cartão", "Tem certeza que deseja excluir este cartão?", async () => {
      const previousState = [...cards];
      setCards(prev => prev.filter(c => c.id !== id));

      try {
        const res = await fetch(`/api/cards/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Cartões de Crédito</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Controle de faturas e cartões vinculados.</p>
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
        {profileCards.filter(c => {
          if (searchTerm) {
            return c.name.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return true;
        }).map(card => {
          const linkedAccount = profileAccounts.find(a => a.id === card.account_id);
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
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(card); }} className="p-1.5 bg-zinc-900/10 dark:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-zinc-600 transition-colors pointer-events-auto cursor-pointer">
                          <Settings size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }} className="p-1.5 bg-zinc-900/10 dark:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-[#ff7b7b] transition-colors pointer-events-auto cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 italic tracking-wider absolute right-0 group-hover:opacity-0 transition-opacity pointer-events-none">FinTrack Card</p>
                </div>

                <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-1 tracking-tight truncate">{card.name}</h4>
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
                  <p className="text-zinc-900 dark:text-white text-sm font-bold font-mono">Dia {card.closing_day}</p>
                </div>
                <div className="w-px h-8 bg-zinc-900/10 dark:bg-white/5"></div>
                <div className="text-right">
                  <p className="mb-0.5 font-bold text-fin-peach">Vencimento</p>
                  <p className="text-fin-peach text-sm font-bold font-mono">Dia {card.due_day}</p>
                </div>
              </div>
            </div>
          );
        })}

        {profileCards.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-900/10 dark:border-white/10 rounded-[24px]">
            <CreditCard className="mx-auto text-zinc-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Nenhum cartão adicionado</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Gerencie suas faturas centralizando seus cartões aqui.</p>
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
              setCards(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
            } else {
              setCards(prev => [...prev, { ...data, id: Date.now() }]);
            }
          }}
        />
      )}
    </div>
  );
}

function CategoriesView({ categories, setCategories, fetchData, showToast, showConfirm, selectedProfile, isReadOnly, searchTerm }) {
  const profileCategories = useMemo(() => categories.filter(c => c.user_id === selectedProfile?.id), [categories, selectedProfile]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [defaultParentId, setDefaultParentId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return profileCategories;
    const term = searchTerm.toLowerCase();
    return profileCategories.filter(c => c.name.toLowerCase().includes(term));
  }, [profileCategories, searchTerm]);

  const allParentCategories = filteredCategories.filter(c => !c.parent_id);
  const parentCategories = categoryFilter === 'all'
    ? allParentCategories
    : allParentCategories.filter(c => c.type === categoryFilter);

  const incomeCount = allParentCategories.filter(c => c.type === 'Income').length;
  const expenseCount = allParentCategories.filter(c => c.type === 'Expense').length;

  const filterTabs = [
    { id: 'all', label: 'Todas', count: allParentCategories.length },
    { id: 'Income', label: 'Receitas', count: incomeCount },
    { id: 'Expense', label: 'Despesas', count: expenseCount },
  ];

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setDefaultParentId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm("Excluir Categoria", "Tem certeza que deseja excluir esta categoria?", async () => {
      const previousState = [...categories];
      setCategories(prev => prev.filter(c => c.id !== id));

      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          showToast("Categoria excluída com sucesso!", "success");
          fetchData();
        } else {
          setCategories(previousState);
          showToast("Erro ao excluir categoria.", "error");
        }
      } catch (e) {
        setCategories(previousState);
        showToast("Erro de conexão.", "error");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Categorias</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Classificação para organizar transações.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-fin-mint text-fin-bg px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:brightness-110 tracking-tight text-sm transition-all shadow-lg shadow-fin-mint/10"
          >
            <Plus size={18} strokeWidth={3} /> Add Categoria
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5 w-fit">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2",
              categoryFilter === tab.id
                ? tab.id === 'Income'
                  ? "bg-fin-surface shadow-sm text-fin-mint"
                  : tab.id === 'Expense'
                    ? "bg-fin-surface shadow-sm text-[#ff7b7b]"
                    : "bg-fin-surface shadow-sm text-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            )}
          >
            {tab.id === 'Income' && <ArrowUpRight size={14} />}
            {tab.id === 'Expense' && <ArrowDownLeft size={14} />}
            {tab.label}
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center",
              categoryFilter === tab.id
                ? tab.id === 'Income'
                  ? "bg-fin-mint/15 text-fin-mint"
                  : tab.id === 'Expense'
                    ? "bg-[#ff7b7b]/15 text-[#ff7b7b]"
                    : "bg-zinc-900/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
                : "bg-zinc-900/5 dark:bg-white/5 text-zinc-500"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {parentCategories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-900/10 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-zinc-500" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            {categoryFilter === 'all' ? 'Nenhuma categoria cadastrada.' : categoryFilter === 'Income' ? 'Nenhuma categoria de receita.' : 'Nenhuma categoria de despesa.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentCategories.map(parent => (
          <div key={parent.id} className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl transition-all hover:border-zinc-900/10 dark:border-white/10 group">
            <div className="flex items-center gap-4 mb-6 relative w-full justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 rounded-[16px] flex items-center justify-center">
                  {parent.icon && CATEGORY_ICONS[parent.icon] ? React.cloneElement(CATEGORY_ICONS[parent.icon], { size: 20 }) : <Tag size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{parent.name}</h4>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                    parent.type === 'Income' ? "text-fin-mint" : "text-[#ff7b7b]"
                  )}>
                    {parent.type === 'Income' ? 'Receita' : 'Despesa'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                  <>
                    <button onClick={() => handleEdit(parent)} className="p-2 text-zinc-600 hover:text-fin-mint transition-colors">
                      <Settings size={16} />
                    </button>
                    <button onClick={() => handleDelete(parent.id)} className="p-2 text-zinc-600 hover:text-[#ff7b7b] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2 mt-6 p-4 rounded-[16px] bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5">
              {filteredCategories.filter(c => c.parent_id === parent.id).length === 0 && (
                <p className="text-zinc-600 text-xs italic text-center py-2">Sem subcategorias</p>
              )}
              {filteredCategories.filter(c => c.parent_id === parent.id).map(child => (
                <div key={child.id} className="flex items-center justify-between p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 dark:bg-white/[0.02] rounded-xl group/item">
                  <div className="flex items-center gap-2">
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {child.icon && CATEGORY_ICONS[child.icon] ? React.cloneElement(CATEGORY_ICONS[child.icon], { size: 14 }) : <Tag size={14} />}
                    </div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{child.name}</span>
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                      <button onClick={() => handleEdit(child)} className="p-1 px-1.5 text-zinc-600 hover:text-fin-mint transition-colors"><Settings size={12} /></button>
                      <button onClick={() => handleDelete(child.id)} className="p-1 px-1.5 text-zinc-600 hover:text-[#ff7b7b] transition-colors"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              ))}
              {!isReadOnly && (
                <div className="pt-2">
                  <button
                    onClick={() => { setDefaultParentId(parent.id); setIsModalOpen(true); }}
                    className="w-full text-center text-[11px] uppercase tracking-wider text-fin-mint font-bold py-2.5 hover:bg-fin-mint/10 rounded-xl transition-colors border border-dashed border-fin-mint/20 hover:border-fin-mint/40"
                  >
                    + Add Subcategoria
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryModal 
          onClose={handleClose} 
          onSuccess={() => fetchData()} 
          categories={allParentCategories} 
          initialData={editingCategory}
          defaultParentId={defaultParentId} 
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setCategories(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
            } else {
              setCategories(prev => [...prev, { ...data, id: Date.now() }]);
            }
          }}
        />
      )}
    </div>
  );
}

function TransactionModal({ onClose, onSuccess, accounts, categories, cards, initialData, onOptimisticUpdate }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  let initialTags = [];
  if (initialData?.tags) {
    try {
      initialTags = typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : initialData.tags;
    } catch(e){}
  }

  const [form, setForm] = useState(
    initialData ? {
      ...initialData,
      installments: initialData.total_installments || 1,
      tags: initialTags,
      is_fixed: !!initialData.is_fixed,
      is_repeated: !!initialData.is_repeated,
      ignore_in_reports: !!initialData.ignore_in_reports,
      repeat_frequency: initialData.repeat_frequency || 1,
      repeat_period: initialData.repeat_period || 'monthly',
      notes: initialData.notes || '',
      attachment: null
    } : {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Expense',
      status: 'Paid',
      account_id: accounts[0]?.id || '',
      to_account_id: '',
      category_id: categories[0]?.id || '',
      card_id: '',
      is_recurring: false,
      installments: 1,
      is_fixed: false,
      is_repeated: false,
      repeat_frequency: 1,
      repeat_period: 'monthly',
      notes: '',
      tags: [],
      attachment: null,
      ignore_in_reports: false
    }
  );

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/transactions/${initialData.id}` : '/api/transactions';
    
    const formData = new FormData();
    if (isEditing) {
      formData.append('_method', 'PUT');
    }

    const payloadParams = { ...form, amount: parseFloat(form.amount) };
    if (form.type === 'Transfer') {
      if (!payloadParams.description || payloadParams.description.trim() === '') {
        payloadParams.description = 'Transferência';
      }
      payloadParams.status = 'Paid';
    }

    if (form.is_repeated) {
       payloadParams.repeat_times = form.installments;
    } else {
       payloadParams.total_installments = form.installments;
    }

    Object.keys(payloadParams).forEach(key => {
      const val = payloadParams[key];
      if (val !== null && val !== undefined && val !== '') {
        if (key === 'tags') {
          if (val.length > 0) formData.append(key, JSON.stringify(val));
        } else if (key === 'attachment') {
          formData.append(key, val);
        } else if (typeof val === 'boolean') {
          formData.append(key, val ? '1' : '0');
        } else {
          formData.append(key, val);
        }
      }
    });

    if (onOptimisticUpdate) onOptimisticUpdate({ ...payloadParams, id: initialData?.id }, isEditing);

    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-out border border-zinc-900/10 dark:border-white/5">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Editar Transação' : 'Nova Transação'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors text-zinc-500 dark:text-zinc-400">
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
            {[
              { id: 'Income', label: 'Receita' },
              { id: 'Expense', label: 'Despesa' },
              { id: 'Transfer', label: 'Transf.' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, type: t.id })}
                className={cn(
                  "py-2 text-sm font-bold rounded-xl transition-all",
                  form.type === t.id
                    ? (t.id === 'Income' || t.id === 'Expense' ? "bg-fin-surface shadow-sm text-fin-mint" : "bg-fin-surface shadow-sm text-zinc-900 dark:text-white")
                    : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {form.type !== 'Transfer' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Descrição</label>
              <input
                required
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                placeholder="Ex: Aluguel Mensal"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-500 font-bold">R$</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-white/10 outline-none font-bold text-zinc-900 dark:text-white transition-all"
                  placeholder="0,00"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Data</label>
              <CustomDatePicker
                value={form.date}
                onChange={val => setForm({ ...form, date: val })}
                triggerClassName="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 focus:ring-1 focus:ring-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                {form.type === 'Transfer' ? 'Da Conta' : 'Conta'}
              </label>
              <CustomSelect
                value={form.account_id}
                onChange={val => setForm({ ...form, account_id: val })}
                options={accounts.map(a => ({ value: a.id, label: a.name }))}
              />
            </div>
            {form.type === 'Transfer' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Para Conta</label>
                <CustomSelect
                  value={form.to_account_id}
                  onChange={val => setForm({ ...form, to_account_id: val })}
                  options={[
                    { value: '', label: 'Selecionar Conta' },
                    ...accounts.map(a => ({ value: a.id, label: a.name }))
                  ]}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Categoria</label>
                <CustomSelect
                  value={form.category_id}
                  onChange={val => setForm({ ...form, category_id: val })}
                  options={(() => {
                    const parentCats = categories.filter(c => !c.parent_id && c.type === form.type);
                    const grouped = [];
                    parentCats.forEach(parent => {
                      const children = categories.filter(c => c.parent_id === parent.id);
                      if (children.length > 0) {
                        grouped.push({ isGroup: true, label: parent.name });
                        grouped.push({ value: parent.id, label: parent.name });
                        children.forEach(child => {
                          grouped.push({ value: child.id, label: `↳ ${child.name}`, indent: true });
                        });
                      } else {
                        grouped.push({ value: parent.id, label: parent.name });
                      }
                    });
                    return grouped;
                  })()}
                />
              </div>
            )}
          </div>

          {form.type !== 'Transfer' && (
            <div className="grid grid-cols-2 gap-4">
              {form.type === 'Expense' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Forma de Pagamento</label>
                  <CustomSelect
                    value={form.card_id}
                    onChange={val => setForm({ ...form, card_id: val })}
                    options={[
                      { value: '', label: 'Direto da Conta' },
                      ...cards.map(c => ({ value: c.id, label: `${c.name} (Cartão)` }))
                    ]}
                  />
                </div>
              ) : <div />}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Status</label>
                <label className="flex items-center gap-3 cursor-pointer group mt-1">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={form.status === 'Paid'}
                      onChange={e => setForm({ ...form, status: e.target.checked ? 'Paid' : 'Pending' })} 
                    />
                    <div className={cn("w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-all duration-300 ease-out", form.status === 'Paid' && "bg-fin-mint")}></div>
                    <div className={cn("absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-out shadow-sm", form.status === 'Paid' && "translate-x-4")}></div>
                  </div>
                  <span className={cn("text-sm font-bold transition-colors", form.status === 'Paid' ? "text-fin-mint" : "text-zinc-500")}>
                    {form.status === 'Paid' 
                      ? (form.type === 'Income' ? 'Recebido' : (form.type === 'Expense' ? 'Pago' : 'Efetivada'))
                      : 'Pendente'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {form.type !== 'Transfer' ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/40 border border-zinc-900/10 dark:border-white/5 hover:bg-zinc-200/80 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <span className="text-sm font-bold text-zinc-900 dark:text-white">Mais Detalhes</span>
                <ChevronDown className={cn("text-zinc-500 transition-transform duration-300", showAdvanced && "rotate-180")} size={20} />
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                showAdvanced ? "max-h-[800px] mt-2 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="p-4 space-y-5 border border-zinc-900/10 dark:border-white/5 rounded-2xl bg-zinc-200/30 dark:bg-black/20">
                  
                  {form.type !== 'Transfer' && (
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={form.is_fixed}
                          onChange={e => setForm({ ...form, is_fixed: e.target.checked })} 
                        />
                        <div className={cn("w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors", form.is_fixed && "bg-fin-mint")}></div>
                        <div className={cn("absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", form.is_fixed && "translate-x-4")}></div>
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {form.type === 'Income' ? 'Receita Fixa' : 'Despesa Fixa'}
                      </span>
                    </label>
                  )}

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer group mb-3">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={form.is_repeated}
                          onChange={e => setForm({ ...form, is_repeated: e.target.checked })} 
                        />
                        <div className={cn("w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors", form.is_repeated && "bg-fin-mint")}></div>
                        <div className={cn("absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", form.is_repeated && "translate-x-4")}></div>
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Repetir Transação
                      </span>
                    </label>
                    
                    {form.is_repeated && (
                      <div className="grid grid-cols-2 gap-4 pl-13 animate-in slide-in-from-top-2 fade-in">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">A cada</label>
                          <input
                            type="number"
                            min="1"
                            className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                            value={form.repeat_frequency}
                            onChange={e => setForm({ ...form, repeat_frequency: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Período</label>
                          <CustomSelect
                            value={form.repeat_period}
                            onChange={val => setForm({ ...form, repeat_period: val })}
                            triggerClassName="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-white/5 focus:ring-1 focus:ring-white/10"
                            options={[
                              { value: 'daily', label: 'Dia(s)' },
                              { value: 'weekly', label: 'Semana(s)' },
                              { value: 'monthly', label: 'Mês(es)' },
                              { value: 'yearly', label: 'Ano(s)' }
                            ]}
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Quantidade de vezes a repetir</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Ex: 12"
                            className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                            value={form.installments}
                            onChange={e => setForm({ ...form, installments: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Observações</label>
                    <textarea
                      rows={2}
                      className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                      placeholder="Adicione notas adicionais..."
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.tags && form.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-zinc-900/10 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 text-zinc-500 dark:text-zinc-400">
                            <Plus size={12} className="rotate-45" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                      placeholder="Digite e aperte Enter para adicionar"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Anexo (Opcional)</label>
                    <input
                      type="file"
                      className="w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-fin-mint/10 file:text-fin-mint hover:file:bg-fin-mint/20 cursor-pointer"
                      onChange={e => setForm({ ...form, attachment: e.target.files[0] })}
                    />
                    {initialData?.attachment_path && (
                      <p className="text-xs text-zinc-500 mt-1">Já possui um anexo salvo.</p>
                    )}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group mt-2 pt-4 border-t border-zinc-900/10 dark:border-white/5">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={form.ignore_in_reports}
                        onChange={e => setForm({ ...form, ignore_in_reports: e.target.checked })} 
                      />
                      <div className={cn("w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors", form.ignore_in_reports && "bg-fin-mint")}></div>
                      <div className={cn("absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", form.ignore_in_reports && "translate-x-4")}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Ignorar em Relatórios
                      </span>
                      <span className="text-xs text-zinc-500">Não contabilizar em saldos e gráficos automáticos.</span>
                    </div>
                  </label>
                  
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Observações (Opcional)</label>
              <textarea
                rows={2}
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                placeholder="Adicione notas adicionais..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          )}


          <button
            type="submit"
            className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-fin-mint/20 mt-6"
          >
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountModal({ onClose, onSuccess, initialData, onOptimisticUpdate }) {
  const [form, setForm] = useState(
    initialData || { name: '', type: 'Bank', initial_balance: '0' }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/accounts/${initialData.id}` : '/api/accounts';
    const method = isEditing ? 'PUT' : 'POST';

    const payload = { ...form, initial_balance: parseFloat(form.initial_balance) };
    if (onOptimisticUpdate) onOptimisticUpdate({ ...payload, id: initialData?.id }, isEditing);

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-md rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Editar Conta' : 'Nova Conta'}</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors"><Plus size={20} className="rotate-45" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Nome da Conta</label>
            <input
              required
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="Ex: Nubank"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Tipo</label>
            <CustomSelect
              value={form.type}
              onChange={val => setForm({ ...form, type: val })}
              options={[
                { value: 'Bank', label: 'Banco' },
                { value: 'Cash', label: 'Dinheiro' },
                { value: 'Savings', label: 'Poupança' }
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Saldo Inicial</label>
            <input
              type="number"
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="0,00"
              value={form.initial_balance}
              onChange={e => setForm({ ...form, initial_balance: e.target.value })}
            />
          </div>
          <button className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all mt-2">Salvar Conta</button>
        </form>
      </div>
    </div>
  );
}

function CardModal({ onClose, onSuccess, accounts, initialData, onOptimisticUpdate }) {
  const [form, setForm] = useState(
    initialData || { name: '', closing_day: '1', due_day: '10', account_id: accounts[0]?.id || '' }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/cards/${initialData.id}` : '/api/cards';
    const method = isEditing ? 'PUT' : 'POST';

    if (onOptimisticUpdate) onOptimisticUpdate({ ...form, id: initialData?.id }, isEditing);

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-md rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Editar Cartão' : 'Novo Cartão'}</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors"><Plus size={20} className="rotate-45" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Nome do Cartão</label>
            <input
              required
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="Ex: Visa Infinite"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Fechamento</label>
              <input
                type="number"
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
                placeholder="Dia"
                value={form.closing_day}
                onChange={e => setForm({ ...form, closing_day: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Vencimento</label>
              <input
                type="number"
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
                placeholder="Dia"
                value={form.due_day}
                onChange={e => setForm({ ...form, due_day: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Debitar em</label>
            <CustomSelect
              value={form.account_id}
              onChange={val => setForm({ ...form, account_id: val })}
              options={accounts.map(a => ({ value: a.id, label: `Pagar com: ${a.name}` }))}
            />
          </div>
          <button className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all mt-2">Salvar Cartão</button>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({ onClose, onSuccess, categories, initialData, onOptimisticUpdate, defaultParentId }) {
  const parentOnlyCategories = categories.filter(c => !c.parent_id);
  const getInitialForm = () => {
    if (initialData) return initialData;
    if (defaultParentId) {
      const parent = parentOnlyCategories.find(c => c.id === defaultParentId);
      return { name: '', parent_id: String(defaultParentId), type: parent?.type || 'Expense', icon: '' };
    }
    return { name: '', parent_id: '', type: 'Expense', icon: '' };
  };
  const [form, setForm] = useState(getInitialForm());

  const handleParentChange = (parentId) => {
    const parent = parentOnlyCategories.find(c => c.id === parseInt(parentId));
    setForm(prev => ({
      ...prev,
      parent_id: parentId,
      type: parent ? parent.type : prev.type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing ? `/api/categories/${initialData.id}` : '/api/categories';
    const method = isEditing ? 'PUT' : 'POST';

    if (onOptimisticUpdate) onOptimisticUpdate({ ...form, id: initialData?.id }, isEditing);

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-md rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Editar Categoria' : defaultParentId ? 'Nova Subcategoria' : 'Nova Categoria'}</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors"><Plus size={20} className="rotate-45" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
            {[
              { id: 'Income', label: 'Receita' },
              { id: 'Expense', label: 'Despesa' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                disabled={!!form.parent_id}
                onClick={() => setForm({ ...form, type: t.id })}
                className={cn(
                  "py-2 text-sm font-bold rounded-xl transition-all",
                  form.type === t.id
                    ? (t.id === 'Income' ? "bg-fin-surface shadow-sm text-fin-mint" : "bg-fin-surface shadow-sm text-[#ff7b7b]")
                    : "text-zinc-600 dark:text-zinc-500",
                  form.parent_id ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Nome da Categoria</label>
            <input
              required
              className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all focus:ring-1 focus:ring-white/10"
              placeholder="Ex: Alimentação"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Subcategoria de (Opcional)</label>
            <CustomSelect
              value={form.parent_id}
              onChange={handleParentChange}
              options={[
                { value: '', label: 'Categoria Principal' },
                ...parentOnlyCategories.map(c => ({ value: c.id, label: c.name }))
              ]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Ícone (Opcional)</label>
            <div className="grid grid-cols-5 gap-2 p-2 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
              {Object.keys(CATEGORY_ICONS).map(iconKey => (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setForm({ ...form, icon: iconKey === form.icon ? '' : iconKey })}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl transition-all",
                    form.icon === iconKey
                      ? "bg-fin-mint/20 text-fin-mint shadow-inner border border-fin-mint/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                  )}
                  title={iconKey}
                >
                  {CATEGORY_ICONS[iconKey]}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold mt-2 hover:brightness-110 transition-all">Salvar Categoria</button>
        </form>
      </div>
    </div>
  );
}

function ReportsView({ data, user, selectedProfile, transactions, categories, accounts, cards }) {
  const [reportType, setReportType] = useState('monthly');
  const [refDate, setRefDate] = useState(new Date());
  const [activeReport, setActiveReport] = useState('fluxo-caixa');

  const profileTransactions = useMemo(() => 
    transactions.filter(t => t.user_id === selectedProfile?.id && !t.ignore_in_reports), 
    [transactions, selectedProfile]
  );
  const profileCategories = useMemo(() => categories.filter(c => c.user_id === selectedProfile?.id), [categories, selectedProfile]);
  const profileAccounts = useMemo(() => accounts.filter(a => a.user_id === selectedProfile?.id), [accounts, selectedProfile]);
  const profileCards = useMemo(() => cards.filter(c => c.user_id === selectedProfile?.id), [cards, selectedProfile]);

  // 1. Fluxo de Caixa (Receitas vs Despesas) - Últimos 6 meses
  const incomeVsExpenses = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
    return last6Months.map(monthDate => {
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthTxs = profileTransactions?.filter(t => t?.date?.startsWith?.(monthStr)) || [];
      return {
        month: format(monthDate, 'MMM yy', { locale: ptBR }),
        income: monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount || 0), 0),
        expenses: monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount || 0), 0),
      };
    });
  }, [profileTransactions]);

  // 2. Receitas por Categoria
  const incomeByCategory = useMemo(() => {
    const currentMonthStr = format(new Date(), 'yyyy-MM');
    const monthTxs = profileTransactions?.filter(t => t?.date?.startsWith?.(currentMonthStr) && t.type === 'Income') || [];
    const categoriesMap = profileCategories?.reduce((acc, cat) => { acc[cat.id] = cat.name; return acc; }, {}) || {};

    const agg = monthTxs.reduce((acc, t) => {
      const name = categoriesMap[t.category_id] || 'Outros';
      acc[name] = (acc[name] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    return Object.entries(agg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [profileTransactions, profileCategories]);

  // 3. Despesas por Categoria
  const expensesByCategory = useMemo(() => {
    const currentMonthStr = format(new Date(), 'yyyy-MM');
    const monthTxs = profileTransactions?.filter(t => t?.date?.startsWith?.(currentMonthStr) && t.type === 'Expense') || [];
    const categoriesMap = profileCategories?.reduce((acc, cat) => { acc[cat.id] = cat.name; return acc; }, {}) || {};

    const agg = monthTxs.reduce((acc, t) => {
      const name = categoriesMap[t.category_id] || 'Outros';
      acc[name] = (acc[name] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    return Object.entries(agg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [profileTransactions, profileCategories]);

  // 4. Despesas Fixas vs Variáveis
  const fixedVsVariable = useMemo(() => {
    const currentMonthStr = format(new Date(), 'yyyy-MM');
    const monthTxs = profileTransactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === 'Expense');
    
    const fixed = monthTxs.filter(t => t.is_fixed).reduce((s, t) => s + Number(t.amount), 0);
    const variable = monthTxs.filter(t => !t.is_fixed).reduce((s, t) => s + Number(t.amount), 0);
    
    return [
      { name: 'Fixas', value: fixed, color: '#98e5dd' },
      { name: 'Variáveis', value: variable, color: '#ff7b7b' }
    ];
  }, [profileTransactions]);

  // 5. Evolução do Saldo
  const balanceEvolution = useMemo(() => {
    const last12Months = Array.from({ length: 12 }).map((_, i) => subMonths(new Date(), i)).reverse();
    
    return last12Months.map(monthDate => {
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthTxs = profileTransactions.filter(t => t.date.startsWith(monthStr));
      
      const income = monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
      const balance = income - expense;
      
      return {
        month: format(monthDate, 'MMM yy', { locale: ptBR }),
        saldo: balance,
        receitas: income,
        despesas: expense
      };
    });
  }, [profileTransactions]);

  // 6. Saldo por Conta
  const balanceByAccount = useMemo(() => {
    return profileAccounts.map(acc => ({
      name: acc.name,
      saldo: acc.current_balance !== undefined ? acc.current_balance : acc.initial_balance
    })).sort((a, b) => b.saldo - a.saldo);
  }, [profileAccounts]);

  // 7. Contas a Pagar
  const accountsPayable = useMemo(() => {
    return profileTransactions
      .filter(t => t.type === 'Expense' && t.status === 'Pending')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [profileTransactions]);

  // 8. Contas a Receber
  const accountsReceivable = useMemo(() => {
    return profileTransactions
      .filter(t => t.type === 'Income' && t.status === 'Pending')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [profileTransactions]);

  // 9. Relatório de Cartão de Crédito
  const cardReport = useMemo(() => {
    const currentMonthStr = format(new Date(), 'yyyy-MM');
    const monthTxs = profileTransactions.filter(t => 
      t.date.startsWith(currentMonthStr) && 
      t.type === 'Expense' && 
      t.card_id
    );
    
    const byCard = monthTxs.reduce((acc, t) => {
      const card = profileCards.find(c => c.id === t.card_id);
      const cardName = card ? card.name : 'Cartão Desconhecido';
      acc[cardName] = (acc[cardName] || 0) + Number(t.amount);
      return acc;
    }, {});
    
    return Object.entries(byCard).map(([name, value]) => ({ name, value }));
  }, [profileTransactions, profileCards]);

  // 10. Limite Utilizado do Cartão
  const cardLimitUsage = useMemo(() => {
    return profileCards.map(card => {
      const currentMonthStr = format(new Date(), 'yyyy-MM');
      const monthTxs = profileTransactions.filter(t => 
        t.date.startsWith(currentMonthStr) && 
        t.type === 'Expense' && 
        t.card_id === card.id
      );
      
      const totalSpent = monthTxs.reduce((s, t) => s + Number(t.amount), 0);
      const limit = card.limit || 5000; // Valor padrão se não houver limite definido
      const usagePercentage = limit > 0 ? (totalSpent / limit) * 100 : 0;
      
      return {
        name: card.name,
        gasto: totalSpent,
        limite: limit,
        utilizacao: usagePercentage
      };
    });
  }, [profileTransactions, profileCards]);

  // 11. Metas Financeiras
  const financialGoals = useMemo(() => {
    const totalIncome = profileTransactions
      .filter(t => t.type === 'Income')
      .reduce((s, t) => s + Number(t.amount), 0);
    
    const totalExpense = profileTransactions
      .filter(t => t.type === 'Expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    
    return [
      { meta: 'Taxa de Poupança', atual: savingsRate.toFixed(1), objetivo: 20, unidade: '%' },
      { meta: 'Receita Mensal', atual: totalIncome, objetivo: 10000, unidade: 'R$' },
      { meta: 'Despesas Controladas', atual: totalExpense, objetivo: 7000, unidade: 'R$' }
    ];
  }, [profileTransactions]);

  // 12. Comparação Mensal de Receitas e Despesas
  const monthlyComparison = useMemo(() => {
    const last3Months = Array.from({ length: 3 }).map((_, i) => subMonths(new Date(), i)).reverse();
    return last3Months.map(monthDate => {
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthTxs = profileTransactions.filter(t => t.date.startsWith(monthStr));
      return {
        month: format(monthDate, 'MMM yy', { locale: ptBR }),
        receitas: monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0),
        despesas: monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  }, [profileTransactions]);

  const reportComponents = {
    'fluxo-caixa': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Fluxo de Caixa (Últimos 6 Meses)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpenses}>
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
    ),
    'receitas-categoria': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Receitas por Categoria (Mês Atual)</h3>
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
              <ArrowUpRight size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma receita este mês</p>
            </div>
          )}
        </div>
      </div>
    ),
    'despesas-categoria': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Despesas por Categoria (Mês Atual)</h3>
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
              <ArrowDownLeft size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhuma despesa este mês</p>
            </div>
          )}
        </div>
      </div>
    ),
    'fixas-vs-variaveis': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Despesas Fixas vs Variáveis (Mês Atual)</h3>
        <div className="h-80">
          {fixedVsVariable.some(item => item.value > 0) ? (
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
                  contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
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
    'evolucao-saldo': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Evolução do Saldo (Últimos 12 Meses)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceEvolution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="saldo" stroke={user?.theme_color || '#98e5dd'} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Saldo" />
              <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Receitas" />
              <Line type="monotone" dataKey="despesas" stroke="#ff7b7b" strokeWidth={2} dot={{ r: 3 }} name="Despesas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    'saldo-contas': (
      <div className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Saldo por Conta</h3>
        <div className="h-80">
          {balanceByAccount.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceByAccount}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1c1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                />
                <Bar dataKey="saldo" fill={user?.theme_color || '#98e5dd'} radius={[4, 4, 0, 0]} name="Saldo" />
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
    { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: <ArrowRightLeft size={16} /> },
    { id: 'receitas-categoria', label: 'Receitas por Categoria', icon: <ArrowUpRight size={16} /> },
    { id: 'despesas-categoria', label: 'Despesas por Categoria', icon: <ArrowDownLeft size={16} /> },
    { id: 'fixas-vs-variaveis', label: 'Fixas vs Variáveis', icon: <Tag size={16} /> },
    { id: 'evolucao-saldo', label: 'Evolução do Saldo', icon: <LineChartIcon size={16} /> },
    { id: 'saldo-contas', label: 'Saldo por Conta', icon: <Wallet size={16} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Relatórios</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Análises detalhadas e insights sobre suas finanças.</p>
      </header>

      <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              activeReport === tab.id
                ? "bg-fin-surface shadow-sm text-fin-mint"
                : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
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
          <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Contas a Pagar</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {accountsPayable.length > 0 ? (
              accountsPayable.map(t => (
                <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-white">{t.description}</span>
                    <span className="text-xs text-zinc-500">{format(parseISO(t.date), 'dd MMM yyyy', { locale: ptBR })}</span>
                  </div>
                  <span className="font-bold text-[#ff7b7b]">R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
<h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Contas a Receber</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {accountsReceivable.length > 0 ? (
              accountsReceivable.map(t => (
                <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-zinc-900/10 dark:bg-white/5 border border-zinc-900/10 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-white">{t.description}</span>
                    <span className="text-xs text-zinc-500">{format(parseISO(t.date), 'dd MMM yyyy', { locale: ptBR })}</span>
                  </div>
                  <span className="font-bold text-fin-mint">R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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

function SettingsView({ theme, setTheme, user, setToken, setUser, authFetch, showToast }) {
  const [localColor, setLocalColor] = useState(user?.theme_color || '#98e5dd');

  const handleColorBlur = async (colorToSave = localColor) => {
    try {
      const res = await authFetch('/api/user/theme-color', {
        method: 'PUT',
        body: JSON.stringify({ theme_color: colorToSave })
      });
      if (res.ok) {
        setUser(prev => ({ ...prev, theme_color: colorToSave }));
        showToast('Cor do tema atualizada com sucesso!');
      } else {
        showToast('Erro ao atualizar cor', 'error');
      }
    } catch (e) {
      showToast('Erro de rede ao atualizar cor', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Configurações</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie suas preferências e conta do FinTrack.</p>
      </header>

      <div className="bg-fin-surface rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-2xl text-fin-mint border-2 border-zinc-700 shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-widest mb-4">Preferências de Aparência</h4>
            <div className="flex items-center justify-between p-4 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Tema do Sistema</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Alterne entre o modo Claro e Escuro.</p>
              </div>
              <div className="flex bg-zinc-200/50 dark:bg-black/40 p-1 rounded-xl border border-zinc-900/10 dark:border-white/5">
                <button
                  onClick={() => setTheme('light')}
                  className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", theme === 'light' ? "bg-fin-surface text-zinc-900 dark:text-white shadow" : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white")}
                >
                  Claro
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", theme === 'dark' ? "bg-fin-surface text-zinc-900 dark:text-white shadow" : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:text-white")}
                >
                  Escuro
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Cor Principal (Tema)</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Personalize a cor de destaque do FinTrack.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  {['#98e5dd', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setLocalColor(color);
                        document.documentElement.style.setProperty('--mint', color);
                        handleColorBlur(color);
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform shadow-sm",
                        localColor === color ? "border-zinc-900 dark:border-white scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                      title="Selecionar cor"
                    />
                  ))}
                </div>
                
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-900/10 dark:border-white/10 shadow-inner flex-shrink-0 group" title="Cor personalizada">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/10 dark:bg-black/40 group-hover:bg-transparent transition-colors">
                    <Plus size={16} className={cn("text-white drop-shadow-md transition-opacity", !['#98e5dd', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'].includes(localColor) ? "opacity-100" : "opacity-0")} />
                  </div>
                  <input
                    type="color"
                    value={localColor}
                    onChange={(e) => {
                      setLocalColor(e.target.value);
                      document.documentElement.style.setProperty('--mint', e.target.value);
                    }}
                    onBlur={() => handleColorBlur(localColor)}
                    className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    setLocalColor('#98e5dd');
                    document.documentElement.style.setProperty('--mint', '#98e5dd');
                    handleColorBlur('#98e5dd');
                  }}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2"
                >
                  Restaurar Padrão
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-widest mb-4">Gerenciamento de Conta</h4>
            <button
              onClick={() => {
                setToken(null);
                setUser(null);
                localStorage.setItem('token', '');
              }}
              className="w-full flex items-center justify-between p-4 bg-zinc-200/50 dark:bg-black/20 hover:bg-[#ff7b7b]/10 group rounded-2xl border border-zinc-900/10 dark:border-white/5 transition-colors"
            >
              <div className="text-left">
                <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-[#ff7b7b] transition-colors">Sair da Conta</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 group-hover:text-[#ff7b7b]/70 transition-colors">Encerrar sessão no dispositivo atual.</p>
              </div>
              <ChevronRight className="text-zinc-600 dark:text-zinc-500 group-hover:text-[#ff7b7b]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-fin-surface w-full max-w-sm rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-out">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#ff7b7b]/10 text-[#ff7b7b] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-600 bg-zinc-900/10 dark:text-zinc-400 dark:bg-white/5 hover:bg-zinc-900/20 dark:hover:bg-white/10 transition-colors">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl font-bold text-fin-bg bg-[#ff7b7b] hover:bg-[#ff5252] shadow-lg shadow-[#ff7b7b]/20 transition-colors">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthScreen({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao autenticar');
      }

      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fin-bg flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-fin-mint/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-fin-peach/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 bg-fin-surface rounded-[28px] mx-auto flex items-center justify-center shadow-2xl mb-6 border border-zinc-900/10 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-fin-mint/20 blur-xl rounded-full"></div>
            <Wallet className="text-fin-mint relative z-10" size={40} fill="currentColor" strokeWidth={0} />
          </motion.div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">FinTrack<span className="text-zinc-400 dark:text-zinc-600">.</span></h2>
          <p className="mt-2 text-zinc-500 font-medium">Controle suas finanças com elegância</p>
        </div>

        <div className="bg-fin-surface/40 backdrop-blur-xl p-8 md:p-10 shadow-3xl border border-zinc-900/10 dark:border-white/5 rounded-[40px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {isLogin ? 'Bem-vindo de volta' : 'Comece agora'}
              </h3>
              <p className="text-sm text-zinc-500 mb-8 font-medium">
                {isLogin ? 'Entre na sua conta para continuar' : 'Crie sua conta e organize sua vida financeira'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#ff7b7b]/10 border border-[#ff7b7b]/20 text-[#ff7b7b] p-4 rounded-2xl text-xs text-center font-bold"
                  >
                    {error}
                  </motion.div>
                )}

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-900/10 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fin-mint/30 transition-all font-medium placeholder-zinc-600"
                      placeholder="Ex: João Silva"
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-900/10 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fin-mint/30 transition-all font-medium placeholder-zinc-600"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Senha</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-900/10 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fin-mint/30 transition-all font-medium placeholder-zinc-600"
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-fin-mint text-fin-bg rounded-2xl font-bold text-sm shadow-xl shadow-fin-mint/10 hover:brightness-110 transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-fin-bg border-t-transparent rounded-full" />
                       Processando...
                    </div>
                  ) : isLogin ? 'Entrar Agora' : 'Criar Conta Grátis'}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              {isLogin ? 'Novo por aqui?' : 'Já possui uma conta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-fin-mint hover:brightness-125 font-bold transition-colors underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

