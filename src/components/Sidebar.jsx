import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Layers,
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

const Sidebar = ({
  user = DEFAULT_USER,
  activeItem = 'dashboard',
  onNavigate,
  isMobileOpen = false,
  setIsMobileOpen,
  className = "",
  sidebarOpen,
  setSidebarOpen,
  items // Accept items prop if provided
}) => {
  const { isDark } = useTheme(); // Use theme from context
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalActiveItem, setInternalActiveItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const currentActive = onNavigate ? activeItem : internalActiveItem;
  const navItemsToUse = items || NAV_ITEMS;

  const handleNavigate = useCallback((item) => {
    const { id, path } = item;

    // If it's a specific route redirection as per user request
    if (path) {
      navigate(path);
      return;
    }

    if (onNavigate) {
      onNavigate(id);
    } else {
      setInternalActiveItem(id);
    }
    // Close mobile sidebar on navigation
    if (setIsMobileOpen && window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
    if (setSidebarOpen && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [onNavigate, setIsMobileOpen, setSidebarOpen, navigate]);

  const handleToggleDesktop = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleToggleMobile = useCallback(() => {
    if (setIsMobileOpen) {
      setIsMobileOpen(prev => !prev);
    }
    if (setSidebarOpen) {
      setSidebarOpen(prev => !prev);
    }
  }, [setIsMobileOpen, setSidebarOpen]);

  const filteredChats = SAMPLE_CHATS.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine if sidebar should be open
  const isOpen = isMobileOpen || sidebarOpen;

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0D0D0D] text-gray-400 border-[#1F1F1F]' : 'bg-white text-gray-600 border-gray-200'} font-sans border-r transition-colors duration-200`}>

      {/* Header */}
      <div className={`px-3 py-3 flex items-center justify-between ${isDark ? 'border-[#1F1F1F]/50' : 'border-gray-200/50'} border-b flex-shrink-0`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
            <Layers className="text-white w-4 h-4" />
          </div>

        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={handleToggleDesktop}
          className={`hidden lg:flex items-center justify-center p-1.5 rounded-lg ${isDark ? 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-400 hover:bg-[#252525] hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-900'} border transition-all shadow-sm flex-shrink-0`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={handleToggleMobile}
          className={`lg:hidden flex items-center justify-center p-1.5 rounded-lg ${isDark ? 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#252525] hover:text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'} border transition-all shadow-sm flex-shrink-0`}
        >
          <X size={16} />
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
                ? isDark ? 'text-white bg-[#1A1A1A]' : 'text-gray-900 bg-blue-50 border border-blue-100'
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

      {/* Divider */}
      <div className={`h-px ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-200'} mx-3 my-2 flex-shrink-0`} />

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
      {/* Mobile Toggle Button - Always Visible When Sidebar Closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleToggleMobile}
            className={`lg:hidden fixed top-3 left-3 z-[90] p-1.5 rounded-lg ${isDark ? 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#252525] hover:text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'} border shadow-lg transition-all`}
          >
            <Menu size={14} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Desktop Toggle Button - When Sidebar Collapsed */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={handleToggleDesktop}
            className={`hidden lg:flex fixed top-3 left-3 z-[90] p-1.5 rounded-lg items-center justify-center ${isDark ? 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#252525] hover:text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'} border shadow-lg transition-all`}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

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
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Animated Width to prevent Layout Shift */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 0 : 256,
          opacity: 1 // Keep opacity 1 so it doesn't flash
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`hidden lg:block h-screen fixed top-0 left-0 z-[100] bg-inherit border-r overflow-hidden ${isDark ? 'border-[#1F1F1F]' : 'border-gray-200'} ${className}`}
      >
        <div className="w-64 h-full">
          <SidebarContent />
        </div>
      </motion.aside>

      {/* Spacer that also animates width */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 0 : 256 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="hidden lg:block flex-shrink-0"
      />
    </>
  );
};

export default Sidebar;
