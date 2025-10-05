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
import OnboardingTour from './OnboardingTour';
import ActiveChat from './ActiveChat';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileKeyboard } from '../hooks/useMobileKeyboard';
import { useOnboardingTour } from '../hooks/useOnboardingTour';

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
  
  // Onboarding tour functionality
  const {
    showTour,
    isFirstLogin,
    startTour,
    closeTour,
    completeTour,
    resetTour
  } = useOnboardingTour();
  
  // Free request limit state
  const [requestCount, setRequestCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Enhanced UI state management
  const [lockedInputHeight, setLockedInputHeight] = useState(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  
  // Text-to-Speech state management
  const [isReading, setIsReading] = useState(false);
  const [currentReadingMessageId, setCurrentReadingMessageId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [activeVoiceSelectorId, setActiveVoiceSelectorId] = useState(null);
  const speechSynthesisRef = useRef(null);
  
  // Refs
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const modalDropdownRef = useRef(null);
  const voiceSelectorRef = useRef(null);
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

  // Enhanced mobile app experience - prevent scrolling when in chat mode
  useEffect(() => {
    if (chatActive) {
      // Prevent page scrolling when chat is active for app-like experience
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [chatActive]);

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
      // Cleanup speech synthesis
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Close modal dropdown when clicking outside
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

  // Text-to-Speech functionality with Indian accent
  const cleanTextForSpeech = (text) => {
    // Remove HTML tags and formatting
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/`([^`]*)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/[-*]\s/g, '') // Remove bullet points
      .replace(/\n+/g, '. ') // Replace line breaks with periods
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return cleanText;
  };

  const readAloudMessage = (messageText, messageId) => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech feature.');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // If already reading this message, stop it
    if (isReading && currentReadingMessageId === messageId) {
      setIsReading(false);
      setCurrentReadingMessageId(null);
      return;
    }

    // Clean the text for better speech
    const cleanText = cleanTextForSpeech(messageText);
    
    if (!cleanText.trim()) {
      alert('No readable content found in this message.');
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(cleanText);
    speechSynthesisRef.current = utterance;

    // Set speech parameters for natural human-like fast pace
    utterance.rate = 1.2; // Faster for more natural human pace
    utterance.pitch = 0.95; // Slightly lower pitch for male voice
    utterance.volume = 0.9; // Clear and comfortable volume

    // Get available voices
    const voices = speechSynthesis.getVoices();
    
    console.log('🔍 Searching for Hindi/Indian male voice...');
    console.log('Total voices available:', voices.length);
    
    // If user has manually selected a voice, use that
    let selectedVoice = null;
    
    // Check if it's a regional accent selection
    if (typeof selectedVoiceIndex === 'string' && selectedVoiceIndex.startsWith('regional-')) {
      const accent = selectedVoiceIndex.replace('regional-', '');
      console.log('🇮🇳 Using regional accent:', accent);
      
      // Apply regional accent settings directly to utterance
      const regionalSettings = {
        'hindi': { rate: 0.9, pitch: 0.8, language: 'hi-IN' },
        'marathi': { rate: 0.95, pitch: 0.85, language: 'mr-IN' },
        'bengali': { rate: 0.9, pitch: 0.9, language: 'bn-IN' },
        'tamil': { rate: 0.95, pitch: 0.85, language: 'ta-IN' },
        'telugu': { rate: 0.95, pitch: 0.8, language: 'te-IN' },
        'gujarati': { rate: 0.95, pitch: 0.85, language: 'gu-IN' },
        'punjabi': { rate: 1.0, pitch: 0.8, language: 'pa-IN' },
        'kannada': { rate: 0.95, pitch: 0.85, language: 'kn-IN' },
        'malayalam': { rate: 0.9, pitch: 0.9, language: 'ml-IN' },
        'indian-english': { rate: 1.1, pitch: 0.85, language: 'en-IN' }
      };
      
      const settings = regionalSettings[accent] || regionalSettings['indian-english'];
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      
      // Try to find a matching system voice
      selectedVoice = voices.find(voice => 
        voice.lang.toLowerCase().includes(settings.language.toLowerCase()) ||
        voice.name.toLowerCase().includes(accent) ||
        (settings.language === 'en-IN' && voice.lang.toLowerCase().includes('en-in'))
      );
      
      console.log(`✅ Regional ${accent} voice configured - Rate: ${settings.rate}, Pitch: ${settings.pitch}`);
    } else if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
      selectedVoice = voices[selectedVoiceIndex];
      console.log('👤 Using manually selected voice:', selectedVoice.name, selectedVoice.lang);
    } else {
      // Automatic voice selection with comprehensive patterns
      const indianVoicePatterns = [
        // Hindi
        'hindi', 'hi-in', 'ravi', 'hemant', 'aditi', 'kiran', 
        // Marathi
        'marathi', 'mr-in', 'maharashtra', 'mumbai',
        // Punjabi
        'punjabi', 'pa-in', 'punjab', 'gurmukhi',
        // Gujarati
        'gujarati', 'gu-in', 'gujarat', 'ahmedabad',
        // Bengali
        'bengali', 'bn-in', 'kolkata', 'west bengal',
        // Tamil
        'tamil', 'ta-in', 'chennai', 'tamil nadu',
        // Telugu
        'telugu', 'te-in', 'hyderabad', 'andhra pradesh',
        // Kannada
        'kannada', 'kn-in', 'bangalore', 'karnataka',
        // Malayalam
        'malayalam', 'ml-in', 'kerala', 'kochi',
        // Other Indian patterns
        'indian', 'india', 'en-in', 'priya', 'veena', 'arjun', 'rohan', 'amit', 'raj',
        'microsoft ravi', 'google hindi', 'nuance vocalizer', 'microsoft desktop', 'natural', 'premium'
      ];
      
      const maleVoicePatterns = [
        'male', 'man', 'boy', 'ravi', 'hemant', 'kiran', 'arjun', 'rohan', 'amit', 'raj',
        'deep', 'bass', 'low'
      ];
      
      // Try multiple strategies to find the best voice
      
      // Strategy 1: Perfect match - Hindi male voices
      selectedVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        return (lang.includes('hi-in') || lang.includes('hi')) && 
               (maleVoicePatterns.some(pattern => name.includes(pattern)) || 
                (!name.includes('female') && !name.includes('woman')));
      });
      
      // Strategy 2: Indian English voices (male preference)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return (lang.includes('en-in') || indianVoicePatterns.some(pattern => name.includes(pattern))) &&
                 (maleVoicePatterns.some(pattern => name.includes(pattern)) || 
                  (!name.includes('female') && !name.includes('woman')));
        });
      }
      
      // Strategy 3: Any Indian/Hindi voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return lang.includes('hi-in') || lang.includes('hi') || lang.includes('en-in') || 
                 indianVoicePatterns.some(pattern => name.includes(pattern));
        });
      }
      
      // Strategy 4: English voices with male preference
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return lang.includes('en-') && 
                 (maleVoicePatterns.some(pattern => name.includes(pattern)) || 
                  (!name.includes('female') && !name.includes('woman')));
        });
      }
      
      // Strategy 5: Premium voices (often better quality)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes('premium') || name.includes('natural') || name.includes('neural');
        });
      }
      
      // Strategy 6: Any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en-'));
      }
      
      // Strategy 7: Fallback to first available voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
    }
    
    // Apply voice-specific settings
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      
      const name = selectedVoice.name.toLowerCase();
      const lang = selectedVoice.lang.toLowerCase();
      
      // Optimize settings based on voice characteristics and regional languages
      if (lang.includes('hi-in') || lang.includes('hi') || name.includes('hindi')) {
        // Hindi voices
        utterance.rate = 1.0; // Natural pace for clear Hindi pronunciation
        utterance.pitch = 0.8; // Lower for male effect
        console.log('✅ Using Hindi voice:', selectedVoice.name);
      } else if (lang.includes('mr-in') || name.includes('marathi')) {
        // Marathi voices
        utterance.rate = 1.0; // Natural pace for Marathi
        utterance.pitch = 0.85; // Slightly higher for Marathi accent
        console.log('✅ Using Marathi voice:', selectedVoice.name);
      } else if (lang.includes('pa-in') || name.includes('punjabi')) {
        // Punjabi voices
        utterance.rate = 1.1; // Slightly faster for Punjabi rhythm
        utterance.pitch = 0.8; // Lower for characteristic Punjabi tone
        console.log('✅ Using Punjabi voice:', selectedVoice.name);
      } else if (lang.includes('gu-in') || name.includes('gujarati')) {
        // Gujarati voices
        utterance.rate = 1.0; // Natural pace for Gujarati
        utterance.pitch = 0.85; // Moderate pitch
        console.log('✅ Using Gujarati voice:', selectedVoice.name);
      } else if (lang.includes('bn-in') || name.includes('bengali')) {
        // Bengali voices
        utterance.rate = 0.95; // Slightly slower for Bengali pronunciation
        utterance.pitch = 0.9; // Higher pitch for Bengali accent
        console.log('✅ Using Bengali voice:', selectedVoice.name);
      } else if (lang.includes('ta-in') || name.includes('tamil')) {
        // Tamil voices
        utterance.rate = 1.0; // Natural pace for Tamil
        utterance.pitch = 0.85; // Moderate pitch
        console.log('✅ Using Tamil voice:', selectedVoice.name);
      } else if (lang.includes('te-in') || name.includes('telugu')) {
        // Telugu voices
        utterance.rate = 1.0; // Natural pace for Telugu
        utterance.pitch = 0.8; // Lower pitch
        console.log('✅ Using Telugu voice:', selectedVoice.name);
      } else if (lang.includes('kn-in') || name.includes('kannada')) {
        // Kannada voices
        utterance.rate = 1.0; // Natural pace for Kannada
        utterance.pitch = 0.85; // Moderate pitch
        console.log('✅ Using Kannada voice:', selectedVoice.name);
      } else if (lang.includes('ml-in') || name.includes('malayalam')) {
        // Malayalam voices
        utterance.rate = 0.95; // Slightly slower for Malayalam clarity
        utterance.pitch = 0.9; // Higher pitch for Malayalam accent
        console.log('✅ Using Malayalam voice:', selectedVoice.name);
      } else if (lang.includes('en-in') || name.includes('indian') || name.includes('india')) {
        // Indian English voices
        utterance.rate = 1.1; // Natural pace for Indian accent
        utterance.pitch = 0.85; // Lower for male effect
        console.log('✅ Using Indian English voice:', selectedVoice.name);
      } else if (name.includes('male') || name.includes('man')) {
        // Confirmed male voices
        utterance.rate = 1.15; // Natural fast pace
        utterance.pitch = 0.85; // Lower pitch
        console.log('✅ Using male voice:', selectedVoice.name);
      } else {
        // Generic/fallback voices - make them sound more male
        utterance.rate = 1.1; // Faster for natural effect
        utterance.pitch = 0.7; // Much lower pitch to sound male
        console.log('✅ Using voice with male settings:', selectedVoice.name);
      }
      
      console.log('🎙️ Final voice settings - Rate:', utterance.rate, 'Pitch:', utterance.pitch, 'Volume:', utterance.volume);
    } else {
      console.log('⚠️ No voice found, using system default');
    }

    // Add more human-like pauses and intonation with regional improvements
    let enhancedText = cleanText
      .replace(/\./g, '. ') // Add pause after periods
      .replace(/,/g, ', ') // Add slight pause after commas
      .replace(/:/g, ': ') // Add pause after colons
      .replace(/;/g, '; ') // Add pause after semicolons
      .replace(/\?/g, '? ') // Add pause after questions
      .replace(/!/g, '! ') // Add pause after exclamations
      .replace(/\s+/g, ' ') // Clean up multiple spaces
      .trim();
    
    // Regional pronunciation improvements
    if (typeof selectedVoiceIndex === 'string' && selectedVoiceIndex.startsWith('regional-')) {
      const accent = selectedVoiceIndex.replace('regional-', '');
      
      // Common Indian pronunciation adjustments
      enhancedText = enhancedText
        // Legal terms pronunciation
        .replace(/\bvs\b/gi, 'versus')
        .replace(/\betc\b/gi, 'etcetera')
        .replace(/\bie\b/gi, 'that is')
        .replace(/\beg\b/gi, 'for example')
        // Indian context improvements
        .replace(/\bRs\b/gi, 'Rupees')
        .replace(/\bINR\b/gi, 'Indian Rupees')
        .replace(/\bCrore\b/gi, 'Crore')
        .replace(/\bLakh\b/gi, 'Lakh')
        // Add slight pauses for better comprehension
        .replace(/(\d+)/g, ' $1 ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    utterance.text = enhancedText;

    // Event handlers
    utterance.onstart = () => {
      setIsReading(true);
      setCurrentReadingMessageId(messageId);
    };

    utterance.onend = () => {
      setIsReading(false);
      setCurrentReadingMessageId(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsReading(false);
      setCurrentReadingMessageId(null);
      alert('An error occurred while reading the text. Please try again.');
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  };

  // Load voices when available (some browsers load voices asynchronously)
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Debug: Log available voices
        console.log('🎤 Available voices for TTS:', voices.length);
        voices.forEach((voice, index) => {
          console.log(`${index}. ${voice.name} (${voice.lang})`);
        });
        
        // Highlight Hindi/Indian voices for debugging
        const indianVoices = voices.filter(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return lang.includes('hi') || lang.includes('en-in') || 
                 name.includes('indian') || name.includes('india') || 
                 name.includes('hindi') || name.includes('ravi') || 
                 name.includes('aditi');
        });
        
        if (indianVoices.length > 0) {
          console.log('🇮🇳 Available Hindi/Indian voices:');
          indianVoices.forEach((voice, index) => {
            const originalIndex = voices.indexOf(voice);
            console.log(`Index ${originalIndex}: ${voice.name} (${voice.lang})`);
          });
        } else {
          console.log('❌ No Hindi/Indian voices found. Using best available voice with Indian accent simulation.');
        }
        
        // Auto-select best voice if none selected
        if (selectedVoiceIndex === null) {
          const bestVoiceIndex = findBestVoiceIndex(voices);
          if (bestVoiceIndex !== -1) {
            setSelectedVoiceIndex(bestVoiceIndex);
            console.log(`🎯 Auto-selected voice: ${voices[bestVoiceIndex].name} (Index: ${bestVoiceIndex})`);
          }
        }
      }
    };

    // Helper function to find best voice
    const findBestVoiceIndex = (voices) => {
      // Priority patterns for automatic selection
      const patterns = [
        { pattern: (v) => v.lang.includes('hi-IN') && !v.name.toLowerCase().includes('female'), score: 100 },
        { pattern: (v) => v.lang.includes('hi') && !v.name.toLowerCase().includes('female'), score: 95 },
        { pattern: (v) => v.lang.includes('en-IN') && !v.name.toLowerCase().includes('female'), score: 90 },
        { pattern: (v) => v.name.toLowerCase().includes('ravi'), score: 85 },
        { pattern: (v) => v.name.toLowerCase().includes('indian') && !v.name.toLowerCase().includes('female'), score: 80 },
        { pattern: (v) => v.lang.includes('hi-IN'), score: 75 },
        { pattern: (v) => v.lang.includes('en-IN'), score: 70 },
        { pattern: (v) => v.name.toLowerCase().includes('male'), score: 65 },
        { pattern: (v) => !v.name.toLowerCase().includes('female'), score: 60 }
      ];
      
      let bestIndex = -1;
      let bestScore = 0;
      
      voices.forEach((voice, index) => {
        let score = 0;
        for (const pattern of patterns) {
          if (pattern.pattern(voice)) {
            score = Math.max(score, pattern.score);
            break;
          }
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });
      
      return bestIndex;
    };

    // Load voices immediately
    loadVoices();

    // Some browsers need this event listener
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceIndex]);

  // Click outside handler for dropdowns and body scroll management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target)) {
        setShowModalDropdown(false);
      }
      // Close voice selector if clicking outside any voice selector
      if (activeVoiceSelectorId && !event.target.closest('.voice-selector-container')) {
        setActiveVoiceSelectorId(null);
      }
    };

    // Prevent body scroll on mobile when any dropdown is open
    if (isMobile && (showModalDropdown || activeVoiceSelectorId)) {
      document.body.classList.add('dropdown-open');
    } else {
      document.body.classList.remove('dropdown-open');
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('dropdown-open');
    };
  }, [showModalDropdown, activeVoiceSelectorId, isMobile]);

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
      formatted = formatted.replace(/^###\s(.+)$/gm, '<div class="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 pb-1 border-b border-slate-300 dark:border-slate-600 break-words">$1</div>');
      formatted = formatted.replace(/^##\s(.+)$/gm, '<div class="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 border-l-4 border-slate-500 dark:border-slate-400 pl-3 break-words">$1</div>');
      formatted = formatted.replace(/^#\s(.+)$/gm, '<div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 break-words">$1</div>');
      
      // Format bold text - safe inline
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<span class="font-semibold text-slate-900 dark:text-slate-100">$1</span>');
      
      // Format bullet points - contained and safe with flex-wrap
      formatted = formatted.replace(/^[\*\-]\s(.+)$/gm, '<div class="flex items-start my-2 flex-wrap"><div class="flex-shrink-0 text-slate-500 mr-2 mt-1.5 text-xs">●</div><div class="flex-1 text-slate-700 dark:text-slate-300 break-words min-w-0">$1</div></div>');
      
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
    if (!query.trim() && uploadedFiles.length === 0) return;

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
      text: query || (uploadedFiles.length > 0 ? `📎 ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} uploaded` : ''),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: detectDocumentRequest(query) ? 'document-request' : 'consultation',
      selectedAgent: selectedModal, // Store which agent was selected for this question
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : null // Include uploaded files
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
    // Clear uploaded files after sending
    setUploadedFiles([]);
    
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

  // Clean voice button toggle handler - completely independent of input focus state
  const handleVoiceToggle = useCallback((e) => {
    // Stop event propagation using React-compatible methods
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Access native event if available for stopImmediatePropagation
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    // Force state update regardless of input focus state
    const newModalState = !isVoiceModalOpen;
    
    // Use requestAnimationFrame to ensure state updates happen in the next render cycle
    requestAnimationFrame(() => {
      setVoiceModalOpen(newModalState);
      setIsVoiceActive(newModalState);
    });
    
    console.log('Voice button clicked - Modal opening:', newModalState);
  }, [isVoiceModalOpen]);

  // File upload handlers
  const handleFileUpload = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      // Accept common document types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback((fileId) => {
    setUploadedFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  }, []);

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
        processed = processed.replace(/^[\*\-]\s(.+)$/gm, '<div class="flex items-start my-1 flex-wrap"><span class="text-slate-500 mr-2 flex-shrink-0">•</span><span class="flex-1 safe-text-render min-w-0">$1</span></div>');
        
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
        className={`flex chat-message ${isUser ? 'justify-end' : 'justify-start'} ${
          message.type === 'greeting' ? 'mt-2' : (!isPreviousSameSender ? 'mt-6' : 'mt-3')
        }`}
      >
        {/* Bot Avatar */}
        {!isUser && !isPreviousSameSender && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mr-3 shadow-lg"
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
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-2xl rounded-br-md'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {/* Document Type Indicator */}
            {message.type === 'document-request' && isUser && (
              <div className="flex items-center mb-2 text-slate-100">
                <FileText size={14} className="mr-1" />
                <span className="text-xs font-medium">Document Request</span>
              </div>
            )}
            
            {message.type === 'document' && !isUser && (
              <div className="flex items-center mb-3 text-slate-600 dark:text-slate-400">
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
            
            {/* File Attachments */}
            {message.files && message.files.length > 0 && (
              <div className={`mt-3 ${isUser ? '' : 'border-t border-slate-200 dark:border-slate-700 pt-3'}`}>
                <div className="flex flex-wrap gap-2">
                  {message.files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
                        isUser 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {/* File Icon or Preview */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-4 h-4 rounded object-cover"
                          />
                        ) : (
                          <FileText size={12} className={isUser ? 'text-white/80' : 'text-slate-500'} />
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isUser ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Typing Indicator */}
            {!isUser && isTyping && message.text === '' && (
              <div className="flex items-center space-x-1 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                {/* Voice Selector Button */}
                <div className="relative voice-selector-container">
                  <button 
                    onClick={() => setActiveVoiceSelectorId(activeVoiceSelectorId === message.id ? null : message.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded relative group"
                    title="Select voice"
                  >
                    <Settings size={12} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      Select voice for reading
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-slate-800"></div>
                    </div>
                  </button>
                  
                  {/* Voice Selector Dropdown */}
                  {activeVoiceSelectorId === message.id && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 max-h-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-20">
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Select Voice ({availableVoices.length} available)
                        </p>
                      </div>
                      <div className="max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        {/* Preferred Indian Regional Voices */}
                        {[
                          { name: 'Hindi (हिंदी)', lang: 'hi-IN', isRegional: true, accent: 'hindi' },
                          { name: 'Marathi (मराठी)', lang: 'mr-IN', isRegional: true, accent: 'marathi' },
                          { name: 'Bengali (বাংলা)', lang: 'bn-IN', isRegional: true, accent: 'bengali' },
                          { name: 'Tamil (தமிழ்)', lang: 'ta-IN', isRegional: true, accent: 'tamil' },
                          { name: 'Telugu (తెలుగు)', lang: 'te-IN', isRegional: true, accent: 'telugu' },
                          { name: 'Gujarati (ગુજરાતી)', lang: 'gu-IN', isRegional: true, accent: 'gujarati' },
                          { name: 'Punjabi (ਪੰਜਾਬੀ)', lang: 'pa-IN', isRegional: true, accent: 'punjabi' },
                          { name: 'Kannada (ಕನ್ನಡ)', lang: 'kn-IN', isRegional: true, accent: 'kannada' },
                          { name: 'Malayalam (മലയാളം)', lang: 'ml-IN', isRegional: true, accent: 'malayalam' },
                          { name: 'English (Indian)', lang: 'en-IN', isRegional: true, accent: 'indian-english' }
                        ].map((voice, index) => (
                          <button
                            key={`regional-${index}`}
                            onClick={() => {
                              setSelectedVoiceIndex(`regional-${voice.accent}`);
                              setActiveVoiceSelectorId(null);
                              console.log('🎙️ Regional voice selected:', voice.name, voice.accent);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border-l-2 ${
                              selectedVoiceIndex === `regional-${voice.accent}` 
                                ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border-slate-600 dark:border-slate-400 font-medium' 
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate text-slate-800 dark:text-slate-200">
                                  {voice.name}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded text-white font-medium ${
                                  voice.lang.includes('hi-') ? 'bg-orange-500' :
                                  voice.lang.includes('mr-') ? 'bg-purple-500' :
                                  voice.lang.includes('pa-') ? 'bg-green-500' :
                                  voice.lang.includes('gu-') ? 'bg-slate-500' :
                                  voice.lang.includes('bn-') ? 'bg-indigo-500' :
                                  voice.lang.includes('ta-') ? 'bg-red-500' :
                                  voice.lang.includes('te-') ? 'bg-pink-500' :
                                  voice.lang.includes('kn-') ? 'bg-yellow-600' :
                                  voice.lang.includes('ml-') ? 'bg-teal-500' :
                                  'bg-slate-500'
                                }`}>
                                  Regional
                                </span>
                              </div>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                                🇮🇳 Optimized Indian Accent
                              </span>
                            </div>
                          </button>
                        ))}
                        
                        {/* Separator */}
                        {availableVoices.length > 0 && (
                          <div className="border-t border-slate-200 dark:border-slate-700 my-2">
                            <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30">
                              System Voices
                            </div>
                          </div>
                        )}
                        
                        {/* System Available Voices */}
                        {availableVoices
                          .sort((a, b) => {
                            // Prioritize Indian regional languages
                            const aIsIndian = a.lang.includes('-in') || ['hindi', 'marathi', 'punjabi', 'gujarati', 'bengali', 'tamil', 'telugu', 'kannada', 'malayalam'].some(lang => a.name.toLowerCase().includes(lang));
                            const bIsIndian = b.lang.includes('-in') || ['hindi', 'marathi', 'punjabi', 'gujarati', 'bengali', 'tamil', 'telugu', 'kannada', 'malayalam'].some(lang => b.name.toLowerCase().includes(lang));
                            
                            if (aIsIndian && !bIsIndian) return -1;
                            if (!aIsIndian && bIsIndian) return 1;
                            
                            return a.name.localeCompare(b.name);
                          })
                          .map((voice, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedVoiceIndex(index);
                              setActiveVoiceSelectorId(null);
                              console.log('🎙️ Voice selected:', voice.name, voice.lang);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border-l-2 ${
                              selectedVoiceIndex === index 
                                ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border-slate-600 dark:border-slate-400 font-medium' 
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="font-medium truncate text-slate-800 dark:text-slate-200">
                                  {voice.name.replace(/Microsoft|Google|Apple/gi, '').trim()}
                              </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded text-white font-medium ${
                                  voice.lang.includes('hi-') ? 'bg-orange-500' :
                                  voice.lang.includes('mr-') ? 'bg-purple-500' :
                                  voice.lang.includes('pa-') ? 'bg-green-500' :
                                  voice.lang.includes('gu-') ? 'bg-slate-500' :
                                  voice.lang.includes('bn-') ? 'bg-indigo-500' :
                                  voice.lang.includes('ta-') ? 'bg-red-500' :
                                  voice.lang.includes('te-') ? 'bg-pink-500' :
                                  voice.lang.includes('kn-') ? 'bg-yellow-600' :
                                  voice.lang.includes('ml-') ? 'bg-teal-500' :
                                  voice.lang.includes('en-in') ? 'bg-slate-500' :
                                  'bg-slate-500'
                                }`}>
                                  {voice.lang.includes('hi-') ? 'हिंदी' :
                                   voice.lang.includes('mr-') ? 'मराठी' :
                                   voice.lang.includes('pa-') ? 'ਪੰਜਾਬੀ' :
                                   voice.lang.includes('gu-') ? 'ગુજરાતી' :
                                   voice.lang.includes('bn-') ? 'বাংলা' :
                                   voice.lang.includes('ta-') ? 'தமிழ்' :
                                   voice.lang.includes('te-') ? 'తెలుగు' :
                                   voice.lang.includes('kn-') ? 'ಕನ್ನಡ' :
                                   voice.lang.includes('ml-') ? 'മലയാളം' :
                                   voice.lang.includes('en-in') ? 'English (IN)' :
                                   voice.lang.toUpperCase()}
                              </span>
                            </div>
                              {voice.lang.includes('-in') && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                                  🇮🇳 Indian Regional Voice
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Read Aloud Button */}
                <button 
                  onClick={() => readAloudMessage(message.text, message.id)}
                  className={`${
                    isReading && currentReadingMessageId === message.id
                      ? 'text-violet-500 hover:text-violet-600' 
                      : 'text-slate-400 hover:text-violet-500'
                  } transition-colors p-1 rounded relative group`}
                  title={
                    isReading && currentReadingMessageId === message.id 
                      ? "Stop reading" 
                      : "Read aloud"
                  }
                >
                  {isReading && currentReadingMessageId === message.id ? (
                    <div className="relative">
                      <Volume2 size={14} />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    <Volume2 size={14} />
                  )}
                  
                  {/* Enhanced Tooltip with Current Voice Info */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {isReading && currentReadingMessageId === message.id ? "Stop reading" : 
                     `Read aloud ${selectedVoiceIndex !== null && availableVoices[selectedVoiceIndex] ? 
                      `(${availableVoices[selectedVoiceIndex].name})` : 
                      '(Hindi accent)'}`}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-slate-800"></div>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(message.text);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded"
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
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded"
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
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Document Actions
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors flex items-center">
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
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 mr-3 flex items-center justify-center shadow-lg">
        <Scale size={18} className="text-white" />
      </div>
      
      <div className="flex flex-col p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          {loadingState.icon && (
            <div className="text-slate-500">
              {loadingState.icon}
            </div>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {loadingState.text || 'Analyzing...'}
          </span>
          <div className="flex space-x-1 ml-2">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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
                    className="text-sm bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 flex items-center"
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
        className="absolute left-0 right-0 top-full mt-2 bg-slate-50/80 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl z-10"
        data-tour="suggestions-panel"
      >
        <div className="p-3 space-y-1.5">
          {randomSuggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion.id}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="w-full text-left p-2.5 hover:bg-white/70 dark:hover:bg-slate-800/50 transition-all duration-200 flex items-start rounded-lg group"
            >
              <div className="flex items-center mr-3 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                {suggestion.category === 'document' ? (
                  <FileText size={14} className="text-emerald-500" />
                ) : (
                  <MessageSquare size={14} className="text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 dark:text-slate-300 block leading-snug group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  {suggestion.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };
  
  // Clean Professional Voice Button - Independent of input focus state
  const CleanVoiceButton = ({ onClick, isActive = false }) => {
    const handleClick = useCallback((e) => {
      // Stop event propagation using React-compatible methods
      e.preventDefault();
      e.stopPropagation();
      // Access native event if available for stopImmediatePropagation
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
      
      console.log('Voice button physical click detected');
      
      // Execute immediately without any conditions
      if (onClick) {
        onClick(e);
      }
    }, [onClick]);

    // Beautiful Professional Voice Icon
    const VoiceIcon = () => (
      <svg 
        width={isMobile ? "14" : "16"} 
        height={isMobile ? "14" : "16"} 
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

    return (
      <button
        onClick={handleClick}
        onMouseDown={handleClick} // Handle mousedown as backup
        onTouchStart={handleClick} // Handle touch as backup
        type="button"
        className={`
          ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}
          flex items-center justify-center
          rounded-full
          transition-colors duration-200
          focus:outline-none
          ${isActive 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700'
          }
        `}
        title={isActive ? "Stop Recording" : "Voice Input"}
        style={{ 
          zIndex: 9999, // Highest possible z-index
          position: 'relative',
          pointerEvents: 'auto'
        }}
      >
        <VoiceIcon />
        {isActive && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white" />
        )}
      </button>
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
    }, [showModalDropdown]); // Only include showModalDropdown as a dependency
    
    return (
      <div className={`${isMobile ? 'relative' : 'dropdown-container'}`} ref={modalDropdownRef}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isLoading && setShowModalDropdown(!showModalDropdown)} // Prevent opening during loading
          disabled={isLoading}
          className={`flex items-center gap-1.5 ${isMobile ? 'px-2 py-1' : 'px-2 py-0.5'} rounded-md transition-all duration-200 ${isMobile ? 'text-xs' : 'text-xs'} font-medium border shadow-sm no-select ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${
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
          <div className={`${isMobile ? 'w-3 h-3' : 'w-2.5 h-2.5'} flex items-center justify-center`}>
            {React.cloneElement(selectedOption?.icon, { size: isMobile ? 10 : 9 })}
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
            <ChevronDown size={isMobile ? 10 : 8} className="opacity-60" />
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
          
          /* Mobile input container - Always fixed at bottom edge */
          .mobile-input-container {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            margin: 0 !important;
            padding-bottom: env(safe-area-inset-bottom) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border-top: 1px solid rgba(203, 213, 225, 0.4);
            box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08), 0 -1px 4px rgba(0, 0, 0, 0.04);
            transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        background-color 0.25s ease, 
                        box-shadow 0.25s ease !important;
          }
          
          .dark .mobile-input-container {
            background: rgba(15, 23, 42, 0.98) !important;
            border-top: 1px solid rgba(51, 65, 85, 0.4);
            box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.2), 0 -1px 4px rgba(0, 0, 0, 0.1);
          }
          
          /* Mobile input keyboard active state - Enhanced */
          .mobile-input-keyboard-active {
            background: rgba(255, 255, 255, 1) !important;
            border-top: 1px solid rgba(203, 213, 225, 0.6);
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(0, 0, 0, 0.06);
            transform: translateY(0) !important;
          }
          
          .dark .mobile-input-keyboard-active {
            background: rgba(15, 23, 42, 1) !important;
            border-top: 1px solid rgba(51, 65, 85, 0.6);
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3), 0 -2px 8px rgba(0, 0, 0, 0.15);
          }
          
          /* Force bottom positioning */
          .mobile-chat-container {
            padding-bottom: 120px !important;
            margin-bottom: 0 !important;
          }
          
          /* Prevent body scroll when keyboard is open */
          .mobile-keyboard-open {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 100vh !important;
            overflow: hidden !important;
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
          }
          
          /* Mobile input keyboard focus state */
          .mobile-input-keyboard-focus {
            border-color: rgb(100, 116, 139) !important;
            background: rgba(255, 255, 255, 0.98) !important;
          }
          
          .dark .mobile-input-keyboard-focus {
            background: rgba(15, 23, 42, 0.98) !important;
            border-color: rgb(148, 163, 184) !important;
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
            data-tour="chat-history"
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
                : 'py-12 sm:py-16 bg-transparent flex items-center justify-center min-h-[70vh]'
            }`}
          >
            {!chatActive ? (
              /* Initial Hero State */
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                {/* Logo/Icon - Premium Silver Look (Smaller) */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-5 w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Scale size={20} className="text-white" />
                </motion.div>
                
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8"
                >
                  Mera Vakil
                </motion.h1>
                
                <VoiceModal
                  isOpen={isVoiceModalOpen}
                  onClose={() => {
                    setIsVoiceActive(false);
                    setVoiceModalOpen(false);
                  }}
                  isVoiceActive={isVoiceActive}
                  setIsVoiceActive={setIsVoiceActive}
                  onVoiceResult={(transcript) => {
                    setQuery(transcript);
                    setIsVoiceActive(false);
                    setVoiceModalOpen(false);
                  }}
                />
                
                {/* Search Input - Premium Black/White/Silver Theme - Fully Responsive */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="relative mb-6 w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-6"
>
 




                  {/* Uploaded Files Preview - Compact for Inactive State */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3 p-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <FileText size={10} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uploadedFiles.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-600 text-xs"
                          >
                            {file.preview ? (
                              <img src={file.preview} alt={file.name} className="w-4 h-4 rounded object-cover" />
                            ) : (
                              <FileText size={10} className="text-slate-500" />
                            )}
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{file.name}</span>
                            <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <X size={10} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`relative ${isDragOver ? 'ring-2 ring-slate-400 dark:ring-slate-500 ring-offset-2 rounded-3xl' : ''}`}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <textarea
                      ref={inputRef}
                      value={query}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Ask your legal question..."
                      rows={1}
                      className="w-full pl-20 sm:pl-24 pr-24 sm:pr-28 text-sm sm:text-base rounded-3xl border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 text-slate-900 transition-all duration-300 resize-none overflow-hidden flex items-center"
                      style={{
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                        minHeight: '56px',
                        maxHeight: '200px',
                        paddingTop: '16px',
                        paddingBottom: '16px'
                      }}
                    />
                    
                    {/* Left Side Controls Container - Perfect Vertical Center */}
                    <div className="absolute left-2 sm:left-3 top-0 bottom-0 flex items-center gap-1 sm:gap-1.5 z-10">
                      {/* AI Agent Selector Dropdown */}
                      <div className="relative" ref={modalDropdownRef}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowModalDropdown(!showModalDropdown)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 flex items-center justify-center shadow-sm group relative"
                          title="Select AI Agent"
                        >
                          {/* Selected Agent Icon */}
                          <div className="relative">
                            {modalOptions.find(opt => opt.id === selectedModal)?.icon}
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
                        
                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {showModalDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 bottom-full mb-2 w-64 sm:w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                              style={{
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                              }}
                            >
                              {/* Header */}
                             
                             <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
    <Bot size={16} className="text-slate-600 dark:text-slate-400" />
    Select AI Assistant
  </h3>
</div>

{/* Agent Options */}
<div className="p-2 max-h-80 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
  {modalOptions.map((option) => (
    <motion.button
      key={option.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setSelectedModal(option.id);
        setShowModalDropdown(false);
      }}
      className={`w-full p-3 rounded-xl text-left transition-all duration-200 mb-1.5 border ${
        selectedModal === option.id
          ? 'bg-slate-700 dark:bg-slate-700 border-slate-600 text-white shadow-md'
          : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon Container */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            selectedModal === option.id
              ? 'bg-slate-600 dark:bg-slate-600'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {option.icon}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`text-sm font-bold ${
                selectedModal === option.id
                  ? 'text-white'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {option.label}
            </h4>
            {selectedModal === option.id && (
              <CheckCircle size={14} className="text-green-400" />
            )}
          </div>

          <p
            className={`text-xs leading-snug ${
              selectedModal === option.id
                ? 'text-slate-200'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {option.description}
          </p>

          <div
            className={`text-[10px] mt-1 font-medium ${
              selectedModal === option.id
                ? 'text-slate-300'
                : 'text-slate-500 dark:text-slate-500'
            }`}
          >
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
                      
                      {/* Voice Button */}
                      <CleanVoiceButton 
                        onClick={handleVoiceToggle} 
                        isActive={isVoiceActive || isVoiceModalOpen}
                      />
                    </div>
                    
                    {/* Right Side Controls Container - Perfect Vertical Center */}
                    <div className="absolute right-2 sm:right-2.5 top-0 bottom-0 flex items-center gap-1.5 sm:gap-2 z-10">
                      {/* Upload Button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('inactive-file-upload').click()}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm relative flex items-center justify-center"
                        title="Upload Document"
                      >
                        <Upload size={16} className="sm:w-[17px] sm:h-[17px]" />
                        {uploadedFiles.length > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-slate-700 dark:bg-slate-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md"
                          >
                            {uploadedFiles.length}
                          </motion.div>
                        )}
                      </motion.button>
                      
                      {/* Hidden File Input */}
                      <input
                        id="inactive-file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      
                      {/* Send Button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={!query.trim() && uploadedFiles.length === 0}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                          !query.trim() && uploadedFiles.length === 0
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-700 dark:bg-slate-600 text-white shadow-md hover:bg-slate-800 dark:hover:bg-slate-500'
                        }`}
                      >
                        <SendHorizontal size={16} className="sm:w-[17px] sm:h-[17px]" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Query Suggestons */}
                  <AnimatePresence>
                    <QuerySuggestions 
                      visible={showSuggestions && inputFocused && !chatActive}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </AnimatePresence>
                </motion.div>
                
                {/* Quick Action Hints */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-2 justify-center max-w-2xl"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400">
                    <MessageSquare size={12} />
                    <span>Ask Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-full text-xs text-emerald-600 dark:text-emerald-400">
                    <FileText size={12} />
                    <span>Generate Documents</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 rounded-full text-xs text-amber-600 dark:text-amber-400">
                    <Upload size={12} />
                    <span>Upload Files</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Active Chat State - Full Chat Interface */
              <ActiveChat
                // State
                messages={messages}
                isLoading={isLoading}
                query={query}
                setQuery={setQuery}
                uploadedFiles={uploadedFiles}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                inputFocused={inputFocused}
                setInputFocused={setInputFocused}
                isVoiceActive={isVoiceActive}
                isVoiceModalOpen={isVoiceModalOpen}
                requestCount={requestCount}
                isAuthenticated={isAuthenticated}
                
                // Refs
                inputRef={inputRef}
                chatContainerRef={chatContainerRef}
                
                // Handlers
                handleSubmit={handleSubmit}
                handleReset={handleReset}
                handleVoiceToggle={handleVoiceToggle}
                handleFileUpload={handleFileUpload}
                removeFile={removeFile}
                handleFileDrop={handleFileDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPress}
                setSidebarOpen={setSidebarOpen}
                setChatActive={setChatActive}
                
                // Mobile
                isMobile={isMobile}
                mobileHandleInputFocus={mobileHandleInputFocus}
                mobileHandleInputBlur={mobileHandleInputBlur}
                keyboardVisible={keyboardVisible}
                keyboardHeight={keyboardHeight}
                
                // Components & Functions
                renderMessage={renderMessage}
                renderLoadingSkeleton={renderLoadingSkeleton}
                ModalDropdown={ModalDropdown}
                
                // Config
                API_CONFIG={API_CONFIG}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Onboarding Tour */}
      {showTour && (
        <OnboardingTour 
          isOpen={showTour}
          onClose={closeTour}
          onComplete={completeTour}
        />
      )}
    </div>
  );
};

export default Hero;