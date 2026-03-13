import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
// ícones do lucide-react
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
  ShoppingBag,
  Car,
  Home,
  Coffee,
  Utensils,
  Plane,
  Briefcase,
  Zap,
  Smartphone,
  Heart,
  Gift,
  Book,
  HelpCircle,
  ShoppingCart,
  Fuel,
  Bus,
  Bike,
  GraduationCap,
  Baby,
  PawPrint,
  Dumbbell,
  Music,
  Tv,
  Gamepad2,
  Scissors,
  Stethoscope,
  Pill,
  Building2,
  Landmark,
  HandCoins,
  PiggyBank,
  Banknote,
  Receipt,
  Shirt,
  Umbrella,
  Wrench,
  Paintbrush,
  Camera,
  TreePine,
  UtensilsCrossed,
  Wine,
  IceCream,
  Pizza,
  Salad,
  Droplets,
  Wifi,
  Globe,
  PartyPopper,
  Theater,
  Headphones,
  Church,
  Star,
  Menu,
  X,
} from "lucide-react";
// Gráficos do recharts
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  format,
  parseISO,
  isPast,
  isToday,
  endOfMonth,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "./utils/classNames";

const COLORS = [
  "#98e5dd",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

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

import CustomSelect from "./components/ui/CustomSelect";
import CustomDatePicker from "./components/ui/CustomDatePicker";

// Páginas
import Dashboard from "./views/Dashboard";
import TransactionsView from "./views/TransactionsView";
import SettingsView from "./views/SettingsView";
import ReportsView from "./views/ReportsView";
import CategoriesView from "./views/CategoriesView";
import CardsView from "./views/CardsView";
import AuthScreen from "./views/AuthScreen";
import AccountsView from "./views/AccountsView";

// Modais
import CategoryModal from "./modals/CategoryModal";
import AccountModal from "./modals/AccountModal";
import TransactionModal from "./modals/TransactionModal";
import CardModal from "./modals/CardModal";
import ConfirmModal from "./modals/ConfirmModal";
import QuickEffectiveModal from "./modals/QuickEffectiveModal";
import ShareModal from "./modals/ShareModal";

// Componentes UI
import TransactionRow from "./components/ui/TransactionRow";
import StatCard from "./components/ui/StatCard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [activeTab, setActiveTab] = useState("dashboard");
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
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bem-vindo!",
      message: "Explore o seu novo painel financeiro.",
      type: "system",
      date: new Date(),
      read: false,
    },
    {
      id: 2,
      title: "Atalho disponível",
      message: 'Dica: Aperte a tecla "F" para focar no campo de busca.',
      type: "tip",
      date: new Date(),
      read: false,
    },
  ]);

  const searchRef = useRef(null);
  const [searchIndex, setSearchIndex] = useState(0);

  const systemCommands = useMemo(
    () => [
      {
        id: "dash",
        label: "Ir para Dashboard",
        action: () => setActiveTab("dashboard"),
        icon: <LayoutDashboard size={16} />,
        keywords: "inicio home painel",
      },
      {
        id: "trans",
        label: "Ir para Transações",
        action: () => setActiveTab("transactions"),
        icon: <ArrowRightLeft size={16} />,
        keywords: "histórico extrato lançamentos",
      },
      {
        id: "acc",
        label: "Ir para Contas",
        action: () => setActiveTab("accounts"),
        icon: <Wallet size={16} />,
        keywords: "bancos carteiras saldo",
      },
      {
        id: "card",
        label: "Ir para Cartões",
        action: () => setActiveTab("cards"),
        icon: <CreditCard size={16} />,
        keywords: "crédito faturas",
      },
      {
        id: "cat",
        label: "Ir para Categorias",
        action: () => setActiveTab("categories"),
        icon: <ListTree size={16} />,
        keywords: "grupos organização",
      },
      {
        id: "rep",
        label: "Ir para Relatórios",
        action: () => setActiveTab("reports"),
        icon: <BarChart3 size={16} />,
        keywords: "gráficos análise estatísticas",
      },
      {
        id: "sett",
        label: "Ir para Configurações",
        action: () => setActiveTab("settings"),
        icon: <Settings size={16} />,
        keywords: "perfil conta tema cores",
      },
      {
        id: "new",
        label: "Nova Transação",
        action: () => openTransactionModal(),
        icon: <Plus size={16} />,
        keywords: "adicionar cadastrar receita despesa",
      },
      {
        id: "share",
        label: "Compartilhar Dados",
        action: () => setIsShareModalOpen(true),
        icon: <UserPlus size={16} />,
        keywords: "convidar código esposa marido",
      },
    ],
    [],
  );

  const filteredCommands = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return systemCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(term) ||
        c.keywords.toLowerCase().includes(term),
    );
  }, [searchTerm, systemCommands]);

  useEffect(() => {
    setSearchIndex(0);
  }, [searchTerm]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
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
  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
      }

      return response;
    },
    [token],
  );

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
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Keyboard shortcut for search (F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key.toLowerCase() === "f" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement.tagName,
        )
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Inject custom theme color
  useEffect(() => {
    if (user?.theme_color) {
      document.documentElement.style.setProperty("--mint", user.theme_color);
    } else {
      document.documentElement.style.removeProperty("--mint");
    }
  }, [user?.theme_color]);

  // Automatic Transaction Notifications (Overdue & Today)
  useEffect(() => {
    if (!transactions.length || !user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setNotifications((prev) => {
      const currentNotifIds = new Set(prev.map((n) => n.id));
      const newNotifs = [];

      transactions.forEach((t) => {
        if (t.status !== "Pending") return;

        const tDate = parseISO(t.date);
        tDate.setHours(0, 0, 0, 0);

        const isOverdue = tDate < today;
        const isDueToday = tDate.getTime() === today.getTime();

        if (isOverdue || isDueToday) {
          const notifId = `notif-trans-${t.id}-${isOverdue ? "overdue" : "today"}`;
          if (!currentNotifIds.has(notifId)) {
            newNotifs.push({
              id: notifId,
              title: isOverdue ? "⚠️ Transação Atrasada" : "📅 Vence Hoje",
              message: `${t.type === "Income" ? "Receita" : "Despesa"}: ${t.description} - R$ ${Number(t.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              type: isOverdue ? "warning" : "info",
              date: new Date(),
              read: false,
            });
            currentNotifIds.add(notifId);
          }
        }
      });

      if (newNotifs.length === 0) return prev;
      // Filter out old notifications for the same transaction to only keep the latest status
      const filteredPrev = prev.filter((n) => {
        if (!n.id?.toString().startsWith("notif-trans-")) return true;
        const transId = n.id.split("-")[2];
        return !newNotifs.some((nn) => nn.id.split("-")[2] === transId);
      });

      return [...newNotifs, ...filteredPrev];
    });
  }, [transactions, user]);

  const fetchUser = async () => {
    try {
      const res = await authFetch("/api/me");
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
      const dashRes = await authFetch("/api/dashboard");
      if (!dashRes.ok) throw new Error("Falha no dashboard");
      const dash = await dashRes.json();

      const transRes = await authFetch("/api/transactions");
      if (!transRes.ok) throw new Error("Falha nas transactions");
      const trans = await transRes.json();

      const accRes = await authFetch("/api/accounts");
      if (!accRes.ok) throw new Error("Falha nas accounts");
      const acc = await accRes.json();

      const catRes = await authFetch("/api/categories");
      if (!catRes.ok) throw new Error("Falha nas categories");
      const cat = await catRes.json();

      const cardRes = await authFetch("/api/cards");
      if (!cardRes.ok) throw new Error("Falha nos cards");
      const card = await cardRes.json();

      const followRes = await authFetch("/api/share/following");
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
      const res = await authFetch(`/api/share/unfollow/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Parou de seguir!");
        fetchData();
      } else {
        showToast("Erro ao parar de seguir", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 dark:bg-[#111313] z-[999] overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fin-mint/20 dark:bg-fin-mint/10 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fin-peach/20 dark:bg-fin-peach/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="flex flex-col items-center relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8">
            {/* Outer spinning ring */}
            <div
              className="absolute inset-0 rounded-[28px] border-2 border-transparent border-t-fin-mint border-r-fin-peach opacity-50 animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>
            {/* Inner pulsing logo */}
            <div className="w-20 h-20 bg-fin-surface rounded-[24px] shadow-2xl flex items-center justify-center border border-zinc-900/10 dark:border-white/5 animate-pulse-glow">
              <Wallet
                size={36}
                className="text-fin-mint"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            FinTrack<span className="text-zinc-400 dark:text-zinc-600">.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-fin-mint rounded-full animate-ping"></span>
            Sincronizando dados...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <AuthScreen
        setToken={(t) => {
          localStorage.setItem("token", t);
          setToken(t);
        }}
      />
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 p-4">
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-zinc-800">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-zinc-100">Sem Dados</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Não foi possível carregar os dados financeiros.
          </p>
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
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-fin-bg border-r border-zinc-900/10 dark:border-white/5 z-20 hidden md:flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isSidebarCollapsed ? "w-20" : "w-[260px]",
        )}
      >
        <div
          className={cn(
            "p-8 flex items-center gap-3",
            isSidebarCollapsed && "justify-center p-6",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-fin-mint/10 flex flex-shrink-0 items-center justify-center text-fin-mint">
            <Wallet size={18} fill="currentColor" strokeWidth={0} />
          </div>
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic transition-opacity duration-200">
              FinTrack
              <span className="text-zinc-400 dark:text-zinc-600">.</span>
            </h1>
          )}
        </div>

        <div
          className={cn(
            "px-8 mt-2 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200",
            isSidebarCollapsed && "opacity-0 h-0 my-0 overflow-hidden",
          )}
        >
          Menu Principal
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Wallet size={20} />}
            label="Contas"
            active={activeTab === "accounts"}
            onClick={() => setActiveTab("accounts")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<ArrowRightLeft size={20} />}
            label="Transações"
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<CreditCard size={20} />}
            label="Cartões de Crédito"
            active={activeTab === "cards"}
            onClick={() => setActiveTab("cards")}
            collapsed={isSidebarCollapsed}
          />
          <div
            className={cn(
              "px-4 pt-6 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200",
              isSidebarCollapsed && "opacity-0 h-0 pt-0 pb-0 overflow-hidden",
            )}
          >
            Desempenho & Ajustes
          </div>
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Relatórios"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Tag size={20} />}
            label="Categorias"
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Configurações"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Compartilhar"
            active={isShareModalOpen}
            onClick={() => setIsShareModalOpen(true)}
            collapsed={isSidebarCollapsed}
          />

          <div
            className={cn(
              "px-8 pt-6 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest transition-opacity duration-200",
              isSidebarCollapsed && "opacity-0 h-0 pt-0 pb-0 overflow-hidden",
            )}
          >
            Perfis
          </div>
          <NavItem
            icon={<User size={20} />}
            label="Meu Painel"
            active={selectedProfile?.id === user?.id}
            onClick={() => setSelectedProfile(user)}
            collapsed={isSidebarCollapsed}
            variant="profile"
          />
          {following.map((follow) => (
            <NavItem
              key={follow.id}
              icon={
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                    selectedProfile?.id === follow.id
                      ? "bg-fin-mint text-fin-bg"
                      : "bg-fin-mint/20 text-fin-mint",
                  )}
                >
                  {follow.name.charAt(0)}
                </div>
              }
              label={follow.name}
              active={selectedProfile?.id === follow.id}
              onClick={() => setSelectedProfile(follow)}
              collapsed={isSidebarCollapsed}
              variant="profile"
            />
          ))}
        </nav>

        <div
          className={cn(
            "p-6 mt-auto border-t border-zinc-900/10 dark:border-white/5",
            isSidebarCollapsed && "p-4",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              isSidebarCollapsed ? "justify-center" : "px-2",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex flex-shrink-0 items-center justify-center font-bold text-fin-mint border-2 border-zinc-700">
              {user?.name?.charAt(0) || "U"}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 transition-opacity duration-200 flex items-center justify-between">
                <p className="font-semibold text-sm truncate text-zinc-900 dark:text-white mr-2">
                  {user?.name || "Usuário"}
                </p>
                <button
                  onClick={() => {
                    setToken(null);
                    setUser(null);
                    localStorage.setItem("token", "");
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
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-fin-bg z-[101] md:hidden flex flex-col shadow-2xl border-r border-zinc-900/10 dark:border-white/5"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fin-mint/10 flex items-center justify-center text-fin-mint">
                    <Wallet size={18} fill="currentColor" strokeWidth={0} />
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                    FinTrack
                    <span className="text-zinc-400 dark:text-zinc-600">.</span>
                  </h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-zinc-900/10 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Navegação
                </div>
                <NavItem
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  active={activeTab === "dashboard"}
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<Wallet size={20} />}
                  label="Contas"
                  active={activeTab === "accounts"}
                  onClick={() => {
                    setActiveTab("accounts");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<ArrowRightLeft size={20} />}
                  label="Transações"
                  active={activeTab === "transactions"}
                  onClick={() => {
                    setActiveTab("transactions");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<CreditCard size={20} />}
                  label="Cartões"
                  active={activeTab === "cards"}
                  onClick={() => {
                    setActiveTab("cards");
                    setIsMobileMenuOpen(false);
                  }}
                />

                <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Recursos
                </div>
                <NavItem
                  icon={<BarChart3 size={20} />}
                  label="Relatórios"
                  active={activeTab === "reports"}
                  onClick={() => {
                    setActiveTab("reports");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<Tag size={20} />}
                  label="Categorias"
                  active={activeTab === "categories"}
                  onClick={() => {
                    setActiveTab("categories");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<Users size={20} />}
                  label="Compartilhar"
                  active={isShareModalOpen}
                  onClick={() => {
                    setIsShareModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                />
                <NavItem
                  icon={<Settings size={20} />}
                  label="Configurações"
                  active={activeTab === "settings"}
                  onClick={() => {
                    setActiveTab("settings");
                    setIsMobileMenuOpen(false);
                  }}
                />

                <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Perfis
                </div>
                <NavItem
                  icon={<User size={20} />}
                  label="Meu Painel"
                  active={selectedProfile?.id === user?.id}
                  onClick={() => {
                    setSelectedProfile(user);
                    setIsMobileMenuOpen(false);
                  }}
                  variant="profile"
                />
                {following.map((follow) => (
                  <NavItem
                    key={follow.id}
                    icon={
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                          selectedProfile?.id === follow.id
                            ? "bg-fin-mint text-fin-bg"
                            : "bg-fin-mint/20 text-fin-mint",
                        )}
                      >
                        {follow.name.charAt(0)}
                      </div>
                    }
                    label={follow.name}
                    active={selectedProfile?.id === follow.id}
                    onClick={() => {
                      setSelectedProfile(follow);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="profile"
                  />
                ))}
              </div>

              <div className="p-6 border-t border-zinc-900/10 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex flex-shrink-0 items-center justify-center font-bold text-fin-mint border-2 border-zinc-700">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-zinc-900 dark:text-white">
                      {user?.name || "Usuário"}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToken(null);
                    setUser(null);
                    localStorage.setItem("token", "");
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
      <main
        className={cn(
          "flex-1 p-4 md:p-10 pb-24 md:pb-10 min-w-0 max-w-[1400px] mx-auto transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-[260px]",
        )}
      >
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors min-h-[44px] text-zinc-900 dark:text-white"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic">
            FinTrack
          </h1>
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
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSearchIndex(
                        (prev) => (prev + 1) % filteredCommands.length,
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSearchIndex(
                        (prev) =>
                          (prev - 1 + filteredCommands.length) %
                          filteredCommands.length,
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      filteredCommands[searchIndex].action();
                      setSearchTerm("");
                    } else if (e.key === "Escape") {
                      setSearchTerm("");
                    }
                  }
                }}
                placeholder="Pesquisar ou digitar comando"
                className="w-full bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-2xl py-3 pl-12 pr-12 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-fin-mint/30 dark:focus:border-fin-mint/20 focus:ring-4 focus:ring-fin-mint/5 transition-all group-hover:bg-zinc-100 dark:group-hover:bg-white/[0.04]"
              />
              <LayoutDashboard
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/10 dark:bg-white/5 rounded-md px-2 py-1 flex items-center border border-zinc-900/10 dark:border-white/5">
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-500">
                  F
                </span>
              </div>
            </div>

            {filteredCommands.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-fin-surface border border-zinc-900/10 dark:border-white/5 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-zinc-900/10 dark:border-white/5 bg-zinc-200/30 dark:bg-black/10">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-3">
                    Comandos Sugeridos
                  </span>
                </div>
                <div className="p-2">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setSearchTerm("");
                      }}
                      onMouseEnter={() => setSearchIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left",
                        idx === searchIndex
                          ? "bg-fin-mint text-fin-bg"
                          : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                          idx === searchIndex
                            ? "bg-fin-bg/10 text-fin-bg"
                            : "bg-fin-mint/10 text-fin-mint",
                        )}
                      >
                        {cmd.icon}
                      </div>
                      <span className="font-bold text-sm flex-1">
                        {cmd.label}
                      </span>
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
                  : "bg-fin-surface text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-900/10 dark:border-white/5 hover:bg-zinc-900/5 dark:hover:bg-white/5",
              )}
            >
              <AlertCircle size={20} />
              {notifications.some((n) => !n.read) && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-fin-peach rounded-full border-2 border-fin-surface"></div>
              )}
            </button>

            {isNotificationsOpen && (
              <NotificationPopover
                notifications={notifications}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAsRead={(id) => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
                  );
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

        {activeTab === "dashboard" && (
          <Dashboard
            data={data}
            transactions={transactions}
            accounts={accounts}
            categories={categories}
            user={user}
            onEdit={openTransactionModal}
            onNavigate={(tab, filters) => {
              setActiveTab(tab);
              setTransactionFilters(filters);
            }}
            selectedProfile={selectedProfile}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsView
            transactions={transactions}
            setTransactions={setTransactions}
            fetchData={fetchData}
            onEdit={openTransactionModal}
            showToast={showToast}
            showConfirm={showConfirm}
            initialFilters={transactionFilters}
            categories={categories}
            accounts={accounts}
            user={user}
            selectedProfile={selectedProfile}
            isReadOnly={isReadOnly}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === "accounts" && (
          <AccountsView
            accounts={accounts}
            setAccounts={setAccounts}
            fetchData={fetchData}
            showToast={showToast}
            showConfirm={showConfirm}
            selectedProfile={selectedProfile}
            isReadOnly={isReadOnly}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === "cards" && (
          <CardsView
            cards={cards}
            setCards={setCards}
            accounts={accounts}
            fetchData={fetchData}
            showToast={showToast}
            showConfirm={showConfirm}
            selectedProfile={selectedProfile}
            isReadOnly={isReadOnly}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesView
            categories={categories}
            setCategories={setCategories}
            fetchData={fetchData}
            showToast={showToast}
            showConfirm={showConfirm}
            selectedProfile={selectedProfile}
            isReadOnly={isReadOnly}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === "reports" && (
          <ReportsView
            data={data}
            user={user}
            selectedProfile={selectedProfile}
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            cards={cards}
          />
        )}
        {activeTab === "settings" && (
          <SettingsView
            theme={theme}
            setTheme={setTheme}
            user={user}
            setToken={setToken}
            setUser={setUser}
            authFetch={authFetch}
            showToast={showToast}
          />
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-fin-surface border-t border-zinc-900/10 dark:border-white/5 p-3 flex justify-around md:hidden z-30 pb-safe">
        <MobileNavItem
          icon={<LayoutDashboard size={24} />}
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <MobileNavItem
          icon={<ArrowRightLeft size={24} />}
          active={activeTab === "transactions"}
          onClick={() => setActiveTab("transactions")}
        />
        <button
          onClick={() => openTransactionModal()}
          className="w-14 h-14 bg-fin-mint rounded-full flex items-center justify-center text-fin-bg -mt-8 shadow-2xl shadow-fin-mint/20 border-4 border-fin-bg"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
        <MobileNavItem
          icon={<CreditCard size={24} />}
          active={activeTab === "cards"}
          onClick={() => setActiveTab("cards")}
        />
        <MobileNavItem
          icon={<Settings size={24} />}
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
      </nav>

      {/* Modals */}
      {isTransactionModalOpen && (
        <TransactionModal
          onClose={closeTransactionModal}
          onSuccess={() => fetchData()}
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setTransactions((prev) =>
                prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)),
              );
            } else {
              setTransactions((prev) => [{ ...data, id: Date.now() }, ...prev]);
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
        <div
          className={cn(
            "fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100] border",
            toast.type === "success"
              ? "bg-fin-mint text-fin-bg border-fin-mint/30 shadow-fin-mint/20"
              : "bg-[#ff7b7b] text-fin-bg border-[#ff7b7b]/30 shadow-[#ff7b7b]/20",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={24} />
          ) : (
            <AlertCircle size={24} />
          )}
          <p className="font-bold">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
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

function NavItem({ icon, label, active, onClick, collapsed, variant = "nav" }) {
  const isProfile = variant === "profile";
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
          : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-900/10 dark:hover:bg-white/5",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center min-w-[20px] transition-transform duration-200",
          active
            ? isProfile
              ? "text-fin-mint"
              : "text-fin-bg"
            : "text-zinc-600 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200",
          collapsed && !active && "group-hover:scale-110",
        )}
      >
        {icon}
      </div>
      {!collapsed && (
        <span
          className={cn(
            "transition-opacity duration-200 text-left flex-1 whitespace-nowrap overflow-hidden text-ellipsis",
            active && isProfile && "text-fin-mint",
          )}
        >
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
        <h3 className="font-bold text-zinc-900 dark:text-white">
          Notificações
        </h3>
        <span className="text-[10px] font-bold bg-fin-mint/20 text-fin-mint px-2 py-0.5 rounded-full">
          {notifications.filter((n) => !n.read).length} Novas
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
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer relative group",
                  !n.read && "bg-fin-mint/5",
                )}
                onClick={() => onMarkAsRead(n.id)}
              >
                {!n.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fin-mint rounded-full"></div>
                )}
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight pr-4">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                    {format(n.date, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {n.message}
                </p>
                {n.type === "tip" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-fin-mint uppercase tracking-wider">
                    <Star size={10} fill="currentColor" /> Dica do Sistema
                  </div>
                )}
                {n.type === "warning" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#ff7b7b] uppercase tracking-wider">
                    <AlertCircle size={10} fill="currentColor" /> Urgente
                  </div>
                )}
                {n.type === "info" && (
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
        active
          ? "bg-fin-mint/10 text-fin-mint"
          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
      )}
    >
      {icon}
    </button>
  );
}



