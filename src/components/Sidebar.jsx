import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebarOpen } from '../redux/sidebarSlice';
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
import { useTheme } from '../context/ThemeContext';

// Sample Data
const DEFAULT_USER = {
  name: "Alex Morgan",
  email: "alex@lawfront.com",
};

const NAV_ITEMS = [
  { id: 'chatbot', label: 'AI Chatbot', icon: Bot, color: '#8B5CF6', path: '/' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, color: '#10B981', path: '/legal-consoltation' },
  { id: 'documents', label: 'Documents', icon: FileText, color: '#3B82F6', path: '/legal-documents-review' },
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
    <div className="relative w-6 h-6 flex items-center justify-center">
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={isOpen ? "open" : "closed"}
      >
        <motion.path
          stroke={isDark ? "#94A3B8" : "#475569"}
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { d: "M4 6L20 6", opacity: 1 },
            open: { d: "M6 6L18 18", stroke: "#3B82F6" }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.path
          stroke={isDark ? "#94A3B8" : "#475569"}
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { d: "M4 12L16 12", opacity: 1, x: 0 },
            open: { d: "M4 12L4 12", opacity: 0, x: -10 }
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          stroke={isDark ? "#94A3B8" : "#475569"}
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { d: "M4 18L20 18", opacity: 1 },
            open: { d: "M6 18L18 6", stroke: "#3B82F6" }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.svg>
    </div>
  );
};

const Sidebar = ({
  user = DEFAULT_USER,
  activeItem = 'dashboard',
  onNavigate,
  className = "",
  items, // Accept items prop if provided
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
    // Auto-close sidebar on navigation for a seamless experience
    dispatch(setSidebarOpen(false));
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
      <div className="px-3 py-3 flex items-center justify-between flex-shrink-0">
        <Link to="/" className="flex items-center min-w-0 flex-1 group">
          <span className={`text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300 truncate px-1`}>
            Mera Vakil
          </span>
        </Link>

        {/* Unified Toggle Button (Matches Navbar) */}
        <button
          onClick={handleToggleMobile}
          className={`flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 group
            ${isDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-100'}`}
          title="Close Sidebar"
        >
          <SidebarToggleIcon isOpen={true} mode={mode} />
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
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${isActive
                ? isDark ? 'text-white bg-[#1A1A1A]' : 'text-gray-900 bg-blue-50'
                : isDark ? 'hover:text-gray-200 hover:bg-[#1A1A1A]/50' : 'hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                  style={{
                    backgroundColor: isActive
                      ? `${item.color}25`
                      : (isDark ? '#1A1A1A' : '#F3F4F6'),
                    color: item.color || (isActive ? '#3B82F6' : (isDark ? '#555' : '#999'))
                  }}
                >
                  <Icon size={14} className="flex-shrink-0" />
                </motion.div>
                <span className={`transition-all duration-200 truncate ${isActive ? (isDark ? 'text-white font-bold' : 'text-gray-900 font-bold') : (isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-900')}`}>
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

      {/* Chats Header - Fixed */}
      <div className="px-3 py-2 flex items-center justify-between flex-shrink-0">
        <h3 className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-widest`}>Conversations</h3>
        <button className={`${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Chat List - Scrollable Area Only */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => dispatch(setSidebarOpen(false))}
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
        )}
      </div>

      {/* Promo Card - Fixed at Bottom */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className={`${isDark ? 'bg-gradient-to-br from-[#1A1A1A] to-[#111] border-[#222] hover:border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300'} border rounded-xl p-3 relative overflow-hidden group cursor-pointer transition-all`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-1.5 relative z-10">
            <div className={`p-1 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'} rounded-md text-blue-500`}>
              <Zap size={11} fill="currentColor" />
            </div>
            <span className={`text-[11px] font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Upgrade to Pro</span>
          </div>
          <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} leading-tight relative z-10`}>Unlock AI insights & unlimited history</p>
        </div>
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
