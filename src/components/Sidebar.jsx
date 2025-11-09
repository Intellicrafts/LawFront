import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronLeft, Menu, Plus, Star, MoreVertical, Edit, Archive, 
  Trash2, Clock, Search, MessageSquare, Filter, X, 
  BookmarkCheck, History, Inbox, AlertCircle, CheckCircle,
  Sparkles, MessageCircle, Home, Grid3x3, BookOpen, Wallet
} from 'lucide-react';

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  chatHistory,
  handleReset,
  toggleStar,
  archiveChat,
  deleteChat,
  updateChatTitle
}) {
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);
  const chatListRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visibleChats, setVisibleChats] = useState(20); // Initial number of chats to show
  const { isDark } = useTheme();

  // Filter chats based on search query and selected filter
  const filteredChats = chatHistory.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || chat[filter] === true;
    return matchesSearch && matchesFilter;
  });

  // Get visible chats for infinite scrolling
  const displayedChats = filteredChats.slice(0, visibleChats);

  // Handle scroll to load more chats
  useEffect(() => {
    const handleScroll = () => {
      if (chatListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
        // When user scrolls to 80% of the way down, load more chats
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
          // Add more chats to visible list
          setVisibleChats(prev => Math.min(prev + 10, filteredChats.length));
        }
      }
    };

    const chatListElement = chatListRef.current;
    if (chatListElement) {
      chatListElement.addEventListener('scroll', handleScroll);
      return () => chatListElement.removeEventListener('scroll', handleScroll);
    }
  }, [filteredChats.length]);

  // Reset visible chats when filter or search changes
  useEffect(() => {
    setVisibleChats(20);
  }, [filter, searchQuery]);

  // Handle renaming a chat
  const handleRename = (id, currentTitle) => {
    setRenamingChatId(id);
    setNewTitle(currentTitle);
  };

  // Submit the new title for a chat
  const handleRenameSubmit = (id) => {
    if (newTitle.trim()) {
      updateChatTitle(id, newTitle.trim());
    }
    setRenamingChatId(null);
    setNewTitle('');
  };

  // Handle keyboard events for renaming
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(id);
    } else if (e.key === 'Escape') {
      setRenamingChatId(null);
      setNewTitle('');
    }
  };

  // Handle blur event for renaming input
  const handleBlur = (id) => {
    handleRenameSubmit(id);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Handle click outside filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterMenu && !event.target.closest('.filter-menu-container')) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  // Get filter icon based on current filter
  const getFilterIcon = () => {
    switch(filter) {
      case 'starred': return <Star size={14} className="text-amber-400" />;
      case 'recent': return <History size={14} className="text-sky-400" />;
      case 'archived': return <Archive size={14} className="text-purple-400" />;
      default: return <Filter size={14} className="text-gray-400" />;
    }
  };

  // Get filter label based on current filter
  const getFilterLabel = () => {
    switch(filter) {
      case 'starred': return 'Starred';
      case 'recent': return 'Recent';
      case 'archived': return 'Archived';
      default: return 'All Chats';
    }
  };

  // Navigation items matching the image
  const navItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Templates', icon: Grid3x3, active: false },
    { name: 'Explore', icon: BookOpen, active: false },
    { name: 'History', icon: Clock, active: false },
    { name: 'Wallet', icon: Wallet, active: false },
  ];

  // Group chat history by date (matching image structure)
  const groupedChats = filteredChats.reduce((acc, chat) => {
    const date = chat.date || 'Other';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(chat);
    return acc;
  }, {});

  // Date groups matching image
  const dateGroups = [
    { label: 'Tomorrow', chats: groupedChats['Tomorrow'] || [] },
    { label: '10 days Ago', chats: groupedChats['10 days Ago'] || [] },
  ];

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: -320 }}
      animate={{ x: sidebarOpen ? 0 : -320 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed left-0 top-0 z-40 w-64 sm:w-72 md:w-80 h-screen
                bg-[#2C2C2C] dark:bg-[#2C2C2C] 
                bg-white dark:bg-[#2C2C2C]
                border-r border-[#3A3A3A] dark:border-[#3A3A3A]
                border-r border-gray-200 dark:border-[#3A3A3A]`}
      data-tour="chat-history"
    >

      {/* Header with Mera Vakil Logo */}
      <div className="pt-5 pb-4 px-5 border-b border-[#3A3A3A] dark:border-[#3A3A3A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://e7.pngegg.com/pngimages/437/159/png-clipart-coat-of-arms-of-india-lion-capital-of-ashoka-pillars-of-ashoka-sarnath-museum-ashoka-chakra-state-emblem-of-india-national-mammal-text-thumbnail.png" alt="Ashok Chakra - Mera Vakil" className="w-10 h-10 object-contain"/>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Mera Vakil
          </h2>
        </div>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-[#3A3A3A]' : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label="Close sidebar"
          >
            <X size={18} className={isDark ? 'text-white' : 'text-gray-900'} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* New Conversation Button with colorful styling */}
      {/* <div className="px-4 pt-3 pb-2 flex justify-center">
        <button
          onClick={handleReset}
          className={`py-2 px-4 rounded-full text-white font-medium 
                    flex items-center justify-center gap-2 
                    bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600
                    shadow-sm hover:shadow-md 
                    transition-all duration-300 transform hover:scale-[1.02]`}
        >
          <div className="relative">
            <Sparkles size={14} className="text-white/80 absolute -top-1 -right-1" />
            <MessageCircle size={15} className="text-white" />
          </div>
          <span className="text-sm">New Chat</span>
        </button>
      </div> */}

      {/* Search Chats Input - Matching Image */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search chats"
            className="w-full px-3 py-2.5 pl-9 pr-9 rounded-lg text-sm
                      bg-gray-100 dark:bg-[#1A1A1A]
                      border border-gray-300 dark:border-[#3A3A3A]
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500
                      focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]
                      transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white" 
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Grid3x3 size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Links - Matching Image */}
      <div className="px-6 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                        transition-all duration-200
                        ${item.active 
                          ? 'bg-gray-200 dark:bg-[#3A3A3A] text-gray-900 dark:text-white' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3A3A3A]/50 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Icon size={18} className="text-gray-700 dark:text-white" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
            </button>
          );
        })}
      </div>


      {/* Chat History - Matching Image Structure */}
      <div 
        ref={chatListRef}
        className="mt-2 mb-3 px-4 overflow-y-auto max-h-[calc(100vh-400px)] 
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3A3A3A] 
                  hover:scrollbar-thumb-[#4A4A4A]"
      >
        {dateGroups.map((group, groupIndex) => (
          group.chats.length > 0 && (
            <div key={groupIndex} className="mb-4">
              {/* Date Heading */}
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400 mb-2 px-2">
                {group.label}
              </h3>
              
              {/* Chat Items */}
              {group.chats.slice(0, 3).map((chat) => (
                <div
                  key={chat.id}
                  className="mb-1.5 px-2 py-1.5 rounded-lg cursor-pointer 
                            hover:bg-[#3A3A3A]/50 dark:hover:bg-[#3A3A3A]/50
                            transition-all duration-200"
                >
                  {renamingChatId === chat.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      autoFocus
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, chat.id)}
                      onBlur={() => handleBlur(chat.id)}
                      className="w-full text-xs font-medium bg-transparent 
                                border-b border-[#3A3A3A] focus:outline-none focus:border-white
                                text-white placeholder-gray-500"
                    />
                  ) : (
                    <p className="text-xs text-gray-300 dark:text-gray-300 line-clamp-1">
                      {chat.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ))}
        
        {/* Fallback for other chats */}
        {filteredChats.filter(chat => 
          !dateGroups.some(g => g.chats.includes(chat))
        ).length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400 mb-2 px-2">
              Other
            </h3>
            {filteredChats
              .filter(chat => !dateGroups.some(g => g.chats.includes(chat)))
              .slice(0, 5)
              .map((chat) => (
                <div
                  key={chat.id}
                  className="mb-1.5 px-2 py-1.5 rounded-lg cursor-pointer 
                            hover:bg-[#3A3A3A]/50 dark:hover:bg-[#3A3A3A]/50
                            transition-all duration-200"
                >
                  <p className="text-xs text-gray-300 dark:text-gray-300 line-clamp-1">
                    {chat.title}
                  </p>
                </div>
              ))}
          </div>
        )}
        
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
            <Inbox size={20} className="text-gray-500 mb-2" />
            <p className="text-xs text-gray-400">
              {searchQuery ? 'No chats found' : 'No chat history'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
