import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, MessageSquare, Menu, ChevronLeft, Plus, MoreVertical, Trash2, Edit, Star, Clock, Archive, AlertCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Mic } from 'lucide-react';
import VoiceModal from '../components/VoiceModal';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';



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

  // Sample legal queries for typing animation
  const sampleQueries = [
    "What are my rights in a landlord-tenant dispute?",
    "How do I file a small claims lawsuit?",
    "What should I do after a car accident?",
    "Can I get legal aid for my divorce case?",
    "What's the process for contesting a will?"
  ];

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

  // Simulate typing response animation
  const simulateTypingResponse = (fullText, onUpdate, onComplete, delay = 10) => {
    let index = 0;
    const interval = setInterval(() => {
      onUpdate(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, delay);
    return interval;
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

  // Typing animation effect


  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Custom scrollbar styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .overflow-y-auto::-webkit-scrollbar {
        width: 5px;
        background-color: transparent;
      }
      
      .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
        margin: 5px 0;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb {
        background: rgba(14, 165, 233, 0.2);
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      
      .overflow-y-auto:hover::-webkit-scrollbar-thumb {
        background: rgba(14, 165, 233, 0.4);
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: rgba(14, 165, 233, 0.6);
      }
      
      .overflow-y-auto {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 253, 253, 0.4) transparent;
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

  // Render formatted message text
  const renderMessageText = (text) => {
    return (
      <div 
        className="leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  // Loading skeleton component
  const renderLoadingSkeleton = () => (
    <div className="flex flex-col space-y-2 animate-pulse">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#0EA5E9] dark:bg-[#38BDF8] mr-3 flex items-center justify-center">
          <span className="text-white text-xs font-bold">M</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded"></div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{loadingState}</div>
          </div>
          <div className="w-64 h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded"></div>
          <div className="w-52 h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded"></div>
          <div className="w-40 h-4 bg-[#E2E8F0] dark:bg-[#334155] rounded"></div>
        </div>
      </div>
    </div>
  );

  // Limit warning component
  const LimitWarning = () => (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${showLimitWarning ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-[#0EA5E9] dark:text-[#38BDF8] mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0] mb-1">
              Free Limit Reached
            </h4>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-3">
              You've used all {API_CONFIG.FREE_REQUEST_LIMIT} free questions. Sign in to continue chatting!
            </p>

            
          <button
      onClick={() => navigate('/Auth')}
      className="text-sm bg-[#0EA5E9] dark:bg-[#38BDF8] text-white px-3 py-1 rounded-md hover:opacity-90 transition-opacity"
    >
      Sign In
    </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="hero-section" className="pt-16 bg-[#F8F9FA] dark:bg-[#0F172A] min-h-screen flex flex-col items-center justify-center px-4 h-6 transition-all duration-500">
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
              // Initial centered hero content
              <div className="flex flex-col items-center">
                <div className="mb-6 w-16 h-16 rounded-full bg-[#0EA5E9] dark:bg-[#38BDF8] flex items-center justify-center shadow-lg">
                  <MessageSquare size={28} className="text-white" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1E293B] dark:text-[#E2E8F0] mb-2">
                  Discuss Your Legal Concern
                </h1>
                
                {!checkAuthStatus() && (
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">
                    {API_CONFIG.FREE_REQUEST_LIMIT - requestCount} free questions remaining
                  </p>
                )}
                
                <VoiceModal
                  isOpen={isVoiceModalOpen}
                  onClose={() => setVoiceModalOpen(false)}
                  onVoiceResult={(transcript) => setQuery(transcript)}
                />
                
                <div className="relative mb-8 w-full max-w-xl">
                 <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={typedText}
                    className="w-full pl-14 pr-14 py-4 rounded-full border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] 
                            bg-white dark:bg-[#1E293B] dark:text-[#E2E8F0] shadow-lg text-[#1E293B]"
                  />
                  <button
                    onClick={() => setVoiceModalOpen(true)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded-full text-white hover:shadow-lg 
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] focus:ring-opacity-50 z-10"
                    title="Voice Mode"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded-full text-white hover:shadow-lg 
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] focus:ring-opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => {
                      setChatActive(true);
                      setMessages([
                        {
                          id: Date.now(),
                          text: "Hello! I'm Your Virtual Bakil, your AI legal assistant. How can I help you today?",
                          sender: 'bot',
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ]);
                    }}
                    className="px-8 py-3 bg-[#0EA5E9] dark:bg-[#38BDF8] text-white font-medium rounded-full 
                             shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] focus:ring-opacity-50"
                  >
                    Get Started
                  </button>
                  <button className="px-8 py-3 bg-white dark:bg-[#1E293B] hover:bg-[#F8F9FA] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-medium rounded-full shadow-md hover:shadow-lg
                                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#64748B] dark:focus:ring-[#94A3B8] focus:ring-opacity-50 border border-[#E2E8F0] dark:border-[#334155]">
                    Watch Demo
                  </button>
                </div>
              </div>
            ) : (
              // Active chat interface
              <>
                {/* Chat messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 w-full"
                >
                  <div className="flex justify-center mb-4">
                    <div className="px-4 py-2 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded-full text-white text-sm font-medium">
                      {`Good day! Today is ${new Date().toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}`}
                    </div>
                  </div>

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-[#0EA5E9] dark:bg-[#38BDF8] flex items-center justify-center mr-2 mt-1">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-[#0EA5E9] dark:bg-[#38BDF8] text-white rounded-br-none'
                            : 'bg-[#F8F9FA] dark:bg-[#334155] text-[#1E293B] dark:text-[#E2E8F0] rounded-bl-none border border-[#E2E8F0] dark:border-[#64748B]'
                        }`}
                      >
                        {renderMessageText(message.text)}
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>

                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-[#E2E8F0] dark:bg-[#64748B] flex items-center justify-center ml-2 mt-1">
                          <span className="text-[#64748B] dark:text-[#E2E8F0] text-xs font-bold">You</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && <div className="flex justify-start">{renderLoadingSkeleton()}</div>}
                </div>
                  {/* Chat input */}
                  <div className="p-4 border-t border-[#E2E8F0] dark:border-[#334155]">
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your legal question..."
                        className="w-full px-5 py-4 pr-14 rounded-full border border-[#E2E8F0] dark:border-[#334155] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] 
                                  bg-[#F8F9FA] dark:bg-[#334155] dark:text-[#E2E8F0] text-[#1E293B]"
                        autoFocus
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded-full text-white 
                                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] dark:focus:ring-[#38BDF8] focus:ring-opacity-50
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                             </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

