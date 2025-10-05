import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Plus, MessageSquare, X, FileText, BookOpen, Shield,
  ArrowRight, Mic, Upload, SendHorizontal, RefreshCw, Bot, ChevronDown,
  ThumbsUp, Copy, CheckCircle
} from 'lucide-react';

/**
 * ActiveChat - Ultra Professional ChatGPT-like Interface
 * 
 * Features:
 * - Auto-scrolling chat area when new messages arrive
 * - Fixed input height with textarea expansion for long text
 * - Mobile keyboard handling (shifts input above keyboard)
 * - Agent selection dropdown inside input field
 * - Voice modal icon inside input field
 * - Clean professional interface without top action buttons
 * - New Chat icon in message actions
 * - Pure gray/silver/slate theme (ZERO blue)
 * - Smooth ChatGPT-like animations
 */
const ActiveChat = ({
  // State
  messages,
  isLoading,
  query,
  setQuery,
  uploadedFiles,
  isDragOver,
  setIsDragOver,
  inputFocused,
  setInputFocused,
  isVoiceActive,
  isVoiceModalOpen,
  requestCount,
  isAuthenticated,
  
  // Refs
  inputRef,
  chatContainerRef,
  
  // Handlers
  handleSubmit,
  handleReset,
  handleVoiceToggle,
  handleFileUpload,
  removeFile,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  handleInputChange,
  handleKeyPress,
  setSidebarOpen,
  setChatActive,
  
  // Mobile
  isMobile,
  mobileHandleInputFocus,
  mobileHandleInputBlur,
  keyboardVisible,
  keyboardHeight,
  
  // Components & Functions
  renderMessage,
  renderLoadingSkeleton,
  ModalDropdown,
  
  // Config
  API_CONFIG
}) => {
  
  // Agent selection state
  const [showModalDropdown, setShowModalDropdown] = useState(false);
  const [selectedModal, setSelectedModal] = useState('bakilat');
  const modalDropdownRef = useRef(null);
  
  // Premium suggestion cards data
  const suggestionCards = [
    {
      icon: <FileText size={20} className="text-slate-600 dark:text-slate-400" />,
      title: "Draft Legal Documents",
      desc: "Generate contracts, agreements & more",
      query: "I need help drafting a legal document"
    },
    {
      icon: <Scale size={20} className="text-slate-600 dark:text-slate-400" />,
      title: "Legal Consultation",
      desc: "Get expert advice on your legal matters",
      query: "I need legal consultation"
    },
    {
      icon: <BookOpen size={20} className="text-slate-600 dark:text-slate-400" />,
      title: "Case Analysis",
      desc: "Understand precedents & case laws",
      query: "Help me analyze a legal case"
    },
    {
      icon: <Shield size={20} className="text-slate-600 dark:text-slate-400" />,
      title: "Rights & Remedies",
      desc: "Know your legal rights & options",
      query: "What are my legal rights in this situation?"
    }
  ];

  // AI Agent Options
  const modalOptions = [
    {
      id: 'bakilat',
      label: 'Bakilat 2.0',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-violet-500">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                fill="currentColor" stroke="currentColor" strokeWidth="1"/>
          <circle cx="12" cy="12" r="3" fill="white" />
        </svg>
      ),
      description: 'Advanced AI for complex legal analysis',
      color: 'violet',
      specialty: 'Complex Legal Analysis'
    },
    {
      id: 'Nyaayaadheesh',
      label: 'Nyaayaadheesh 3.1',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-emerald-500">
          <path d="M12 2L13.09 6.26L18 7L13.09 7.74L12 12L10.91 7.74L6 7L10.91 6.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L20.09 19.26L24 20L20.09 20.74L19 25L17.91 20.74L14 20L17.91 19.26L19 15Z" fill="currentColor" opacity="0.7"/>
          <path d="M5 9L6.09 13.26L10 14L6.09 14.74L5 19L3.91 14.74L0 14L3.91 13.26L5 9Z" fill="currentColor" opacity="0.5"/>
        </svg>
      ),
      description: 'Specialized in modern Indian law & precedents',
      color: 'emerald',
      specialty: 'Indian Legal System'
    },
    {
      id: 'munshi',
      label: 'Munshi 3',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-amber-500">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M7 8h10M7 12h8M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="17" cy="6" r="2" fill="currentColor"/>
          <path d="M15 4l4 4" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      description: 'Expert document drafting & contract generation',
      color: 'amber',
      specialty: 'Document Generation'
    },
    {
      id: 'adalat',
      label: 'Adalat 2.1',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-indigo-500">
          <path d="M12 3L14 8H19L15.5 11L17 16L12 13L7 16L8.5 11L5 8H10L12 3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      description: 'Court procedures & litigation guidance',
      color: 'indigo',
      specialty: 'Litigation Support'
    }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [messages, isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target)) {
        setShowModalDropdown(false);
      }
    };

    if (showModalDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModalDropdown]);

  const handleSuggestionClick = (suggestionQuery) => {
    setQuery(suggestionQuery);
    setTimeout(() => handleSubmit(), 100);
  };

  // Enhanced renderMessage with logo icon and action buttons for AI
  const renderMessageWithActions = (message, index, allMessages) => {
    if (message.type === 'bot') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3 items-start group"
        >
          {/* AI Logo Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
              <img 
                src="/logo.svg" 
                alt="AI" 
                className="w-5 h-5 relative z-10"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Bot size={16} className="text-white hidden" />
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {renderMessage ? renderMessage(message, index, allMessages) : (
              <div className="max-w-none">
                <p className="text-slate-700 dark:text-slate-300">{message.text}</p>
              </div>
            )}
            
            {/* Action Buttons - Show on hover */}
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Copy"
                onClick={() => {
                  navigator.clipboard.writeText(message.text || '');
                }}
              >
                <Copy size={14} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Like"
              >
                <ThumbsUp size={14} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="New Chat"
              >
                <Plus size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    } else {
      return renderMessage ? renderMessage(message, index, allMessages) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end"
        >
          <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg">
            <p>{message.text}</p>
          </div>
        </motion.div>
      );
    }
  };

  // Professional Voice Icon (Copied from Hero)
  const VoiceIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );

  // Agent Dropdown Component (Copied from Hero - Circular Button Style)
  const AgentDropdown = () => {
    const selectedOption = modalOptions.find(option => option.id === selectedModal);
    
    return (
      <div className="relative" ref={modalDropdownRef}>
        {/* Circular Button with Agent Icon - Like Hero */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isLoading && setShowModalDropdown(!showModalDropdown)}
          disabled={isLoading}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 flex items-center justify-center shadow-sm group relative"
          title="Select AI Agent"
        >
          {/* Selected Agent Icon */}
          <div className="relative">
            {selectedOption?.icon}
          </div>
          
          {/* Dropdown Arrow Indicator */}
          <motion.div 
            animate={{ rotate: showModalDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-0.5 -right-0.5"
          >
            <div className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300 flex items-center justify-center">
              <ChevronDown size={8} className="text-white dark:text-slate-700" />
            </div>
          </motion.div>
        </motion.button>

        {/* Dropdown Menu - Fully Dark Mode Compatible */}
        <AnimatePresence>
          {showModalDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 bottom-full mb-2 w-64 sm:w-72 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden z-50 shadow-2xl dark:shadow-slate-900/50"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-600">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Bot size={16} className="text-slate-600 dark:text-slate-400" />
                  Select AI Assistant
                </h3>
              </div>
              
              {/* Agent Options */}
              <div className="p-2 max-h-80 overflow-y-auto bg-white dark:bg-slate-800">
                {modalOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedModal(option.id);
                      setShowModalDropdown(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 mb-1.5 ${
                      selectedModal === option.id
                        ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon Container */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        selectedModal === option.id
                          ? 'bg-white/20 dark:bg-white/10'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600'
                      }`}>
                        {option.icon}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-bold transition-colors duration-200 ${
                            selectedModal === option.id
                              ? 'text-white'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {option.label}
                          </h4>
                          {selectedModal === option.id && (
                            <CheckCircle size={14} className="text-green-400 dark:text-green-400" />
                          )}
                        </div>
                        <p className={`text-xs transition-colors duration-200 ${
                          selectedModal === option.id
                            ? 'text-slate-200 dark:text-slate-300'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {option.description}
                        </p>
                        <div className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                          selectedModal === option.id
                            ? 'text-slate-300 dark:text-slate-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {option.specialty}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Calculate input container style for mobile keyboard
  const getInputContainerStyle = () => {
    if (isMobile && keyboardVisible && keyboardHeight) {
      return {
        transform: `translateY(-${keyboardHeight}px)`,
        transition: 'transform 0.3s ease-out'
      };
    }
    return {
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease-out'
    };
  };

  return (
    <div className="fixed inset-0 top-[64px] flex flex-col bg-white dark:bg-slate-950">
      {/* ===== CHAT MESSAGES AREA - Scrollable ===== */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className={`min-h-full flex flex-col ${isMobile ? 'w-full px-3' : 'max-w-4xl mx-auto w-full px-6'} py-4`}>
            {/* Empty State - Center of screen */}
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                {/* Premium Icon with Silver Shine */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`
                    ${isMobile ? 'w-20 h-20 mb-6' : 'w-24 h-24 mb-8'}
                    rounded-full
                    bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800
                    flex items-center justify-center
                    shadow-2xl shadow-slate-400/30
                    relative
                    overflow-hidden
                  `}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <Scale size={isMobile ? 32 : 40} className="text-white relative z-10" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Mera Vakil
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                  Your AI Legal Assistant for Indian Law
                </p>

                {/* Premium Suggestion Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
                  {suggestionCards.map((item, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(item.query)}
                      className="
                        p-4 rounded-2xl text-left
                        bg-white dark:bg-slate-800/60
                        border border-slate-200 dark:border-slate-700
                        hover:border-slate-300 dark:hover:border-slate-600
                        hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50
                        transition-all duration-200
                        group
                      "
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors duration-200">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

          {/* Messages */}
          <div className="space-y-6 px-2">
            {messages.map((message, index) => (
              <div key={index}>
                {renderMessageWithActions(message, index, messages)}
              </div>
            ))}
            
            {/* Loading State */}
            {isLoading && renderLoadingSkeleton && renderLoadingSkeleton()}
          </div>
        </div>
      </div>

      {/* ===== PROFESSIONAL GLASS INPUT AREA ===== */}
      <div 
        className="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl"
      >
        <div className={`${isMobile ? 'max-w-full px-3 pt-4 pb-3' : 'max-w-4xl mx-auto px-6 pt-6 pb-5'}`}>
          
          {/* Uploaded Files Preview */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
                    >
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-5 h-5 rounded object-cover" />
                      ) : (
                        <FileText size={16} className="text-slate-500" />
                      )}
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <span className="text-slate-400 text-[10px]">({(file.size / 1024).toFixed(1)}KB)</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <X size={12} className="text-slate-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN INPUT - MATCHES HERO SECTION */}
          <div 
            className={`
              relative
              rounded-3xl
              bg-white dark:bg-slate-800
              border-2 transition-all duration-300
              ${inputFocused || query.trim()
                ? 'border-slate-500 dark:border-slate-400 ring-2 ring-slate-200 dark:ring-slate-700'
                : 'border-slate-300 dark:border-slate-600'
              }
              ${isDragOver ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-700/50 ring-2 ring-slate-400 dark:ring-slate-500' : ''}
            `}
            style={{
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
            }}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center gap-1.5 px-5 py-3">
              {/* Agent Dropdown - Circular Button (From Hero) */}
              <div className="flex-shrink-0">
                <AgentDropdown />
              </div>

              {/* Voice Button - Circular Button (From Hero) */}
              <div className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceToggle}
                  className={`
                    w-9 h-9
                    flex items-center justify-center
                    rounded-full
                    transition-all duration-200
                    focus:outline-none
                    ${isVoiceActive || isVoiceModalOpen
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600'
                    }
                  `}
                  title={isVoiceActive || isVoiceModalOpen ? "Stop Recording" : "Voice Input"}
                >
                  <VoiceIcon />
                  {(isVoiceActive || isVoiceModalOpen) && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white" />
                  )}
                </motion.button>
              </div>

              {/* Textarea Field - FIXED HEIGHT - NO CHANGES */}
              <div className="flex-1 flex items-center">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  onFocus={(e) => {
                    setInputFocused(true);
                    if (isMobile && mobileHandleInputFocus) mobileHandleInputFocus(e);
                  }}
                  onBlur={(e) => {
                    setInputFocused(false);
                    if (isMobile && mobileHandleInputBlur) mobileHandleInputBlur(e);
                  }}
                  placeholder="Ask your legal question..."
                  rows={1}
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none border-none text-sm sm:text-base resize-none overflow-y-auto"
                  style={{ 
                    height: '44px',
                    lineHeight: '1.5',
                    padding: '10px 0'
                  }}
                />
              </div>

              {/* Upload Button */}
              <div className="flex-shrink-0">
                <label
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors duration-200 block"
                  title="Upload File"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Upload size={18} />
                  </motion.div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              {/* Send Button */}
              <div className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!query.trim() && uploadedFiles.length === 0}
                  className={`
                    p-2 rounded-full
                    transition-all duration-200
                  ${query.trim() || uploadedFiles.length > 0
                    ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  }
                `}
                style={{
                  minHeight: '32px',
                  minWidth: '32px'
                }}
                title="Send Message"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <SendHorizontal size={16} />
                )}
              </motion.button>
              </div>
            </div>

            {/* Drag & Drop Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 backdrop-blur-sm rounded-3xl flex items-center justify-center pointer-events-none border-2 border-dashed border-slate-400 dark:border-slate-500">
                <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2 text-sm">
                  <Upload size={18} />
                  <span>Drop files here</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveChat;