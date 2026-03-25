
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiServices, authAPI, tokenManager, lawyerAPI, casesAPI, consultationAPI, walletServices } from '../../api/apiService';
import NotificationDropdown from '../NotificationDropdown';
import Avatar from '../common/Avatar';
import LawyerAppointments from '../LawyerAdmin/LawyerAppointments';
import LawyerClients from '../LawyerAdmin/LawyerClients';
import LawyerCases from '../LawyerAdmin/LawyerCases';
import LawyerDocuments from '../LawyerAdmin/LawyerDocuments';
import LawyerFees from '../LawyerAdmin/LawyerFees';
import LawyerProfile from '../LawyerAdmin/LawyerProfile';
import LawyerSettings from '../LawyerAdmin/LawyerSettings';
import LawyerVerification from '../LawyerAdmin/LawyerVerification';
import WalletLayout from '../Wallet/WalletLayout';
import WithdrawFundsModal from '../Wallet/WithdrawFundsModal';
import Sidebar from '../layout/Sidebar';
import { verificationService } from '../../services/verificationService';
import {
  Home,
  Calendar,
  Users,
  FileText,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  DollarSign,
  Clock,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Sun,
  Moon,
  Search,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  PieChart as LucidePieChart,
  Star,
  Award,
  Target,
  Briefcase,
  Sparkles,
  MoreHorizontal,
  Zap,
  Shield,
  Layers,
  Bookmark,
  Flame,
  Bot,
  Video,
  CheckCircle2,
  CheckCircle,
  Clock3,
  ExternalLink,
  ChevronLeft,
  Scale,
  Check,
  AlertCircle,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart,
  Pie, Cell, AreaChart, Area
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebarOpen } from '../../redux/sidebarSlice';
import { useTheme } from '../../context/ThemeContext';

// --- Premium UI Constants & Styling ---

const COLORS = {
  primary: '#1E293B', // Professional Legal Navy
  accent: '#B45309',  // Sophisticated Amber/Gold
  dark: '#0F172A',
  darkCard: '#111827',
  lightCard: '#FFFFFF',
  textMuted: '#64748B',
  bgLight: '#F8FAFC',
};

const CHartColors = [COLORS.primary, COLORS.secondary, '#3B82F6', '#F59E0B'];

// --- Helper Components ---

const normalizeWalletBalance = (balanceData = {}) => {
  const earned = Number(balanceData.earned_balance ?? 0);
  const promo = Number(balanceData.promotional_balance ?? 0);
  const total = Number(balanceData.total_balance ?? balanceData.balance ?? (earned + promo) ?? 0);

  return {
    earnedBalance: Number.isFinite(earned) ? earned : 0,
    promotionalBalance: Number.isFinite(promo) ? promo : 0,
    totalBalance: Number.isFinite(total) ? total : 0,
  };
};

const extractTransactions = (txData) => {
  if (Array.isArray(txData)) return txData;
  if (Array.isArray(txData?.transactions)) return txData.transactions;
  if (Array.isArray(txData?.data?.transactions)) return txData.data.transactions;
  if (Array.isArray(txData?.data)) return txData.data;
  return [];
};

const computeEarningsMetrics = (balanceData, txData) => {
  const wallet = normalizeWalletBalance(balanceData);
  const transactions = extractTransactions(txData);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let monthlyCredits = 0;
  let lifetimeCredits = 0;
  let latestCreditAt = null;

  transactions.forEach((tx) => {
    const amount = Number(tx?.amount ?? tx?.credit_amount ?? 0);
    const txType = String(tx?.transaction_type || tx?.type || tx?.entry_type || '').toLowerCase();
    const isCredit = txType.includes('credit') || txType.includes('recharge') || amount > 0;
    if (!isCredit || !Number.isFinite(amount)) return;

    lifetimeCredits += amount;

    const whenRaw = tx?.created_at || tx?.timestamp || tx?.createdAt;
    const when = whenRaw ? new Date(whenRaw) : null;
    if (when && !Number.isNaN(when.getTime())) {
      if (when.getMonth() === currentMonth && when.getFullYear() === currentYear) {
        monthlyCredits += amount;
      }
      if (!latestCreditAt || when.getTime() > latestCreditAt.getTime()) {
        latestCreditAt = when;
      }
    }
  });

  return {
    ...wallet,
    monthlyCredits,
    lifetimeCredits,
    transactionsCount: transactions.length,
    latestCreditAt: latestCreditAt ? latestCreditAt.toISOString() : null,
  };
};



