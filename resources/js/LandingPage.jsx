import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  BarChart3, 
  Zap,
  ChevronRight,
  ChevronDown,
  Star,
  Search,
  BellRing,
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Coffee,
  Home,
  ShoppingBag,
  Car,
  Shield,
  Smartphone,
  Moon,
  Palette,
  Clock,
  Target,
  Sparkles,
  ChevronUp,
  MessageCircle,
  ArrowRightLeft,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/* ===== DOT PATTERN ===== */
const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotPattern" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="currentColor" className="text-zinc-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotPattern)" />
  </svg>
);

/* ===== SMOOTH SCROLL HELPER ===== */
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/* ===== NAVIGATION WITH SCROLL EFFECT ===== */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Recursos', id: 'features' },
    { label: 'Como Funciona', id: 'como-funciona' },
    { label: 'Planos', id: 'pricing' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-6 transition-all duration-500",
          scrolled
            ? "bg-[#020617]/70 backdrop-blur-xl border border-white/10 py-3 shadow-2xl shadow-black/20"
            : "bg-transparent border border-transparent py-4"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#98e5dd]/10 text-[#98e5dd] rounded-lg flex items-center justify-center">
              <Wallet size={18} fill="currentColor" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">FinTrack<span className="text-zinc-600">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className="text-[13px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/app" className="text-[13px] font-bold text-white hover:opacity-70 transition-all uppercase tracking-wider">Entrar</Link>
            <Link to="/app" className="bg-[#98e5dd] text-[#020617] px-6 py-2.5 rounded-lg text-[13px] font-black hover:brightness-110 transition-all uppercase tracking-wider" style={{ boxShadow: '0 0 20px rgba(152,229,221,0.3), 0 0 60px rgba(152,229,221,0.1)' }}>Teste Grátis</Link>
          </div>

          {/* Hamburger button for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#020617] md:hidden flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#98e5dd]/10 text-[#98e5dd] rounded-lg flex items-center justify-center">
                  <Wallet size={18} fill="currentColor" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-white uppercase italic">FinTrack<span className="text-zinc-600">.</span></span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mb-12">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-2xl font-black text-white text-left uppercase tracking-tighter hover:text-[#98e5dd] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              <Link 
                to="/app" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm"
              >
                Entrar
              </Link>
              <Link 
                to="/app" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-5 rounded-2xl bg-[#98e5dd] text-[#020617] font-black uppercase tracking-widest text-sm"
                style={{ boxShadow: '0 0 20px rgba(152,229,221,0.3)' }}
              >
                Teste Grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ===== ANIMATED COUNTER ===== */
const AnimatedNumber = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);

  return (
    <motion.span
      onViewportEnter={() => {
        let start = 0;
        const end = value;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { start = end; clearInterval(timer); }
          setCount(Math.floor(start));
        }, 16);
      }}
    >
      {count.toLocaleString('pt-BR')}{suffix}
    </motion.span>
  );
};

