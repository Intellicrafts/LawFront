
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiServices, authAPI, tokenManager, lawyerAPI, casesAPI, consultationAPI, lawyerAdminAPI } from '../../api/apiService';
import NotificationDropdown from '../NotificationDropdown';
import Avatar from '../common/Avatar';
import LawyerAppointments from '../LawyerAdmin/LawyerAppointments';
import LawyerClients from '../LawyerAdmin/LawyerClients';
import LawyerCases from '../LawyerAdmin/LawyerCases';
import LawyerDocuments from '../LawyerAdmin/LawyerDocuments';
import LawyerProfile from '../LawyerAdmin/LawyerProfile';
import LawyerSettings from '../LawyerAdmin/LawyerSettings';
import Sidebar from '../layout/Sidebar';
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
  Clock3,
  ExternalLink,
  ChevronLeft,
  Scale
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
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden">
            <Briefcase size={18} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
          </div>
          <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Mera Vakil
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
              <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 opacity-70 tracking-tighter">Council Verified</p>
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

const LiveSessionCard = ({ appointment, darkMode, onJoin }) => (
  <GlassCard darkMode={darkMode} className={`p-4 mb-6 border-l-4 ${darkMode ? 'border-l-white bg-white/5' : 'border-l-slate-900 bg-slate-50 shadow-sm'}`}>
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${darkMode ? 'bg-white/10' : 'bg-white shadow-md'}`}>
          <Video size={20} className={darkMode ? 'text-white' : 'text-slate-900'} />
          <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${darkMode ? 'bg-white border-neutral-900' : 'bg-slate-900 border-white'} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Active Channel: {appointment?.client_name || 'Legal Consultation'}</h4>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={10} className="text-blue-500" />
            Secure Session • {appointment?.session_token?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <button
        onClick={() => onJoin(appointment)}
        className="relative px-8 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[12px] font-black uppercase tracking-wider overflow-hidden group/btn transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-2">
          Join Consultation Room <ChevronRight size={16} />
        </span>
      </button>
    </div>
  </GlassCard>
);

const StatCardPremium = ({ title, value, change, trend, icon: Icon, color, darkMode }) => (
  <GlassCard
    darkMode={darkMode}
    className={`p-3.5 group/stat ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
    id={`stat-${title.toLowerCase().split(' ')[0]}`}
  >
    <div className="flex items-start justify-between mb-2.5">
      <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'} transition-all group-hover/stat:scale-110 group-hover/stat:bg-slate-900/10 dark:group-hover/stat:bg-white/10`}>
        <Icon size={16} className={darkMode ? 'text-slate-300' : 'text-slate-900'} />
      </div>
      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${trend === 'up' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-500'}`}>
        {trend === 'up' ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
        {change}%
      </div>
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{title}</p>
      <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
      <div className="mt-2 h-[3px] w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-slate-900 dark:bg-white"
        />
      </div>
    </div>
  </GlassCard>
);

const LawyerDashboard = ({ darkMode, userData, onNavigate, handleJoinSession, statsData, appointmentData, activeSession }) => {
  const stats = useMemo(() => [
    { title: 'Case Volume', value: statsData?.total_cases || '42', change: '+12%', icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Appointments', value: statsData?.appointments || '8', change: '+5%', icon: Calendar, gradient: 'from-green-500 to-green-600' },
    { title: 'Win Rate', value: '89%', change: '+5%', icon: Award, gradient: 'from-purple-500 to-purple-600' },
    { title: 'Billed Rev.', value: `₹${statsData?.revenue || '45,230'}`, change: '+8%', icon: DollarSign, gradient: 'from-orange-500 to-orange-600' },
  ], [statsData]);

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
    <div className="p-4 sm:p-5 space-y-5 max-w-[1600px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <GlassCard darkMode={darkMode} className="lg:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors ${darkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-slate-900/5 group-hover:bg-slate-900/10'}`} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <PremiumBadge text="Professional Dashboard" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Advancing Justice,<br />
              <span className="text-slate-900 dark:text-white underline decoration-slate-400/30 underline-offset-8">
                Adv. {userData?.name || 'Vakil'}
              </span>
            </h1>
            <p className={`text-[12px] max-w-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed font-bold opacity-80`}>
              Current roster: <span className="text-slate-900 dark:text-slate-300">{appointmentData?.length || 0} active sessions</span>.
            </p>
          </div>
        </GlassCard>

        <GlassCard darkMode={darkMode} className="p-6 relative">
          <h3 className="text-lg font-black">AI Insights</h3>
          <p className="text-sm opacity-70">Strategy shift recommended for case #29-B.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <StatCardPremium key={i} {...stat} darkMode={darkMode} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard darkMode={darkMode} className="xl:col-span-2 p-5 h-[340px] flex flex-col">
          <h3 className="font-bold mb-4">Performance Analytics</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={0.3} fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard darkMode={darkMode} className="p-5">
          <h3 className="font-bold mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {appointmentData?.slice(0, 3).map((apt, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-medium">{apt.client_name || 'Client'}</span>
                <span className="text-[10px] opacity-50">{apt.case_type}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// --- Main LawyerAdmin Component ---

const LawyerAdmin = () => {
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { isOpen: isSidebarOpen } = useSelector((state) => state.sidebar);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      const [dashResponse, activeConsultResponse] = await Promise.all([
        lawyerAdminAPI.getDashboardData(profileId).catch((err) => {
          console.error("Dashboard API error:", err);
          return { data: {} };
        }),
        consultationAPI.getActiveSession().catch((err) => {
          console.error("Session API error:", err);
          return { data: null };
        })
      ]);

      const dashData = dashResponse?.data || {};

      const stats = {
        total_cases: dashData.active_cases || 0,
        revenue: dashData.monthly_revenue || 0,
        upcoming_count: dashData.upcoming_appointments?.length || 0,
        trends: dashData.appointment_trends || [],
        revenue_trends: dashData.revenue_trends || []
      };

      // Merge and sanitize appointments from profile JSON hierarchy
      // We use localStorage as a high-integrity source of truth to avoid stale closures in polling
      let appointments = dashData.upcoming_appointments || [];
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

          // Priority 2: Temporal proximity (15m before, 2h after)
          return apt.status === 'scheduled' &&
            (aptTime - now) < 15 * 60 * 1000 &&
            (now - aptTime) < 120 * 60 * 1000;
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
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, []); // REMOVED userData dependency to kill the loop

  useEffect(() => {
    // If sidebar preference isn't set, default to open for lawyer admin
    if (localStorage.getItem('sidebarOpen') === null) {
      dispatch(setSidebarOpen(true));
    }

    const initData = async () => {
      setLoading(true);
      try {
        const profile = await authAPI.getUserProfile();
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
    };
    initData();
  }, [dispatch, fetchData]);

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
      navigate('/auth');
    } catch (error) {
      tokenManager.removeToken();
      navigate('/auth');
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: COLORS.primary },
    { id: 'appointments', label: 'Consultations', icon: Calendar, color: COLORS.primary },
    { id: 'clients', label: 'Client Center', icon: Users, color: COLORS.primary },
    { id: 'cases', label: 'Active Cases', icon: Briefcase, color: COLORS.primary },
    { id: 'documents', label: 'Knowledge Base', icon: FolderOpen, color: COLORS.primary },
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
            MERA VAKIL
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
              {activeTab === 'dashboard' && (
                <LawyerDashboard
                  darkMode={isDark}
                  userData={userData}
                  onNavigate={setActiveTab}
                  handleJoinSession={handleJoinSession}
                  statsData={statsData}
                  appointmentData={appointmentData}
                  activeSession={activeSession}
                />
              )}
              {activeTab === 'appointments' && (
                <LawyerAppointments
                  darkMode={isDark}
                  initialAppointments={appointmentData}
                  userData={userData}
                  activeSession={activeSession}
                />
              )}
              {activeTab === 'clients' && <LawyerClients darkMode={isDark} />}
              {activeTab === 'cases' && <LawyerCases darkMode={isDark} />}
              {activeTab === 'documents' && <LawyerDocuments darkMode={isDark} />}
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
    </div>
  );
};

const Gavel = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 11a1 1 0 01-1 1H4a1 1 0 01-1-1l3-11zm12 0l3 11a1 1 0 01-1 1h-1a1 1 0 01-1-1l3-11zm-6-2v2m0 12v2m-4-7h8m-11 5h14" />
  </svg>
);

export default LawyerAdmin;