const GlassCard = ({ children, className = "", darkMode, hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' } : {}}
    className={`
      relative overflow-hidden rounded-[24px] border transition-all duration-300
      ${darkMode
        ? 'bg-neutral-900/80 border-white/5 backdrop-blur-xl'
        : 'bg-white/90 border-slate-200/50 backdrop-blur-lg shadow-sm'
      }
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const PremiumBadge = ({ text, type = 'primary' }) => {
  const styles = {
    primary: 'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20',
    secondary: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[type]}`}>
      {text}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-black/80 border-white/10' : 'bg-white/90 border-slate-200'} backdrop-blur-md shadow-2xl`}>
        <p className={`text-[11px] font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {entry.name}: <span className={darkMode ? 'text-white' : 'text-slate-900'}>{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Sub-Components ---

const TopNavbar = ({
  userData,
  onMenuClick,
  isSidebarOpen,
  setNotificationsDropdownOpen,
  notificationsDropdownOpen,
  notifications,
  notificationsCount,
  notificationsLoading,
  markAllAsRead,
  fetchUserNotifications,
  handleNotificationClick,
  darkMode,
  toggleDarkMode,
  handleLogout,
  searchQuery,
  setSearchQuery,
  setActiveTab
}) => (
  <header className={`sticky top-0 z-40 w-full transition-all duration-500 ${darkMode
    ? 'bg-black/20 backdrop-blur-3xl shadow-none'
    : 'bg-white/40 backdrop-blur-2xl shadow-none'
    }`}>
    <div className="flex h-12 items-center justify-between px-4 sm:px-5">
      <div className="flex items-center gap-4">
        {/* Toggle only visible when sidebar is closed, or on mobile */}
        {(!isSidebarOpen || window.innerWidth < 1024) && (
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 group"
            title="Toggle System Navigation"
          >
            <SidebarToggleIcon isOpen={isSidebarOpen} mode={darkMode ? 'dark' : 'light'} />
          </button>
        )}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md relative group overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-900'}`}>
            <Briefcase size={18} className={`relative z-10 ${darkMode ? 'text-white' : 'text-white'}`} />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <h1 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            MeraBakil<span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>.</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search - Compact & Integrated */}
        <div className={`hidden md:flex items-center h-8 px-3 gap-2 rounded-xl transition-all duration-300 w-48 lg:w-64 border 
          ${darkMode
            ? 'bg-white/5 border-white/10 focus-within:border-white/30'
            : 'bg-white border-slate-200 focus-within:border-slate-900 shadow-sm shadow-slate-200/20'}`}>
          <Search size={13} className={`${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search system..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] w-full placeholder:text-slate-400 font-bold focus:ring-0"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all ${darkMode ? 'text-amber-400 hover:bg-amber-400/10' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <NotificationDropdown
              notifications={notifications}
              notificationsCount={notificationsCount}
              notificationsLoading={notificationsLoading}
              isOpen={notificationsDropdownOpen}
              onToggle={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
              onMarkAllAsRead={markAllAsRead}
              onRefresh={fetchUserNotifications}
              onNotificationClick={handleNotificationClick}
              userId={userData?.id}
              darkMode={darkMode}
              compact={true}
            />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative group ml-1">
          <button className={`flex items-center gap-2 p-0.5 pr-2 rounded-full border transition-all ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            <Avatar
              src={userData?.profileImage}
              name={userData?.name || 'L'}
              size={24}
              className="rounded-full shadow-md"
            />
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-black leading-none uppercase tracking-widest">{userData?.name?.split(' ')[0] || 'Advocate'}</p>
              {(() => {
                const s = userData?.lawyer_data?.status;
                if (s === 'Admin Verified')
                  return <p className="text-[8px] text-blue-500 font-bold uppercase mt-1 tracking-tighter">Admin Verified</p>;
                if (s === 'Bar Council Verified')
                  return <p className="text-[8px] text-green-500 font-bold uppercase mt-1 tracking-tighter">Council Verified</p>;
                return <p className="text-[8px] text-amber-500 font-bold uppercase mt-1 tracking-tighter animate-pulse">Pending Review</p>;
              })()}
            </div>
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden border ${darkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="p-3 border-b border-inherit">
              <p className="text-[12px] font-bold truncate">{userData?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{userData?.email}</p>
            </div>
            <div className="p-1.5">
              {[
                { label: 'Academic Profile', icon: User, tab: 'profile' },
                { label: 'System Settings', icon: Settings, tab: 'settings' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${darkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <item.icon size={14} className={darkMode ? 'text-white' : 'text-slate-900'} />
                  {item.label}
                </button>
              ))}
              <div className="my-1 border-t border-inherit" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const SidebarToggleIcon = ({ isOpen, mode }) => {
  const isDark = mode === 'dark';
  return (
    <div className="relative w-5 h-5 flex flex-col justify-between items-center py-1.5">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 5, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
        className={`h-0.5 rounded-full ${isDark ? 'bg-slate-300' : 'bg-slate-950'}`}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, width: "70%" }}
        className={`h-0.5 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -5, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
        className={`h-0.5 rounded-full ${isDark ? 'bg-slate-300' : 'bg-slate-950'}`}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
};

const ScaleIcon = Scale;

// Count-up animation hook
const useCountUp = (target, duration = 1200, delay = 0) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(num) || num === 0) { setValue(target); return; }
    let startTime = null;
    let frame;
    const startAnim = () => {
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const pct = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - pct, 3); // ease-out-cubic
        const cur = Math.round(eased * num);
        // Reconstruct the original format (e.g. ₹1,234 or 89%)
        const prefix = String(target).replace(/[0-9,.]+.*/, '');
        const suffix = String(target).replace(/^[^0-9]*[0-9,.]+/, '');
        setValue(`${prefix}${cur.toLocaleString('en-IN')}${suffix}`);
        if (pct < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const timer = setTimeout(startAnim, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return value || target;
};

const ProfileCompletionWidget = ({ userData, darkMode, onNavigate }) => {
  const fields = [
    { label: 'Avatar', done: !!userData?.profileImage },
    { label: 'Bio', done: !!(userData?.lawyer_data?.bio || userData?.bio)?.trim() },
    { label: 'Specialization', done: !!(userData?.lawyer_data?.specialization || userData?.lawyer_data?.expertise) },
    { label: 'Verified', done: ['Bar Council Verified', 'Admin Verified'].includes(userData?.lawyer_data?.status) },
    { label: 'Rate set', done: !!(userData?.lawyer_data?.consultation_fee?.length) },
  ];
  const pct = Math.round((fields.filter(f => f.done).length / fields.length) * 100);
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  
  if (pct === 100) return null; // Hide when complete
  
  const textColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate('verification')}
      className={`relative group flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
        darkMode ? 'bg-neutral-900/80 border-white/10 shadow-black/50 backdrop-blur-md' : 'bg-white/90 border-slate-200 shadow-slate-200/50 backdrop-blur-md'
      }`}
      title="Complete your professional profile"
    >
      {/* Hover Gradient Wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, ${pct >= 80 ? 'rgba(16,185,129,0.08)' : pct >= 50 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}, transparent)` }}
      />

      {/* Animated Circular Progress */}
      <div className="relative z-10 flex items-center justify-center">
        <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="22" cy="22" r={radius} fill="none" stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth="3.5" />
          <motion.circle
            cx="22" cy="22" r={radius} fill="none"
            stroke={strokeColor}
            strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 3px ${textColor}80)` }}
          />
        </svg>
        <div className="absolute font-black" style={{ fontSize: '10px', color: darkMode ? '#fff' : '#0f172a' }}>
          {pct}%
        </div>
      </div>

      {/* Text Content */}
      <div className="text-left relative z-10 pr-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: textColor }}>
            Profile Setup
          </p>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor, flexShrink: 0 }} />
        </div>
        <p className={`text-[12px] font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {fields.filter(f => !f.done).length} Action{fields.filter(f => !f.done).length !== 1 ? 's' : ''} Pending
        </p>
      </div>

      {/* Action Arrow */}
      <div className={`ml-auto w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 ${
        darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'
      }`}>
        <ChevronRight size={14} strokeWidth={3} />
      </div>
    </motion.button>
  );
};

