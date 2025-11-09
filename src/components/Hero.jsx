import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import VoiceModal from './VoiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, Settings, User, LogOut, Sun, Moon,
  Mic, Upload, SendHorizontal, ImageIcon, Globe, Bot,
  ChevronDown, Search as SearchIcon, MessageSquare, Sparkles,
  Heart, Share2, Copy, Volume2, Download, CheckCircle
} from 'lucide-react';

const MessageBubble = ({ message, isDark, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    transition={{ duration: 0.35, type: 'spring', stiffness: 100, damping: 15 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`max-w-xs sm:max-w-md lg:max-w-xl px-5 py-3.5 rounded-3xl shadow-sm transition-all ${
        isUser
          ? isDark
            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none shadow-blue-500/20'
            : 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-none shadow-blue-400/20'
          : isDark
          ? 'bg-[#2C2C2C] text-white rounded-bl-none shadow-black/40'
          : 'bg-gray-100 text-gray-900 rounded-bl-none shadow-gray-300/20'
      }`}
    >
      <p className="text-sm leading-relaxed font-medium">{message}</p>
    </motion.div>
  </motion.div>
);

const getModalIcon = (id) => {
  const icons = {
    bakilat: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/><circle cx="12" cy="12" r="3" fill="white" /></svg>,
    nyaaya: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 6.26L18 7L13.09 7.74L12 12L10.91 7.74L6 7L10.91 6.26L12 2Z" fill="currentColor"/></svg>,
    munshi: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M7 8h10M7 12h8M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    adalat: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M12 3L14 8H19L15.5 11L17 16L12 13L7 16L8.5 11L5 8H10L12 3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
  };
  return icons[id] || icons.bakilat;
};

const modalOptions = [
  { id: 'bakilat', label: 'Bakilat 2.0', description: 'Advanced legal analysis', color: 'violet' },
  { id: 'nyaaya', label: 'Nyaaya 3.1', description: 'Indian legal system', color: 'emerald' },
  { id: 'munshi', label: 'Munshi 3', description: 'Document generation', color: 'amber' },
  { id: 'adalat', label: 'Adalat 2.1', description: 'Litigation support', color: 'indigo' }
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
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'bg-[#2C2C2C] hover:bg-[#3A3A3A] text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
        title="Select AI Assistant"
      >
        <Bot size={16} />
        <span className="text-sm font-medium hidden sm:inline">{selected.label}</span>
        <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 top-full mt-1 w-64 rounded-xl shadow-xl z-50 overflow-hidden
              ${isDark ? 'bg-[#1A1A1A] border border-[#3A3A3A]' : 'bg-white border border-gray-200'}`}
          >
            {modalOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setSelectedModal(option.id);
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-3 text-left border-b transition-all duration-200
                  ${selectedModal === option.id
                    ? isDark
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-blue-50 border-blue-200'
                    : isDark
                    ? 'border-[#3A3A3A] hover:bg-[#2C2C2C]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {option.label}
                  </h4>
                  {selectedModal === option.id && <CheckCircle size={14} className="text-green-500 ml-auto" />}
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {option.description}
                </p>
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

  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dropdownRef = useRef(null);

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

  const handleSubmit = (e) => {
    e?.preventDefault();
    const allFiles = [...uploadedFiles, ...pendingFiles];
    if (query.trim() || allFiles.length > 0) {
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

      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden
        ${sidebarOpen ? '' : ''}`}>
        
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, type: 'spring' }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
            onClick={() => setSidebarOpen(true)}
            className={`fixed left-6 top-6 p-2 rounded-lg transition-all duration-200 flex-shrink-0 z-40
              ${isDark 
                ? 'text-white hover:bg-[#3A3A3A]' 
                : 'text-gray-900 hover:bg-gray-100'}`}
            title="Open sidebar"
          >
            <Menu size={20} strokeWidth={1.5} />
          </motion.button>
        )}

        <header className={`transition-colors duration-300 flex-shrink-0
          ${isDark 
            ? 'bg-[#0A0A0A]' 
            : 'bg-white'}`}>
          <div className="w-full px-6 sm:px-8 py-4 flex items-center justify-end gap-4">
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                className={`p-2 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                <SearchIcon size={20} strokeWidth={1.5} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                className={`p-2 rounded-lg transition-all duration-200 relative
                  ${isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Bell size={20} strokeWidth={1.5} />
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                ></motion.span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                className={`p-2 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Settings size={20} strokeWidth={1.5} />
              </motion.button>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                    ${isDark 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:shadow-blue-500/30' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-400 text-white hover:shadow-blue-400/30'}`}
                >
                  <User size={18} strokeWidth={1.5} />
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
                  className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1 shadow-2xl"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className={`w-full h-full rounded-full flex items-center justify-center
                    ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                    <Sparkles size={56} className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}
                >
                  Welcome to Mera Vakil
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Your Intelligent Legal Assistant
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 scroll-smooth"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="max-w-2xl mx-auto w-full">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={idx}
                    message={msg.content}
                    isDark={isDark}
                    isUser={msg.role === 'user'}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div 
            layout
            transition={{ duration: 0.3, type: 'spring' }}
            className={`transition-colors duration-300 px-4 sm:px-6 py-6 flex-shrink-0
            ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            
            <motion.div 
              layout
              className="max-w-2xl mx-auto space-y-3 relative">
              
              {messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-1 py-2"
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm border
                    ${isDark 
                      ? 'bg-gray-600/20 border-gray-500/50 text-gray-300' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                  >
                    <div className={`w-4 h-4 flex items-center justify-center ${
                      selectedModal === 'bakilat' ? 'text-violet-500' :
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
                  className={`flex flex-wrap gap-2 px-1 py-1`}
                >
                  {uploadedFiles.map((file, idx) => (
                    <motion.div
                      key={`uploaded-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs
                        ${isDark ? 'bg-gray-600/20 border border-gray-500/40' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <Upload size={13} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      <span className={`font-medium truncate max-w-24 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeUploadedFile(idx)}
                        className={`hover:opacity-70 transition-opacity ml-1`}
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                  {pendingFiles.map((file, idx) => (
                    <motion.div
                      key={`pending-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs
                        ${isDark ? 'bg-green-600/20 border border-green-500/40' : 'bg-green-50 border border-green-200'}`}
                    >
                      <Upload size={13} className={isDark ? 'text-green-400' : 'text-green-600'} />
                      <span className={`font-medium truncate max-w-24 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeUploadedFile(idx, true)}
                        className={`hover:opacity-70 transition-opacity ml-1`}
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div 
                layout
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                className={`rounded-3xl transition-all duration-300 overflow-visible backdrop-blur-md
                ${isDark 
                  ? 'bg-[#2C2C2C]/40 border border-[#3A3A3A]/40 hover:bg-[#2C2C2C]/60 hover:border-[#3A3A3A]/60 focus-within:bg-[#2C2C2C]/80 focus-within:border-gray-500/50' 
                  : 'bg-white/40 border border-gray-200/40 hover:bg-white/60 hover:border-gray-300/40 focus-within:bg-white/90 focus-within:border-gray-400/50'}`}>
                
                <div className="flex items-end gap-2.5 px-4 py-4 sm:px-5 sm:py-4">
                  
                  <div className="flex items-center gap-1 relative">
                    <motion.button
                      ref={dropdownRef}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setShowModalDropdown(!showModalDropdown)}
                      title="Select AI Model"
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hidden sm:flex z-10
                        ${isDark
                          ? 'hover:bg-gray-600/30 text-gray-400'
                          : 'hover:bg-gray-500/20 text-gray-600'}`}
                    >
                      <Bot size={18} strokeWidth={1.5} />
                    </motion.button>

                    {showModalDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 8 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 320 }}
                        className={`absolute left-0 bottom-full mb-4 w-52 rounded-xl shadow-2xl z-50 overflow-hidden border backdrop-blur-xl
                          ${isDark 
                            ? 'bg-[#1A1A1A] border-gray-500/50' 
                            : 'bg-white border-gray-400/50'}`}
                      >
                        {modalOptions.map((option, idx) => (
                          <motion.button 
                            key={option.id} 
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            whileHover={{ x: 4, backgroundColor: isDark ? '#2C2C2C' : '#F3F4F6' }}
                            onClick={() => {
                              setSelectedModal(option.id);
                              setShowModalDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm transition-all font-medium border-b last:border-b-0
                              ${selectedModal === option.id
                                ? isDark 
                                  ? 'bg-gray-600/20 border-gray-500' 
                                  : 'bg-gray-50 border-gray-200'
                                : isDark 
                                ? 'border-[#3A3A3A]/40 hover:bg-[#2C2C2C]' 
                                : 'border-gray-200/40 hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 flex items-center justify-center ${
                                option.color === 'violet' ? 'text-violet-500' :
                                option.color === 'emerald' ? 'text-emerald-500' :
                                option.color === 'amber' ? 'text-amber-500' :
                                'text-indigo-500'
                              }`}>
                                {getModalIcon(option.id)}
                              </div>
                              <span className={selectedModal === option.id ? 'font-bold' : ''}>{option.label}</span>
                              {selectedModal === option.id && <CheckCircle size={14} className="text-green-500 ml-auto" />}
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <textarea
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Message Bakil AI..."
                    className={`flex-1 bg-transparent outline-none text-sm py-2 px-1 resize-none max-h-32 min-h-10 leading-relaxed
                      ${isDark 
                        ? 'text-white placeholder-gray-400 caret-gray-400' 
                        : 'text-gray-900 placeholder-gray-400 caret-gray-600'}`}
                    rows={1}
                  />

                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => document.getElementById('file-input').click()}
                      title="Upload file"
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200
                        ${isDark
                          ? 'hover:bg-gray-700/50 text-gray-400'
                          : 'hover:bg-gray-200/50 text-gray-600'}`}
                    >
                      <Upload size={18} strokeWidth={1.5} />
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
                      whileHover={isVoiceActive || showVoiceModal ? {} : { scale: 1.1 }}
                      onClick={handleVoiceToggle}
                      title="Voice input"
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200
                        ${isVoiceActive || showVoiceModal
                          ? isDark
                            ? 'bg-red-600/30 text-red-400 animate-pulse'
                            : 'bg-red-500/20 text-red-600 animate-pulse'
                          : isDark
                          ? 'hover:bg-gray-700/50 text-gray-400'
                          : 'hover:bg-gray-200/50 text-gray-600'}`}
                    >
                      <Mic size={18} strokeWidth={1.5} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0 ? {} : { scale: 1.1 }}
                      onClick={handleSubmit}
                      disabled={!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200
                        ${!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0
                          ? isDark
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                          : isDark
                          ? 'bg-gradient-to-br from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white shadow-lg hover:shadow-gray-500/40'
                          : 'bg-gradient-to-br from-gray-500 to-gray-400 hover:from-gray-400 hover:to-gray-300 text-white shadow-md'}`}
                    >
                      <SendHorizontal size={18} strokeWidth={2} />
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
