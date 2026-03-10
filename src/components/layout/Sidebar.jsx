import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebarOpen } from '../../redux/sidebarSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Search,
  Bell,
  CheckSquare,
  Settings,
  FileText,
  Users,
  Zap,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MessageCircle,
  MoreHorizontal,
  Clock,
  Bot,
  Calendar,
  Gavel
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Sample Data
const DEFAULT_USER = {
  name: "Alex Morgan",
  email: "alex@lawfront.com",
};

const NAV_ITEMS = [
  { id: 'chatbot', label: 'AI Chatbot', icon: Bot, color: '#8B5CF6', path: '/' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, color: '#10B981', path: '/legal-consoltation?view=appointments' },
  { id: 'documents', label: 'Documents', icon: FileText, color: '#3B82F6', path: '/legal-documents-review' },
  { id: 'wallet', label: 'Wallet', icon: require('lucide-react').Wallet, color: '#10B981', path: '/wallet' },
  { id: 'cases', label: 'Active Cases', icon: Briefcase, color: '#F59E0B' },
];

// AI Chat History
const SAMPLE_CHATS = [
  { id: 1, title: 'Contract Review Analysis', preview: 'Analyzed employment contract for...', time: '2m' },
  { id: 2, title: 'Legal Research Query', preview: 'Researched precedents for trademark...', time: '1h' },
  { id: 3, title: 'Document Drafting', preview: 'Generated NDA template with custom...', time: '3h' },
  { id: 4, title: 'Case Law Summary', preview: 'Summarized Supreme Court ruling on...', time: '1d' },
  { id: 5, title: 'Compliance Check', preview: 'Reviewed company policy against GDPR...', time: '2d' },
  { id: 6, title: 'IP Rights Consultation', preview: 'Discussed patent filing process...', time: '3d' },
  { id: 7, title: 'Tax Law Inquiry', preview: 'Clarified corporate tax obligations...', time: '4d' },
  { id: 8, title: 'Employment Law', preview: 'Reviewed termination procedures...', time: '5d' },
];


// Professional Animated Sidebar Toggle Icon (Shared logic)
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