/* ===== BENTO CARD ===== */
const BentoCard = ({ className, title, description, icon: Icon, children, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className={cn(
      "bg-zinc-900/30 border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-[#98e5dd]/20 transition-all duration-500",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#98e5dd]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10 h-full flex flex-col">
      {Icon && (
        <div className="w-10 h-10 bg-[#98e5dd]/10 text-[#98e5dd] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon size={20} />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">{description}</p>
      <div className="mt-auto">{children}</div>
    </div>
  </motion.div>
);

/* ===== FAQ ITEM ===== */
const FaqItem = ({ question, answer, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="border-b border-white/5"
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <span className="text-lg font-bold text-white group-hover:text-[#98e5dd] transition-colors pr-4">{question}</span>
        <div className={cn("w-8 h-8 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 transition-all", open && "bg-[#98e5dd]/10 rotate-180")}>
          <ChevronDown size={16} className={cn("text-zinc-500 transition-colors", open && "text-[#98e5dd]")} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="text-zinc-500 text-sm font-medium leading-relaxed pb-6">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ===== DASHBOARD MOCKUP ===== */
const DashboardMockup = () => (
  <div className="bg-[#111313] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl text-white font-['Inter'] text-left w-full select-none">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#1a1c1c]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#98e5dd]/10 text-[#98e5dd] rounded-md flex items-center justify-center"><Wallet size={12} fill="currentColor" /></div>
        <span className="text-xs font-bold text-white">FinTrack Pro</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-white/5 rounded-lg px-3 py-1.5 flex items-center gap-2"><Search size={10} className="text-zinc-500" /><span className="text-[9px] text-zinc-500">Buscar... (F)</span></div>
        <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center"><BellRing size={10} className="text-zinc-500" /></div>
      </div>
    </div>
    <div className="flex">
      <div className="w-36 border-r border-white/5 bg-[#1a1c1c]/50 p-3 space-y-1 hidden sm:block">
        <div className="flex items-center gap-2 bg-[#98e5dd]/10 text-[#98e5dd] px-3 py-2 rounded-xl text-[9px] font-bold"><LayoutDashboard size={12} /> Dashboard</div>
        <div className="flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl text-[9px] font-medium"><ArrowRightLeft size={12} /> Transações</div>
        <div className="flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl text-[9px] font-medium"><Wallet size={12} /> Contas</div>
        <div className="flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl text-[9px] font-medium"><CreditCard size={12} /> Cartões</div>
        <div className="flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl text-[9px] font-medium"><BarChart3 size={12} /> Relatórios</div>
        <div className="flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl text-[9px] font-medium"><Settings size={12} /> Configurações</div>
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-2">Perfis</div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl text-[9px] font-bold text-white">
            <div className="w-4 h-4 rounded-full bg-[#98e5dd]/30 text-[#98e5dd] flex items-center justify-center text-[7px] font-bold">Y</div>
            Meu Painel
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1c1c] rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-2"><ArrowDownLeft size={10} className="text-[#98e5dd]" /><span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Receitas</span></div>
            <div className="text-sm font-black text-[#98e5dd]">R$ 8.450,00</div>
          </div>
          <div className="bg-[#1a1c1c] rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-2"><ArrowUpRight size={10} className="text-[#eeb58f]" /><span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Despesas</span></div>
            <div className="text-sm font-black text-[#eeb58f]">R$ 3.217,50</div>
          </div>
          <div className="bg-[#1a1c1c] rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-2"><TrendingUp size={10} className="text-white" /><span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Saldo</span></div>
            <div className="text-sm font-black text-white">R$ 5.232,50</div>
          </div>
        </div>
        <div className="bg-[#1a1c1c] rounded-2xl p-4 border border-white/5">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Últimos 6 Meses</div>
          <div className="flex items-end gap-2 h-20">
            {[45,30,60,50,75,40,80,55,65,35,90,45].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-md ${i % 2 === 0 ? 'bg-[#98e5dd]/40' : 'bg-[#eeb58f]/30'}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2">{['Out','Nov','Dez','Jan','Fev','Mar'].map(m => (<span key={m} className="text-[7px] text-zinc-600 font-bold">{m}</span>))}</div>
        </div>
        <div className="bg-[#1a1c1c] rounded-2xl p-4 border border-white/5">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Transações Recentes</div>
          <div className="space-y-2">
            {[
              { icon: Home, desc: 'Aluguel', cat: 'Moradia', val: '-R$ 1.200,00', color: '#eeb58f', status: 'Efetivado' },
              { icon: ShoppingBag, desc: 'Supermercado', cat: 'Alimentação', val: '-R$ 487,30', color: '#eeb58f', status: 'Pendente' },
              { icon: ArrowDownLeft, desc: 'Salário', cat: 'Receita', val: '+R$ 5.500,00', color: '#98e5dd', status: 'Efetivado' },
              { icon: Car, desc: 'Combustível', cat: 'Transporte', val: '-R$ 280,00', color: '#eeb58f', status: 'Efetivado' },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}><t.icon size={10} style={{ color: t.color }} /></div>
                  <div><div className="text-[9px] font-bold text-white">{t.desc}</div><div className="text-[7px] text-zinc-600">{t.cat}</div></div>
                </div>
                <div className="text-right"><div className="text-[9px] font-bold" style={{ color: t.color }}>{t.val}</div><div className={`text-[7px] font-bold ${t.status === 'Efetivado' ? 'text-[#98e5dd]' : 'text-zinc-500'}`}>{t.status}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ===== TRANSACTIONS MOCKUP ===== */
const TransactionsMockup = () => (
  <div className="bg-[#111313] rounded-[24px] border border-white/5 overflow-hidden shadow-2xl text-white font-['Inter'] text-left w-full select-none p-4 space-y-3">
    <div className="flex items-center gap-2 flex-wrap">
      <div className="bg-white/5 rounded-xl px-3 py-2 text-[9px] font-bold text-zinc-400 flex items-center gap-1.5 border border-white/5"><span>Março 2026</span><ChevronDown size={10} /></div>
      <div className="bg-[#98e5dd]/10 rounded-xl px-3 py-2 text-[9px] font-bold text-[#98e5dd] border border-[#98e5dd]/20">Todos</div>
      <div className="bg-white/5 rounded-xl px-3 py-2 text-[9px] font-bold text-zinc-500 border border-white/5">Receitas</div>
      <div className="bg-white/5 rounded-xl px-3 py-2 text-[9px] font-bold text-zinc-500 border border-white/5">Despesas</div>
    </div>
    <div>
      <div className="flex justify-between items-center py-1.5 border-b border-white/5 mb-2">
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">08 Mar, Sábado</span>
        <span className="text-[8px] font-bold text-[#98e5dd]">Saldo: R$ 5.232,50</span>
      </div>
      <div className="space-y-1.5">
        {[
          { icon: Home, desc: 'Aluguel', cat: 'Moradia', val: '-R$ 1.200,00', tag: 'FIXO' },
          { icon: ShoppingBag, desc: 'Mercado Extra', cat: 'Alimentação', val: '-R$ 487,30', tag: '3/12' },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-xl px-3 py-2 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#eeb58f]/10 flex items-center justify-center"><t.icon size={12} className="text-[#eeb58f]" /></div>
              <div><div className="text-[9px] font-bold text-white flex items-center gap-2">{t.desc}<span className="text-[7px] bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded font-bold">{t.tag}</span></div><div className="text-[7px] text-zinc-600">{t.cat}</div></div>
            </div>
            <div className="text-[9px] font-bold text-[#eeb58f]">{t.val}</div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center py-1.5 border-b border-white/5 mb-2">
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">05 Mar, Quarta</span>
        <span className="text-[8px] font-bold text-[#98e5dd]">Saldo: R$ 6.919,80</span>
      </div>
      <div className="space-y-1.5">
        {[
          { icon: ArrowDownLeft, desc: 'Salário', cat: 'Receita Principal', val: '+R$ 5.500,00' },
          { icon: Coffee, desc: 'Projeto Freelance', cat: 'Receita Extra', val: '+R$ 2.950,00' },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-xl px-3 py-2 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#98e5dd]/10 flex items-center justify-center"><t.icon size={12} className="text-[#98e5dd]" /></div>
              <div><div className="text-[9px] font-bold text-white">{t.desc}</div><div className="text-[7px] text-zinc-600">{t.cat}</div></div>
            </div>
            <div className="text-[9px] font-bold text-[#98e5dd]">{t.val}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


/* ===== LANDING PAGE ===== */
export default function LandingPage() {

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 font-['Inter'] selection:bg-[#98e5dd]/30 selection:text-white overflow-x-hidden">
      <DotPattern />
      <Nav />

      {/* ===== HERO ===== */}
      <section id="inicio" className="relative pt-44 pb-20 md:pt-60 md:pb-40 px-6">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#98e5dd]/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#eeb58f]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-zinc-900/50 border border-white/10 px-4 py-2 rounded-full mb-10">
              <Zap size={14} className="text-[#98e5dd]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Novo: Saldo Projetado Automático</span>
              <ChevronRight size={14} className="text-zinc-600" />
            </motion.div>
            
            <h1 className="text-6xl md:text-[84px] font-black tracking-tighter leading-[0.85] mb-10 text-white">
              Sua vida financeira.<br />
              <span className="italic font-serif font-light text-[#98e5dd] lowercase tracking-normal">Organizada de verdade.</span>
            </h1>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-12 max-w-xl">
              Gestão de contas, cartões e perfis compartilhados com uma interface <span className="text-white font-bold underline decoration-[#98e5dd] decoration-2 underline-offset-4">deslumbrante</span> e ultra-rápida.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center gap-5">
              <Link to="/app" className="bg-[#98e5dd] text-[#020617] px-10 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 w-full sm:w-auto justify-center animate-glow-mint">
                Começar agora <ArrowRight size={20} />
              </Link>
              <button onClick={() => scrollToSection('features')} className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all w-full sm:w-auto text-center cursor-pointer">
                Ver recursos
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[
                  'https://randomuser.me/api/portraits/women/44.jpg',
                  'https://randomuser.me/api/portraits/men/32.jpg',
                  'https://randomuser.me/api/portraits/women/68.jpg',
                ].map((src, i) => (
                  <img key={i} src={src} alt="Usuário" className="w-10 h-10 rounded-full border-2 border-[#020617] object-cover" />
                ))}
              </div>
              <p className="text-zinc-500 text-sm font-medium">Sincronize suas finanças com sua família em <span className="text-white font-bold italic">tempo real</span>.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 flex items-center gap-4 text-zinc-600 text-[11px] font-bold uppercase tracking-widest">
               <CheckCircle2 size={14} className="text-[#98e5dd]" /> 100% Gratuito para testes por 14 dias
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3, duration: 1 }} className="relative hidden lg:block group">
            <div className="absolute -inset-10 bg-[#98e5dd]/5 blur-[120px] rounded-full group-hover:bg-[#98e5dd]/10 transition-all duration-1000" />
            <div className="relative"><DashboardMockup /></div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-16 px-6 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#98e5dd]/5 via-transparent to-[#eeb58f]/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
          {[
            { value: 1250, suffix: '+', label: 'Usuários Ativos' },
            { value: 45000, suffix: '+', label: 'Transações/Mês' },
            { value: 99, suffix: '%', label: 'Uptime Garantido' },
            { value: 4.9, suffix: '★', label: 'Nota dos Usuários' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES BENTO ===== */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#98e5dd]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block h-px w-20 bg-gradient-to-r from-transparent via-[#98e5dd] to-transparent mb-8" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 font-mono">Funcionalidades</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Potência extrema.<br />Simplicidade absoluta.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <BentoCard className="md:col-span-4" title="Compartilhamento Familiar" description="Conecte contas com sua esposa, marido ou sócio. Troque de perfil para ver dashboards individuais em modo somente leitura." icon={Users} delay={0.1}>
              <div className="mt-4 flex items-center gap-6">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#98e5dd]/20 flex items-center justify-center text-[#98e5dd] font-bold">Y</div>
                  <div><div className="text-xs font-bold text-white">Yurii (Meu Painel)</div><div className="text-[10px] text-zinc-500">Administrador</div></div>
                </div>
                <ArrowRight size={20} className="text-zinc-700 flex-shrink-0" />
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 flex-1 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-[#eeb58f]/20 flex items-center justify-center text-[#eeb58f] font-bold">J</div>
                  <div><div className="text-xs font-bold text-white">Joana (Seguindo)</div><div className="text-[10px] text-zinc-500">Somente Leitura</div></div>
                </div>
              </div>
            </BentoCard>

            <BentoCard className="md:col-span-2" title="Gestão de Cartões" description="Limites, faturas e melhores dias de compra automatizados." icon={CreditCard} delay={0.2}>
              <div className="bg-zinc-800/50 border border-white/5 p-5 rounded-[24px]">
                <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-bold text-zinc-400">NUBANK</span><span className="text-[10px] font-bold text-[#98e5dd]">FECHADA</span></div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2"><motion.div initial={{ width: 0 }} whileInView={{ width: '65%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-[#98e5dd]" /></div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-600"><span>R$ 1.200,00</span><span>R$ 3.000,00</span></div>
              </div>
            </BentoCard>

            <BentoCard className="md:col-span-3" title="Command Palette" description="Aperte 'F' em qualquer lugar. Navegue, crie lançamentos e busque sem tirar as mãos do teclado." icon={Search} delay={0.3}>
              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <span className="text-[#98e5dd] font-bold text-sm tracking-tighter italic">F</span>
                <div className="h-4 w-px bg-zinc-800" />
                <span className="text-zinc-600 text-sm">Buscar funcionalidade...</span>
              </div>
            </BentoCard>

            <BentoCard className="md:col-span-3" title="Alertas Inteligentes" description="Notificações automáticas de transações que vencem hoje ou já estão atrasadas." icon={BellRing} delay={0.4}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-xl"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Atrasado: Aluguel</span></div>
                <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Vence Hoje: Internet</span></div>
              </div>
            </BentoCard>

            <BentoCard className="md:col-span-6" title="Transações com Saldo Projetado" description="Todas as transações organizadas por dia, com saldo cumulativo em tempo real. Filtros por tipo, status, categorias e período." icon={Calculator} delay={0.5}>
              <div className="mt-4"><TransactionsMockup /></div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#98e5dd]/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block h-px w-20 bg-gradient-to-r from-transparent via-[#98e5dd] to-transparent mb-8" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 font-mono">Simples assim</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">3 passos.<br />Zero complicação.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-[#98e5dd]/30 via-[#98e5dd]/10 to-[#98e5dd]/30" />
            
            {[
              { step: '01', icon: Smartphone, title: 'Cadastre-se em 30s', desc: 'Crie sua conta gratuitamente. Sem cartão de crédito, sem compromisso.' },
              { step: '02', icon: Target, title: 'Configure suas contas', desc: 'Adicione suas contas bancárias, cartões de crédito e categorias personalizadas.' },
              { step: '03', icon: Sparkles, title: 'Controle total', desc: 'Lance suas receitas e despesas. O saldo projetado, relatórios e alertas fazem o resto.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="text-center relative">
                <div className="w-16 h-16 bg-[#98e5dd]/10 border border-[#98e5dd]/20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10">
                  <item.icon size={28} className="text-[#98e5dd]" />
                </div>
                <div className="text-[10px] font-black text-[#98e5dd] uppercase tracking-[0.3em] mb-3">{item.step}</div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIFERENCIAIS ===== */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eeb58f]/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block h-px w-20 bg-gradient-to-r from-transparent via-[#98e5dd] to-transparent mb-8" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 font-mono">Por que nos escolher</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Feito para quem leva<br /><span className="italic font-serif font-light text-[#98e5dd] lowercase tracking-normal">finanças a sério.</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Moon, title: 'Dark Mode Nativo', desc: 'Interface premium escura que cuida dos seus olhos e da sua produtividade.' },
              { icon: Shield, title: 'Dados Seguros', desc: 'Autenticação por token, dados criptografados e sessões protegidas.' },
              { icon: Palette, title: 'Tema Personalizável', desc: 'Mude a cor principal do sistema direto nas configurações.' },
              { icon: Clock, title: 'Lançamento Rápido', desc: 'Efetive pagamentos em um clique com nosso modal de ação rápida.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8 hover:border-[#98e5dd]/20 transition-all duration-500 group">
                <div className="w-12 h-12 bg-[#98e5dd]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={22} className="text-[#98e5dd]" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-32 px-6 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 block font-mono">Investimento</span>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-10">Controle <span className="italic font-serif font-light text-[#98e5dd] lowercase tracking-normal">total</span> do seu dinheiro.</h2>
            <p className="text-zinc-500 font-medium">Preços transparentes. Escolha o plano ideal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] flex flex-col">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8"><Star size={20} className="text-zinc-500" /></div>
              <h4 className="text-lg font-bold text-zinc-500 mb-2 uppercase tracking-widest">Experimental</h4>
              <div className="text-5xl font-black text-white mb-4 italic">Grátis</div>
              <p className="text-zinc-600 text-sm font-medium mb-10">Até 2 contas e 2 cartões. Explore por 14 dias.</p>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Dashboard básico</li>
                <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Command Palette</li>
                <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Alertas de Vencimento</li>
              </ul>
              <Link to="/app" className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all uppercase tracking-widest text-xs text-center block">Começar Grátis</Link>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-zinc-900 border border-[#98e5dd]/30 p-10 rounded-[40px] flex flex-col relative animate-glow-card">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#98e5dd] text-[#020617] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Mais popular</div>
              <div className="w-12 h-12 bg-[#98e5dd]/10 rounded-2xl flex items-center justify-center mb-8"><Zap size={20} className="text-[#98e5dd]" /></div>
              <h4 className="text-lg font-bold text-[#98e5dd] mb-2 uppercase tracking-widest">Premium Mensal</h4>
              <div className="text-5xl font-black text-white mb-4">R$ 19,90<span className="text-sm text-zinc-500 font-medium">/mês</span></div>
              <p className="text-zinc-600 text-sm font-medium mb-10">Tudo ilimitado. Sem restrições.</p>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Contas & Cartões ilimitados</li>
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Saldo Projetado Completo</li>
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Relatórios Avançados</li>
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Tema Personalizável</li>
              </ul>
              <Link to="/app" className="w-full py-5 rounded-2xl bg-[#98e5dd] text-[#020617] font-black hover:brightness-110 transition-all uppercase tracking-widest text-xs text-center block" style={{ boxShadow: '0 0 25px rgba(152,229,221,0.25), 0 0 60px rgba(152,229,221,0.08)' }}>Assinar Premium</Link>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] flex flex-col">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8"><Users size={20} className="text-zinc-500" /></div>
              <h4 className="text-lg font-bold text-zinc-500 mb-2 uppercase tracking-widest">Plano Família</h4>
              <div className="text-5xl font-black text-white mb-4 italic">R$ 34,90<span className="text-sm text-zinc-500 font-medium">/mês</span></div>
              <p className="text-zinc-600 text-sm font-medium mb-10">Premium para até 3 perfis compartilhados.</p>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> 3 Perfis Integrados</li>
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Relatórios Consolidados</li>
                <li className="flex items-center gap-3 text-zinc-400 text-sm font-medium"><CheckCircle2 size={16} className="text-[#98e5dd]" /> Suporte Prioritário</li>
              </ul>
              <Link to="/app" className="w-full py-5 rounded-2xl bg-white/10 border border-white/5 text-white font-black hover:bg-white/20 transition-all uppercase tracking-widest text-xs text-center block">Assinar Família</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block h-px w-20 bg-gradient-to-r from-transparent via-[#98e5dd] to-transparent mb-8" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 font-mono">Dúvidas</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Perguntas frequentes</h3>
          </div>

          <div>
            <FaqItem delay={0.1} question="O FinTrack é realmente gratuito?" answer="Sim! Oferecemos 14 dias de teste completo, sem cartão de crédito. Após o trial, o plano gratuito continua com limites de 2 contas e 2 cartões." />
            <FaqItem delay={0.15} question="Como funciona o compartilhamento familiar?" answer="Cada usuário possui um código único de 12 caracteres. Basta compartilhar esse código com sua família e eles poderão seguir seus dados em modo somente leitura, mantendo a privacidade total." />
            <FaqItem delay={0.2} question="O que é o Saldo Projetado?" answer="É nosso algoritmo exclusivo que calcula seu saldo futuro somando todas as receitas e despesas pendentes em cada dia. Assim você sabe exatamente quanto dinheiro terá disponível em qualquer data." />
            <FaqItem delay={0.25} question="Meus dados estão seguros?" answer="Absolutamente. Usamos autenticação por tokens (Laravel Sanctum), conexões criptografadas e isolamento de dados por usuário. Nenhum dado financeiro é compartilhado sem seu consentimento explícito." />
            <FaqItem delay={0.3} question="Posso personalizar o visual do sistema?" answer="Sim! Nas configurações do sistema você pode escolher entre tema claro e escuro, e também pode trocar a cor principal do sistema para qualquer cor que desejar." />
            <FaqItem delay={0.35} question="O que é a Command Palette?" answer="É um atalho de teclado (tecla F) que abre um campo de busca universal. A partir dele, você pode navegar entre telas, criar lançamentos e executar ações sem usar o mouse." />
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#98e5dd]/5 via-transparent to-[#eeb58f]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#98e5dd]/10 blur-[200px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-[#98e5dd]/10 border border-[#98e5dd]/20 rounded-[28px] flex items-center justify-center mx-auto mb-10">
            <Wallet size={40} className="text-[#98e5dd]" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">
            Pronto para assumir<br />o <span className="italic font-serif font-light text-[#98e5dd] lowercase tracking-normal">controle</span>?
          </h2>
          <p className="text-lg text-zinc-400 font-medium mb-12 max-w-xl mx-auto">
            Junte-se a centenas de pessoas que já organizam suas finanças com o FinTrack Pro. Comece agora, é grátis.
          </p>
          <Link to="/app" className="inline-flex items-center gap-3 bg-[#98e5dd] text-[#020617] px-12 py-6 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all animate-glow-mint-lg">
            Criar minha conta <ArrowRight size={24} />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-zinc-600 text-[11px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#98e5dd]" /> Sem cartão</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#98e5dd]" /> 14 dias grátis</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#98e5dd]" /> Cancele quando quiser</span>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#98e5dd]/10 text-[#98e5dd] rounded-lg flex items-center justify-center"><Wallet size={18} fill="currentColor" /></div>
                <span className="font-black text-2xl tracking-tighter text-white uppercase italic">FinTrack<span className="text-zinc-600">.</span></span>
              </div>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">Gestão financeira pessoal inteligente. Organize suas contas, cartões e receitas com uma interface premium e compartilhe com sua família.</p>
            </div>
            <div>
              <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-6">Produto</h5>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('features')} className="text-sm font-medium text-zinc-600 hover:text-white transition-colors cursor-pointer">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-zinc-600 hover:text-white transition-colors cursor-pointer">Planos</button></li>
                <li><button onClick={() => scrollToSection('como-funciona')} className="text-sm font-medium text-zinc-600 hover:text-white transition-colors cursor-pointer">Como Funciona</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-6">Legal</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-medium text-zinc-600 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-sm font-medium text-zinc-600 hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="text-sm font-medium text-zinc-600 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.2em]">© 2026 FinTrack Pro - Todos os direitos reservados</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
              <ChevronUp size={18} className="text-zinc-500" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
