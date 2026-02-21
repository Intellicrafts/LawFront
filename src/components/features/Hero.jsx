import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../layout/Sidebar';
import VoiceModal from '../VoiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar } from '../../redux/sidebarSlice';
import {
  Menu, X, Bell, Settings, User, LogOut, Sun, Moon,
  Mic, Upload, SendHorizontal, ImageIcon, Globe, Bot,
  ChevronDown, Search as SearchIcon, MessageSquare, Sparkles,
  Heart, Share2, Copy, Volume2, Download, CheckCircle,
  Loader2, Brain, BookOpen, PenTool, Zap, ThumbsUp, ThumbsDown, VolumeX,
  PanelLeftClose, PanelLeftOpen, ArrowRight, TrendingUp, Cpu, Target,
  History, Archive, Star as StarIcon, FileText
} from 'lucide-react';
import { chatbotService, CHAT_STATES, AI_MODELS } from '../../services/chatbotApiService';
import { useParams, useNavigate } from 'react-router-dom';
import { chatbotAPI } from '../../api/apiService';
import { fetchChatSessions } from '../../redux/chatSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Custom Lawyer Tia Avatar Component
const TiaAvatar = ({ isStreaming }) => (
  <div className="relative group">
    {/* Animated glow ring during streaming */}
    {isStreaming && (
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500/40 to-indigo-500/40 blur-lg rounded-full"
      />
    )}
    <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-2xl border-2 border-white/20 transition-transform duration-500 group-hover:scale-105">
      <img
        src="/lawyer_tia_avatar.png"
        alt="Lawyer Tia"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          e.target.src = 'https://ui-avatars.com/api/?name=Tia&background=0284c7&color=fff';
        }}
      />
    </div>
    {/* Subtle status indicator dot */}
    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
  </div>
);