const Sidebar = ({
  user = DEFAULT_USER,
  activeItem = 'dashboard',
  onNavigate,
  className = "",
  items, // Accept items prop if provided
  isLawyerAdmin = false, // New prop to toggle between User and Lawyer views
  ...chatProps // Accept chat history props
}) => {
  const { isDark, mode } = useTheme();
  const { isOpen } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [internalActiveItem, setInternalActiveItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const currentActive = onNavigate ? activeItem : internalActiveItem;
  const navItemsToUse = items || NAV_ITEMS;

  const handleNavigate = useCallback((item) => {
    const { id, path } = item;
    if (path) {
      navigate(path);
      dispatch(setSidebarOpen(false));
      return;
    }
    if (onNavigate) {
      onNavigate(id);
    } else {
      setInternalActiveItem(id);
    }
    // Auto-close sidebar on navigation ONLY on mobile for a better experience
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  }, [onNavigate, navigate, dispatch]);

  const handleToggleDesktop = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleToggleMobile = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const chatHistory = (chatProps.chatHistory && chatProps.chatHistory.length > 0) ? chatProps.chatHistory : SAMPLE_CHATS;

  const filteredChats = chatHistory.filter(chat =>
    (chat.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarContentJSX = (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0D0D0D] text-gray-400 border-[#1F1F1F]' : 'bg-white text-gray-600 border-gray-200'} font-sans border-r transition-colors duration-200`}>

      {/* Header */}
      <div className="px-3 py-4 flex items-center justify-between flex-shrink-0 border-b border-slate-100 dark:border-white/5">
        <Link to="/" className="flex items-center min-w-0 flex-1 group pl-2 gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
            <Gavel size={14} className={isDark ? 'text-black' : 'text-white'} />
          </div>
          <span className={`text-[17px] font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>
            {isLawyerAdmin ? (
              <>Bakil <span className="text-slate-400 font-normal">Admin</span></>
            ) : (
              <>Mera<span className="text-indigo-500">Bakil</span></>
            )}
          </span>
        </Link>

        {/* Interior Toggle Button - Visible on both Mobile and Desktop */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 group relative"
          title={isOpen ? "Collapse Panel" : "Expand Panel"}
        >
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
            <ChevronLeft size={16} className={isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'} />
          </div>
        </button>
      </div>

      {/* Main Navigation - Fixed */}
      <div className="px-2 py-2 space-y-0.5 flex-shrink-0">
        {navItemsToUse.map((item) => {
          const isActive = currentActive === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide capitalize transition-all duration-150 group ${isActive
                ? isDark
                  ? 'text-white bg-white/5 border border-white/5 shadow-sm'
                  : 'text-slate-900 bg-white border border-slate-200 shadow-sm'
                : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={14} className={`flex-shrink-0 transition-colors ${isActive
                  ? isDark ? 'text-white' : 'text-slate-900'
                  : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">
                  {item.label}
                </span>
              </div>
              {item.count ? (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-[#262626] text-gray-500' : 'bg-gray-200 text-gray-600'
                  }`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>



      {/* Live Search - Fixed */}
      {!isLawyerAdmin && (
        <div className="px-3 py-2 flex-shrink-0">
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-600' : 'text-gray-400'} pointer-events-none z-10`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className={`w-full ${isDark ? 'bg-[#151515] text-gray-300 border-[#222] focus:border-blue-500 placeholder:text-gray-700' : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 placeholder:text-gray-400'} text-xs rounded-lg py-2 pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all border relative z-0`}
            />
          </div>
        </div>
      )}

      {/* Live Consultations/Chats Header - Fixed */}
      <div className="px-3 py-2 mt-2 flex items-center justify-between flex-shrink-0">
        <h3 className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>
          {isLawyerAdmin ? 'Consultation Registry' : 'Conversations'}
        </h3>
        <button className={`${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Main List Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-hide">
        {isLawyerAdmin ? (
          /* Lawyer Consultation Feed in Sidebar */
          (chatProps.activeConsultations && chatProps.activeConsultations.length > 0) ? (
            chatProps.activeConsultations.map((apt) => {
              const isLive = apt.consultation_status === 'in_progress' ||
                (apt.status === 'scheduled' &&
                  Math.abs(new Date(apt.appointment_time).getTime() - new Date().getTime()) < 30 * 60 * 1000);

              return (
                <button
                  key={apt.id}
                  onClick={() => onNavigate('appointments')}
                  className={`w-full flex flex-col gap-1 p-2 rounded-lg ${isDark ? 'hover:bg-[#1A1A1A]/70' : 'hover:bg-gray-50'} transition-all group text-left relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'} flex-shrink-0`} />
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} truncate`}>
                        {apt.client_name || 'Legal Session'}
                      </span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isLive ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {isLive ? 'LIVE' : 'UPCOMING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1 pl-3">
                    <p className={`text-[9px] ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'} truncate`}>
                      {apt.case_type || 'Consultation'}
                    </p>
                    <p className={`text-[9px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <Calendar size={28} className={`mx-auto mb-2 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
              <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No sessions scheduled</p>
            </div>
          )
        ) : (
          /* Client Chat Feed in Sidebar */
          filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  dispatch(setSidebarOpen(false));
                  navigate(`/chatbot/${chat.id}`);
                }}
                className={`w-full flex flex-col gap-1 p-2 rounded-lg ${isDark ? 'hover:bg-[#1A1A1A]/70' : 'hover:bg-gray-50'} transition-all group text-left`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <MessageCircle size={11} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} truncate`}>{chat.title}</span>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-400'} flex-shrink-0`}>
                    <Clock size={9} />
                    <span>{chat.time}</span>
                  </div>
                </div>
                <p className={`text-[10px] ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'} truncate pl-4`}>{chat.preview}</p>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <MessageCircle size={28} className={`mx-auto mb-2 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
              <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No conversations found</p>
            </div>
          )
        )}
      </div>

    </div>
  );

  return (
    <>

      {/* Slide-over components handle visibility based on global state */}

      {/* Mobile Slide-over */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggleMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[120] w-72 lg:hidden shadow-2xl"
            >
              {sidebarContentJSX}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Animated Width to prevent Layout Shift */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`hidden lg:block h-screen fixed top-0 left-0 z-[100] bg-inherit border-r overflow-hidden ${isDark ? 'border-[#1F1F1F]' : 'border-gray-200'} ${className}`}
      >
        <div className="w-64 h-full">
          {sidebarContentJSX}
        </div>
      </motion.aside>

      {/* Spacer that also animates width */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 256 : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="hidden lg:block flex-shrink-0"
      />
    </>
  );
};

export default Sidebar;
