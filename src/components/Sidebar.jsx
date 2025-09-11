import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronLeft, Menu, Plus, Star, MoreVertical, Edit, Archive, 
  Trash2, Clock, Search, MessageSquare, Filter, X, 
  BookmarkCheck, History, Inbox, AlertCircle, CheckCircle,
  Sparkles, MessageCircle
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

  return (
    <div
      ref={sidebarRef}
      style={{ top: '95px' }}
      className={`fixed left-0 bottom-4 z-40 w-64 sm:w-72 md:w-80 
                bg-white/95 dark:bg-gray-900/95 
                shadow-xl hover:shadow-2xl backdrop-blur-md 
                transform transition-all duration-300 ease-in-out 
                rounded-2xl border border-gray-100/30 dark:border-gray-700/30
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      data-tour="chat-history"
    >
      {/* Decorative elements for premium look */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-indigo-400/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-sky-400/5 rounded-full blur-3xl -z-10"></div>

      {/* Toggle button with enhanced styling */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ top: '2px' }}
        className={`absolute -right-10 p-2.5 rounded-xl 
                  ${isDark 
                    ? 'bg-gray-800/95 hover:bg-gray-700/95 text-gray-300 hover:text-gray-200' 
                    : 'bg-white/95 hover:bg-gray-50/95 text-gray-600 hover:text-gray-700'} 
                  shadow-md hover:shadow-lg 
                  transition-all duration-300 
                  flex items-center justify-center z-50
                  border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
                  focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400`}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft size={16} className="transition-transform duration-300" />
        ) : (
          <Menu size={16} className="transition-transform duration-300" />
        )}
      </button>

      {/* Header with logo/title */}
      <div className="pt-4 pb-2 px-5 border-b border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* <div className={`w-7 h-7 rounded-full flex items-center justify-center 
                        ${isDark ? 'bg-gradient-to-br from-sky-700 to-sky-900' : 'bg-gradient-to-br from-sky-500 to-sky-700'} 
                        text-white shadow-sm`}>
            <MessageSquare size={14} />
          </div> */}
          <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Chat History
          </h2>
        </div>
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

      {/* Enhanced Search with clear button */}
      <div className="px-4 py-2">
        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search conversations..."
            className={`w-full px-3 py-2 pl-8 rounded-lg text-xs
                      border ${isDark 
                        ? 'border-gray-700 bg-gray-800/70 text-gray-200 placeholder-gray-500' 
                        : 'border-gray-200 bg-gray-100/70 text-gray-800 placeholder-gray-500'} 
                      focus:outline-none focus:ring-1
                      ${isDark ? 'focus:ring-gray-500/20' : 'focus:ring-gray-300/30'} 
                      transition-all duration-300`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <Search 
            size={14} 
            className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 
                      ${isDark ? 'text-gray-500' : 'text-gray-500'}`} 
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 
                        ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} 
                        transition-colors duration-200`}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Filter UI */}
      <div className="px-4 py-1.5 relative filter-menu-container">
        <div 
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer
                    ${isDark 
                      ? 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700' 
                      : 'bg-gray-100/70 hover:bg-gray-200/70 border border-gray-200'} 
                    transition-colors duration-200`}
        >
          <div className="flex items-center gap-1.5">
            {getFilterIcon()}
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {getFilterLabel()}
            </span>
          </div>
          <ChevronLeft 
            size={14} 
            className={`transform transition-transform duration-300 
                      ${showFilterMenu ? 'rotate-90' : '-rotate-90'} 
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}`} 
          />
        </div>

        {/* Filter dropdown menu */}
        {showFilterMenu && (
          <div className={`absolute left-4 right-4 mt-1.5 rounded-lg shadow-lg z-50 overflow-hidden
                        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                        ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <ul>
              <li 
                onClick={() => { setFilter('all'); setShowFilterMenu(false); }}
                className={`px-3 py-2 flex items-center gap-2 cursor-pointer
                          ${filter === 'all' 
                            ? (isDark ? 'bg-gray-700/50' : 'bg-gray-100/50') 
                            : ''} 
                          ${isDark 
                            ? 'hover:bg-gray-700/70 text-gray-200' 
                            : 'hover:bg-gray-100/70 text-gray-800'} 
                          transition-colors duration-200`}
              >
                <MessageSquare size={14} className={filter === 'all' ? 'text-sky-400' : 'text-gray-400'} />
                <span className="text-xs">All Conversations</span>
                {filter === 'all' && <CheckCircle size={12} className="ml-auto text-sky-400" />}
              </li>
              <li 
                onClick={() => { setFilter('starred'); setShowFilterMenu(false); }}
                className={`px-3 py-2 flex items-center gap-2 cursor-pointer
                          ${filter === 'starred' 
                            ? (isDark ? 'bg-gray-700/50' : 'bg-gray-100/50') 
                            : ''} 
                          ${isDark 
                            ? 'hover:bg-gray-700/70 text-gray-200' 
                            : 'hover:bg-gray-100/70 text-gray-800'} 
                          transition-colors duration-200`}
              >
                <Star size={14} className={filter === 'starred' ? 'text-amber-400' : 'text-gray-400'} />
                <span className="text-xs">Starred</span>
                {filter === 'starred' && <CheckCircle size={12} className="ml-auto text-sky-400" />}
              </li>
              <li 
                onClick={() => { setFilter('recent'); setShowFilterMenu(false); }}
                className={`px-3 py-2 flex items-center gap-2 cursor-pointer
                          ${filter === 'recent' 
                            ? (isDark ? 'bg-gray-700/50' : 'bg-gray-100/50') 
                            : ''} 
                          ${isDark 
                            ? 'hover:bg-gray-700/70 text-gray-200' 
                            : 'hover:bg-gray-100/70 text-gray-800'} 
                          transition-colors duration-200`}
              >
                <History size={14} className={filter === 'recent' ? 'text-sky-400' : 'text-gray-400'} />
                <span className="text-xs">Recent</span>
                {filter === 'recent' && <CheckCircle size={12} className="ml-auto text-sky-400" />}
              </li>
              <li 
                onClick={() => { setFilter('archived'); setShowFilterMenu(false); }}
                className={`px-3 py-2 flex items-center gap-2 cursor-pointer
                          ${filter === 'archived' 
                            ? (isDark ? 'bg-gray-700/50' : 'bg-gray-100/50') 
                            : ''} 
                          ${isDark 
                            ? 'hover:bg-gray-700/70 text-gray-200' 
                            : 'hover:bg-gray-100/70 text-gray-800'} 
                          transition-colors duration-200`}
              >
                <Archive size={14} className={filter === 'archived' ? 'text-purple-400' : 'text-gray-400'} />
                <span className="text-xs">Archived</span>
                {filter === 'archived' && <CheckCircle size={12} className="ml-auto text-sky-400" />}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Chat History with enhanced styling and invisible scrollbar */}
      <div 
        ref={chatListRef}
        className="mt-2 mb-3 px-4 overflow-y-auto max-h-[calc(100vh-250px)] 
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent 
                  hover:scrollbar-thumb-gray-300/30 dark:hover:scrollbar-thumb-gray-700/30"
      >
        {filteredChats.length > 0 ? (
          displayedChats.map((chat) => (
            <div
              key={chat.id}
              className={`mb-2 rounded-lg overflow-hidden 
                        ${isDark 
                          ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50' 
                          : 'bg-white/50 hover:bg-gray-50/70 border border-gray-200/50'} 
                        cursor-pointer transition-all duration-200 
                        transform hover:scale-[1.01] hover:shadow-sm`}
            >
              <div className="px-3 py-2">
                <div className="flex justify-between items-start">
                  {renamingChatId === chat.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      autoFocus
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, chat.id)}
                      onBlur={() => handleBlur(chat.id)}
                      className={`text-xs font-medium bg-transparent 
                                border-b focus:outline-none w-full pr-2
                                ${isDark 
                                  ? 'text-gray-200 border-gray-600' 
                                  : 'text-gray-800 border-gray-300'}`}
                      style={{ boxShadow: 'none' }}
                    />
                  ) : (
                    <h3
                      className={`text-xs font-medium line-clamp-1 pr-2 
                                ${chat.unread 
                                  ? (isDark ? 'text-[#5cacde] font-semibold' : 'text-[#22577a] font-semibold') 
                                  : (isDark ? 'text-gray-200' : 'text-gray-800')}`}
                    >
                      {chat.title}
                    </h3>
                  )}

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button 
                      onClick={() => toggleStar(chat.id)} 
                      className={`p-1 rounded-full transition-colors duration-200
                                ${chat.starred 
                                  ? 'text-amber-400' 
                                  : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}
                    >
                      <Star size={12} fill={chat.starred ? '#FBBF24' : 'none'} />
                    </button>
                    <div className="relative group">
                      <button 
                        className={`p-1 rounded-full transition-colors duration-200
                                  ${isDark 
                                    ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'}`}
                      >
                        <MoreVertical size={12} />
                      </button>
                      <div 
                        className={`absolute right-0 mt-1 w-40 rounded-lg shadow-lg 
                                  border ${isDark ? 'border-gray-700' : 'border-gray-200'} 
                                  ${isDark ? 'bg-gray-800' : 'bg-white'} 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                  transition-all duration-200 z-50 overflow-hidden`}
                      >
                        <ul>
                          <li
                            onClick={() => handleRename(chat.id, chat.title)}
                            className={`px-3 py-2 text-xs 
                                      ${isDark 
                                        ? 'text-gray-300 hover:bg-gray-700/70' 
                                        : 'text-gray-700 hover:bg-gray-100/70'} 
                                      flex items-center cursor-pointer transition-colors duration-200`}
                          >
                            <Edit size={12} className="mr-2" /> Rename
                          </li>
                          <li
                            onClick={() => archiveChat(chat.id)}
                            className={`px-3 py-2 text-xs 
                                      ${isDark 
                                        ? 'text-gray-300 hover:bg-gray-700/70' 
                                        : 'text-gray-700 hover:bg-gray-100/70'} 
                                      flex items-center cursor-pointer transition-colors duration-200`}
                          >
                            <Archive size={12} className="mr-2" /> Archive
                          </li>
                          <li
                            onClick={() => deleteChat(chat.id)}
                            className={`px-3 py-2 text-xs text-red-500 
                                      ${isDark ? 'hover:bg-gray-700/70' : 'hover:bg-gray-100/70'} 
                                      flex items-center cursor-pointer transition-colors duration-200`}
                          >
                            <Trash2 size={12} className="mr-2" /> Delete
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className={`text-[11px] mt-1 line-clamp-2 
                              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {chat.preview}
                </p>
                
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] flex items-center 
                                  ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Clock size={10} className="mr-1" />
                    {chat.date}
                  </span>
                  {chat.unread && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full 
                                    ${isDark 
                                      ? 'bg-[#5cacde]/20 text-[#5cacde]' 
                                      : 'bg-[#22577a]/10 text-[#22577a]'}`}>
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex flex-col items-center justify-center py-8 px-3 text-center rounded-lg 
                          ${isDark 
                            ? 'bg-gray-800/30 border border-gray-700/50' 
                            : 'bg-gray-100/30 border border-gray-200/50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                            ${isDark ? 'bg-gray-700/70 text-gray-400' : 'bg-gray-200/70 text-gray-500'}`}>
              <Inbox size={16} />
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No conversations found
            </h3>
            <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Start a new conversation to get help'}
            </p>
          </div>
        )}
        
        {/* Loading indicator when more chats are available */}
        {visibleChats < filteredChats.length && (
          <div className="py-2 flex justify-center">
            <div className="flex space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