// High-Tech Intelligence Log Box - Redesigned for Customer Centricity
const IntelligenceLog = ({ thought, isStreaming, isDark }) => {
  if (!thought && !isStreaming) return null;

  // We parse the raw backend string into UI steps
  // Example thought: "[STATUS] Analyzing query... \n [CLASSIFICATION] other \n [CACHE_MISS] No relevant cache found"
  const rawText = thought || '';

  const steps = [];
  if (rawText.includes('[STATUS]')) steps.push({ label: 'Analyzing Legal Query', active: true, done: rawText.includes('[CLASSIFICATION]') });
  if (rawText.includes('[CLASSIFICATION]')) {
    const match = rawText.match(/\[CLASSIFICATION\]\s*([^\n]+)/i);
    const intent = match ? match[1].trim() : 'Legal Matter';
    steps.push({ label: `Identified Intent: ${intent}`, active: true, done: rawText.includes('[CACHE') || rawText.includes('keep-alive') });
  }
  if (rawText.includes('[CACHE_HIT]')) steps.push({ label: 'Retrieving Prior Legal Precedents...', active: true, done: true });
  if (rawText.includes('[CACHE_MISS]')) steps.push({ label: 'Consulting Knowledge Base...', active: true, done: true });

  const fallBackSteps = [{ label: 'Initializing Neural Engine...', active: true, done: false }];
  const displaySteps = steps.length > 0 ? steps : fallBackSteps;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`mb-6 w-full max-w-sm rounded-2xl overflow-hidden p-[1px] transition-all duration-700 shadow-2xl
        ${isDark ? 'bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-transparent' : 'bg-gradient-to-br from-emerald-400/30 via-blue-400/20 to-transparent'}`}
    >
      <div className={`relative px-5 py-4 w-full h-full backdrop-blur-2xl rounded-2xl ${isDark ? 'bg-[#0A0A0E]/95' : 'bg-white/95'}`}>

        {/* Header */}
        <div className={`flex items-center justify-between pb-3 mb-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <Cpu className={isStreaming ? "text-emerald-400 animate-pulse" : "text-emerald-500"} size={14} />
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Intelligence Pipeline
            </span>
          </div>
          {isStreaming && (
            <div className="flex gap-[3px]">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                />
              ))}
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {displaySteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center mt-0.5">
                {/* Step Circle */}
                <div className={`w-4 h-4 rounded-full flex items-center justify-center z-10 shadow-sm transition-all duration-500
                  ${step.done ? 'bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow-emerald-500/30'
                    : 'bg-[#1a1a1a] border border-blue-500/50'}`}>
                  {step.done ? (
                    <CheckCircle size={10} className="text-white drop-shadow-md" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
                {/* Connecting Line */}
                {idx !== displaySteps.length - 1 && (
                  <div className={`absolute top-4 bottom-[-16px] w-[1px] ${step.done ? 'bg-gradient-to-b from-emerald-500/50 to-transparent' : 'bg-gray-300/30 dark:bg-gray-700/50'}`} />
                )}
              </div>

              <div className={`text-[12px] font-semibold pt-0.5 tracking-wide transition-colors duration-500 ${step.done ? (isDark ? 'text-gray-200' : 'text-slate-700') : (isDark ? 'text-blue-400' : 'text-blue-600')}`}>
                {step.label}
                {!step.done && isStreaming && (
                  <span className="inline-block ml-1 opacity-70 animate-pulse">...</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

const AmbientWaitingState = ({ isDark }) => {
  const [phase, setPhase] = useState(0);
  const phrases = [
    "Structuring legal framework...",
    "Reviewing statutory compiliances...",
    "Cross-referencing judicial precedents...",
    "Synthesizing final counsel..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phrases.length);
    }, 2800); // Slightly faster rotation
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full max-w-sm rounded-2xl overflow-hidden p-[1px] mb-6 ${isDark ? 'bg-gradient-to-b from-blue-500/30 to-purple-500/10' : 'bg-gradient-to-b from-blue-400/30 to-indigo-400/10'}`}
    >
      <div className={`relative px-5 py-4 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl ${isDark ? 'bg-[#0f0f13]/90' : 'bg-white/95'}`}>

        {/* Animated Background Scanline */}
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
        />

        <div className="flex items-center gap-4 relative z-10">
          {/* Breathing Neural Core */}
          <div className="relative flex items-center justify-center w-8 h-8">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full blur-md ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-blue-400/30 border-t-blue-400"
            />
            <div className={`w-3 h-3 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)] ${isDark ? 'bg-white' : 'bg-blue-50'}`} />
          </div>

          <div className="flex flex-col justify-center flex-1 h-10 overflow-hidden">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-blue-400/80' : 'text-blue-600/80'}`}>
              Neural Engine Active
            </span>
            <div className="relative h-5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Spring-like easing
                  className={`absolute inset-0 text-[14px] font-semibold tracking-wide flex items-center ${isDark ? 'text-gray-100' : 'text-slate-800'}`}
                >
                  {phrases[phase]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- Skeleton Loader Component ---
const SkeletonLoading = ({ isDark }) => {
  const [phase, setPhase] = useState(0);
  const loadingPhrases = [
    "Analyzing Legal Query...",
    "Reviewing Jurisprudence...",
    "Cross-referencing Case Law...",
    "Checking Citations...",
    "Synthesizing Legal Framework...",
    "Drafting Comprehensive Response..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % loadingPhrases.length);
    }, 4000); // Change phrase every 4 seconds
    return () => clearInterval(timer);
  }, [loadingPhrases.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex w-full mb-6"
    >
      <div className="flex-shrink-0 mr-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${isDark ? 'bg-[#1E1E1E]' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
          <Sparkles size={16} className={isDark ? "text-purple-400" : "text-purple-500"} />
        </div>
      </div>

      <div className={`relative px-5 py-4 w-full max-w-2xl rounded-2xl rounded-tl-sm border
        ${isDark ? 'bg-[#1A1A1A]/80 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>

        {/* Name and Loading status */}
        <div className="flex items-center gap-2 pb-1">
          <span className={`text-[12px] font-black tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            AI ASSISTANT
          </span>
          <div className="flex gap-1 items-center ml-2">
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`} />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`} />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`} />
          </div>
        </div>

        {/* Dynamic Text Container */}
        <div className="relative h-6 mb-3 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`absolute inset-0 text-[11px] font-bold tracking-wide italic ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
            >
              {loadingPhrases[phase]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Skeleton Lines */}
        <div className="space-y-3">
          <div className={`h-2.5 rounded-full animate-pulse w-full max-w-[85%] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`h-2.5 rounded-full animate-pulse w-full max-w-[95%] ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`} />
          <div className={`h-2.5 rounded-full animate-pulse w-full max-w-[70%] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>

        {/* Polish shimmer */}
        <motion.div
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

// Professional Typing Animation Component
const StreamingText = ({ text, isDark }) => {
  // Handle auto-scroll with high sensitivity during generation
  useEffect(() => {
    const container = document.getElementById('chat-scroll-container');
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 400;
      if (isNearBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
      }
    }
  }, [text]);

  if (!text) {
    return <AmbientWaitingState isDark={isDark} />;
  }

  return (
    <div className={`relative ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      <FormattedResponse text={text} isDark={isDark} isStreaming={true} cursorAtEnd={true} />
    </div>
  );
};

/**
 * Premium Markdown & Professional Legal Formatting Engine
 * Transforms raw AI tokens into a state-of-the-art legal presentation.
 */
const FormattedResponse = ({ text, isDark, isStreaming = false, cursorAtEnd = false }) => {
  if (!text) return null;

  return (
    <div className={`prose max-w-none w-full animate-in fade-in duration-700 slide-in-from-bottom-2
      ${isDark
        ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 marker:text-blue-500'
        : 'prose-p:text-slate-700/90 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-a:text-blue-600 marker:text-blue-600'
      }
      prose-h1:text-2xl prose-h1:font-black prose-h1:bg-gradient-to-r prose-h1:from-blue-600 prose-h1:to-indigo-600 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:mb-6
      prose-h2:text-xl prose-h2:font-extrabold prose-h2:tracking-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b ${isDark ? 'prose-h2:border-white/5' : 'prose-h2:border-slate-100'}
      prose-h3:text-lg prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3
      prose-p:leading-[1.8] prose-p:text-[15px] prose-p:tracking-normal prose-p:my-4
      prose-ul:my-6 prose-ul:list-disc prose-li:my-2 prose-li:leading-relaxed
      prose-ol:my-6 prose-ol:list-decimal
      prose-table:my-8 prose-table:w-full prose-table:rounded-2xl prose-table:overflow-hidden prose-table:border-separate prose-table:border-spacing-0 prose-table:border ${isDark ? 'prose-table:border-white/10 prose-table:bg-white/[0.02]' : 'prose-table:border-slate-200 prose-table:bg-slate-50/50'}
      prose-th:bg-blue-600/10 prose-th:backdrop-blur-md prose-th:px-5 prose-th:py-4 prose-th:text-left prose-th:text-[13px] prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-blue-500 prose-th:border-b ${isDark ? 'prose-th:border-white/5' : 'prose-th:border-slate-200'}
      prose-td:px-5 prose-td:py-4 prose-td:text-[14px] prose-td:leading-relaxed prose-td:border-b ${isDark ? 'prose-td:border-white/5 prose-td:text-slate-300' : 'prose-td:border-slate-100 prose-td:text-slate-700'}
      prose-tr:last:prose-td:border-b-0
      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:shadow-sm
      prose-a:underline prose-a:decoration-blue-500/30 prose-a:underline-offset-4 hover:prose-a:text-blue-500 prose-a:transition-colors
      prose-strong:font-bold prose-strong:text-blue-500/90
    `}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';
            if (!inline) {
              return (
                <div className={`not-prose my-6 rounded-2xl border overflow-hidden font-mono text-[13.5px] leading-relaxed shadow-xl ${isDark ? 'bg-[#0A0A0A] border-white/10' : 'bg-slate-900 border-slate-800 text-slate-100'}`}>
                  <div className="px-5 py-2.5 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 leading-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                      </div>
                      <span className="opacity-70 uppercase tracking-[0.2em] text-[10.5px] font-black text-blue-400">{language}</span>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(String(children))} className="hover:text-blue-400 transition-colors active:scale-95 p-1" title="Copy Code">
                      <Copy size={14} />
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto selection:bg-blue-500/30 custom-scrollbar">
                    <code className={className} {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return <code className={`px-1.5 py-0.5 rounded-md text-[13px] font-mono ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`} {...props}>{children}</code>;
          },
        }}
      >
        {text}
      </ReactMarkdown>
      {isStreaming && cursorAtEnd && (
        <span className="relative inline-block ml-2 top-[2px]">
          <span className="absolute inset-0 bg-blue-500/60 blur-[8px] rounded-full animate-pulse" />
          <span className="relative block w-2 h-4 bg-blue-600 rounded-sm animate-[pulse_0.8s_infinite] shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
        </span>
      )}
    </div>
  );
};

/**
 * Professional Message Actions Component
 * Features: Natural Human Voice synthesis with punctuation pauses, Clipboard Copy, and Feedback.
 */
// Global reference to prevent garbage collection of active speech
let activeUtterance = null;

const MessageActions = ({ text, isDark }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [voices, setVoices] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Ensure voices are loaded properly
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices.length);
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
      }
    };

    // Load voices immediately
    loadVoices();

    // Set up listener for voice changes (needed for some browsers)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Fallback: try loading again after a short delay
    const timeout = setTimeout(loadVoices, 100);

    return () => {
      clearTimeout(timeout);
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleReadAloud = () => {
    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Ensure speech synthesis is available
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Simplified multi-pass cleaning for speech
    let cleanText = text;
    [
      /Analyzing query\.{1,3}/gi,
      /Found in Semantic Cache/gi,
      /Generating response/gi,
      /^[a-z_]{2,}(?:\.{1,3}|[:\s!]|(?=[A-Z\s!]))/i,
      /\b[a-z_]{2,}_[a-z_]{2,}\b/gi,
      /(\*\*|__|#|\*|-|>)/g,
    ].forEach(pattern => {
      cleanText = cleanText.replace(pattern, '');
    });
    cleanText = cleanText.trim();

    if (!cleanText) {
      console.warn('No text to speak');
      return;
    }

    console.log('Starting speech synthesis for text:', cleanText.substring(0, 50) + '...');

    // Create utterance
    activeUtterance = new SpeechSynthesisUtterance(cleanText);
    const utterance = activeUtterance;

    // Set speech parameters for natural flow
    utterance.rate = 1.15;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Select voice (prioritize Indian accent)
    if (voicesLoaded && voices.length > 0) {
      const indianVoice = voices.find(v =>
        (v.lang === 'en-IN' || v.lang === 'hi-IN') ||
        (v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi'))
      );

      const googleEnglishVoice = voices.find(v =>
        v.name.toLowerCase().includes('google') && v.lang.startsWith('en')
      );

      const anyEnglishVoice = voices.find(v => v.lang.startsWith('en'));

      if (indianVoice) {
        utterance.voice = indianVoice;
        console.log('Using Indian voice:', indianVoice.name);
      } else if (googleEnglishVoice) {
        utterance.voice = googleEnglishVoice;
        console.log('Using Google English voice:', googleEnglishVoice.name);
      } else if (anyEnglishVoice) {
        utterance.voice = anyEnglishVoice;
        console.log('Using English voice:', anyEnglishVoice.name);
      } else {
        utterance.voice = voices[0];
        console.log('Using default voice:', voices[0].name);
      }
    }

    // Set up event handlers
    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      activeUtterance = null;
    };

    utterance.onerror = (event) => {
      if (event.error === 'interrupted') {
        console.log('Speech interrupted as expected');
      } else {
        console.error('Speech error:', event.error, event);
        setIsSpeaking(false);
        activeUtterance = null;
        if (event.error === 'not-allowed') {
          alert('Please allow audio playback in your browser settings');
        }
      }
    };

    utterance.onpause = () => {
      console.log('Speech paused');
    };

    utterance.onresume = () => {
      console.log('Speech resumed');
    };

    // Start speaking
    try {
      window.speechSynthesis.speak(utterance);
      console.log('Speech synthesis started');
    } catch (error) {
      console.error('Failed to start speech:', error);
      setIsSpeaking(false);
      alert('Failed to start text-to-speech. Please try again.');
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      // Clean markdown bold/header but PRESERVE newlines and list structure
      const cleanText = text
        .replace(/(\*\*|__|\#)/g, '') // Remove bold/header markers
        .trim();

      await navigator.clipboard.writeText(cleanText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-0.5 mt-2 ml-0.5 px-1 py-1 rounded-lg w-fit border shadow-sm scale-90 origin-left ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}
    >
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleReadAloud}
        className={`p-1 rounded-md transition-all duration-200 flex items-center gap-1 group ${isSpeaking
          ? 'text-blue-500 bg-blue-500/15 ring-1 ring-blue-500/20'
          : isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-white/5' : 'text-gray-500 hover:text-blue-600 hover:bg-white'
          }`}
        title={isSpeaking ? "Stop" : "Read Aloud"}
      >
        {isSpeaking ? <VolumeX size={12} className="animate-pulse" /> : <Volume2 size={12} />}
      </motion.button>

      <div className={`w-[1px] h-2.5 mx-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleCopy}
        className={`p-1 rounded-md transition-all duration-200 flex items-center gap-1 ${isCopied
          ? 'text-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/20'
          : isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-500 hover:text-emerald-600 hover:bg-white'
          }`}
        title="Copy"
      >
        {isCopied ? <CheckCircle size={12} /> : <Copy size={12} />}
      </motion.button>

      <div className={`w-[1px] h-2.5 mx-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />

      <div className="flex items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
          className={`p-1 rounded-md transition-all duration-200 ${feedback === 'like'
            ? 'text-blue-500 bg-blue-500/15'
            : isDark ? 'text-gray-500 hover:text-blue-400 hover:bg-white/5' : 'text-gray-500 hover:text-blue-600 hover:bg-white'
            }`}
        >
          <ThumbsUp size={12} fill={feedback === 'like' ? 'currentColor' : 'none'} strokeWidth={feedback === 'like' ? 2 : 1.5} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
          className={`p-1 rounded-md transition-all duration-200 ${feedback === 'dislike'
            ? 'text-red-500 bg-red-500/15'
            : isDark ? 'text-gray-500 hover:text-red-400 hover:bg-white/5' : 'text-gray-500 hover:text-red-600 hover:bg-white'
            }`}
        >
          <ThumbsDown size={12} fill={feedback === 'dislike' ? 'currentColor' : 'none'} strokeWidth={feedback === 'dislike' ? 2 : 1.5} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ThoughtAccordion removed in favor of IntelligenceLog

const MessageBubble = ({ message, thought, isDark, isUser, isStreaming = false, chatState, modelId = 'legal_counsel' }) => {
  const [showLog, setShowLog] = useState(false);
  const agentName = modalOptions.find(opt => opt.id === modelId)?.label || 'LAWYER TIA';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        opacity: { duration: 0.4 }
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8 group`}
    >
      <div className={`flex items-start gap-2.5 sm:gap-4 max-w-[98%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && <TiaAvatar isStreaming={isStreaming} />}

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          {/* Name and State HUD for AI */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-1.5 ml-1">
              <span className={`text-[11px] font-black tracking-widest opacity-80 uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {agentName}
              </span>

              <div className="flex items-center gap-1.5">
                {(thought || isStreaming) && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLog(!showLog)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all
                      ${showLog
                        ? (isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm')
                        : 'text-gray-500 hover:text-blue-500 hover:bg-blue-500/5'}`}
                    title={showLog ? "Hide Logic & Events" : "Show Logic & Events"}
                  >
                    <Brain size={11} className={showLog ? "animate-pulse" : ""} />
                    <span>{showLog ? 'Hide Process' : 'Show Process'}</span>
                  </motion.button>
                )}

                {isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-tighter
                    ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}
                  >
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                    <span>{chatState || 'Thinking'}</span>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* The Intelligence Log (Shown only when toggled) */}
          <AnimatePresence>
            {!isUser && showLog && (thought || isStreaming) && (
              <IntelligenceLog thought={thought} isStreaming={isStreaming} isDark={isDark} />
            )}
          </AnimatePresence>

          <div
            className={`relative transition-all duration-300 ${isUser
              ? `px-3.5 py-2 rounded-[18px] shadow-sm ${isDark
                ? 'bg-gradient-to-br from-[#1e1e1e] to-[#141414] border border-white/10 text-white shadow-xl shadow-black/20'
                : 'bg-white border border-slate-200 text-slate-700 shadow-lg shadow-slate-200/5'
              } font-medium text-[14px] leading-relaxed max-w-[85%] sm:max-w-sm`
              : `w-full ${isDark ? 'text-gray-200' : 'text-slate-800'}`
              }`}
          >
            {isStreaming && !isUser ? (
              message ? (
                <StreamingText text={message} isDark={isDark} />
              ) : (
                <div className="flex gap-1.5 px-3 py-2 bg-white/5 rounded-xl w-fit">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    />
                  ))}
                </div>
              )
            ) : isUser ? (
              <span className="leading-relaxed whitespace-pre-wrap">{message}</span>
            ) : (
              <div className={`prose-professional ${isDark ? 'text-gray-100' : 'text-slate-900'}`}>
                <FormattedResponse text={message} isDark={isDark} />
              </div>
            )}
          </div>

          {!isUser && !isStreaming && message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-1"
            >
              <MessageActions text={message} isDark={isDark} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getModalIcon = (id) => {
  const icons = {
    legal_counsel: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2C12 2 14 6 16 8L20 10C16 12 12 14 12 14C12 14 8 12 4 10L8 8C10 6 12 2 12 2Z" fill="currentColor" opacity="0.9" /><circle cx="12" cy="16" r="2" fill="currentColor" /><path d="M10 20L12 22L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g></svg>,
    nyaaya: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2L18 8H16V14H8V8H6L12 2Z" fill="currentColor" opacity="0.9" /><rect x="7" y="15" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="10" y1="15" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" /><line x1="14" y1="15" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" /></g></svg>,
    munshi: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M8 7H16M8 11H16M8 15H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></g></svg>,
    adalat: <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><g><path d="M12 2L20 7V12C20 18 12 22 12 22C12 22 4 18 4 12V7L12 2Z" fill="currentColor" opacity="0.8" /><path d="M10 13L11.5 14.5L15 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g></svg>
  };
  return icons[id] || icons.legal_counsel;
};

const modalOptions = [
  { id: 'legal_counsel', label: 'BAKILAT 1.0', description: 'Advanced AI for everyday legal tasks', color: 'violet' },
  { id: 'nyaaya', label: 'Nyaaya 3.1', description: 'For comprehensive case analysis', color: 'emerald' },
  { id: 'munshi', label: 'Munshi 3', description: 'Specialized in contract drafting', color: 'amber' },
  { id: 'adalat', label: 'Adalat 2.1', description: 'Expert litigation support', color: 'indigo' }
];

// Professional Chat State Indicator Component
const ChatStateIndicator = ({ chatState, stateMessage, isDark }) => {
  const [dynamicMessage, setDynamicMessage] = useState(stateMessage);

  // Logic to make it feel "Alive" by cycling sub-tasks
  useEffect(() => {
    let interval;
    if (chatState === CHAT_STATES.ANALYZING || chatState === CHAT_STATES.RESEARCHING || chatState === CHAT_STATES.CONNECTING) {
      const subTasks = {
        [CHAT_STATES.CONNECTING]: ['Securing encrypted channel...', 'Handshaking with legal core...', 'Initializing neural link...'],
        [CHAT_STATES.ANALYZING]: ['Parsing legal entities...', 'Identifying relevant statutes...', 'Structural analysis of query...'],
        [CHAT_STATES.RESEARCHING]: ['Searching Case Law database...', 'Consulting ICP & CRPC...', 'Cross-referencing precedents...'],
      };

      const currentTasks = subTasks[chatState] || [];
      if (currentTasks.length > 0) {
        let i = 0;
        setDynamicMessage(currentTasks[0]);
        interval = setInterval(() => {
          i = (i + 1) % currentTasks.length;
          setDynamicMessage(currentTasks[i]);
        }, 2500);
      }
    } else {
      setDynamicMessage(stateMessage);
    }
    return () => clearInterval(interval);
  }, [chatState, stateMessage]);

  const getStateIcon = () => {
    switch (chatState) {
      case CHAT_STATES.CONNECTING: return <Loader2 size={14} className="animate-spin text-blue-500" />;
      case CHAT_STATES.ANALYZING: return <Brain size={14} className="animate-pulse text-purple-500" />;
      case CHAT_STATES.RESEARCHING: return <BookOpen size={14} className="animate-pulse text-emerald-500" />;
      case CHAT_STATES.DRAFTING: return <PenTool size={14} className="animate-pulse text-amber-500" />;
      case CHAT_STATES.STREAMING: return <Zap size={14} className="animate-pulse text-indigo-500" />;
      case CHAT_STATES.COMPLETE: return <CheckCircle size={14} className="text-green-500" />;
      case CHAT_STATES.ERROR: return <X size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const getStateColor = () => {
    switch (chatState) {
      case CHAT_STATES.COMPLETE:
        return isDark ? 'text-green-400 bg-green-500/5 border-green-500/20' : 'text-green-600 bg-green-50 border-green-200';
      case CHAT_STATES.ERROR:
        return isDark ? 'text-red-400 bg-red-500/5 border-red-500/20' : 'text-red-600 bg-red-50 border-red-200';
      default:
        return isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  if (chatState === CHAT_STATES.IDLE || chatState === CHAT_STATES.STREAMING) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[11.5px] font-bold tracking-tight border shadow-sm backdrop-blur-md transition-all duration-500 ${getStateColor()}`}>
        <div className="flex items-center justify-center">
          {getStateIcon()}
        </div>
        <span className="opacity-90">{dynamicMessage}</span>
        <div className="flex gap-0.5 ml-1">
          {[0, 1, 2].map(d => (
            <motion.div
              key={d}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: d * 0.2 }}
              className="w-1 h-1 rounded-full bg-current"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

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
  const { mode } = useSelector((state) => state.theme);
  const { isOpen: sidebarOpen } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const isDark = mode === 'dark';
  const { isAuthenticated } = useAuth();
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedModal, setSelectedModal] = useState('legal_counsel');
  const [showModalDropdown, setShowModalDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Chatbot API Integration - Session and State Management
  const [sessionId, setSessionId] = useState(null);
  const [chatState, setChatState] = useState(CHAT_STATES.IDLE);
  const [stateMessage, setStateMessage] = useState('');

  // Load session from URL
  useEffect(() => {
    const loadSession = async () => {
      // If we are already on this session and have messages, don't reload
      // This prevents the "flicker" and state loss on first interaction
      if (routeSessionId && routeSessionId === sessionId && messages.length > 0) {
        return;
      }

      if (routeSessionId) {
        setSessionId(routeSessionId);
        setIsLoading(true);
        try {
          const response = await chatbotAPI.getSession(routeSessionId);
          if (response && response.success) {
            const formattedMessages = response.data.messages.map(msg => ({
              id: msg.id.toString(),
              role: msg.sender === 'bot' ? 'assistant' : msg.sender,
              content: msg.message,
              thought: msg.metadata?.thought,
              modelId: selectedModal // or from metadata if saved
            }));
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error loading session:", error);
          // Optional: navigate to new chat on error
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset for new chat
        setSessionId(null);
        setMessages([]);
        setChatState(CHAT_STATES.IDLE);
      }
    };
    loadSession();
  }, [routeSessionId, selectedModal]); // Reload when ID changes

  // Map UI model selection to API model names
  const getApiModelName = useCallback((uiModel) => {
    const modelMap = {
      'legal_counsel': AI_MODELS.LEGAL_COUNSEL,
      'nyaaya': AI_MODELS.NYAAYA,
      'munshi': AI_MODELS.MUNSHI,
      'adalat': AI_MODELS.ADALAT,
    };
    return modelMap[uiModel] || AI_MODELS.LEGAL_COUNSEL;
  }, []);

  // Handle chat state changes from API service
  const handleStateChange = useCallback((state, message) => {
    setChatState(state);
    setStateMessage(message);
  }, []);

  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState('100dvh');

  // Intelligent Keyboard & Viewport Handling for Mobile
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const height = window.visualViewport.height;
      setViewportHeight(`${height}px`);

      // If keyboard opened (height decreased), scroll to bottom if needed
      if (height < window.innerHeight * 0.8 && chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Intelligent Auto-scroll for streaming chats
  useEffect(() => {
    if (chatContainerRef.current) {
      const isAtBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop - chatContainerRef.current.clientHeight < 150;

      // Only auto-scroll if the user hasn't manually scrolled up to read history
      if (isAtBottom) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

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

  // Point 2: Intelligent Auto-Scroll Handler
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Check if user is already near the bottom (within 150px)
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;

    // Auto scroll if user is at bottom or it's the very first message
    if (isAtBottom || messages.length <= 1) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Handle streaming text scroll specifically
  useEffect(() => {
    if (isLoading && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
      if (isAtBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [isLoading]);

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

  /**
   * Main submission handler for the chatbot.
   * Features: Multi-agent validation, intelligent auto-scroll, and error recovery.
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const userQuery = query.trim();
    const allFiles = [...uploadedFiles, ...pendingFiles];

    // Prevent submission if no input
    if (!userQuery && allFiles.length === 0) return;

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Capture current state for the message history
    const messageId = Date.now().toString();
    const userMessage = {
      id: messageId,
      role: 'user',
      content: userQuery || "Uploaded files",
      modelId: selectedModal // Persist the agent who received this message
    };
    setMessages(prev => [...prev, userMessage]);

    // Cleanup inputs for next interaction
    setQuery('');
    setUploadedFiles([]);
    setPendingFiles([]);

    /**
     * Point 1: Agent Restriction check.
     */
    if (selectedModal !== 'legal_counsel') {
      setIsLoading(true);
      setChatState(CHAT_STATES.ANALYZING);

      setTimeout(() => {
        const warningMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `The **${modalOptions.find(o => o.id === selectedModal)?.label}** agent is currently in **tuning & training mode** for advanced legal datasets.\n\nFor the best experience with everyday legal tasks and research, please use our flagship **BAKILAT 1.0** agent which is fully optimized and available for production.`
        };
        setMessages(prev => [...prev, warningMessage]);
        setIsLoading(false);
        setChatState(CHAT_STATES.IDLE);
      }, 1000);
      return;
    }

    // Proceed with API call for Bakilat
    setIsLoading(true);
    setChatState(CHAT_STATES.CONNECTING);

    try {
      const apiModel = getApiModelName(selectedModal);
      let activeSessionId = sessionId;

      if (messages.length === 0 && !sessionId) {
        // Create new session in Backend
        try {
          const newSession = await chatbotAPI.createSession(userQuery.substring(0, 50));
          if (newSession && newSession.success) {
            activeSessionId = newSession.data.id;
            setSessionId(activeSessionId);
            // Update URL without reloading
            navigate(`/chatbot/${activeSessionId}`, { replace: true });
            dispatch(fetchChatSessions()); // Refresh sidebar
          }
        } catch (e) {
          console.error("Failed to create backend session", e);
          // Fallback to local ID?
          activeSessionId = Date.now().toString();
          setSessionId(activeSessionId);
        }
      }

      // Save User Message to Backend
      if (activeSessionId) {
        chatbotAPI.addEvent(activeSessionId, {
          sender: 'user',
          message: userQuery,
          event_type: 'message'
        }).catch(e => console.error("Failed to save user message", e));
      }

      // Create a dedicated ID for the bot's message to update it in real-time
      const botMessageId = 'bot-' + Date.now().toString();

      // Add empty assistant message that will be populated by chunks
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'assistant',
        content: '',
        isRealTime: true,
        modelId: selectedModal // Persist original responding agent
      }]);

      const result = await chatbotService.sendMessage(
        userQuery,
        apiModel,
        handleStateChange,
        activeSessionId,
        (chunk) => {
          // Handle structured chunk (text vs thought)
          setMessages(prev => prev.map(msg => {
            if (msg.id !== botMessageId) return msg;

            if (chunk.type === 'thought') {
              return { ...msg, thought: (msg.thought || '') + chunk.content };
            }

            // --- Aggressive prefix stripping during streaming ---
            let newContent = msg.content + chunk.content;
            const techPatterns = /^(Analyzing query\.{0,3}|greeting|cache_hit|routing|thinking)\s*/i;

            // If the message is very short and matches a technical pattern, we treat it as meta
            if (newContent.length < 50 && techPatterns.test(newContent)) {
              // We keep it as thought but hide from main content
              return { ...msg, thought: (msg.thought || '') + chunk.content };
            }

            return { ...msg, content: newContent };
          }));

          // Smart auto-scroll: only force scroll to bottom if user hasn't scrolled up
          const container = document.getElementById('chat-scroll-container');
          if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isAtBottom) {
              container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
            }
          }
        }
      );
      if (result.sessionId && result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }

      if (!result.success) {
        // Replace with error message if failed
        setMessages(prev => prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, content: `__System Alert:__ ${result.response}`, isRealTime: false }
            : msg
        ));
      } else {
        // Mark as no longer streaming
        setMessages(prev => prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, isRealTime: false }
            : msg
        ));

        // Save Bot Response to Backend
        if (activeSessionId) {
          chatbotAPI.addEvent(activeSessionId, {
            sender: 'bot',
            message: result.response,
            event_type: 'message',
            metadata: { thought: messages.find(m => m.id === botMessageId)?.thought }
          }).then(() => {
            dispatch(fetchChatSessions()); // Refresh sidebar to show updated time/preview?
          }).catch(e => console.error("Failed to save bot message", e));
        }
      }
    } catch (error) {
      handleStateChange(CHAT_STATES.ERROR, 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
    setChatState(CHAT_STATES.IDLE);
    setStateMessage('');

    // Clear current session and create new one
    if (sessionId) {
      chatbotService.clearCurrentSession(sessionId);
    }
    const newSession = chatbotService.createNewSession(getApiModelName(selectedModal));
    // setSessionId(newSession.id); // Don't set ID here, let url handle it or next message
    navigate('/chatbot'); // Return to new chat URL
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
    <div className={`flex w-full overflow-hidden transition-colors duration-300
      ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}
      style={{
        height: viewportHeight,
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >

      {/* Sidebar removed as it is now global in App.js */}

      <div className="flex-1 flex flex-col relative overflow-hidden h-full">



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

        <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
          <div
            id="chat-scroll-container"
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 scroll-smooth scrollbar-hide"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y'
            }}
          >
            <div className={`max-w-3xl mx-auto w-full pb-32 pt-20 sm:pt-24`}>
              {messages.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none mt-20">
                  <motion.div
                    layout
                    className="text-center max-w-md pointer-events-auto"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                  >
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
                      Welcome to MeraBakil
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Your Intelligent Legal Assistant
                    </motion.p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id || idx}
                      message={msg.content}
                      thought={msg.thought}
                      isDark={isDark}
                      isUser={msg.role === 'user'}
                      isStreaming={msg.isRealTime}
                      chatState={stateMessage}
                      modelId={msg.modelId || selectedModal}
                    />
                  ))}

                  {/* 
                      Only show skeleton loader if:
                      1. We are in the "loading" state
                      2. AND the currently streaming real-time message doesn't have any actual response text yet
                  */}
                  {isLoading && !messages.some(m => m.isRealTime && m.content.length > 0) && (
                    <div className="space-y-4">
                      <ChatStateIndicator
                        chatState={chatState}
                        stateMessage={stateMessage}
                        isDark={isDark}
                      />
                      <SkeletonLoading isDark={isDark} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <motion.div
            layout
            transition={{ duration: 0.3, type: 'spring' }}
            className={`px-4 pb-6 pt-2 flex-shrink-0 relative z-20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}
          >
            <div className="max-w-3xl mx-auto">
              <motion.div
                layout
                className={`relative rounded-3xl border transition-all duration-500 overflow-hidden
                  ${isDark
                    ? 'bg-[#151515]/80 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                    : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
                  }
                  ${query.trim() ? 'ring-1 ring-blue-500/20' : ''}`}
              >
                {/* Subtle top glare for glass effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                {/* Input Content */}
                <div className="flex flex-col">
                  {/* Action Bar (Top) */}
                  <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/30'}`}>
                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest backdrop-blur-md
                        ${isDark
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>{selectedModal === 'legal_counsel' ? 'Bakilat 1.0' : modalOptions.find(o => o.id === selectedModal)?.label}</span>
                      </div>

                      {(uploadedFiles.length > 0 || pendingFiles.length > 0) && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border
                          ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                          <Upload size={10} strokeWidth={3} />
                          <span>{uploadedFiles.length + pendingFiles.length} File(s)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowModalDropdown(!showModalDropdown)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        title="Change model"
                      >
                        <Settings size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Main Input Field */}
                  <div className="flex items-end gap-3 p-4">
                    <div className="flex-1 min-w-0">
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
                        placeholder="Describe your legal situation..."
                        className={`w-full bg-transparent !bg-transparent outline-none border-none text-[15px] font-medium leading-relaxed resize-none p-0 max-h-32 min-h-[24px] focus:ring-0
                          ${isDark ? 'text-white placeholder-slate-500/60 caret-blue-500' : 'text-slate-900 placeholder-slate-400 caret-blue-600'}`}
                        rows={1}
                        spellCheck="false"
                      />
                    </div>

                    {/* Bottom Utility Bar */}
                    <div className="flex items-center gap-2 pb-0.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('file-input').click()}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all
                          ${isDark
                            ? 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                      >
                        <Upload size={18} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVoiceToggle}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all
                          ${isVoiceActive || showVoiceModal
                            ? 'bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/20'
                            : isDark
                              ? 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                      >
                        <Mic size={18} />
                      </motion.button>

                      <motion.button
                        disabled={!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0}
                        onClick={handleSubmit}
                        whileHover={query.trim() ? { scale: 1.05, x: 2 } : {}}
                        whileTap={query.trim() ? { scale: 0.95 } : {}}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                          ${!query.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0
                            ? isDark ? 'text-slate-700 bg-slate-900/50 border border-white/5' : 'text-slate-200 bg-slate-50 border border-slate-100'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'}`}
                      >
                        <SendHorizontal size={20} strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* File list (horizontal scroll if many) */}
                <AnimatePresence>
                  {(uploadedFiles.length > 0 || pendingFiles.length > 0) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`px-4 pb-4 flex flex-wrap gap-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}
                    >
                      {[...uploadedFiles, ...pendingFiles].map((file, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold
                            ${isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        >
                          <FileText size={12} className="text-blue-500" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <button onClick={() => removeUploadedFile(idx)} className="hover:text-red-500 transition-colors">
                            <X size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="mt-3 flex items-center justify-center gap-4">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
                  MeraBakil provides AI-driven legal guidance. Verify all critical steps with a registered lawyer.
                </p>
              </div>
            </div>
          </motion.div>
        </main>
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