const LiveSessionCard = ({ appointment, darkMode, onJoin }) => (
  <GlassCard darkMode={darkMode} className={`p-4 mb-6 border-l-4 relative overflow-hidden
    ${darkMode
      ? 'border-l-emerald-400 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
      : 'border-l-emerald-500 bg-emerald-50/80 shadow-md'
    }`}>
    {/* Pulsing backdrop */}
    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl animate-pulse" />
    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative shadow-lg
          ${darkMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white border border-emerald-200 shadow-emerald-100'}`}>
          <Video size={20} className="text-emerald-500" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-900 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
              ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>Live</span>
            <h4 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{appointment?.client_name || 'Legal Consultation'}</h4>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={10} className="text-emerald-500" />
            Encrypted Session • {appointment?.session_token?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <button
        onClick={() => onJoin(appointment)}
        className={`ripple-btn press-scale relative px-8 h-11 rounded-2xl text-[11px] font-black uppercase tracking-wider overflow-hidden transition-all hover:scale-[1.02] shadow-xl
          ${darkMode ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-400' : 'bg-emerald-600 text-white shadow-emerald-600/25 hover:bg-emerald-700'}`}
      >
        <div className="absolute inset-0 bg-white/15 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-2">
          <Video size={14} />
          {appointment?.status === 'completed' ? 'Resume Consultation' : 'Join Live Chamber'}
        </span>
      </button>
    </div>
  </GlassCard>
);

const StatCardPremium = ({ title, value, change, trend, icon: Icon, gradient, darkMode, delay = 0 }) => {
  const displayValue = useCountUp(value, 1200, delay);
  return (
    <GlassCard
      darkMode={darkMode}
      className={`p-3.5 group/stat cursor-default press-scale stagger-item ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'}`}
      id={`stat-${title.toLowerCase().split(' ')[0]}`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className={`p-2 rounded-xl transition-all duration-300 group-hover/stat:scale-110
          ${darkMode ? 'bg-white/5 group-hover/stat:bg-white/10' : 'bg-slate-50 group-hover/stat:bg-slate-100 shadow-sm'}`}>
          <Icon size={16} className={darkMode ? 'text-slate-300' : 'text-slate-700'} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border
          ${trend === 'up'
            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            : 'bg-red-500/10 text-red-500 border-red-400/20'}`}>
          {trend === 'up' ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{title}</p>
        <p className={`stat-reveal text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          style={{ animationDelay: `${delay}ms` }}>
          {displayValue}
        </p>
        <div className="mt-3 space-y-1">
          <div className={`h-[3px] w-full rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: delay / 1000 + 0.3 }}
              className={`h-full rounded-full ${gradient
                ? `bg-gradient-to-r ${gradient}`
                : darkMode ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const EarningsSparkline = ({ darkMode }) => {
  const sparkData = [
    { day: 'M', v: 200 }, { day: 'T', v: 450 }, { day: 'W', v: 300 },
    { day: 'T', v: 700 }, { day: 'F', v: 500 }, { day: 'S', v: 850 }, { day: 'S', v: 620 },
  ];
  return (
    <div className="flex items-end gap-1 h-10 mt-3">
      {sparkData.map((d, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(d.v / 850) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
          className={`flex-1 rounded-t-sm min-h-[2px] ${darkMode ? 'bg-white/20' : 'bg-slate-900/20'}`}
          title={`${d.day}: ₹${d.v}`}
        />
      ))}
    </div>
  );
};

const LawyerDashboard = ({ darkMode, userData, onNavigate, handleJoinSession, statsData, appointmentData, activeSession, onVerified, earningsData, onOpenWithdraw, useHighContrastWithdraw = false }) => {
  const monthlyRevenue = Number(earningsData?.monthlyCredits || statsData?.revenue || 0);
  const earnedBalance = Number(earningsData?.earnedBalance || 0);
  const canWithdraw = earnedBalance > 0;
  const stats = useMemo(() => [
    { title: 'Case Volume', value: String(statsData?.total_cases || 42), change: '+12%', icon: FileText, gradient: 'from-blue-500 to-blue-600', delay: 0 },
    { title: 'Appointments', value: String(statsData?.appointments || 8), change: '+5%', icon: Calendar, gradient: 'from-green-500 to-green-600', delay: 80 },
    { title: 'Win Rate', value: '89%', change: '+5%', icon: Award, gradient: 'from-purple-500 to-purple-600', delay: 160 },
    { title: 'Billed Rev.', value: `₹${monthlyRevenue.toLocaleString('en-IN')}`, change: '+8%', icon: DollarSign, gradient: 'from-orange-500 to-orange-600', delay: 240 },
  ], [statsData, monthlyRevenue]);

  const performanceTrend = [
    { name: 'Mon', value: 400, cases: 24 },
    { name: 'Tue', value: 300, cases: 18 },
    { name: 'Wed', value: 600, cases: 35 },
    { name: 'Thu', value: 800, cases: 48 },
    { name: 'Fri', value: 500, cases: 29 },
    { name: 'Sat', value: 900, cases: 62 },
    { name: 'Sun', value: 1100, cases: 75 },
  ];

  return (
    <div className="space-y-0 max-w-[1600px] mx-auto overflow-hidden">
      <div className="p-4 sm:p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Enhanced Premium Hero Welcome Card */}
          <GlassCard darkMode={darkMode} className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            {/* Elegant Background Gradients */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 transition-colors duration-1000 ${darkMode ? 'bg-amber-500/10 group-hover:bg-amber-500/20' : 'bg-amber-400/20 group-hover:bg-amber-400/30'}`} />
            <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 transition-colors duration-1000 ${darkMode ? 'bg-blue-600/10 group-hover:bg-blue-600/20' : 'bg-blue-500/15 group-hover:bg-blue-500/25'}`} />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <PremiumBadge text="Professional Dashboard" type="primary" />
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-[9px] font-black uppercase tracking-widest shadow-sm
                    ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
                    Live System
                  </div>
                </div>
                
                <h1 className={`font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1] mb-2 ${darkMode ? 'text-white drop-shadow-md' : 'text-slate-900 drop-shadow-sm'}`}>
                  Welcome back,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-1 pb-2">
                    Adv. {userData?.name || 'Bakil'}
                  </span>
                </h1>
                <p className={`text-[11px] font-bold uppercase tracking-[0.25em] mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Secure Legal Workspace
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-md border transition-transform hover:scale-105 ${darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'}`}>
                    <Calendar size={14} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <span>{appointmentData?.length || 0} Consultations Today</span>
                  </div>
                  <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-md border transition-transform hover:scale-105 ${darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'}`}>
                    <Briefcase size={14} className={darkMode ? 'text-amber-400' : 'text-amber-500'} />
                    <span>{statsData?.total_cases || 0} Active Cases</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Profile Completion Widget positioned beautifully to the side/top on web, stacked on mobile */}
              <div className="lg:mt-0 lg:ml-auto w-full flex-shrink-0 lg:w-auto">
                <ProfileCompletionWidget userData={userData} darkMode={darkMode} onNavigate={onNavigate} />
              </div>
            </div>
          </GlassCard>

          {/* Earnings Overview Card */}
          <GlassCard darkMode={darkMode} className="p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-30 -translate-y-1/2 translate-x-1/2 ${canWithdraw ? 'bg-amber-400' : 'bg-slate-400'}`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Earnings Console</p>
                  <h3 className={`text-[15px] font-black mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Wallet Overview</h3>
                </div>
                <button
                  onClick={onOpenWithdraw}
                  disabled={!canWithdraw}
                  className={`h-8 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${!canWithdraw
                    ? (darkMode ? 'border-white/10 bg-white/5 text-slate-600 cursor-not-allowed' : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed')
                    : darkMode
                      ? useHighContrastWithdraw
                        ? 'border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
                        : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-slate-900/20 bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                    }`}
                >
                  Withdraw
                </button>
              </div>

              <EarningsSparkline darkMode={darkMode} />

              <div className={`mt-4 pt-4 border-t space-y-2 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                {[
                  { label: 'Earned Balance', value: `₹${earnedBalance.toLocaleString('en-IN')}`, highlight: true },
                  { label: 'This Month', value: `₹${Number(earningsData?.monthlyCredits || 0).toLocaleString('en-IN')}` },
                  { label: 'Lifetime', value: `₹${Number(earningsData?.lifetimeCredits || 0).toLocaleString('en-IN')}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{row.label}</span>
                    <span className={`text-[12px] font-black ${row.highlight ? (darkMode ? 'text-amber-400' : 'text-amber-600') : (darkMode ? 'text-white' : 'text-slate-900')}`}>{row.value}</span>
                  </div>
                ))}
                <div className={`pt-1 text-[9px] font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  {earningsData?.transactionsCount || 0} transactions recorded
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <AnimatePresence>
          {activeSession && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <LiveSessionCard appointment={activeSession} darkMode={darkMode} onJoin={handleJoinSession} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCardPremium key={i} {...s} trend="up" darkMode={darkMode} delay={s.delay} />
          ))}
        </div>

        {/* ═══ Premium Analytics Section ═══ */}
        <div className={`rounded-3xl border p-1 ${darkMode ? 'bg-neutral-900/50 border-white/5' : 'bg-slate-50/80 border-slate-200/60'}`}>
          {/* Section Header */}
          <div className={`flex items-center justify-between px-5 pt-4 pb-3`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-900/5'}`}>
                <Activity size={16} className={darkMode ? 'text-slate-300' : 'text-slate-700'} />
              </div>
              <div>
                <h2 className={`text-[15px] font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Performance Analytics</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Live Metrics · 7-Day Overview</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>

          {/* KPI Tiles Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-3 pb-3">
            {[
              {
                label: 'Appointments',
                value: appointmentData?.length || 0,
                suffix: 'total',
                icon: Calendar,
                color: 'blue',
                bg: darkMode ? 'from-blue-500/10 to-transparent' : 'from-blue-50 to-transparent',
                border: darkMode ? 'border-blue-500/20' : 'border-blue-200',
                text: darkMode ? 'text-blue-400' : 'text-blue-600',
                ring: 'bg-blue-500',
              },
              {
                label: 'Active Cases',
                value: statsData?.total_cases || 0,
                suffix: 'open',
                icon: Briefcase,
                color: 'amber',
                bg: darkMode ? 'from-amber-500/10 to-transparent' : 'from-amber-50 to-transparent',
                border: darkMode ? 'border-amber-500/20' : 'border-amber-200',
                text: darkMode ? 'text-amber-400' : 'text-amber-600',
                ring: 'bg-amber-500',
              },
              {
                label: 'Live Sessions',
                value: appointmentData?.filter(a => a.consultation_status === 'in_progress').length || 0,
                suffix: 'active',
                icon: Video,
                color: 'emerald',
                bg: darkMode ? 'from-emerald-500/10 to-transparent' : 'from-emerald-50 to-transparent',
                border: darkMode ? 'border-emerald-500/20' : 'border-emerald-200',
                text: darkMode ? 'text-emerald-400' : 'text-emerald-600',
                ring: 'bg-emerald-500',
              },
              {
                label: 'Earnings',
                value: `₹${Number(earningsData?.monthlyCredits || 0).toLocaleString('en-IN')}`,
                suffix: 'this month',
                icon: DollarSign,
                color: 'purple',
                bg: darkMode ? 'from-purple-500/10 to-transparent' : 'from-purple-50 to-transparent',
                border: darkMode ? 'border-purple-500/20' : 'border-purple-200',
                text: darkMode ? 'text-purple-400' : 'text-purple-600',
                ring: 'bg-purple-500',
              },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`relative overflow-hidden rounded-2xl border p-4 bg-gradient-to-br ${kpi.bg} ${kpi.border} transition-transform hover:scale-[1.02] cursor-default`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/80'} shadow-sm`}>
                    <kpi.icon size={15} className={kpi.text} />
                  </div>
                  <span className={`w-2 h-2 rounded-full ${kpi.ring} shadow-[0_0_6px_2px_currentColor] ${kpi.text}`} />
                </div>
                <p className={`text-2xl font-black tracking-tighter mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${kpi.text}`}>{kpi.label}</p>
                <p className={`text-[9px] font-bold mt-0.5 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{kpi.suffix}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart + Sessions Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 px-3 pb-3">

            {/* Multi-Line Chart */}
            <GlassCard darkMode={darkMode} className="xl:col-span-2 p-5 h-[320px] flex flex-col" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cases</span>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                  This Week
                </span>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={darkMode ? 0.35 : 0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={darkMode ? 0.35 : 0.2} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#64748b' : '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className={`px-4 py-3 rounded-2xl border shadow-2xl ${darkMode ? 'bg-neutral-900/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'}`} style={{ backdropFilter: 'blur(16px)' }}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{entry.name}:</span>
                                <span className="text-[11px] font-black ml-auto pl-4">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
                    <Area type="monotone" dataKey="cases" name="Cases" stroke="#f59e0b" strokeWidth={2} fill="url(#gradCases)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#f59e0b' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Live Session Feed */}
            <GlassCard darkMode={darkMode} className="p-5 flex flex-col" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Consultation Feed</p>
                  <h3 className={`text-[14px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recent Sessions</h3>
                </div>
                <button onClick={() => onNavigate('appointments')} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
                  View All
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-hidden">
                {(appointmentData?.length > 0) ? appointmentData.slice(0, 5).map((apt, i) => {
                  const isLive = apt.consultation_status === 'in_progress';
                  const isUpcoming = apt.status === 'scheduled';
                  return (
                    <motion.div
                      key={apt.id || i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] ${darkMode ? 'bg-white/3 hover:bg-white/6 border border-white/5' : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isLive ? (darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100') : (darkMode ? 'bg-white/5' : 'bg-slate-200')}`}>
                        {isLive
                          ? <Video size={13} className="text-emerald-500" />
                          : <User size={13} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{apt.client_name || 'Client'}</p>
                        <p className={`text-[9px] font-bold truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{apt.case_type || 'Legal Consultation'}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${
                        isLive
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : isUpcoming
                            ? (darkMode ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200')
                            : (darkMode ? 'bg-white/5 text-slate-500 border border-white/10' : 'bg-slate-100 text-slate-400 border border-slate-200')
                      }`}>
                        {isLive ? '● Live' : isUpcoming ? 'Upcoming' : 'Done'}
                      </span>
                    </motion.div>
                  );
                }) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Calendar size={24} className={`mb-2 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                    <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No sessions yet</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div> {/* close inner p-4 div */}
    </div>
  );
};

// --- Main LawyerAdmin Component ---

const LawyerAdmin = () => {
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { isOpen: isSidebarOpen } = useSelector((state) => state.sidebar);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Read ?tab= query param so returning from ConsultationSession lands on the right section
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [earningsData, setEarningsData] = useState({
    earnedBalance: 0,
    promotionalBalance: 0,
    totalBalance: 0,
    monthlyCredits: 0,
    lifetimeCredits: 0,
    transactionsCount: 0,
    latestCreditAt: null,
  });

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const isSanjayLawyer = userData?.id === 51 || userData?.email === 'sanjay.lawyer@merabakil.com';

  // Intelligent Search & Navigation Logic
  useEffect(() => {
    if (!searchQuery) return;

    const query = searchQuery.toLowerCase().trim();

    // 1. Tab Navigation Routing
    const tabMap = {
      'dashboard': ['dash', 'home', 'main', 'overview'],
      'appointments': ['appt', 'consult', 'meet', 'session', 'calendar', 'schedule'],
      'clients': ['client', 'customer', 'people', 'user', 'vault', 'crm'],
      'cases': ['case', 'legal', 'suit', 'litigation', 'active', 'portfolio'],
      'documents': ['doc', 'file', 'record', 'paper', 'archive', 'bucket'],
      'wallet': ['wallet', 'earnings', 'funds', 'balance', 'withdraw', 'payout'],
      'fees': ['fee', 'fees', 'price', 'pricing', 'rate', 'service', 'charges'],
      'verification': ['verify', 'verification', 'activate', 'credentials', 'profile setup'],
      'profile': ['profile', 'academic', 'my info', 'account'],
      'settings': ['settings', 'security', 'preferences', 'config']
    };

    for (const [tabId, keywords] of Object.entries(tabMap)) {
      if (keywords.some(k => query.includes(k))) {
        setActiveTab(tabId);
        break;
      }
    }

    // 2. Fragment Highlighting (Dashboard scroll/highlight)
    if (activeTab === 'dashboard') {
      const highlights = {
        'total': ['volume', 'total', 'case load'],
        'win': ['win', 'ratio', 'success', 'award', 'target'],
        'revenue': ['rev', 'bill', 'money', 'dollar', 'earn'],
        'active': ['hearing', 'active', 'urgent']
      };

      for (const [id, kwset] of Object.entries(highlights)) {
        if (kwset.some(k => query.includes(k))) {
          const el = document.getElementById(`stat-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Brief visual highlight effect
            el.style.boxShadow = `0 0 20px ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(30, 41, 59, 0.2)'}`;
            setTimeout(() => { if (el) el.style.boxShadow = ''; }, 2000);
          }
          break;
        }
      }
    }
  }, [searchQuery, activeTab, isDark]);

  const fetchData = React.useCallback(async (profileId, fallbackProfile = null) => {
    try {
      const [profileResponse, activeConsultResponse, walletBalanceResponse, walletTxResponse] = await Promise.all([
        authAPI.getUserProfile().catch((err) => {
          console.error("Profile API error:", err);
          return null;
        }),
        consultationAPI.getActiveSession().catch((err) => {
          console.error("Session API error:", err);
          return { data: null };
        }),
        walletServices.getBalance(profileId).catch((err) => {
          console.error("Wallet balance API error:", err);
          return {};
        }),
        walletServices.getTransactions(profileId, 1, 100).catch((err) => {
          console.error("Wallet transactions API error:", err);
          return { transactions: [] };
        }),
      ]);

      const dashData = profileResponse || {};
      const walletMetrics = computeEarningsMetrics(walletBalanceResponse, walletTxResponse);

      const stats = {
        total_cases: dashData?.recent_activity?.cases_summary?.total || 0,
        revenue: walletMetrics?.monthlyCredits || dashData?.recent_activity?.billing_summary?.monthly_revenue || 0,
        upcoming_count: dashData?.recent_activity?.appointments?.length || 0,
        trends: dashData?.recent_activity?.appointment_trends || [],
        revenue_trends: dashData?.recent_activity?.revenue_trends || []
      };

      // Merge and sanitize appointments from profile JSON hierarchy
      // We use localStorage as a high-integrity source of truth to avoid stale closures in polling
      let appointments = dashData?.recent_activity?.appointments || [];
      const profileData = fallbackProfile || JSON.parse(localStorage.getItem('user_profile') || '{}');
      const profileAppointments = profileData?.recent_activity?.appointments;

      if ((!appointments || appointments.length === 0) && Array.isArray(profileAppointments)) {
        console.log(`Smart Data Sync: Falling back to profile stream for appointments. Found ${profileAppointments.length} appointments.`);
        appointments = profileAppointments;
      } else if (appointments.length > 0) {
        console.log(`Smart Data Sync: Using ${appointments.length} appointments from dashboard API.`);
      } else {
        console.log(`Smart Data Sync: No appointments found from dashboard API or profile stream.`);
      }

      const activeConsult = activeConsultResponse?.data?.has_active_session
        ? activeConsultResponse.data.session
        : null;

      // Auto-promote live or in-progress appointments to dashboard focus
      let effectivelyActive = activeConsult;
      if (!effectivelyActive && Array.isArray(appointments)) {
        const liveApt = appointments.find(apt => {
          if (!apt?.appointment_time) return false;

          // Priority 1: Explicitly marked as in_progress
          if (apt.consultation_status === 'in_progress') return true;

          const aptTime = new Date(apt.appointment_time).getTime();
          const now = new Date().getTime();
          const durationMs = (apt.duration_minutes || 60) * 60 * 1000;

          // Priority 2: Temporal proximity (15m before, up to duration after)
          // Allow rejoining ("resuming") even if 'completed' as long as the session time hasn't lapsed.
          return (apt.status === 'scheduled' || apt.status === 'completed') &&
            (aptTime - now) < 15 * 60 * 1000 &&
            (now - aptTime) < durationMs;
        });

        if (liveApt) {
          effectivelyActive = {
            ...liveApt,
            is_auto_detected: true,
            session_token: liveApt.session_token || 'pending'
          };
        }
      }

      setStatsData(stats);
      setAppointmentData(Array.isArray(appointments) ? appointments : []);
      setActiveSession(effectivelyActive);
      setEarningsData(walletMetrics);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, []); // REMOVED userData dependency to kill the loop

  const initData = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await authAPI.getUserProfile();
      // Extract the actual profile data from the Axios response
      const profile = response.data?.data || response.data;
      setUserData(profile);

      // IMMEDIATE DATA PRE-WARMING
      // Inject consultations from profile activity instantly before dashboard API cycle
      if (profile?.recent_activity?.appointments) {
        console.log(`Pre-warming dashboard with ${profile.recent_activity.appointments.length} consultations from profile`);
        setAppointmentData(profile.recent_activity.appointments);

        // Also set active session if any are live in the pre-warmed data
        const liveApt = profile.recent_activity.appointments.find(apt =>
          apt.consultation_status === 'in_progress'
        );
        if (liveApt) setActiveSession(liveApt);
      }

      setLoading(false);
      if (profile?.id) {
        // Trigger deep background fetch for professional metrics
        await fetchData(profile.id, profile);
        fetchUserNotifications(profile.id);
      }
    } catch (error) {
      console.error('Error initializing lawyer admin:', error);
      setLoading(false); // Safety fallback
    }
  }, [fetchData]);

  useEffect(() => {
    // If sidebar preference isn't set, default to open for lawyer admin
    if (localStorage.getItem('sidebarOpen') === null) {
      dispatch(setSidebarOpen(true));
    }

    initData();
  }, [dispatch, fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real-time synchronization polling (every 30 seconds)
  useEffect(() => {
    if (!userData?.id) return;

    const intervalId = setInterval(() => {
      // Only poll if the tab is visible to save resources
      if (document.visibilityState === 'visible') {
        fetchData(userData.id);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userData?.id, fetchData]);

  const fetchUserNotifications = async (userId) => {
    setNotificationsLoading(true);
    try {
      const data = await apiServices.getUserNotifications(userId);
      setNotifications(data.notifications || []);
      setNotificationsCount(data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!userData?.id) return;
    try {
      await apiServices.markAllNotificationsAsRead(userData.id);
      setNotificationsCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    setNotificationsDropdownOpen(false);
    if (notification.type === 'APPOINTMENT') setActiveTab('appointments');
    else if (notification.type === 'CASE') setActiveTab('cases');
  };

  const handleJoinSession = async (session) => {
    if (!session) return;
    let token = session?.session_token;

    // If we only have an appointment ID and the token is pending
    if (!token || token === 'pending') {
      try {
        setLoading(true);
        // We might need to call startSession to get the real token
        if (!session?.appointment_id && !session?.id) {
          throw new Error('No valid session or appointment ID provided');
        }
        const result = await consultationAPI.startSession(session.appointment_id || session.id);
        token = result.session_token;
      } catch (err) {
        console.error('Failed to initialize session:', err);
        setLoading(false);
        return;
      }
    }

    if (!token) return;

    // Smooth "Secure Tunneling" transition effect
    setLoading(true);
    // Extra delay for professional "establishing connection" feel
    setTimeout(() => {
      navigate(`/consultation/${token}`);
    }, 1200);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      tokenManager.removeToken();
      window.location.href = '/auth';
    } catch (error) {
      tokenManager.removeToken();
      window.location.href = '/auth';
    }
  };

  const handleWithdraw = async (amount) => {
    if (!userData?.id) return;
    try {
      setWithdrawLoading(true);
      await walletServices.withdraw({
        user_id: userData.id,
        amount: parseFloat(amount),
        description: 'Lawyer wallet withdrawal'
      });
      await fetchData(userData.id);
      setIsWithdrawOpen(false);
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const isVerified = ['Bar Council Verified', 'Admin Verified'].includes(userData?.lawyer_data?.status);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: COLORS.primary },
    { id: 'verification', label: 'Verification', icon: ShieldCheck, color: COLORS.primary, badge: !isVerified ? 'Pending' : undefined },
    { id: 'appointments', label: 'Consultations', icon: Calendar, color: COLORS.primary },
    { id: 'clients', label: 'Client Center', icon: Users, color: COLORS.primary },
    { id: 'cases', label: 'Active Cases', icon: Briefcase, color: COLORS.primary },
    { id: 'documents', label: 'Knowledge Base', icon: FolderOpen, color: COLORS.primary },
    { id: 'wallet', label: 'Wallet & Earnings', icon: Wallet, color: COLORS.primary },
    { id: 'fees', label: 'Service Fees', icon: DollarSign, color: COLORS.primary },
    { id: 'profile', label: 'Academic Profile', icon: User, color: COLORS.primary },
    { id: 'settings', label: 'System Settings', icon: Settings, color: COLORS.primary },
  ];

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A]' : 'bg-slate-50'}`}>
        <div className="relative flex flex-col items-center max-w-[280px] w-full px-6">
          {/* Main Loader Ring */}
          <div className="relative w-24 h-24 mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-white/10 border-t-white' : 'border-slate-200 border-t-slate-900 shadow-[0_0_15px_rgba(30,41,59,0.1)]'}`}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className={`absolute inset-4 rounded-full border ${isDark ? 'border-white/5 border-b-white/20' : 'border-slate-100 border-b-slate-400'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Scale size={32} className={`opacity-20 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            </div>
          </div>

          <div className="text-center space-y-3 w-full">
            <h2 className={`text-[13px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Preparing Dashboard
            </h2>
            <div className={`h-[2px] w-full rounded-full overflow-hidden relative ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className={`absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent ${isDark ? 'via-white to-transparent' : 'via-slate-900 to-transparent'}`}
              />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Establishing Secure Session...
            </p>
          </div>
        </div>

        {/* Subtle background branding */}
        <div className="absolute bottom-12 left-0 right-0 text-center opacity-10 pointer-events-none">
          <span className={`text-[14px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            MERABAKIL
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Sidebar
        isLawyerAdmin={true}
        activeItem={activeTab}
        onNavigate={(id) => setActiveTab(id)}
        items={sidebarItems}
        user={userData}
        activeConsultations={appointmentData}
      />

      <div className="flex flex-col flex-1 transition-all duration-300 min-w-0">
        <TopNavbar
          userData={userData}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => dispatch(toggleSidebar())}
          notifications={notifications}
          notificationsCount={notificationsCount}
          notificationsLoading={notificationsLoading}
          notificationsDropdownOpen={notificationsDropdownOpen}
          setNotificationsDropdownOpen={setNotificationsDropdownOpen}
          markAllAsRead={markAllAsRead}
          fetchUserNotifications={() => fetchUserNotifications(userData?.id)}
          handleNotificationClick={handleNotificationClick}
          darkMode={isDark}
          toggleDarkMode={toggleTheme}
          handleLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setActiveTab={setActiveTab} // Pass setActiveTab to TopNavbar
        />

        <main className="flex-1 overflow-x-hidden pt-2 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === 'verification' && (
                <LawyerVerification
                  darkMode={isDark}
                  userData={userData}
                  onComplete={initData}
                />
              )}
              {activeTab === 'dashboard' && (
                <LawyerDashboard
                  darkMode={isDark}
                  userData={userData}
                  onNavigate={setActiveTab}
                  handleJoinSession={handleJoinSession}
                  statsData={statsData}
                  appointmentData={appointmentData}
                  activeSession={activeSession}
                  onVerified={initData}
                  earningsData={earningsData}
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  useHighContrastWithdraw={isSanjayLawyer}
                />
              )}
              {activeTab === 'appointments' && (
                <LawyerAppointments
                  darkMode={isDark}
                  userData={userData}
                  activeSession={activeSession}
                  initialAppointments={appointmentData}
                />
              )}
              {activeTab === 'clients' && <LawyerClients darkMode={isDark} />}
              {activeTab === 'cases' && <LawyerCases darkMode={isDark} />}
              {activeTab === 'documents' && <LawyerDocuments darkMode={isDark} />}
              {activeTab === 'wallet' && <WalletLayout />}
              {activeTab === 'fees' && <LawyerFees darkMode={isDark} userData={userData} />}
              {activeTab === 'profile' && <LawyerProfile darkMode={isDark} />}
              {activeTab === 'settings' && <LawyerSettings darkMode={isDark} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform ${isDark ? 'bg-white text-slate-900 shadow-white/20' : 'bg-slate-900 text-white shadow-slate-900/30'}`}>
          <Plus size={24} />
        </button>
      </div>

      <WithdrawFundsModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onConfirm={handleWithdraw}
        isDark={isDark}
        loading={withdrawLoading}
        maxWithdrawable={Number(earningsData?.earnedBalance || 0)}
        useHighContrastWithdraw={isSanjayLawyer}
      />
    </div>
  );
};

const Gavel = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 11a1 1 0 01-1 1H4a1 1 0 01-1-1l3-11zm12 0l3 11a1 1 0 01-1 1h-1a1 1 0 01-1-1l3-11zm-6-2v2m0 12v2m-4-7h8m-11 5h14" />
  </svg>
);

export default LawyerAdmin;
