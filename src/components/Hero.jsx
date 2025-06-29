import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Send, MessageSquare, Menu, ChevronLeft, Plus, MoreVertical, Trash2, Edit, Star, Clock, Archive, AlertCircle, Sparkles, HelpCircle, BookOpen, FileText, Lightbulb, ArrowRight, X, Copy, ThumbsUp, Mic as MicIcon, Home, Users, Scale, Briefcase } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Mic } from 'lucide-react';
import VoiceModal from '../components/VoiceModal';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


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
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState('property');
  const [voiceButtonHover, setVoiceButtonHover] = useState(false);
  const [sendButtonHover, setSendButtonHover] = useState(false);
  const [messageAnimationComplete, setMessageAnimationComplete] = useState(true);
  
  // Free request limit state
  const [requestCount, setRequestCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // Refs
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sample chat history
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

  // Sample legal queries organized by categories
  const querySuggestions = {
    property: [
      { id: 'p1', text: "What are my rights in a landlord-tenant dispute?" },
      { id: 'p2', text: "How can I resolve a property boundary dispute?" },
      { id: 'p3', text: "What legal recourse do I have for construction defects?" }
    ],
    family: [
      { id: 'f1', text: "What's the process for filing for divorce?" },
      { id: 'f2', text: "How is child custody determined in my state?" },
      { id: 'f3', text: "Can I get legal aid for my family court case?" }
    ],
    civil: [
      { id: 'c1', text: "How do I file a small claims lawsuit?" },
      { id: 'c2', text: "What should I do after a car accident?" },
      { id: 'c3', text: "How long do I have to file a personal injury claim?" }
    ],
    business: [
      { id: 'b1', text: "What legal structure is best for my small business?" },
      { id: 'b2', text: "How do I protect my intellectual property?" },
      { id: 'b3', text: "What are my obligations as an employer?" }
    ],
    estate: [
      { id: 'e1', text: "What's the process for contesting a will?" },
      { id: 'e2', text: "How do I set up a power of attorney?" },
      { id: 'e3', text: "What happens to my assets if I die without a will?" }
    ]
  };
  
  // Flattened list for typing animation
  const sampleQueries = Object.values(querySuggestions).flat().map(q => q.text);

  // Loading states for animation
  const loadingStates = [
    'analyzing..',
    'analyzing...',
    'analyzing....',
    'analyzing.....',
    'analyzing......'
  ];

  // Check authentication status from localStorage
  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      return !!authToken && authToken.length > 0;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  // Get request count from localStorage with daily reset
  const getRequestCount = () => {
    try {
      // Get stored data
      const storedData = localStorage.getItem('free_request_data');
      
      if (!storedData) {
        return 0;
      }
      
      const { count, date } = JSON.parse(storedData);
      const storedDate = new Date(date);
      const currentDate = new Date();
      
      // Check if it's a new day (different date)
      if (storedDate.toDateString() !== currentDate.toDateString()) {
        // It's a new day, reset count to 0
        updateRequestCount(0);
        return 0;
      }
      
      return count;
    } catch (error) {
      console.error('Error getting request count:', error);
      return 0;
    }
  };

  // Update request count in localStorage with date
  const updateRequestCount = (count) => {
    try {
      const data = {
        count: count,
        date: new Date().toISOString()
      };
      
      localStorage.setItem('free_request_data', JSON.stringify(data));
      setRequestCount(count);
    } catch (error) {
      console.error('Error updating request count:', error);
    }
  };

  // Initialize request count on component mount and handle migration from old format
  useEffect(() => {
    try {
      // Check if we have data in the old format
      const oldCountData = localStorage.getItem('free_request_count');
      
      if (oldCountData && !localStorage.getItem('free_request_data')) {
        // Migrate old data to new format
        const oldCount = parseInt(oldCountData, 10);
        updateRequestCount(oldCount);
        // Remove old format data
        localStorage.removeItem('free_request_count');
      }
      
      // Get current count (will use new format)
      const currentCount = getRequestCount();
      setRequestCount(currentCount);
    } catch (error) {
      console.error('Error initializing request count:', error);
      setRequestCount(0);
    }
  }, []);

  // API Response Parser
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

  // Format bot response for better display
  const formatBotResponse = (text) => {
    if (!text) return text;

    // Handle numbered lists
    text = text.replace(/(\d+\.\s)/g, '\n$1');
    
    // Handle bullet points
    text = text.replace(/(\*\s)/g, '\n• ');
    text = text.replace(/(-\s)/g, '\n• ');
    
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle line breaks
    text = text.replace(/\n\n/g, '\n');
    
    return text.trim();
  };

  // API Integration Function
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
      return formatBotResponse(parsedText);
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  // Enhanced typing response animation with variable speed
  const simulateTypingResponse = (fullText, onUpdate, onComplete, initialDelay = 10) => {
    let index = 0;
    let delay = initialDelay;
    setMessageAnimationComplete(false);
    
    // Function to determine typing speed based on context
    const getTypingDelay = (currentChar, nextChar) => {
      // Slow down at punctuation
      if (['.', '!', '?', ',', ';', ':'].includes(currentChar)) {
        return initialDelay * 15; // Longer pause at punctuation
      }
      // Slow down at paragraph breaks
      else if (currentChar === '\n') {
        return initialDelay * 20; // Even longer pause at line breaks
      }
      // Random slight variations in typing speed for natural feel
      else {
        return initialDelay + Math.random() * 5;
      }
    };
    
    const typeNextChar = () => {
      if (index < fullText.length) {
        onUpdate(fullText.slice(0, index + 1));
        const currentChar = fullText[index];
        const nextChar = fullText[index + 1] || '';
        delay = getTypingDelay(currentChar, nextChar);
        index++;
        setTimeout(typeNextChar, delay);
      } else {
        setMessageAnimationComplete(true);
        if (onComplete) onComplete();
      }
    };
    
    // Start typing with initial delay
    setTimeout(typeNextChar, 300);
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // Check if user is authenticated or within free limit
    const isUserAuthenticated = checkAuthStatus();
    const currentRequestCount = getRequestCount();

    if (!isUserAuthenticated && currentRequestCount >= API_CONFIG.FREE_REQUEST_LIMIT) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 5000);
      return;
    }

    // Add user message
    const newMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setChatActive(true);
    setIsLoading(true);
    
    // Reset the input field
    const userQuery = query;
    setQuery('');
    
    // Update request count for non-authenticated users
    if (!isUserAuthenticated) {
      updateRequestCount(currentRequestCount + 1);
    }
    
    // Simulate loading states
    let currentStateIndex = 0;
    const stateInterval = setInterval(() => {
      setLoadingState(loadingStates[currentStateIndex]);
      currentStateIndex = (currentStateIndex + 1) % loadingStates.length;
    }, 500);
    
    try {
      // Call actual API
      const botResponse = await sendMessageToAPI(userQuery);
      
      clearInterval(stateInterval);
      setIsLoading(false);
      setLoadingState('');
      
      // Create bot message placeholder
      const botMessageId = Date.now() + 1;
      setMessages([
        ...updatedMessages,
        {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Animate the response text
      simulateTypingResponse(
        botResponse,
        (partialText) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId ? { ...msg, text: partialText } : msg
            )
          );
        },
        () => {
          // Typing complete
        }
      );

      // Add to chat history if it's a new conversation
      if (updatedMessages.length <= 1) {
        const title = userQuery.length > 25 ? userQuery.substring(0, 25) + '...' : userQuery;
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

    } catch (error) {
      clearInterval(stateInterval);
      setIsLoading(false);
      setLoadingState('');
      
      // Add error message
      setMessages([
        ...updatedMessages,
        {
          id: Date.now() + 1,
          text: "❌ Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Handle keyboard events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Reset chat
  const handleReset = () => {
    setChatActive(false);
    setMessages([]);
    setIsLoading(false);
    setLoadingState('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  // Sidebar management effects
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.toggle-sidebar-btn') && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Typing animation effect for placeholder text
  useEffect(() => {
    if (!typing) return;
    
    const currentPlaceholder = sampleQueries[placeholderIndex];
    let currentIndex = 0;
    let typingInterval;
    let pauseTimeout;
    
    // Type the current placeholder
    const typeText = () => {
      if (currentIndex <= currentPlaceholder.length) {
        setTypedText(currentPlaceholder.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Pause at the end of typing before erasing
        pauseTimeout = setTimeout(() => {
          typingInterval = setInterval(eraseText, 50);
        }, 2000);
      }
    };
    
    // Erase the current placeholder
    const eraseText = () => {
      if (currentIndex > 0) {
        setTypedText(currentPlaceholder.substring(0, currentIndex - 1));
        currentIndex--;
      } else {
        clearInterval(typingInterval);
        
        // Move to the next placeholder
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % sampleQueries.length);
        
        // Start typing the next placeholder after a short pause
        pauseTimeout = setTimeout(() => {
          typingInterval = setInterval(typeText, 100);
        }, 500);
      }
    };
    
    // Start the typing animation
    typingInterval = setInterval(typeText, 100);
    
    // Cleanup function
    return () => {
      clearInterval(typingInterval);
      clearTimeout(pauseTimeout);
    };
  }, [placeholderIndex, typing, sampleQueries]);
  
  // Handle input focus events
  const handleInputFocus = () => {
    setInputFocused(true);
    if (!query.trim()) {
      setShowSuggestions(true);
    }
    setTyping(false); // Stop the typing animation when input is focused
  };
  
  const handleInputBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setInputFocused(false);
      // Don't hide suggestions on blur to allow category selection
      if (!query) {
        setTyping(true); // Resume typing animation if input is empty
      }
    }, 200);
  };
  
  // Handle input change with improved suggestion behavior
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Hide suggestions when user starts typing
    if (value.trim()) {
      setShowSuggestions(false);
    } else if (inputFocused) {
      setShowSuggestions(true);
    }
  };
  
  // Handle category change in suggestions
  const handleCategoryChange = (categoryId) => {
    setActiveSuggestionCategory(categoryId);
    // Keep suggestions visible when changing categories
    setShowSuggestions(true);
  };
  
  // Handle suggestion selection
  const handleSuggestionClick = (suggestionText) => {
    setQuery(suggestionText);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };


  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide scrollbars completely
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbars for all browsers */
      .overflow-y-auto::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
        background-color: transparent;
      }
      
      .overflow-y-auto {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
    `;
    
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sidebar helper functions
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredChats = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || chat[filter] === true;
    return matchesSearch && matchesFilter;
  });

  const archiveChat = (chatId) => {
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, archived: true } : chat
      )
    );
  };

  const toggleStar = (id) => {
    setChatHistory(
      chatHistory.map(chat => 
        chat.id === id ? { ...chat, starred: !chat.starred } : chat
      )
    );
  };

  const deleteChat = (id) => {
    setChatHistory(chatHistory.filter(chat => chat.id !== id));
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Advanced message text rendering with professional formatting
  const renderMessageText = (text, sender) => {
    if (!text) return null;
    
    // Process code blocks
    const processCodeBlocks = (content) => {
      const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
      return content.replace(codeBlockRegex, (match, language, code) => {
        return `<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-3 overflow-x-auto"><code class="text-sm font-mono">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      });
    };
    
    // Process inline code
    const processInlineCode = (content) => {
      const inlineCodeRegex = /`([^`]+)`/g;
      return content.replace(inlineCodeRegex, (match, code) => {
        return `<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">${code}</code>`;
      });
    };
    
    // Process links
    const processLinks = (content) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      return content.replace(linkRegex, (match, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${text}</a>`;
      });
    };
    
    // Process bullet points
    const processBulletPoints = (content) => {
      // Match lines starting with * or - followed by a space
      const bulletRegex = /^(?:\*|\-)\s(.+)$/gm;
      return content.replace(bulletRegex, (match, point) => {
        return `<div class="flex items-start my-1.5">
                  <span class="text-[#0EA5E9] dark:text-[#38BDF8] mr-2 mt-0.5">•</span>
                  <span>${point}</span>
                </div>`;
      });
    };
    
    // Process numbered lists
    const processNumberedLists = (content) => {
      // Match lines starting with a number, period, and space
      const numberedRegex = /^(\d+)\.\s(.+)$/gm;
      return content.replace(numberedRegex, (match, number, point) => {
        return `<div class="flex items-start my-1.5">
                  <span class="text-[#0EA5E9] dark:text-[#38BDF8] font-medium mr-2 min-w-[18px]">${number}.</span>
                  <span>${point}</span>
                </div>`;
      });
    };
    
    // Process headings
    const processHeadings = (content) => {
      // Match lines starting with # (h1), ## (h2), ### (h3)
      const h1Regex = /^#\s(.+)$/gm;
      const h2Regex = /^##\s(.+)$/gm;
      const h3Regex = /^###\s(.+)$/gm;
      
      let processed = content;
      processed = processed.replace(h1Regex, '<h3 class="text-xl font-bold my-3 text-[#1E293B] dark:text-[#E2E8F0]">$1</h3>');
      processed = processed.replace(h2Regex, '<h4 class="text-lg font-semibold my-2 text-[#1E293B] dark:text-[#E2E8F0]">$1</h4>');
      processed = processed.replace(h3Regex, '<h5 class="text-base font-medium my-2 text-[#1E293B] dark:text-[#E2E8F0]">$1</h5>');
      
      return processed;
    };
    
    // Process bold and italic text
    const processEmphasis = (content) => {
      // Bold: **text** or __text__
      const boldRegex = /(\*\*|__)(.*?)\1/g;
      // Italic: *text* or _text_
      const italicRegex = /(\*|_)(.*?)\1/g;
      
      let processed = content;
      processed = processed.replace(boldRegex, '<strong class="font-semibold">$2</strong>');
      processed = processed.replace(italicRegex, '<em class="italic">$2</em>');
      
      return processed;
    };
    
    // Process paragraphs with proper spacing
    const processParagraphs = (content) => {
      // Split by double newlines to identify paragraphs
      const paragraphs = content.split(/\n\n+/);
      
      // Only process if there are multiple paragraphs
      if (paragraphs.length <= 1) return content;
      
      return paragraphs
        .map(p => p.trim())
        .filter(p => p) // Remove empty paragraphs
        .map(p => `<p class="my-2">${p}</p>`)
        .join('');
    };
    
    // Apply all formatting in the correct order
    let formattedText = text;
    
    // First, handle code blocks (to prevent other formatting inside them)
    formattedText = processCodeBlocks(formattedText);
    
    // Then apply other formatting
    formattedText = processHeadings(formattedText);
    formattedText = processBulletPoints(formattedText);
    formattedText = processNumberedLists(formattedText);
    formattedText = processLinks(formattedText);
    formattedText = processInlineCode(formattedText);
    formattedText = processEmphasis(formattedText);
    
    // Finally, handle paragraphs if needed
    if (formattedText.includes('\n\n')) {
      formattedText = processParagraphs(formattedText);
    }
    
    return (
      <div 
        className={`leading-relaxed ${sender === 'bot' ? 'text-[15px]' : ''}`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };
  
  // Render message with animations - simplified and cleaner
  const renderMessage = (message, index, messages) => {
    const isPreviousSameSender = index > 0 && messages[index - 1].sender === message.sender;
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${!isPreviousSameSender ? 'mt-6' : 'mt-2'}`}
      >
        {message.sender !== 'user' && !isPreviousSameSender && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center mr-2 mt-1 shadow-md">
            <Scale size={16} className="text-white" />
          </div>
        )}

        <div
          className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white'
              : 'bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] border border-[#E2E8F0] dark:border-[#334155]'
          }`}
        >
          {renderMessageText(message.text, message.sender)}
          <div className="flex items-center justify-between mt-2">
            <p
              className={`text-xs ${
                message.sender === 'user' ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              {message.timestamp}
            </p>
            
            {message.sender === 'bot' && messageAnimationComplete && (
              <div className="flex space-x-2">
                <button 
                  className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#0EA5E9] dark:hover:text-[#38BDF8] transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(message.text);
                    // Could add a toast notification here
                  }}
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                </button>
                <button 
                  className="text-[#64748B] dark:text-[#94A3B8] hover:text-green-500 transition-colors"
                  title="Helpful response"
                >
                  <ThumbsUp size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Enhanced loading skeleton component with animation
  const renderLoadingSkeleton = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-3 max-w-[80%]"
    >
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] mr-3 flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-bold">M</span>
        </div>
        <div className="flex flex-col gap-2 bg-white dark:bg-[#1E293B] p-4 rounded-2xl rounded-bl-none border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-24 h-3 bg-[#0EA5E9]/20 dark:bg-[#38BDF8]/20 rounded-full"></div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium flex items-center">
              <span className="mr-1">{loadingState}</span>
              <div className="flex space-x-1">
                <span className="animate-pulse">⚫</span>
                <span className="animate-pulse delay-100">⚫</span>
                <span className="animate-pulse delay-200">⚫</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
            <div className="w-[85%] h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
            <div className="w-[90%] h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
            <div className="w-[70%] h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <div className="w-16 h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
              <div className="w-4 h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Enhanced limit warning component with animation
  const LimitWarning = () => (
    <AnimatePresence>
      {showLimitWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-4 shadow-xl max-w-sm backdrop-blur-sm bg-white/90 dark:bg-[#1E293B]/90">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="text-red-500 dark:text-red-400" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0] mb-1">
                  Free Limit Reached
                </h4>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-3">
                  You've used all {API_CONFIG.FREE_REQUEST_LIMIT} free questions. Sign in to continue chatting with our legal assistant!
                </p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowLimitWarning(false)}
                    className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
                  >
                    Dismiss
                  </button>
                  
                  <button
                    onClick={() => navigate('/Auth')}
                    className="text-sm bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 flex items-center"
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

  // Query suggestions component
  const QuerySuggestions = ({ visible, category, onCategoryChange, onSuggestionClick }) => {
    const categories = [
      { id: 'property', icon: <Home size={16} />, label: 'Property' },
      { id: 'family', icon: <Users size={16} />, label: 'Family' },
      { id: 'civil', icon: <Scale size={16} />, label: 'Civil' },
      { id: 'business', icon: <Briefcase size={16} />, label: 'Business' },
      { id: 'estate', icon: <FileText size={16} />, label: 'Estate' }
    ];
    
    if (!visible) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 right-0 top-full mt-2 bg-[#F8F9FA] dark:bg-[#0F172A] rounded-xl  z-10"
      >
        <div className="p-3 border-b border-[#E2E8F0] dark:border-[#334155]">
          {/* <h3 className="text-sm font-medium text-[#1E293B] dark:text-[#E2E8F0] mb-2 flex items-center">
            <Lightbulb size={16} className="mr-2 text-[#0EA5E9] dark:text-[#38BDF8]" />
            Suggested Questions
          </h3>
           */}
          {/* <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center whitespace-nowrap transition-colors ${
                  category === cat.id 
                    ? 'bg-[#0EA5E9] dark:bg-[#38BDF8] text-white' 
                    : 'bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#475569]'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div> */}
        </div>
        
        <div className="p-2 max-h-[200px] overflow-y-auto">
          {querySuggestions[category].map(suggestion => (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="w-full text-left p-2.5 rounded-lg text-sm text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors flex items-start"
            >
              <ArrowRight size={14} className="mr-2 mt-1 text-[#0EA5E9] dark:text-[#38BDF8]" />
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };
  
  // Simple voice button without animations
  const VoiceButton = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full z-10 focus:outline-none transition-colors bg-gray-100 dark:bg-gray-700 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0EA5E9] dark:hover:text-[#38BDF8]"
        title="Voice Input"
      >
        <MicIcon size={18} />
      </button>
    );
  };

  return (
    <div id="hero-section" className="pt-20 bg-[#F8F9FA] dark:bg-[#0F172A] min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-500">
      <LimitWarning />
      
      <div className="relative w-full max-w-[800px] mx-auto">
        {/* Sidebar */}
        {localStorage.getItem('auth_token') && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          chatHistory={chatHistory}
          handleReset={handleReset}
          toggleStar={toggleStar}
          archiveChat={archiveChat}
          deleteChat={deleteChat}
          updateChatTitle={updateChatTitle}
        />
      )}

        {/* Main Content - Chat Widget */}
        <div className="transition-all duration-500">
           <div 
            className={`rounded-xl overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm ${
              chatActive 
                ? 'h-[85vh] bg-white/90 dark:bg-gray-900/90 shadow-xl flex flex-col' 
                : 'py-16 sm:py-20 bg-transparent'
            }` }
            style={{backgroundColor: 'transparent',boxShadow: 'none' }}
          >
            {!chatActive ? (
              // Simplified initial centered hero content
              <div className="flex flex-col items-center">
                <div className="mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center shadow-lg">
                  <Scale size={28} className="text-white" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1E293B] dark:text-[#E2E8F0] mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]">
                    Mera Bakil
                  </span>
                </h1>
                
                <p className="text-center text-[#64748B] dark:text-[#94A3B8] mb-6 max-w-lg">
                  {/* Get instant answers to your legal questions */}
                </p>
                
                {!checkAuthStatus() && (
                  <div className="mb-6 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center">
                    <Sparkles size={16} className="text-[#0EA5E9] dark:text-[#38BDF8] mr-2" />
                    <p className="text-sm text-[#0EA5E9] dark:text-[#38BDF8] font-medium">
                      {API_CONFIG.FREE_REQUEST_LIMIT - requestCount} free questions remaining
                    </p>
                  </div>
                )}
                
                <VoiceModal
                  isOpen={isVoiceModalOpen}
                  onClose={() => setVoiceModalOpen(false)}
                  onVoiceResult={(transcript) => setQuery(transcript)}
                />
                
                <div className="relative mb-6 w-full max-w-xl">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Type your question..."
                      className="w-full pl-12 pr-12 py-3.5 rounded-full border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] 
                              bg-white dark:bg-[#1E293B] dark:text-[#E2E8F0] shadow-md text-[#1E293B] transition-all duration-300"
                    />
                    
                    {/* Voice Button with Equalizer */}
                    <VoiceButton 
                      onClick={() => setVoiceModalOpen(true)}
                      isRecording={isVoiceModalOpen}
                    />
                    
                    {/* Send Button - Simplified */}
                    <button
                      onClick={handleSubmit}
                      disabled={!query.trim()}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 focus:outline-none
                                ${!query.trim() 
                                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                  : 'bg-[#0EA5E9] dark:bg-[#38BDF8] text-white hover:bg-[#0EA5E9]/90 dark:hover:bg-[#38BDF8]/90'}`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  {/* Query Suggestions */}
                  <AnimatePresence>
                    <QuerySuggestions 
                      visible={showSuggestions && inputFocused}
                      category={activeSuggestionCategory}
                      onCategoryChange={setActiveSuggestionCategory}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </AnimatePresence>
                </div>
                
                <button 
                  onClick={() => {
                    setChatActive(true);
                    setMessages([
                      {
                        id: Date.now(),
                        text: "Hello! I'm your Bakil Legal Assistant. How can I help you today?",
                        sender: 'bot',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="px-8 py-3 bg-[#0EA5E9] dark:bg-[#38BDF8] text-white font-medium rounded-full 
                           shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] focus:ring-opacity-50 flex items-center justify-center"
                >
                  <MessageSquare size={18} className="mr-2" />
                  <span>Start Conversation</span>
                </button>
                
                {/* Simple feature highlights */}
                <div className="mt-10 flex flex-wrap justify-center gap-6 w-full max-w-2xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                      <Sparkles size={16} className="text-[#0EA5E9] dark:text-[#38BDF8]" />
                    </div>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Instant legal answers</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                      <MicIcon size={16} className="text-[#0EA5E9] dark:text-[#38BDF8]" />
                    </div>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Voice input enabled</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                      <Scale size={16} className="text-[#0EA5E9] dark:text-[#38BDF8]" />
                    </div>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Expert legal guidance</p>
                  </div>
                </div>
              </div>
            ) : (
              // Simplified active chat interface
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {/* Chat messages */}
                <motion.div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Welcome message with date */}
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] rounded-full text-white text-sm font-medium shadow-md"
                    >
                      {`Welcome to Bakil Legal Assistant • ${new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}`}
                    </motion.div>
                  </div>

                  {/* Free questions counter for non-authenticated users */}
                  {!checkAuthStatus() && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center">
                        <Sparkles size={14} className="text-[#0EA5E9] dark:text-[#38BDF8] mr-1.5" />
                        <p className="text-xs text-[#0EA5E9] dark:text-[#38BDF8] font-medium">
                          {API_CONFIG.FREE_REQUEST_LIMIT - requestCount} free questions remaining
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Render messages with our enhanced renderer */}
                  {messages.map((message, index, messagesArray) => 
                    renderMessage(message, index, messagesArray)
                  )}

                  {/* Loading indicator */}
                  {isLoading && <div className="flex justify-start">{renderLoadingSkeleton()}</div>}
                  
                  {/* New conversation button */}
                  {messages.length > 0 && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleReset}
                        className="flex items-center px-4 py-2 text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#0EA5E9] dark:hover:text-[#38BDF8] transition-colors"
                      >
                        <Plus size={16} className="mr-1.5" />
                        New conversation
                      </button>
                    </div>
                  )}
                </motion.div>
                
                {/* Chat input */}
                <div className="p-4 border-t border-[#E2E8F0] dark:border-[#334155]">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Type your question..."
                      className="w-full pl-12 pr-12 py-3.5 rounded-full border border-[#E2E8F0] dark:border-[#334155] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] 
                                bg-white dark:bg-[#1E293B] dark:text-[#E2E8F0] text-[#1E293B] transition-all duration-300"
                      autoFocus
                    />
                    
                    {/* Voice Button with Equalizer */}
                    <VoiceButton 
                      onClick={() => setVoiceModalOpen(true)}
                      isRecording={isVoiceModalOpen}
                    />
                    
                    {/* Send Button - Simplified */}
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !query.trim()}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 focus:outline-none
                                ${isLoading || !query.trim() 
                                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                  : 'bg-[#0EA5E9] dark:bg-[#38BDF8] text-white hover:bg-[#0EA5E9]/90 dark:hover:bg-[#38BDF8]/90'}`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  {/* Query Suggestions */}
                  <AnimatePresence>
                    <QuerySuggestions 
                      visible={showSuggestions && inputFocused}
                      category={activeSuggestionCategory}
                      onCategoryChange={setActiveSuggestionCategory}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </AnimatePresence>
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

