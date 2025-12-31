import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import VoiceModal from './VoiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, Settings, User, LogOut, Sun, Moon,
  Mic, Upload, SendHorizontal, ImageIcon, Globe, Bot,
  ChevronDown, Search as SearchIcon, MessageSquare, Sparkles,
  Heart, Share2, Copy, Volume2, Download, CheckCircle
} from 'lucide-react';

// Streaming Text Component (Google Gemini style)
const StreamingText = ({ text, isDark }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // Streaming speed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={isDark ? 'text-gray-100' : 'text-gray-900'}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

const MessageBubble = ({ message, isDark, isUser, isStreaming = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
  >
    <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden ${isUser
          ? isDark
            ? 'bg-[#1F1F1F] text-gray-50 border border-[#2A2A2A]'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
          : isDark
            ? 'bg-transparent text-gray-200'
            : 'bg-transparent text-gray-800'
          }`}
      >
        {isStreaming && !isUser ? (
          <StreamingText text={message} isDark={isDark} />
        ) : (
          <span>{message}</span>
        )}
      </div>
    </div>
  </motion.div>
);

const getModalIcon = (id) => {
  const icons = {
    bakilat: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2C12 2 14 6 16 8L20 10C16 12 12 14 12 14C12 14 8 12 4 10L8 8C10 6 12 2 12 2Z" fill="currentColor" opacity="0.9" /><circle cx="12" cy="16" r="2" fill="currentColor" /><path d="M10 20L12 22L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g></svg>,
    nyaaya: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2L18 8H16V14H8V8H6L12 2Z" fill="currentColor" opacity="0.9" /><rect x="7" y="15" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="10" y1="15" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" /><line x1="14" y1="15" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" /></g></svg>,
    munshi: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M8 7H16M8 11H16M8 15H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></g></svg>,
    adalat: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2L20 7V12C20 18 12 22 12 22C12 22 4 18 4 12V7L12 2Z" fill="currentColor" opacity="0.8" /><path d="M10 13L11.5 14.5L15 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g></svg>
  };
  return icons[id] || icons.bakilat;
};

const modalOptions = [
  { id: 'bakilat', label: 'Bakilat 2.0', description: 'Advanced AI for everyday legal tasks,', color: 'violet' },
  { id: 'nyaaya', label: 'Nyaaya 3.1', description: 'For comprehensive case analysis ,judgment analysis & judicial decision forecasting', color: 'emerald' },
  { id: 'munshi', label: 'Munshi 3', description: 'Specialized in contract drafting, document generation & legal templates', color: 'amber' },
  { id: 'adalat', label: 'Adalat 2.1', description: 'Expert litigation support, case strategy & courtroom guidance', color: 'indigo' }
];

const AIAssistantDropdown = ({ selectedModal, setSelectedModal, showDropdown, setShowDropdown, isDark }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const selected = modalOptions.find(opt => opt.id === selectedModal) || modalOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-300 ${selected.color === 'violet'
          ? isDark ? 'bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30' : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
          : selected.color === 'emerald'
            ? isDark ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            : selected.color === 'amber'
              ? isDark ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
              : isDark ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
        title="Select AI Assistant"
      >
        <motion.div
          key={selectedModal}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {getModalIcon(selectedModal)}
        </motion.div>
        <span className="text-sm font-semibold hidden sm:inline">{selected.label}</span>
        <motion.div animate={{ rotate: showDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 30 }}
            className={`absolute left-0 top-full mt-2 w-64 rounded-xl shadow-2xl z-50 overflow-hidden border backdrop-blur-xl
              ${isDark ? 'bg-[#1A1A1A]/95 border-gray-500/50' : 'bg-white/95 border-gray-300/50'}`}
          >
            {modalOptions.map((option, idx) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setSelectedModal(option.id);
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-1.5 text-left border-b last:border-b-0 transition-all duration-200
                  ${selectedModal === option.id
                    ? option.color === 'violet'
                      ? isDark ? 'bg-violet-600/20 border-violet-500/50 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-900'
                      : option.color === 'emerald'
                        ? isDark ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : option.color === 'amber'
                          ? isDark ? 'bg-amber-600/20 border-amber-500/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                          : isDark ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : isDark
                      ? 'border-[#3A3A3A]/40 hover:bg-[#2C2C2C] text-gray-300'
                      : 'border-gray-200/40 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0 ${option.color === 'violet' ? 'text-violet-500' :
                    option.color === 'emerald' ? 'text-emerald-500' :
                      option.color === 'amber' ? 'text-amber-500' :
                        'text-indigo-500'
                    }`}>
                    {getModalIcon(option.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${selectedModal === option.id ? 'font-bold' : ''}`}>
                      {option.label}
                    </div>
                    <div className={`text-[11px] mt-0 leading-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </div>
                  </div>
                  {selectedModal === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle size={16} className={`flex-shrink-0 mt-0.5 ${option.color === 'violet' ? 'text-violet-500' :
                        option.color === 'emerald' ? 'text-emerald-500' :
                          option.color === 'amber' ? 'text-amber-500' :
                            'text-indigo-500'
                        }`} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedModal, setSelectedModal] = useState('bakilat');
  const [showModalDropdown, setShowModalDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "What's one lesson life has taught you recently?",
      date: "Tomorrow",
      starred: false,
      unread: false
    },
    {
      id: 2,
      title: "What's one mistake that taught you a valuable lesson?",
      date: "Tomorrow",
      starred: false,
      unread: false
    },
    {
      id: 3,
      title: "What's one goal that excites you the most?",
      date: "Tomorrow",
      starred: false,
      unread: false
    },
    {
      id: 4,
      title: "If animals could talk, which one would be most interesting?",
      date: "10 days Ago",
      starred: false,
      unread: false
    },
    {
      id: 5,
      title: "What's one word to describe your day?",
      date: "10 days Ago",
      starred: false,
      unread: false
    }
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModalDropdown(false);
      }
    };

    if (showModalDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModalDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const allFiles = [...uploadedFiles, ...pendingFiles];
    if (query.trim() || allFiles.length > 0) {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      setIsLoading(true);
      setTimeout(() => {
        if (query.trim()) {
          setMessages([...messages, { role: 'user', content: query }]);
          setMessages(prev => [...prev, { role: 'assistant', content: 'I understand your query. How can I assist you further?' }]);
        }
        setQuery('');
        setUploadedFiles([]);
        setPendingFiles([]);
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
        }
      }, 800);
    }
  };

  const handleVoiceToggle = () => {
    setShowVoiceModal(!showVoiceModal);
  };

  const handleVoiceResult = (result) => {
    setQuery(result);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFileUpload = (files) => {
    if (files) {
      const newFiles = Array.from(files);
      if (messages.length === 0) {
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      } else {
        setPendingFiles([...pendingFiles, ...newFiles]);
      }
    }
  };

  const removeUploadedFile = (index, isPending = false) => {
    if (isPending) {
      setPendingFiles(pendingFiles.filter((_, i) => i !== index));
    } else {
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setMessages([]);
    setQuery('');
    setUploadedFiles([]);
  };

  const handleToggleStar = (chatId) => {
    setChatHistory(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
    ));
  };

  const handleArchiveChat = (chatId) => {
    console.log('Archive:', chatId);
  };

  const handleDeleteChat = (chatId) => {
    console.log('Delete:', chatId);
  };

  const handleUpdateChatTitle = (chatId, newTitle) => {
    setChatHistory(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300
      ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatHistory={chatHistory}
        handleReset={handleReset}
        toggleStar={handleToggleStar}
        archiveChat={handleArchiveChat}
        deleteChat={handleDeleteChat}
        updateChatTitle={handleUpdateChatTitle}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden`}>

        <header className={`transition-colors duration-300 flex-shrink-0
          ${isDark
            ? 'bg-[#0A0A0A]'
            : 'bg-white'}`}>
          <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-end gap-2">

            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                className={`p-1.5 rounded-lg transition-all duration-200
                  ${isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                <SearchIcon size={16} strokeWidth={1.5} />
              </motion.button>

              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-1.5 rounded-lg transition-all duration-200 relative
                    ${isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Bell size={16} strokeWidth={1.5} />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  ></motion.span>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.92 }}
                      transition={{ duration: 0.15, type: 'spring' }}
                      className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-xl z-50 overflow-hidden border
                        ${isDark
                          ? 'bg-[#2C2C2C] border-[#3A3A3A]/80'
                          : 'bg-white border-gray-200/80'}`}
                    >
                      <div className={`px-5 py-4 border-b
                        ${isDark ? 'border-[#3A3A3A]/60 bg-[#2C2C2C]' : 'border-gray-200/60 bg-white'}`}>
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Notifications
                        </h3>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {[
                          { id: 1, title: 'New case assigned', time: '5m ago', type: 'case' },
                          { id: 2, title: 'Document uploaded', time: '1h ago', type: 'document' },
                          { id: 3, title: 'Hearing scheduled', time: '2h ago', type: 'hearing' }
                        ].map((notification, idx) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.2 }}
                            className={`px-5 py-3 border-b last:border-b-0 transition-all cursor-pointer
                              ${isDark
                                ? 'border-[#3A3A3A]/40 hover:bg-[#3A3A3A]/50 text-white'
                                : 'border-gray-200/60 hover:bg-gray-50 text-gray-900'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${notification.type === 'case' ? 'bg-blue-500' :
                                notification.type === 'document' ? 'bg-green-500' :
                                  'bg-amber-500'
                                }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                  {notification.title}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className={`px-5 py-3 border-t text-center
                        ${isDark ? 'border-[#3A3A3A]/60 bg-[#2C2C2C]' : 'border-gray-200/60 bg-white'}`}>
                        <button className={`text-xs font-semibold transition-colors
                          ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                className={`p-1.5 rounded-lg transition-all duration-200
                  ${isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Settings size={16} strokeWidth={1.5} />
              </motion.button>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                    ${isDark
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:shadow-blue-500/30'
                      : 'bg-gradient-to-br from-blue-500 to-blue-400 text-white hover:shadow-blue-400/30'}`}
                >
                  <User size={14} strokeWidth={1.5} />
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.9 }}
                      transition={{ duration: 0.15, type: 'spring' }}
                      className={`absolute right-0 mt-3 w-52 rounded-2xl shadow-2xl z-50 overflow-hidden
                        ${isDark ? 'bg-[#1A1A1A] border border-[#3A3A3A]' : 'bg-white border border-gray-200'}`}
                    >
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all font-medium
                        ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <User size={16} strokeWidth={1.5} /> Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all font-medium
                        ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Settings size={16} strokeWidth={1.5} /> Settings
                      </motion.button>
                      <div className={`my-1 ${isDark ? 'border-[#3A3A3A]' : 'border-gray-200'} border-t`}></div>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: isDark ? '#3A1F1F' : '#FEE2E2' }}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all font-medium text-red-500 hover:text-red-600`}>
                        <LogOut size={16} strokeWidth={1.5} /> Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">

          {messages.length === 0 ? (
            <motion.div
              layout
              className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1 shadow-xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className={`w-full h-full rounded-full flex items-center justify-center
                    ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                    <Sparkles size={32} className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}
                >
                  Welcome to Mera Vakil
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Your Intelligent Legal Assistant
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 scroll-smooth"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="max-w-3xl mx-auto w-full">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={idx}
                    message={msg.content}
                    isDark={isDark}
                    isUser={msg.role === 'user'}
                    isStreaming={idx === messages.length - 1 && msg.role === 'assistant'}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div
            layout
            transition={{ duration: 0.3, type: 'spring' }}
            className={`transition-colors duration-300 px-3 sm:px-4 py-3 flex-shrink-0
            ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>

            <motion.div
              layout
              className="max-w-2xl mx-auto space-y-2 relative">

              {messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-1 py-1"
                >
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold backdrop-blur-sm border
                    ${isDark
                      ? 'bg-gray-600/20 border-gray-500/50 text-gray-300'
                      : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                  >
                    <div className={`w-3 h-3 flex items-center justify-center ${selectedModal === 'bakilat' ? 'text-violet-500' :
                      selectedModal === 'nyaaya' ? 'text-emerald-500' :
                        selectedModal === 'munshi' ? 'text-amber-500' :
                          'text-indigo-500'
                      }`}>
                      {getModalIcon(selectedModal)}
                    </div>
                    <span>{modalOptions.find(opt => opt.id === selectedModal)?.label || 'Bakilat 2.0'}</span>
                  </div>
                </motion.div>
              )}

              {(uploadedFiles.length > 0 || pendingFiles.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-wrap gap-1.5 px-1 py-1`}
                >
                  {uploadedFiles.map((file, idx) => (
                    <motion.div
                      key={`uploaded-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]
                        ${isDark ? 'bg-gray-600/20 border border-gray-500/40' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <Upload size={11} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      <span className={`font-medium truncate max-w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeUploadedFile(idx)}
                        className={`hover:opacity-70 transition-opacity`}
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                  {pendingFiles.map((file, idx) => (
                    <motion.div
                      key={`pending-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]
                        ${isDark ? 'bg-green-600/20 border border-green-500/40' : 'bg-green-50 border border-green-200'}`}
                    >
                      <Upload size={11} className={isDark ? 'text-green-400' : 'text-green-600'} />
                      <span className={`font-medium truncate max-w-20 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeUploadedFile(idx, true)}
                        className={`hover:opacity-70 transition-opacity`}
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div
                layout
                transition={{ duration: 0.2 }}
                className={`rounded-xl transition-all duration-300 overflow-visible backdrop-blur-md border shadow-sm mx-auto max-w-4xl
                ${isDark
                    ? 'bg-[#1e1e1e]/60 border-[#333] focus-within:bg-[#1e1e1e]/80 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-700/50'
                    : 'bg-white/80 border-gray-200 focus-within:bg-white focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-blue-100'}`}>

                <div className="flex items-end gap-2 px-3 py-2">

                  <div className="flex items-center gap-1 relative mb-0.5">
                    <motion.button
                      ref={dropdownRef}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      onClick={() => setShowModalDropdown(!showModalDropdown)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-sm border relative
                        ${isDark
                          ? 'bg-[#1e1e1e] border-white/10 hover:bg-white/10'
                          : 'bg-white border-gray-100 hover:bg-gray-50 shadow-gray-200'}
                        ${selectedModal === 'bakilat' ? 'text-violet-500' :
                          selectedModal === 'nyaaya' ? 'text-emerald-500' :
                            selectedModal === 'munshi' ? 'text-amber-500' :
                              'text-indigo-500'}`}
                    >
                      <div className="scale-90">
                        {getModalIcon(selectedModal)}
                      </div>

                      {/* Cute notification dot/sparkle */}
                      <span className={`absolute top-0 right-0 w-2 h-2 rounded-full border-2 
                        ${isDark ? 'border-[#1e1e1e]' : 'border-white'}
                        ${selectedModal === 'bakilat' ? 'bg-violet-500' :
                          selectedModal === 'nyaaya' ? 'bg-emerald-500' :
                            selectedModal === 'munshi' ? 'bg-amber-500' :
                              'bg-indigo-500'}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {showModalDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className={`absolute -left-2 bottom-full mb-5 w-52 rounded-xl shadow-2xl z-50 overflow-hidden border backdrop-blur-xl ring-1
                            ${isDark
                              ? 'bg-[#111111]/95 border-white/10 ring-white/5'
                              : 'bg-white/95 border-gray-200/80 ring-gray-900/5'}`}
                        >
                          <div className={`px-2.5 py-1.5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Select Model</span>
                          </div>
                          <div className="p-1 space-y-0.5">
                            {modalOptions.map((option, idx) => (
                              <motion.button
                                key={option.id}
                                onClick={() => {
                                  setSelectedModal(option.id);
                                  setShowModalDropdown(false);
                                }}
                                className={`w-full px-2 py-1.5 text-left rounded-lg transition-all duration-200 group relative
                                ${selectedModal === option.id
                                    ? isDark
                                      ? 'bg-white/10 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                    : isDark
                                      ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors flex-shrink-0
                                    ${selectedModal === option.id
                                      ? option.color === 'violet' ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20' :
                                        option.color === 'emerald' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                                          option.color === 'amber' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' :
                                            'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                      : isDark ? 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                                    }`}>
                                    <div className="scale-75 transform">
                                      {getModalIcon(option.id)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-[11px] leading-none">{option.label}</span>
                                      {selectedModal === option.id && (
                                        <motion.div layoutId="active-check">
                                          <CheckCircle size={10} className={option.color === 'violet' ? 'text-violet-400' : option.color === 'emerald' ? 'text-emerald-400' : option.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'} />
                                        </motion.div>
                                      )}
                                    </div>
                                    <p className={`text-[9px] mt-0.5 truncate opacity-70 font-medium`}>
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Type your message..."
                    style={isDark ? { backgroundColor: 'transparent' } : {}}
                    className={`flex-1 outline-none border-none text-[13px] py-1.5 px-0 resize-none max-h-20 min-h-[24px] leading-relaxed tracking-normal break-words whitespace-pre-wrap
                      ${isDark
                        ? 'text-gray-200 placeholder-gray-500 caret-blue-500'
                        : 'bg-transparent text-gray-800 placeholder-gray-400 caret-blue-600'}`}
                    rows={1}
                  />

                  <div className="flex items-center gap-1 pb-0.5">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => document.getElementById('file-input').click()}
                      title="Upload file"
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200
                        ${isDark
                          ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                    >
                      <Upload size={16} strokeWidth={1.5} />
                    </motion.button>

                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={isVoiceActive || showVoiceModal ? {} : { scale: 1.05 }}
                      onClick={handleVoiceToggle}
                      title="Voice input"
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200
                        ${isVoiceActive || showVoiceModal
                          ? isDark
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : 'bg-red-50 text-red-500 animate-pulse'
                          : isDark
                            ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                    >
                      <Mic size={16} strokeWidth={1.5} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0 ? {} : { scale: 1.05 }}
                      onClick={handleSubmit}
                      disabled={!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ml-1
                        ${!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0
                          ? isDark
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                          : isDark
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'}`}
                    >
                      <SendHorizontal size={14} strokeWidth={2} className={!query.trim() ? "ml-0.5" : ""} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        isVoiceActive={isVoiceActive}
        setIsVoiceActive={setIsVoiceActive}
        onVoiceResult={handleVoiceResult}
      />
    </div>
  );
};

export default Hero;
