import React, { useState, useRef } from 'react';

import { ChevronLeft, Menu, Plus, Star, MoreVertical, Edit, Archive, Trash2, Clock, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const filteredChats = chatHistory.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || chat[filter] === true;
    return matchesSearch && matchesFilter;
  });

  const handleRename = (id, currentTitle) => {
    setRenamingChatId(id);
    setNewTitle(currentTitle);
  };

  const handleRenameSubmit = (id) => {
    if (newTitle.trim()) {
      updateChatTitle(id, newTitle.trim());
    }
    setRenamingChatId(null);
    setNewTitle('');
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(id);
    }
  };

  const handleBlur = (id) => {
    handleRenameSubmit(id);
  };

  return (
   <div
  ref={sidebarRef}
  style={{ top: '95px' }} // Inline top value here
  className={`fixed left-0 bottom-4 z-40 w-72 bg-white/90 dark:bg-gray-900/90 
              shadow-xl hover:shadow-2xl backdrop-blur-sm 
              transform transition-transform duration-300 ease-in-out 
              rounded-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)} style={{ top: '2px' }}
        className="absolute -right-12  p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md 
                  hover:shadow-lg transition-all duration-200 flex items-center justify-center z-50"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft size={20} className="text-[#22577a] dark:text-[#5cacde]" />
        ) : (
          <Menu size={20} className="text-[#22577a] dark:text-[#5cacde]" />
        )}
      </button>

      {/* Header */}
      <div className="pt-4 px-6 border-b border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center" />

      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={handleReset}
          className="w-full py-3 px-4 bg-[#3382a9] rounded-full text-white font-medium 
                  flex items-center justify-center gap-2 hover:shadow-md transition-all duration-200"
        >
          <Plus size={18} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Chat Filters */}
      <div className="flex px-4 py-2 space-x-2 overflow-x-auto">
        <button onClick={() => setFilter('all')} className="px-3 py-1 text-xs rounded-full bg-[#22577a] text-white whitespace-nowrap">
          All Chats
        </button>
        <button onClick={() => setFilter('starred')} className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Starred
        </button>
        <button onClick={() => setFilter('recent')} className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Recent
        </button>
        <button onClick={() => setFilter('archived')} className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Archived
        </button>
      </div>

      {/* Live Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 rounded-full text-sm border-0 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#5cacde]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Chat History */}
      <div className="mt-2 mb-4 overflow-y-auto max-h-[calc(100vh-230px)]">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className="px-4 py-3 mb-2 hover:bg-white/60 dark:hover:bg-gray-800/60 cursor-pointer transition-colors duration-150"
          >
            <div className="flex justify-between">
              {renamingChatId === chat.id ? (
                <input
                  type="text"
                  value={newTitle}
                  autoFocus
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, chat.id)}
                  onBlur={() => handleBlur(chat.id)}
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-transparent border-b border-[#5cacde] focus:outline-none"
                />
              ) : (
                <h3
                  className={`text-sm font-medium ${chat.unread ? 'text-[#22577a] dark:text-[#5cacde] font-semibold' : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {chat.title}
                </h3>
              )}

              <div className="flex items-center space-x-2">
                <button onClick={() => toggleStar(chat.id)} className="text-gray-400 hover:text-yellow-400">
                  <Star size={16} fill={chat.starred ? '#FBBF24' : 'none'} className={chat.starred ? 'text-yellow-400' : ''} />
                </button>
                <div className="relative group">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <ul className="py-1">
                      <li
                        onClick={() => handleRename(chat.id, chat.title)}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center cursor-pointer"
                      >
                        <Edit size={14} className="mr-2" /> Rename
                      </li>
                      <li
                        onClick={() => archiveChat(chat.id)}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center cursor-pointer"
                      >
                        <Archive size={14} className="mr-2" /> Archive
                      </li>
                      <li
                        onClick={() => deleteChat(chat.id)}
                        className="px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center cursor-pointer"
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{chat.preview}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock size={12} className="mr-1" />
                {chat.date}
              </span>
              {chat.unread && <span className="w-2 h-2 bg-[#5cacde] rounded-full"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
