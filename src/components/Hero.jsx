import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, Send, MessageSquare, Menu, ChevronLeft, Plus, MoreVertical, 
  Trash2, Edit, Star, Clock, Archive, AlertCircle, Sparkles, HelpCircle, 
  BookOpen, FileText, Lightbulb, ArrowRight, X, Copy, ThumbsUp, 
  Mic, Home, Users, Scale, Briefcase, Bot, User, 
  Download, Share2, RefreshCw, Zap, Shield, CheckCircle,
  Play, Pause, Volume2, Eye, Calendar, Bell, Settings, 
  SendHorizontal, MicIcon, Upload, ChevronDown
} from 'lucide-react';

import { Sidebar } from './Sidebar';
import VoiceModal from '../components/VoiceModal';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileKeyboard } from '../hooks/useMobileKeyboard';

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://bakilchatapp-27296519338.asia-southeast1.run.app",
  USER_ID: "aman",
  SESSION_ID: "hashstring48",
  FREE_REQUEST_LIMIT: 5
};

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Chat state management
  const [query, setQuery] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  
  // UI state management
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typing, setTyping] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState('property');
  const [messageAnimationComplete, setMessageAnimationComplete] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [showModalDropdown, setShowModalDropdown] = useState(false);
  const [selectedModal, setSelectedModal] = useState('bakilat');
  
  // Mobile keyboard handling with enhanced functionality
  const {
    isMobile,
    keyboardVisible,
    keyboardHeight,
    viewportHeight,
    inputFocused: mobileInputFocused,
    keyboardAnimating,
    handleInputFocus: mobileHandleInputFocus,
    handleInputBlur: mobileHandleInputBlur,
    getKeyboardSafeAreaStyle,
    getInputContainerStyle,
    isKeyboardTransitioning
  } = useMobileKeyboard();
  
  // Free request limit state
  const [requestCount, setRequestCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // Enhanced UI state management
  const [lockedInputHeight, setLockedInputHeight] = useState(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  
  // Refs
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const modalDropdownRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const scrollIntervalRef = useRef(null);

  // Chat history
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "Property Boundary Dispute",
      preview: "My neighbor built a fence on what I believe is my property...",
      date: "Today",
      starred: true,
      unread: false
    },
    {
      id: 2,
      title: "Contract Review Help",
      preview: "I need help understanding the terms in my employment contract...",
      date: "Yesterday",
      starred: false,
      unread: true
    },
    {
      id: 3,
      title: "Landlord Tenant Issue",
      preview: "My landlord hasn't fixed the broken heating for weeks...",
      date: "May 13",
      starred: true,
      unread: false
    }
  ]);

  // Enhanced legal queries with document generation prompts
  const querySuggestions = {
    property: [
      { id: 'p1', text: "What are my rights in a landlord-tenant dispute?", category: "consultation" },
      { id: 'p2', text: "Generate a property purchase agreement template", category: "document" },
      { id: 'p3', text: "How can I resolve a property boundary dispute?", category: "consultation" },
      { id: 'p4', text: "Create a rental lease agreement for my property", category: "document" }
    ],
    family: [
      { id: 'f1', text: "What's the process for filing for divorce?", category: "consultation" },
      { id: 'f2', text: "Generate a child custody agreement template", category: "document" },
      { id: 'f3', text: "How is child custody determined in my state?", category: "consultation" },
      { id: 'f4', text: "Create a prenuptial agreement template", category: "document" }
    ],
    civil: [
      { id: 'c1', text: "How do I file a small claims lawsuit?", category: "consultation" },
      { id: 'c2', text: "Generate a demand letter template", category: "document" },
      { id: 'c3', text: "What should I do after a car accident?", category: "consultation" },
      { id: 'c4', text: "Create a settlement agreement template", category: "document" }
    ],
    business: [
      { id: 'b1', text: "What legal structure is best for my small business?", category: "consultation" },
      { id: 'b2', text: "Generate an LLC operating agreement", category: "document" },
      { id: 'b3', text: "How do I protect my intellectual property?", category: "consultation" },
      { id: 'b4', text: "Create an employment contract template", category: "document" }
    ],
    estate: [
      { id: 'e1', text: "What's the process for contesting a will?", category: "consultation" },
      { id: 'e2', text: "Generate a will and testament template", category: "document" },
      { id: 'e3', text: "How do I set up a power of attorney?", category: "consultation" },
      { id: 'e4', text: "Create a trust agreement template", category: "document" }
    ]
  };
  
  const sampleQueries = Object.values(querySuggestions).flat().map(q => q.text);

  // Premium AI Model Selection Options
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
      version: '2.0',
      specialty: 'Complex Legal Analysis'
    },
    {
      id: 'Nyaayaadheesh',
      label: 'Nyaayaadheesh 3.1',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-emerald-500">
          <path d="M12 2L13.09 6.26L18 7L13.09 7.74L12 12L10.91 7.74L6 7L10.91 6.26L12 2Z" 
                fill="currentColor"/>
          <path d="M19 15L20.09 19.26L24 20L20.09 20.74L19 25L17.91 20.74L14 20L17.91 19.26L19 15Z" 
                fill="currentColor" opacity="0.7"/>
          <path d="M5 9L6.09 13.26L10 14L6.09 14.74L5 19L3.91 14.74L0 14L3.91 13.26L5 9Z" 
                fill="currentColor" opacity="0.5"/>
        </svg>
      ),
      description: 'Specialized in modern Indian law & precedents',
      color: 'emerald',
      version: '3.1',
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
      version: '3.0',
      specialty: 'Document Generation'
    },
    {
      id: 'adalat',
      label: 'Adalat 2.1',
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-indigo-500">
          <path d="M12 3L14 8H19L15.5 11L17 16L12 13L7 16L8.5 11L5 8H10L12 3Z" 
                stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      description: 'Court proceedings & litigation support',
      color: 'indigo',
      version: '2.1',
      specialty: 'Litigation Support'
    }
  ];

  // Enhanced loading states
  const loadingStates = [
    { text: 'Analyzing your legal query...', icon: <Search size={14} /> },
    { text: 'Searching legal databases...', icon: <BookOpen size={14} /> },
    { text: 'Consulting legal precedents...', icon: <Scale size={14} /> },
    { text: 'Preparing expert guidance...', icon: <Lightbulb size={14} /> },
    { text: 'Finalizing recommendations...', icon: <CheckCircle size={14} /> }
  ];

  // Enhanced mobile app experience - prevent scrolling on mobile when in chat mode
  useEffect(() => {
    if (isMobile && chatActive) {
      // Prevent hero section scrolling on mobile for app-like experience
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobile, chatActive]);

  // Check authentication status
  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      return !!authToken && authToken.length > 0;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  // Request count management with daily reset
  const getRequestCount = () => {
    try {
      const storedData = localStorage.getItem('free_request_data');
      if (!storedData) return 0;
      
      const { count, date } = JSON.parse(storedData);
      const storedDate = new Date(date);
      const currentDate = new Date();
      
      if (storedDate.toDateString() !== currentDate.toDateString()) {
        updateRequestCount(0);
        return 0;
      }
      
      return count;
    } catch (error) {
      console.error('Error getting request count:', error);
      return 0;
    }
  };

  const updateRequestCount = (count) => {
    try {
      const data = { count, date: new Date().toISOString() };
      localStorage.setItem('free_request_data', JSON.stringify(data));
      setRequestCount(count);
    } catch (error) {
      console.error('Error updating request count:', error);
    }
  };

  // Initialize request count
  useEffect(() => {
    try {
      const oldCountData = localStorage.getItem('free_request_count');
      if (oldCountData && !localStorage.getItem('free_request_data')) {
        const oldCount = parseInt(oldCountData, 10);
        updateRequestCount(oldCount);
        localStorage.removeItem('free_request_count');
      }
      
      const currentCount = getRequestCount();
      setRequestCount(currentCount);
    } catch (error) {
      console.error('Error initializing request count:', error);
      setRequestCount(0);
    }
  }, []);

  // Cleanup scroll intervals and timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Click outside handler for modal dropdown and body scroll management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target)) {
        setShowModalDropdown(false);
      }
    };

    // Prevent body scroll on mobile when dropdown is open
    if (isMobile && showModalDropdown) {
      document.body.classList.add('dropdown-open');
    } else {
      document.body.classList.remove('dropdown-open');
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('dropdown-open');
    };
  }, [showModalDropdown, isMobile]);

  // Enhanced API Response Parser
  const parseAPIResponse = (rawText) => {
    try {
      const lines = rawText.trim().split("\n");
      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const jsonString = line.replace("data: ", "").trim();
          const json = JSON.parse(jsonString);
          return json?.content?.parts?.[0]?.text || "No response content.";
        }
      }
      return "No valid response found.";
    } catch (error) {
      console.error('Error parsing API response:', error);
      return "Error parsing response.";
    }
  };

  // Enhanced document detection and formatting
  const detectDocumentRequest = (text) => {
    const documentKeywords = [
      'generate', 'create', 'draft', 'template', 'agreement', 'contract',
      'letter', 'document', 'form', 'will', 'testament', 'lease'
    ];
    
    return documentKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  };

  // Ultra-optimized professional response formatting - prevents UI breaking
  const formatBotResponse = (text, isDocument = false) => {
    if (!text) return text;

    // Document generation formatting
    if (isDocument || detectDocumentRequest(text)) {
      setShowDocumentGenerator(true);
    }

    // Robust formatting for legal responses - prevents screen breaks
    let formatted = text;
    
    try {
      // Format main headings - safe and contained
      formatted = formatted.replace(/^###\s(.+)$/gm, '<div class="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 pb-1 border-b border-sky-200 break-words">$1</div>');
      formatted = formatted.replace(/^##\s(.+)$/gm, '<div class="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 border-l-4 border-sky-500 pl-3 break-words">$1</div>');
      formatted = formatted.replace(/^#\s(.+)$/gm, '<div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 break-words">$1</div>');
      
      // Format bold text - safe inline
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<span class="font-semibold text-slate-900 dark:text-slate-100">$1</span>');
      
      // Format bullet points - contained and safe with flex-wrap
      formatted = formatted.replace(/^[\*\-]\s(.+)$/gm, '<div class="flex items-start my-2 flex-wrap"><div class="flex-shrink-0 text-sky-500 mr-2 mt-1.5 text-xs">●</div><div class="flex-1 text-slate-700 dark:text-slate-300 break-words min-w-0">$1</div></div>');
      
      // Format numbered lists - safe with proper containment
      formatted = formatted.replace(/^(\d+)\.\s(.+)$/gm, '<div class="flex items-start my-2 flex-wrap"><div class="flex-shrink-0 text-emerald-600 dark:text-emerald-400 mr-3 font-semibold min-w-[1.5rem]">$1.</div><div class="flex-1 text-slate-700 dark:text-slate-300 break-words min-w-0">$2</div></div>');
      
      // Format important notes - contained design
      formatted = formatted.replace(/(?:Note|Important|Warning|Disclaimer):\s*([^.]+\.?)/gi, 
        '<div class="my-3 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-r break-words"><span class="font-medium text-amber-800 dark:text-amber-200">⚠️ $1</span></div>');
      
      // Format code blocks - safe inline
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-sm break-all">$1</code>');
      
      // Convert line breaks safely
      formatted = formatted.replace(/\n/g, '<br class="select-none">');
      
    } catch (error) {
      console.warn('Formatting error, returning plain text:', error);
      return text; // Return original text if formatting fails
    }
    
    return formatted.trim();
  };

  // Enhanced API Integration
  const sendMessageToAPI = async (userMessage) => {
    try {
      // Step 1: Create or update session
      await fetch(
        `${API_CONFIG.BASE_URL}/apps/agents/users/${API_CONFIG.USER_ID}/sessions/${API_CONFIG.SESSION_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: {
              preferred_language: "English",
              visit_count: requestCount + 1,
            },
          }),
        }
      );

      // Step 2: Send message
      const response = await fetch(`${API_CONFIG.BASE_URL}/run_sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: "agents",
          user_id: API_CONFIG.USER_ID,
          session_id: API_CONFIG.SESSION_ID,
          new_message: {
            role: "user",
            parts: [{ text: userMessage }],
          },
          streaming: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const rawText = await response.text();
      const parsedText = parseAPIResponse(rawText);
      const isDocumentRequest = detectDocumentRequest(userMessage);
      
      // Return both raw and formatted text
      return {
        rawText: parsedText,
        formattedText: formatBotResponse(parsedText, isDocumentRequest),
        isDocument: isDocumentRequest
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  // Ultra-fast optimized typing animation - types chunks, formats after completion
  const simulateTypingResponse = (rawText, formattedText, onUpdate, onComplete) => {
    setMessageAnimationComplete(false);
    setIsTyping(true);
    
    // Super fast typing - 8ms base delay, type 2-3 words at once
    const baseDelay = 8;
    const words = rawText.split(' ');
    let currentWordIndex = 0;
    
    const typeNextChunk = () => {
      if (currentWordIndex < words.length) {
        // Type 2-3 words at once for ultra-fast display
        const wordsPerChunk = Math.min(3, words.length - currentWordIndex);
        const currentChunk = words.slice(currentWordIndex, currentWordIndex + wordsPerChunk);
        const textUpToHere = words.slice(0, currentWordIndex + wordsPerChunk).join(' ');
        
        onUpdate(textUpToHere, false); // false = not formatted yet
        currentWordIndex += wordsPerChunk;
        
        // Very minimal pause between chunks
        setTimeout(typeNextChunk, baseDelay * Math.max(1, currentChunk.length));
      } else {
        // Typing complete - now apply formatting with slight delay for smooth transition
        setTimeout(() => {
          setMessageAnimationComplete(true);
          setIsTyping(false);
          onUpdate(formattedText, true); // true = apply formatting
          if (onComplete) onComplete();
        }, 150);
      }
    };
    
    // Start typing immediately
    typeNextChunk();
  };

  // Enhanced message submission with input size preservation
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const isUserAuthenticated = checkAuthStatus();
    const currentRequestCount = getRequestCount();

    if (!isUserAuthenticated && currentRequestCount >= API_CONFIG.FREE_REQUEST_LIMIT) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 5000);
      return;
    }

    // Lock current input height before processing to prevent UI jumps
    const currentInputHeight = inputRef.current ? inputRef.current.offsetHeight : (isMobile ? 72 : 64);
    setLockedInputHeight(currentInputHeight);

    const newMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: detectDocumentRequest(query) ? 'document-request' : 'consultation',
      selectedAgent: selectedModal // Store which agent was selected for this question
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setChatActive(true);
    setIsLoading(true);
    // Reset all scroll states for new message
    setUserScrolledUp(false);
    setAutoScrollEnabled(true);
    setLastScrollPosition(0);
    
    const userQuery = query;
    setQuery('');
    
    // Mobile keyboard handling: Close keyboard smoothly after submit
    if (isMobile && inputRef.current) {
      // Blur input to trigger keyboard close
      inputRef.current.blur();
      
      // Add smooth transition back to original position
      setTimeout(() => {
        // Scroll to show new message after keyboard closes
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait for keyboard close animation
    }
    
    // Apply CSS custom property for locked height
    if (inputRef.current) {
      inputRef.current.style.setProperty('--locked-height', `${currentInputHeight}px`);
      inputRef.current.style.height = `${currentInputHeight}px`;
    }
    
    if (!isUserAuthenticated) {
      updateRequestCount(currentRequestCount + 1);
    }
    
    // Enhanced loading states for different request types
    const documentLoadingStates = [
      { text: 'Analyzing document request...', icon: <FileText size={14} /> },
      { text: 'Accessing legal templates...', icon: <BookOpen size={14} /> },
      { text: 'Generating professional document...', icon: <Plus size={14} /> },
      { text: 'Formatting legal content...', icon: <Edit size={14} /> },
      { text: 'Finalizing document structure...', icon: <CheckCircle size={14} /> }
    ];

    const consultationLoadingStates = [
      { text: 'Analyzing your legal query...', icon: <Search size={14} /> },
      { text: 'Searching legal databases...', icon: <BookOpen size={14} /> },
      { text: 'Consulting legal precedents...', icon: <Scale size={14} /> },
      { text: 'Preparing expert guidance...', icon: <Lightbulb size={14} /> },
      { text: 'Finalizing recommendations...', icon: <CheckCircle size={14} /> }
    ];

    const isDocumentRequest = detectDocumentRequest(userQuery);
    const activeLoadingStates = isDocumentRequest ? documentLoadingStates : consultationLoadingStates;

    // Enhanced loading animation
    let currentStateIndex = 0;
    const stateInterval = setInterval(() => {
      setLoadingState(activeLoadingStates[currentStateIndex]);
      currentStateIndex = (currentStateIndex + 1) % activeLoadingStates.length;
    }, 1500);
    
    try {
      const botResponse = await sendMessageToAPI(userQuery);
      
      clearInterval(stateInterval);
      setIsLoading(false);
      setLoadingState('');
      
      const botMessageId = Date.now() + 1;
      
      setMessages([
        ...updatedMessages,
        {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: botResponse.isDocument ? 'document' : 'consultation',
          isDocument: botResponse.isDocument,
          isFormatted: false,
          selectedAgent: selectedModal // Store which agent generated this response
        }
      ]);

      simulateTypingResponse(
        botResponse.rawText,
        botResponse.formattedText,
        (partialText, isFormatted = false) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId ? { 
                ...msg, 
                text: partialText,
                isFormatted: isFormatted
              } : msg
            )
          );
        },
        () => {
          // Unlock input height after response is complete
          if (inputRef.current) {
            inputRef.current.style.removeProperty('--locked-height');
            inputRef.current.style.height = 'auto';
            // Reset to base height
            const baseHeight = isMobile ? 72 : 64;
            inputRef.current.style.height = `${baseHeight}px`;
          }
          setLockedInputHeight(null);
          
          // Add to chat history for new conversations
          if (updatedMessages.length <= 1) {
            const title = userQuery.length > 30 ? userQuery.substring(0, 30) + '...' : userQuery;
            setChatHistory([
              {
                id: Date.now(),
                title: title,
                preview: userQuery,
                date: "Just now",
                starred: false,
                unread: false
              },
              ...chatHistory
            ]);
          }
        }
      );

    } catch (error) {
      clearInterval(stateInterval);
      setIsLoading(false);
      setLoadingState('');
      
      // Unlock input height on error
      if (inputRef.current) {
        inputRef.current.style.removeProperty('--locked-height');
        inputRef.current.style.height = 'auto';
        const baseHeight = isMobile ? 72 : 64;
        inputRef.current.style.height = `${baseHeight}px`;
      }
      setLockedInputHeight(null);
      
      setMessages([
        ...updatedMessages,
        {
          id: Date.now() + 1,
          text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our support team if the issue persists.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error',
          isFormatted: true,
          selectedAgent: selectedModal // Store which agent was selected when error occurred
        }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      // Reset textarea height after sending with mobile-aware height
      setTimeout(() => {
        if (inputRef.current) {
          const resetHeight = isMobile ? 72 : 64;
          inputRef.current.style.height = `${resetHeight}px`;
        }
      }, 100);
    }
  };

  // Enhanced reset with smooth button feedback
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    if (isLoading || isResetting) return; // Prevent multiple clicks
    
    setIsResetting(true);
    
    // Mobile keyboard handling on reset
    if (isMobile && inputRef.current) {
      // Blur input to close keyboard if open
      inputRef.current.blur();
    }
    
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setChatActive(false);
    setMessages([]);
    setIsLoading(false);
    setLoadingState('');
    setShowDocumentGenerator(false);
    setQuery('');
    
    // Reset textarea height after reset
    if (inputRef.current) {
      const resetHeight = isMobile ? 72 : 64;
      inputRef.current.style.height = `${resetHeight}px`;
    }
    
    setTimeout(() => {
      // Only focus on desktop to avoid unwanted keyboard popup on mobile
      if (!isMobile) {
        inputRef.current?.focus();
      }
      setIsResetting(false);
    }, 300);
  };

  // Sidebar management
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.toggle-sidebar-btn') && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Typing animation for placeholder
  useEffect(() => {
    if (!typing || chatActive) return;
    
    const currentPlaceholder = sampleQueries[placeholderIndex];
    let currentIndex = 0;
    let typingInterval;
    let pauseTimeout;
    
    const typeText = () => {
      if (currentIndex <= currentPlaceholder.length) {
        setTypedText(currentPlaceholder.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        pauseTimeout = setTimeout(() => {
          typingInterval = setInterval(eraseText, 50);
        }, 2000);
      }
    };
    
    const eraseText = () => {
      if (currentIndex > 0) {
        setTypedText(currentPlaceholder.substring(0, currentIndex - 1));
        currentIndex--;
      } else {
        clearInterval(typingInterval);
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % sampleQueries.length);
        pauseTimeout = setTimeout(() => {
          typingInterval = setInterval(typeText, 80);
        }, 500);
      }
    };
    
    typingInterval = setInterval(typeText, 80);
    
    return () => {
      clearInterval(typingInterval);
      clearTimeout(pauseTimeout);
    };
  }, [placeholderIndex, typing, sampleQueries, chatActive]);
  
  const handleInputFocus = () => {
    setInputFocused(true);
    if (!query.trim()) {
      setShowSuggestions(true);
    }
    setTyping(false);
    
    // Call mobile keyboard handler for enhanced mobile experience
    mobileHandleInputFocus();
  };
  
  const handleInputBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
      if (!query) {
        setTyping(true);
      }
      setShowSuggestions(false);
      
      // Call mobile keyboard handler for enhanced mobile experience
      mobileHandleInputBlur();
    }, 200);
  };

  // Enhanced voice button toggle handler for smooth modal operation
  const handleVoiceToggle = useCallback((e) => {
    // Prevent event propagation and default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Force state update with proper timing
    if (isVoiceModalOpen) {
      // If modal is open, close it and stop voice
      setIsVoiceActive(false);
      // Small delay to ensure smooth animation
      setTimeout(() => {
        setVoiceModalOpen(false);
      }, 100);
    } else {
      // Open modal and start voice immediately with proper state synchronization
      setVoiceModalOpen(true);
      // Ensure voice is activated after modal state is set
      setTimeout(() => {
        setIsVoiceActive(true);
      }, 150);
    }
  }, [isVoiceModalOpen, isVoiceActive]);

  // Lock input field height during loading to prevent UI breaks
  useEffect(() => {
    if (inputRef.current) {
      if (isLoading) {
        // Close dropdown when loading starts
        setShowModalDropdown(false);
        
        // Lock the current height when loading starts
        const currentHeight = inputRef.current.offsetHeight;
        inputRef.current.style.height = `${currentHeight}px`;
      } else {
        // Allow dynamic resizing when not loading
        const baseHeight = isMobile ? 72 : 64;
        if (query.trim() === '') {
          // Reset to base height if no content
          inputRef.current.style.height = `${baseHeight}px`;
        }
        // Remove fixed height to allow auto-resize
        if (inputRef.current.style.height && !query.trim()) {
          inputRef.current.style.height = 'auto';
        }
      }
    }
  }, [isLoading, isMobile, query]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Ultra-robust auto-resize with complete loading state protection
    if (inputRef.current && !isLoading && !isTyping) { // Prevent resizing during any processing
      try {
        // Store current height before any changes
        const currentHeight = inputRef.current.offsetHeight;
        
        // Mobile and desktop specific base heights
        const baseHeight = isMobile ? 72 : 64;
        const maxHeight = isMobile ? 160 : 200;
        
        // Reset height to measure content accurately
        inputRef.current.style.height = `${baseHeight}px`;
        
        // Calculate new height based on content
        const scrollHeight = inputRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, baseHeight), maxHeight);
        
        // Apply new height with smooth transition
        inputRef.current.style.height = `${newHeight}px`;
        
        // Handle overflow scrolling
        if (scrollHeight > maxHeight) {
          inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
      } catch (error) {
        console.warn('Input resize error:', error);
        // Fallback to base height if something goes wrong
        if (inputRef.current) {
          inputRef.current.style.height = `${isMobile ? 72 : 64}px`;
        }
      }
    }
    
    // Handle suggestions visibility
    if (value.trim()) {
      setShowSuggestions(false);
    } else if (inputFocused && !isLoading) {
      setShowSuggestions(true);
    }
  };
  
  const handleSuggestionClick = (suggestionText) => {
    setQuery(suggestionText);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Smart scroll to bottom utility
  const scrollToBottom = useCallback((behavior = 'smooth', force = false) => {
    if (!chatContainerRef.current) return;
    
    const container = chatContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;
    const maxScrollTop = scrollHeight - height;
    
    if (maxScrollTop > 0 && (autoScrollEnabled || force)) {
      container.scrollTo({
        top: maxScrollTop,
        behavior: behavior
      });
    }
  }, [autoScrollEnabled]);

  // Enhanced auto-scroll during typing animation
  useEffect(() => {
    if (isTyping && autoScrollEnabled && !userScrolledUp) {
      // Clear any existing scroll interval
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      
      // Continuous smooth scrolling during typing
      scrollIntervalRef.current = setInterval(() => {
        if (chatContainerRef.current && !isUserScrollingRef.current) {
          const container = chatContainerRef.current;
          const scrollHeight = container.scrollHeight;
          const height = container.clientHeight;
          const maxScrollTop = scrollHeight - height;
          const currentScrollTop = container.scrollTop;
          
          // Only scroll if we're not at the bottom and user hasn't scrolled up
          if (currentScrollTop < maxScrollTop - 10 && !userScrolledUp) {
            container.scrollTo({
              top: maxScrollTop,
              behavior: 'smooth'
            });
          }
        }
      }, 100); // Check every 100ms during typing
      
      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      };
    } else {
      // Clean up interval when not typing
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  }, [isTyping, autoScrollEnabled, userScrolledUp]);

  // Handle messages update - scroll for new messages
  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      // Scroll to bottom when new message arrives (not during typing)
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
    }
  }, [messages.length, isTyping, scrollToBottom]);

  // Enhanced scroll event handling
  const handleChatScroll = useCallback((e) => {
    if (!chatContainerRef.current) return;
    
    const container = chatContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;
    const maxScrollTop = scrollHeight - height;
    const currentScrollTop = container.scrollTop;
    
    // Mark user as actively scrolling
    isUserScrollingRef.current = true;
    
    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Detect user scroll direction and intent
    const scrollDifference = currentScrollTop - lastScrollPosition;
    setLastScrollPosition(currentScrollTop);
    
    // User scrolled up significantly - disable auto scroll
    if (currentScrollTop < maxScrollTop - 150) {
      setUserScrolledUp(true);
      setAutoScrollEnabled(false);
    }
    // User scrolled to bottom or near bottom - re-enable auto scroll
    else if (currentScrollTop >= maxScrollTop - 50) {
      setUserScrolledUp(false);
      setAutoScrollEnabled(true);
    }
    
    // Reset user scrolling flag after scroll ends
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
      
      // Re-enable auto scroll after user stops scrolling for a while
      if (!userScrolledUp) {
        setAutoScrollEnabled(true);
      }
    }, 150);
    
  }, [lastScrollPosition, userScrolledUp]);

  // Reset scroll behavior when typing completes
  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      // Reset user scroll state after typing completes
      setTimeout(() => {
        if (!isUserScrollingRef.current) {
          setUserScrolledUp(false);
          setAutoScrollEnabled(true);
        }
      }, 1000);
    }
  }, [isTyping, messages.length]);

  // Professional message rendering with document detection
  const renderMessageText = (text, sender, messageType, isFormatted = true) => {
    if (!text) return null;
    
    // If not formatted yet (during typing), display as plain text with safe styling
    if (!isFormatted && sender === 'bot') {
      return (
        <div className="leading-relaxed text-[15px] whitespace-pre-wrap chat-typing-text safe-text-render message-content">
          {text}
        </div>
      );
    }
    
    const processFormatting = (content) => {
      try {
        // Handle HTML from formatBotResponse (already formatted)
        if (content.includes('<div') || content.includes('<strong') || content.includes('<span')) {
          return content;
        }
        
        // Basic markdown-like processing for plain responses with safety
        let processed = content;
        
        // Bold text
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold safe-text-render">$1</strong>');
        
        // Lists with safe flex classes
        processed = processed.replace(/^[\*\-]\s(.+)$/gm, '<div class="flex items-start my-1 flex-wrap"><span class="text-blue-500 mr-2 flex-shrink-0">•</span><span class="flex-1 safe-text-render min-w-0">$1</span></div>');
        
        // Line breaks
        processed = processed.replace(/\n/g, '<br class="select-none">');
        
        return processed;
      } catch (error) {
        console.warn('Text processing error:', error);
        return content; // Return original content if processing fails
      }
    };
    
    const formattedText = processFormatting(text);
    
    return (
      <div 
        className={`leading-relaxed chat-formatting-transition message-content safe-text-render ${
          isFormatted ? 'message-formatting-complete' : ''
        } ${sender === 'bot' ? 'text-[15px]' : 'text-[15px]'}`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  // Enhanced message component with document features
  const renderMessage = (message, index, messages) => {
    const isPreviousSameSender = index > 0 && messages[index - 1].sender === message.sender;
    const isUser = message.sender === 'user';
    // Use the agent that was selected when this message was created, not the current selection
    const messageAgent = modalOptions.find(opt => opt.id === message.selectedAgent) || modalOptions.find(opt => opt.id === selectedModal);
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.4, 
          delay: 0.1,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`flex chat-message ${isUser ? 'justify-end' : 'justify-start'} ${!isPreviousSameSender ? 'mt-6' : 'mt-3'}`}
      >
        {/* Bot Avatar */}
        {!isUser && !isPreviousSameSender && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mr-3 shadow-lg"
          >
            <Scale size={18} className="text-white" />
          </motion.div>
        )}

        {/* Message Bubble */}
        <div className={`max-w-[85%] relative ${!isUser && isPreviousSameSender ? 'ml-12' : ''}`}>
          {/* Message Content */}
          <div
            className={`px-4 py-3 relative ${
              isUser
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl rounded-br-md'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {/* Document Type Indicator */}
            {message.type === 'document-request' && isUser && (
              <div className="flex items-center mb-2 text-sky-100">
                <FileText size={14} className="mr-1" />
                <span className="text-xs font-medium">Document Request</span>
              </div>
            )}
            
            {message.type === 'document' && !isUser && (
              <div className="flex items-center mb-3 text-sky-600 dark:text-sky-400">
                <FileText size={14} className="mr-1" />
                <span className="text-xs font-medium">Legal Document Generated</span>
              </div>
            )}

            {/* AI Agent Badge - Show for all bot messages */}
            {!isUser && (
              <div className="flex items-center mb-3">
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${
                  messageAgent?.color === 'violet' 
                    ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300'
                    : messageAgent?.color === 'emerald'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : messageAgent?.color === 'amber'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : messageAgent?.color === 'indigo'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {messageAgent?.icon && 
                      React.cloneElement(messageAgent.icon, { 
                        width: 12, 
                        height: 12 
                      })
                    }
                  </div>
                  <span className="font-semibold">
                    {messageAgent?.label || 'AI Assistant'}
                  </span>
                  {messageAgent?.version && (
                    <span className="opacity-75">
                      v{messageAgent.version}
                    </span>
                  )}
                </div>
              </div>
            )}

            {renderMessageText(message.text, message.sender, message.type, message.isFormatted)}
            
            {/* Typing Indicator */}
            {!isUser && isTyping && message.text === '' && (
              <div className="flex items-center space-x-1 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-slate-500 ml-2">
                  {messageAgent?.label || 'AI Assistant'} is typing...
                </span>
              </div>
            )}
          </div>

          {/* Message Actions & Timestamp */}
          <div className="flex items-center justify-between mt-2 px-1">
            <span className={`text-xs ${isUser ? 'text-slate-500' : 'text-slate-400'}`}>
              {message.timestamp}
            </span>
            
            {/* Bot Message Actions */}
            {!isUser && messageAnimationComplete && message.text && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(message.text);
                  }}
                  className="text-slate-400 hover:text-sky-500 transition-colors p-1 rounded"
                  title="Copy response"
                >
                  <Copy size={14} />
                </button>
                
                <button 
                  className="text-slate-400 hover:text-emerald-500 transition-colors p-1 rounded"
                  title="Helpful response"
                >
                  <ThumbsUp size={14} />
                </button>

                {message.type === 'document' && (
                  <button 
                    onClick={() => setShowDocumentGenerator(true)}
                    className="text-slate-400 hover:text-sky-500 transition-colors p-1 rounded"
                    title="Edit document"
                  >
                    <Edit size={14} />
                  </button>
                )}

                <button 
                  className="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded"
                  title="Share response"
                >
                  <Share2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Document Actions Panel */}
          {message.type === 'document' && !isUser && messageAnimationComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.5 }}
              className="mt-3 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                  Document Actions
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-sky-500 text-white text-xs rounded-md hover:bg-sky-600 transition-colors flex items-center">
                    <Download size={12} className="mr-1" />
                    Download
                  </button>
                  <button className="px-3 py-1 bg-slate-500 text-white text-xs rounded-md hover:bg-slate-600 transition-colors flex items-center">
                    <Edit size={12} className="mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Enhanced loading skeleton
  const renderLoadingSkeleton = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start max-w-[80%]"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 mr-3 flex items-center justify-center shadow-lg">
        <Scale size={18} className="text-white" />
      </div>
      
      <div className="flex flex-col p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          {loadingState.icon && (
            <div className="text-sky-500">
              {loadingState.icon}
            </div>
          )}
          <span className="text-sm text-sky-600 dark:text-sky-400 font-medium">
            {loadingState.text || 'Analyzing...'}
          </span>
          <div className="flex space-x-1 ml-2">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-4/5"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </motion.div>
  );

  // Enhanced limit warning
  const LimitWarning = () => (
    <AnimatePresence>
      {showLimitWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xl max-w-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="text-red-500 dark:text-red-400" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Free Limit Reached
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  You've used all {API_CONFIG.FREE_REQUEST_LIMIT} free consultations. Sign in to continue with unlimited access!
                </p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowLimitWarning(false)}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    Dismiss
                  </button>
                  
                  <button
                    onClick={() => navigate('/Auth')}
                    className="text-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 flex items-center"
                  >
                    <span>Sign In</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Clean, simple query suggestions - randomized each time
  const QuerySuggestions = ({ visible, onSuggestionClick }) => {
    // Get fresh random sample questions from different categories every time visible changes
    const getRandomSuggestions = useCallback(() => {
      const allSuggestions = Object.values(querySuggestions).flat();
      const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
      
      // Select 6 questions ensuring category variety
      const selectedSuggestions = [];
      const usedCategories = new Set();
      
      // First pass: one from each category
      for (const suggestion of shuffled) {
        if (selectedSuggestions.length >= 6) break;
        if (!usedCategories.has(suggestion.category)) {
          selectedSuggestions.push(suggestion);
          usedCategories.add(suggestion.category);
        }
      }
      
      // Second pass: fill remaining slots
      for (const suggestion of shuffled) {
        if (selectedSuggestions.length >= 6) break;
        if (!selectedSuggestions.find(s => s.id === suggestion.id)) {
          selectedSuggestions.push(suggestion);
        }
      }
      
      return selectedSuggestions;
    }, []);

    const [randomSuggestions, setRandomSuggestions] = useState([]);
    
    // Refresh suggestions when component becomes visible
    useEffect(() => {
      if (visible) {
        setRandomSuggestions(getRandomSuggestions());
      }
    }, [visible, getRandomSuggestions]);
    
    if (!visible) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute left-0 right-0 top-full mt-3 bg-slate-50/80 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl z-10"
      >
        <div className="p-4 space-y-2">
          {randomSuggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion.id}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="w-full text-left p-3 hover:bg-white/70 dark:hover:bg-slate-800/50 transition-all duration-200 flex items-start rounded-xl group"
            >
              <div className="flex items-center mr-3 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                {suggestion.category === 'document' ? (
                  <FileText size={14} className="text-emerald-500" />
                ) : (
                  <MessageSquare size={14} className="text-sky-500" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 dark:text-slate-300 block leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  {suggestion.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };
  
  // Enhanced voice button with mobile-optimized sizing
  const VoiceButton = ({ onClick, isActive = false }) => {
    const [isClicking, setIsClicking] = useState(false);
    
    const handleClick = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent double-clicks
      if (isClicking) return;
      
      setIsClicking(true);
      
      // Execute the onClick handler with the event
      if (onClick) {
        onClick(e);
      }
      
      // Reset clicking state after a short delay
      setTimeout(() => {
        setIsClicking(false);
      }, 300);
    }, [onClick, isClicking]);

    return (
      <motion.button
        whileTap={{ scale: 0.90 }}
        whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
        onClick={handleClick}
        type="button"
        disabled={isClicking}
        className={`relative ${isMobile ? 'w-8 h-8' : 'w-9 h-9'} flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-200 dark:ring-red-800'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-sky-900/20 dark:hover:text-sky-400 hover:shadow-md'
        } ${isClicking ? 'opacity-80 cursor-wait' : ''}`}
        title={isActive ? "Stop Voice Recording" : "Start Voice Recording"}
        aria-label={isActive ? "Stop Voice Recording" : "Start Voice Recording"}
      >
        {/* Voice Mode Indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"
          >
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-full bg-green-400 rounded-full"
            />
          </motion.div>
        )}
        
        <motion.div
          animate={isActive ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : { scale: 1, rotate: 0 }}
          transition={{ 
            duration: isActive ? 2 : 0.3, 
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isActive ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center"
            >
              <Mic size={isMobile ? 16 : 18} />
            </motion.div>
          ) : (
            <Mic size={isMobile ? 16 : 18} />
          )}
        </motion.div>
        
        {/* Pulse ring for active state */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  };

  // Smart Dropdown with Dynamic Positioning
  const ModalDropdown = () => {
    const selectedOption = modalOptions.find(option => option.id === selectedModal);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    // Calculate dropdown position with loading state protection
    React.useEffect(() => {
      if (showModalDropdown && inputRef.current && modalDropdownRef.current) {
        // Add delay to ensure DOM has updated and loading states are handled
        const positionDropdown = () => {
          const inputRect = inputRef.current.getBoundingClientRect();
          const dropdownRect = modalDropdownRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // During loading, use the current input dimensions without recalculation
          const inputHeight = inputRect.height;
          const inputTop = inputRect.top;
          const inputBottom = inputRect.bottom;
          
          // Calculate available space above the input field
          const spaceAbove = inputTop;
          const dropdownHeight = isMobile ? 280 : 360; // More accurate dropdown height estimation
          
          // Determine if dropdown should show above or below (prefer above during loading)
          const showAbove = spaceAbove > dropdownHeight || inputBottom + dropdownHeight > viewportHeight || isLoading;
          
          if (isMobile) {
            // For mobile, use fixed positioning with loading state consideration
            const safeTop = Math.max(16, inputBottom + 12);
            const safeBottom = Math.max(24, viewportHeight - inputTop + 12);
            
            // During loading, add extra margin to prevent overlap with processing message
            const loadingOffset = isLoading ? 40 : 0;
            
            setDropdownStyle({
              position: 'fixed',
              bottom: showAbove ? `${safeBottom + loadingOffset}px` : 'auto',
              top: showAbove ? 'auto' : `${safeTop + loadingOffset}px`,
              left: '16px',
              right: '16px',
              zIndex: 9999,
              maxWidth: 'calc(100vw - 2rem)',
              maxHeight: showAbove 
                ? `${inputTop - 32 - loadingOffset}px` 
                : `${viewportHeight - inputBottom - 32 - loadingOffset}px`
            });
          } else {
            // For desktop, use absolute positioning with loading state clearance
            const baseClearance = 16;
            const loadingClearance = isLoading ? 40 : 0; // Extra space when loading message is shown
            const totalClearance = baseClearance + loadingClearance;
            
            setDropdownStyle({
              position: 'absolute',
              bottom: '100%',
              left: '0',
              marginBottom: `${totalClearance}px`,
              zIndex: 50,
              minWidth: '320px',
              maxWidth: 'calc(100vw - 3rem)'
            });
          }
        };
        
        // Position immediately and with delays for different scenarios
        positionDropdown();
        const timeoutId1 = setTimeout(positionDropdown, 50);
        const timeoutId2 = setTimeout(positionDropdown, 150); // Extra delay for loading state changes
        
        return () => {
          clearTimeout(timeoutId1);
          clearTimeout(timeoutId2);
        };
      }
    }, [showModalDropdown, isMobile, query, isLoading, loadingState]); // Include loadingState for more precise updates
    
    return (
      <div className={`${isMobile ? 'relative' : 'dropdown-container'}`} ref={modalDropdownRef}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isLoading && setShowModalDropdown(!showModalDropdown)} // Prevent opening during loading
          disabled={isLoading}
          className={`flex items-center gap-2 ${isMobile ? 'px-3 py-1.5' : 'px-2.5 py-1'} rounded-lg transition-all duration-200 ${isMobile ? 'text-sm' : 'text-xs'} font-medium border shadow-sm no-select ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${
            selectedOption?.color === 'violet' 
              ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300'
              : selectedOption?.color === 'emerald'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : selectedOption?.color === 'amber'
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              : selectedOption?.color === 'indigo'
              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          } ${!isLoading ? 'hover:shadow-md' : ''} z-20`}
        >
          <div className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} flex items-center justify-center`}>
            {React.cloneElement(selectedOption?.icon, { size: isMobile ? 14 : 11 })}
          </div>
          <span className={`${isMobile ? 'inline' : 'hidden sm:inline'} ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {isMobile ? selectedOption?.label?.split(' ')[0] : selectedOption?.label}
          </span>
          {!isMobile && (
            <span className="sm:hidden text-xs">
              {selectedOption?.label?.split(' ')[0]}
            </span>
          )}
          <motion.div
            animate={{ rotate: showModalDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={isMobile ? 12 : 9} className="opacity-60" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showModalDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`${isMobile ? 'mobile-dropdown' : `dropdown-panel ${isLoading ? 'loading-state' : ''}`} bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden transform-gpu`}
              style={dropdownStyle}
            >
              <div className={`${isMobile ? 'p-2.5' : 'p-3'} ${isMobile ? 'max-h-52 overflow-y-auto scrollbar-hide' : ''}`}>
                <div className={`${isMobile ? 'text-xs' : 'text-xs'} font-semibold text-slate-600 dark:text-slate-300 mb-2 px-1 flex items-center gap-1.5`}>
                  <div className="flex items-center">
                    <svg width={isMobile ? 14 : 12} height={isMobile ? 14 : 12} viewBox="0 0 24 24" fill="none" className="text-violet-500">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  Select an Agent
                </div>
                <div className={`space-y-${isMobile ? '1.5' : '1'}`}>
                  {modalOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: isMobile ? 1.01 : 1.005, x: isMobile ? 1 : 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedModal(option.id);
                        setShowModalDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 ${isMobile ? 'p-2.5' : 'p-2.5'} rounded-xl transition-all duration-200 ${
                        selectedModal === option.id
                          ? `${
                            option.color === 'violet' 
                              ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 shadow-sm'
                              : option.color === 'emerald'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 shadow-sm'
                              : option.color === 'amber'
                              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 shadow-sm'
                              : option.color === 'indigo'
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm'
                          }`
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {React.cloneElement(option.icon, { size: isMobile ? 16 : 14 })}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <div className={`font-medium text-slate-800 dark:text-slate-200 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                            {option.label}
                          </div>
                          {option.version && (
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              option.color === 'violet' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                              : option.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                              : option.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            }`}>
                              v{option.version}
                            </span>
                          )}
                        </div>
                        <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-slate-500 dark:text-slate-400 mt-0.5 leading-snug`}>
                          {option.description}
                        </div>
                        {option.specialty && (
                          <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1`}>
                            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" className="text-current">
                              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="font-medium">{option.specialty}</span>
                          </div>
                        )}
                      </div>
                      {selectedModal === option.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`${isMobile ? 'w-2.5 h-2.5' : 'w-2 h-2'} rounded-full ${
                            option.color === 'violet' ? 'bg-violet-500'
                            : option.color === 'emerald' ? 'bg-emerald-500'
                            : option.color === 'amber' ? 'bg-amber-500'
                            : option.color === 'indigo' ? 'bg-indigo-500'
                            : 'bg-slate-500'
                          }`}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Main render
  return (
    <div 
      className={`min-h-screen bg-gray-50 dark:bg-slate-900 transition-all duration-500 ${
        isMobile && chatActive ? 'pt-0 overflow-hidden' : 'pt-20'
      } ${isMobile && keyboardVisible ? 'mobile-keyboard-active' : ''}`}
      style={{
        ...getKeyboardSafeAreaStyle(),
        paddingBottom: isMobile && keyboardHeight > 0 ? `${keyboardHeight}px` : '0px'
      }}
    >
      {/* CSS for scrollbar hiding and mobile optimizations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Mobile touch improvements and keyboard handling */
        @media (max-width: 768px) {
          .mobile-input {
            -webkit-appearance: none;
            -webkit-border-radius: 16px;
            -webkit-tap-highlight-color: transparent;
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          /* Mobile keyboard active state */
          .mobile-keyboard-active {
            height: 100vh;
            overflow: hidden;
            touch-action: none;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Mobile input elevated state when keyboard is visible */
          .mobile-input-elevated {
            backdrop-filter: blur(25px);
            background: rgba(249, 250, 251, 0.98) !important;
            box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.15), 0 -5px 15px rgba(0, 0, 0, 0.1);
            border-top: 1px solid rgba(203, 213, 225, 0.9);
            position: fixed !important;
            touch-action: pan-y;
          }
          
          .dark .mobile-input-elevated {
            background: rgba(15, 23, 42, 0.98) !important;
            border-top: 1px solid rgba(51, 65, 85, 0.9);
            box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.3), 0 -5px 15px rgba(0, 0, 0, 0.2);
          }
          
          /* Allow interaction with input elements while preventing general dragging */
          .mobile-keyboard-active input,
          .mobile-keyboard-active button,
          .mobile-keyboard-active textarea,
          .mobile-keyboard-active [role="button"] {
            touch-action: auto !important;
            user-select: auto !important;
            -webkit-user-select: auto !important;
            pointer-events: auto !important;
          }
          
          /* Enhanced mobile input styling */
          .mobile-input:focus {
            transform: none !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
          }
          
          /* Mobile input keyboard focus state */
          .mobile-input-keyboard-focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 10px 40px rgba(0, 0, 0, 0.15) !important;
            border-color: rgb(59, 130, 246) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(15px);
          }
          
          .dark .mobile-input-keyboard-focus {
            background: rgba(15, 23, 42, 0.98) !important;
            border-color: rgb(59, 130, 246) !important;
          }
          
          /* Ensure dropdown stays above everything on mobile */
          .mobile-dropdown {
            position: fixed !important;
            z-index: 9999 !important;
            max-height: 55vh !important;
            overflow-y: auto !important;
          }
          
          /* Prevent body scroll when dropdown is open */
          body.dropdown-open {
            overflow: hidden;
          }
          
          /* Mobile keyboard animations */
          .mobile-keyboard-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Mobile app-like input container */
          .mobile-app-input {
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
        }
        
        /* Desktop dropdown improvements */
        @media (min-width: 769px) {
          .dropdown-container {
            position: relative;
            z-index: 50;
          }
          
          .dropdown-panel {
            position: absolute !important;
            bottom: 100% !important;
            left: 0 !important;
            margin-bottom: 16px !important;
            min-width: 280px !important;
            max-width: calc(100vw - 3rem) !important;
            z-index: 50 !important;
          }
          
          /* Extra clearance during loading */
          .dropdown-panel.loading-state {
            margin-bottom: 56px !important;
          }
        }
        
        /* Input field stability during loading */
        .input-loading-lock {
          pointer-events: none !important;
          resize: none !important;
        }
        
        /* Prevent text selection on buttons */
        .no-select {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
      
      <LimitWarning />
      
      <div className={`relative w-full mx-auto ${chatActive && isMobile ? 'h-screen' : 'max-w-4xl px-4'}`}>
        {/* Sidebar */}
        {localStorage.getItem('auth_token') && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            chatHistory={chatHistory}
            handleReset={handleReset}
            toggleStar={(id) => {
              setChatHistory(
                chatHistory.map(chat => 
                  chat.id === id ? { ...chat, starred: !chat.starred } : chat
                )
              );
            }}
            archiveChat={(chatId) => {
              setChatHistory(prev =>
                prev.map(chat =>
                  chat.id === chatId ? { ...chat, archived: true } : chat
                )
              );
            }}
            deleteChat={(id) => {
              setChatHistory(chatHistory.filter(chat => chat.id !== id));
            }}
            updateChatTitle={(chatId, newTitle) => {
              setChatHistory((prev) =>
                prev.map((chat) =>
                  chat.id === chatId ? { ...chat, title: newTitle } : chat
                )
              );
            }}
          />
        )}

        {/* Main Content */}
        <div className={`transition-all duration-500 ${chatActive && isMobile ? 'h-full' : ''}`}>
          <div 
            className={`transition-all duration-500 ease-in-out ${
              chatActive 
                ? 'h-screen flex flex-col bg-gray-50 dark:bg-slate-900' 
                : 'py-16 sm:py-20 bg-transparent flex items-center justify-center min-h-[80vh]'
            }`}
          >
            {!chatActive ? (
              /* Initial Hero State */
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center max-w-2xl mx-auto"
              >
                {/* Logo/Icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-2xl"
                >
                  <Scale size={32} className="text-white" />
                </motion.div>
                
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-600">
                    Mera Bakil
                  </span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed"
                >
                 Your AI Legal Assistant for Expert Guidance & Document Generation 
                </motion.p>
                
                {/* Free Questions Counter */}
                {!checkAuthStatus() && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 px-6 py-3 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center"
                  >
                    <Sparkles size={18} className="text-sky-500 mr-2" />
                    <p className="text-sky-700 dark:text-sky-300 font-medium">
                      {API_CONFIG.FREE_REQUEST_LIMIT - requestCount} free consultations remaining
                    </p>
                  </motion.div>
                )}
                
                <VoiceModal
                  isOpen={isVoiceModalOpen}
                  onClose={() => {
                    setVoiceModalOpen(false);
                    setIsVoiceActive(false);
                  }}
                  isVoiceActive={isVoiceActive}
                  setIsVoiceActive={setIsVoiceActive}
                  onVoiceResult={(transcript) => {
                    // Set the transcript to the input field
                    setQuery(transcript);
                    // Close the modal after processing
                    setTimeout(() => {
                      setIsVoiceActive(false);
                      setVoiceModalOpen(false);
                    }, 500);
                  }}
                />
                
                {/* Search Input */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative mb-8 w-full max-w-2xl"
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Ask your legal question..."
                      className="w-full pl-14 pr-14 py-4 rounded-full border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 bg-white dark:bg-slate-800 dark:text-slate-100 text-slate-900 text-lg shadow-xl transition-all duration-300"
                    />
                    

                    
                    {/* Voice Button - Fixed Position */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <VoiceButton 
                        onClick={handleVoiceToggle} 
                        isActive={isVoiceActive || isVoiceModalOpen}
                      />
                    </div>
                    
                    {/* Send Button - Fixed Position */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={!query.trim()}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          !query.trim() 
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:shadow-lg shadow-sky-500/25'
                        }`}
                      >
                        <SendHorizontal size={20} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Query Suggestions */}
                  <AnimatePresence>
                    <QuerySuggestions 
                      visible={showSuggestions && inputFocused && !chatActive}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </AnimatePresence>
                </motion.div>
                
                {/* Quick Start Button */}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => {
                    setChatActive(true);
                    // Reset scroll states for new chat
                    setUserScrolledUp(false);
                    setAutoScrollEnabled(true);
                    setLastScrollPosition(0);
                    setMessages([
                      {
                        id: Date.now(),
                        text: `Hello! I'm ${modalOptions.find(opt => opt.id === selectedModal)?.label || 'your AI Legal Assistant'}. I can help you with legal consultations and generate documents. How can I assist you today?`,
                        sender: 'bot',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'greeting',
                        selectedAgent: selectedModal // Store which agent was selected for greeting
                      }
                    ]);
                    // Ensure scroll to bottom after chat becomes active
                    setTimeout(() => {
                      if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                      }
                    }, 100);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 flex items-center justify-center text-lg"
                >
                  <MessageSquare size={20} className="mr-2" />
                  <span>Start Legal Consultation</span>
                </motion.button>
                

              </motion.div>
            ) : (
              /* Active Chat Interface */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full relative"
              >
                {/* Clean Centered Header */}
                <div className="sticky top-0 z-20 py-6 flex justify-center">
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    {/* Status Indicator */}
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    
                    {/* Greeting Text */}
                    <div className="flex items-center gap-3">
                      <Scale size={22} className="text-sky-600 dark:text-sky-400" />
                      <span className="text-slate-800 dark:text-slate-200 font-semibold text-base">
                        {new Date().getHours() < 12 ? 'Good Morning' : 
                         new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}
                      </span>
                    </div>
                    
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <Calendar size={12} className="text-slate-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Free Questions Counter */}
                    {!checkAuthStatus() && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-900/20 rounded-full">
                        <Bell size={12} className="text-sky-500" />
                        <span className="text-xs text-sky-600 dark:text-sky-300 font-medium">
                          {API_CONFIG.FREE_REQUEST_LIMIT - requestCount} free left
                        </span>
                      </div>
                    )}
                  </motion.div>
                  

                </div>

                {/* Chat Messages Area - Full Height */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleChatScroll}
                  className="flex-1 overflow-y-auto px-6 pt-2 pb-32 space-y-6 chat-container"
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                  }}
                >
                  {/* Initial Welcome Message */}
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center justify-center h-64 text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30 rounded-full flex items-center justify-center mb-4">
                        <Scale size={28} className="text-sky-600 dark:text-sky-400" />
                      </div>
                      <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-center gap-3'} mb-2`}>
                        <h3 className={`${isMobile ? 'text-base flex-1' : 'text-lg'} font-semibold text-slate-800 dark:text-slate-200`}>
                          {isMobile ? 'Legal Assistant' : 'Ready to Help with Legal Matters'}
                        </h3>
                        
                        {/* Premium AI New Chat Icon - Top Right */}
                        <motion.button
                          onClick={handleReset}
                          whileHover={{ scale: isMobile ? 1.05 : 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group"
                          disabled={isLoading || isResetting}
                        >
                          {/* Premium Icon Container */}
                          <div className={`relative ${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden`}>
                            
                            {/* Animated Background Glow */}
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full blur-sm"
                            />
                            
                            {/* Premium AI Sparkles - Shining Animation */}
                            <motion.div
                              animate={{
                                rotate: [0, 360]
                              }}
                              transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="absolute inset-0"
                            >
                              {/* Golden AI Sparkle - Top Right */}
                              <motion.div
                                animate={{
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0],
                                  rotateZ: [0, 180, 360]
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  delay: 0,
                                  ease: "easeInOut"
                                }}
                                className={`absolute ${isMobile ? '-top-0.5 -right-0.5' : '-top-1 -right-1'} w-1.5 h-1.5`}
                              >
                                <div className="w-full h-full relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full blur-sm"></div>
                                  <Sparkles size={isMobile ? 8 : 10} className="text-yellow-300 relative z-10" />
                                </div>
                              </motion.div>
                              
                              {/* Blue AI Sparkle - Bottom Left */}
                              <motion.div
                                animate={{
                                  scale: [0, 0.8, 0],
                                  opacity: [0, 0.9, 0],
                                  rotateZ: [360, 180, 0]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  delay: 1.2,
                                  ease: "easeInOut"
                                }}
                                className={`absolute ${isMobile ? '-bottom-0.5 -left-0.5' : '-bottom-1 -left-1'} w-1 h-1`}
                              >
                                <div className="w-full h-full relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full blur-sm"></div>
                                  <Sparkles size={isMobile ? 6 : 8} className="text-blue-300 relative z-10" />
                                </div>
                              </motion.div>
                              
                              {/* Pink Premium Sparkle - Top Left */}
                              <motion.div
                                animate={{
                                  scale: [0, 0.7, 0],
                                  opacity: [0, 0.8, 0],
                                  rotateZ: [0, 90, 180]
                                }}
                                transition={{
                                  duration: 2.8,
                                  repeat: Infinity,
                                  delay: 2,
                                  ease: "easeInOut"
                                }}
                                className={`absolute ${isMobile ? 'top-0 -left-0.5' : 'top-0 -left-1'} w-0.5 h-0.5`}
                              >
                                <div className="w-full h-full relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-sm"></div>
                                  <Sparkles size={isMobile ? 4 : 6} className="text-pink-300 relative z-10" />
                                </div>
                              </motion.div>
                            </motion.div>
                            
                            {/* Main Icon */}
                            <motion.div
                              animate={isResetting ? {
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                              } : {
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={isResetting ? {
                                duration: 0.6
                              } : {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="relative z-10"
                            >
                              {isResetting ? (
                                <CheckCircle size={isMobile ? 12 : 14} className="text-white" />
                              ) : (
                                <Plus size={isMobile ? 12 : 14} className="text-white font-bold" strokeWidth={2.5} />
                              )}
                            </motion.div>
                            
                            {/* Ripple effect on click */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0.5 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute inset-0 bg-white rounded-full"
                              key={isResetting ? 'reset' : 'idle'}
                            />
                          </div>
                          
                          {/* Clean Tooltip - Desktop Only */}
                          {!isMobile && (
                            <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <div className="bg-slate-800/90 dark:bg-white/90 text-white dark:text-slate-800 text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                                {isResetting ? 'Starting...' : 'New Chat'}
                              </div>
                            </div>
                          )}
                        </motion.button>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
                        Ask questions, request document generation, or upload files for legal analysis. 
                        Your professional legal assistant is ready.
                      </p>
                      
                      {/* Quick Action Hints */}
                      <div className="flex flex-wrap gap-2 mt-6 justify-center">
                        <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400">
                          <MessageSquare size={12} />
                          <span>Ask Questions</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 rounded-full text-xs text-emerald-600 dark:text-emerald-400">
                          <FileText size={12} />
                          <span>Generate Documents</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 rounded-full text-xs text-amber-600 dark:text-amber-400">
                          <Upload size={12} />
                          <span>Upload Files</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Messages */}
                  {messages.map((message, index, messagesArray) => 
                    renderMessage(message, index, messagesArray)
                  )}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      {renderLoadingSkeleton()}
                    </div>
                  )}
                  
                  {/* Professional New Chat Button - Bottom of Chat Area */}
                  {messages.length > 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex justify-center pt-6 pb-2"
                    >
                      <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || isResetting}
                        className={`group relative flex items-center gap-3 ${isMobile ? 'px-4 py-2.5' : 'px-6 py-3'} rounded-xl  dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:border-slate-300/70 dark:hover:border-slate-500/70 ${isLoading || isResetting ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {/* Subtle Background Glow */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Icon with Premium Animation */}
                        <motion.div
                          animate={isResetting ? {
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          } : {
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={isResetting ? {
                            duration: 0.8
                          } : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative z-10"
                        >
                          <div className={`relative ${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm`}>
                            {/* Sparkle Effect */}
                            <motion.div
                              animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute -top-0.5 -right-0.5 w-1 h-1"
                            >
                              <Sparkles size={4} className="text-yellow-300" />
                            </motion.div>
                            
                            {isResetting ? (
                              <CheckCircle size={isMobile ? 10 : 12} className="text-white" />
                            ) : (
                              <Plus size={isMobile ? 10 : 12} className="text-white" strokeWidth={2.5} />
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Text */}
                        <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300 relative z-10`}>
                          {isResetting ? 'Starting...' : 'New Chat'}
                        </span>
                        
                        {/* Subtle Arrow Indicator */}
                        <motion.div
                          animate={{ x: [0, 2, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative z-10"
                        >
                          <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-slate-300/50 dark:bg-slate-600/50 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-300`}>
                            <Plus size={isMobile ? 8 : 10} className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" strokeWidth={2} />
                          </div>
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
                
                {/* Professional Input Area - Mobile App Style with Enhanced Positioning */}
                <div 
                  className={`mt-auto ${isMobile ? 'p-4 pb-6' : 'p-4 sm:p-6 pb-16 sm:pb-20'} bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 ${
                    isMobile && keyboardVisible ? 'mobile-input-elevated' : ''
                  }`}
                  style={isMobile ? {
                    ...getInputContainerStyle(),
                    paddingBottom: keyboardVisible ? '16px' : '40px',
                    transform: keyboardVisible ? 'translateY(-40px)' : 'translateY(-10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    // Prevent dragging when keyboard is open
                    touchAction: keyboardVisible ? 'none' : 'auto',
                    pointerEvents: keyboardVisible ? 'auto' : 'auto',
                    userSelect: keyboardVisible ? 'none' : 'auto',
                    position: 'relative',
                    zIndex: keyboardVisible ? 1000 : 'auto'
                  } : {}}
                  // Prevent dragging while allowing input interaction when keyboard is visible
                  onTouchMove={isMobile && keyboardVisible ? (e) => {
                    // Only prevent if the touch target is not an input element or button
                    const target = e.target;
                    if (!target.closest('input, button, textarea, [role="button"]')) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  } : undefined}
                >
                  <div className={`${isMobile ? 'w-full' : 'max-w-4xl mx-auto'}`}>
                    {/* Mobile Status Bar - Only for Mobile */}
                    {isMobile && isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-3 text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 p-2 rounded-lg"
                      >
                        <RefreshCw size={12} className="animate-spin" />
                        {/* <span>Processing your legal query...</span> */}
                      </motion.div>
                    )}
                    
                    {/* Robust Input Container */}
                    <div className="relative">
                      {/* Main Input Field - Fixed Sizing */}
                      <div className="relative">
                        <motion.textarea
                          ref={inputRef}
                          value={query}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPress}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          placeholder={isMobile ? "Ask your legal question..." : " Ask about legal matters, request document generation, or upload files for analysis"}
                          rows={1}
                          disabled={isLoading || isTyping} // Disable during processing
                          className={`w-full ${isMobile ? 'pl-14 pr-20 py-4 pb-14 mobile-input mobile-app-input mobile-keyboard-transition' : 'pl-12 pr-24 py-3 pb-12'} rounded-2xl border ${isMobile ? 'border-2' : 'border'} border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-slate-100 text-slate-900 resize-none transition-all duration-300 shadow-lg ${isMobile ? 'text-base shadow-2xl' : 'text-base'} leading-relaxed overflow-y-auto scrollbar-hide ${(isLoading || isTyping) ? 'opacity-75 cursor-not-allowed input-loading-lock' : ''} ${
                            isMobile && keyboardVisible && mobileInputFocused ? 'mobile-input-keyboard-focus' : ''
                          }`}
                          style={{ 
                            minHeight: isMobile ? '72px' : '64px',
                            maxHeight: isMobile ? '160px' : '200px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            // Use locked height during processing, auto otherwise
                            height: (isLoading || isTyping) && lockedInputHeight ? `${lockedInputHeight}px` : 'auto',
                            '--locked-height': lockedInputHeight ? `${lockedInputHeight}px` : 'auto'
                          }}
                          animate={isMobile ? {
                            scale: keyboardVisible && mobileInputFocused ? 1.02 : 1,
                            y: keyboardVisible && mobileInputFocused ? -2 : 0
                          } : {}}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            duration: 0.3
                          }}
                          autoFocus={!isMobile && !isLoading && !isTyping}
                        />
                        
                        {/* Voice Button - Mobile Optimized */}
                        <div className={`absolute ${isMobile ? 'left-3 top-3' : 'left-3 top-3'}`}>
                          <VoiceButton 
                            onClick={handleVoiceToggle} 
                            isActive={isVoiceActive || isVoiceModalOpen}
                          />
                        </div>
                        
                        {/* Right Side Action Icons - Compact Mobile Layout */}
                        <div className={`absolute ${isMobile ? 'right-2 top-3' : 'right-3 top-3'} flex items-center ${isMobile ? 'gap-1' : 'gap-1'}`}>
                          {/* Upload Icon - Mobile Compact */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className={`${isMobile ? 'p-2' : 'p-2'} rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors no-select`}
                            title="Upload Document"
                          >
                            <Upload size={isMobile ? 16 : 16} className="text-slate-500 dark:text-slate-400 hover:text-sky-500" />
                          </motion.button>
                          
                          {/* Send Button - Mobile Priority */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={isLoading || !query.trim()}
                            className={`${isMobile ? 'p-2.5' : 'p-2.5'} rounded-full transition-all duration-200 ml-0.5 no-select ${
                              isLoading || !query.trim() 
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : `bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:shadow-lg shadow-sky-500/25 hover:scale-105 ${isMobile ? 'shadow-xl' : ''}`
                            }`}
                            title={isLoading ? 'Processing...' : 'Send Message'}
                          >
                            {isLoading ? (
                              <RefreshCw size={isMobile ? 18 : 18} className="animate-spin" />
                            ) : (
                              <SendHorizontal size={isMobile ? 18 : 18} />
                            )}
                          </motion.button>
                        </div>
                        
                        {/* Bottom Control Bar - Clean Mobile Layout */}
                        <div className={`absolute ${isMobile ? 'bottom-2 left-3 right-3' : 'bottom-2 left-3 right-3'} flex items-center ${isMobile ? 'justify-center' : 'justify-between'}`}>
                          {/* Modal Selection Dropdown - Center on Mobile */}
                          <div className="relative z-10">
                            <ModalDropdown />
                          </div>
                          
                          {/* Character Count - Desktop Only to Prevent Clutter */}
                          {!isMobile && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                              {query.length > 0 && (
                                <span>{query.length} chars</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      


                      {/* Desktop Status Indicators - Only for Desktop */}
                      {!isMobile && isLoading && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 mt-3 text-sm text-sky-600 dark:text-sky-400"
                        >
                          {/* <RefreshCw size={14} className="animate-spin" />
                          <span>Processing your legal query...</span> */}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;