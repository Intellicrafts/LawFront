// src/components/OnboardingTour.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import '../styles/onboardingTour.css';
import { 
  Sparkles, 
  MessageSquare, 
  Mic, 
  History, 
  Home, 
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Crown,
  Zap
} from 'lucide-react';

const OnboardingTour = ({ isOpen, onClose, onComplete }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  
  const [currentStep, setCurrentStep] = useState(-1); // -1 = welcome screen, 0-4 = tour steps, 5 = completion
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);

  // Tour steps configuration
  const tourSteps = [
    {
      target: '[data-tour="start-consultation"]',
      title: "Ask Your Legal Question",
      content: "MeraBakil is an AI-powered chatbot developed to provide instant and accurate answers to your legal questions.",
      icon: <MessageSquare className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
        // Ensure consultation button is visible - scroll before disabling scroll
        const consultBtn = document.querySelector('[data-tour="start-consultation"]');
        const chatInput = document.querySelector('[data-tour="chat-input"]');
        if (consultBtn && chatInput) {
          // Calculate position to show both elements optimally
          const buttonRect = consultBtn.getBoundingClientRect();
          const inputRect = chatInput.getBoundingClientRect();
          
          // If elements are not properly visible, scroll to show them
          if (buttonRect.top < 100 || buttonRect.bottom > window.innerHeight - 200) {
            const averageTop = (buttonRect.top + inputRect.top) / 2;
            window.scrollTo({
              top: window.scrollY + averageTop - window.innerHeight / 2,
              behavior: 'smooth'
            });
            
            // Wait for scroll to complete before proceeding
            setTimeout(() => {
              // Scroll is disabled after this in useEffect
            }, 500);
          }
        }
      }
    },
    {
      target: '[data-tour="start-consultation"]',
      title: "🎙️ Voice Input",
      content: "you don’t even have to type. Just speak your legal question, and our AI Lawyer will listen, understand, and reply instantly",
      icon: <Mic className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
        // Keep the same view, just highlight voice button
        const voiceBtn = document.querySelector('[data-tour="voice-button"]');
        if (voiceBtn) {
          // Add CSS class for highlight animation
          voiceBtn.classList.add('tour-voice-highlight');
          setTimeout(() => {
            voiceBtn.classList.remove('tour-voice-highlight');
          }, 4000);
        }
      }
    },
    {
      target: '[data-tour="chat-history"]',
      title: "Private & Secure Chats",
      content: "Your conversation is confidential and encrypted.",
      icon: <History className="w-5 h-5" />,
      placement: 'right',
      trigger: () => {
        // Sidebar opening is handled by navigation logic
        const chatHistory = document.querySelector('[data-tour="chat-history"]');
        if (chatHistory) {
          chatHistory.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
      {
    target: '[data-tour="navbar"]',
    title: "MeraBakil Services",
    content: (
      <>
        Discover all MeraBakil legal services from the navigation bar:
       <>
 <ul className="list-none mt-2 text-sm space-y-2">
  <li className="flex items-start gap-2">
    <span className="text-pink-500">
      💬
    </span>
    <strong className="text-gray-700 dark:text-gray-400">Private Chat:</strong>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-green-500">
      ⚖️
    </span>
    <strong className="text-gray-700 dark:text-gray-400">Legal Consultation</strong>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-500">
      🤖
    </span>
    <strong className="text-gray-700 dark:text-gray-400">Task Automation:</strong>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-blue-500">
      📄
    </span>
    <strong className="text-gray-700 dark:text-gray-400">Document Review</strong>
  </li>
</ul>

</>

      </>
    ),
    icon: <Home className="w-5 h-5 text-primary" />,
    placement: 'bottom',
    trigger: () => {
      const navbar = document.querySelector('[data-tour="navbar"]');
      if (navbar) {
        navbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },
    {
      target: '[data-tour="start-consultation"]',
      title: "Welcome to MeraBakil",
      content: "MeraBakil may sometimes produce incorrect or incomplete answers. Always consult a qualified lawyer for serious legal matters.",
      icon: <Zap className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
        // Smooth scroll without layout shift
        const consultBtn = document.querySelector('[data-tour="start-consultation"]');
        if (consultBtn) {
          consultBtn.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }
  ];

  // Smart tooltip positioning - ensures visibility of tooltip and buttons
  const calculateTooltipPosition = useCallback((targetElement, placement) => {
    if (!targetElement || !tooltipRef.current) return { top: 0, left: 0 };

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let position = { top: 0, left: 0 };

    // For consultation button steps (1, 2, 5) - smart positioning
    if (targetElement.getAttribute('data-tour') === 'start-consultation') {
      // Check if there's enough space below the button for tooltip
      const spaceBelow = viewportHeight - targetRect.bottom;
      const tooltipHeight = tooltipRect.height || 200; // estimate if not measured yet
      
      if (spaceBelow >= tooltipHeight + 40) {
        // Enough space below - position under button
        position = {
          top: targetRect.bottom + 20,
          left: Math.max(20, Math.min(
            targetRect.left + (targetRect.width - tooltipRect.width) / 2,
            viewportWidth - tooltipRect.width - 20
          ))
        };
      } else {
        // Not enough space below - position above button
        position = {
          top: Math.max(20, targetRect.top - tooltipHeight - 20),
          left: Math.max(20, Math.min(
            targetRect.left + (targetRect.width - tooltipRect.width) / 2,
            viewportWidth - tooltipRect.width - 20
          ))
        };
      }
    }
    // Sidebar positioning
    else if (placement === 'right') {
      position = {
        top: Math.max(20, Math.min(
          targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          viewportHeight - tooltipRect.height - 20
        )),
        left: Math.min(targetRect.right + 15, viewportWidth - tooltipRect.width - 20)
      };
    }
    // Navbar positioning
    else if (placement === 'bottom') {
      position = {
        top: targetRect.bottom + 15,
        left: Math.max(20, Math.min(
          targetRect.left + (targetRect.width - tooltipRect.width) / 2,
          viewportWidth - tooltipRect.width - 20
        ))
      };
    }
    // Center for welcome screen
    else {
      position = {
        top: (viewportHeight - tooltipRect.height) / 2,
        left: (viewportWidth - tooltipRect.width) / 2
      };
    }

    return position;
  }, []);

  // Highlight target element (no scrolling during tour steps)
  const highlightTarget = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      setHighlightedElement(element);
      // Only scroll if we're on welcome screen or completion screen
      if (currentStep === -1 || currentStep >= tourSteps.length) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return element;
    }
    return null;
  }, [currentStep, tourSteps.length]);

  // Handle step change with smart positioning
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      const step = tourSteps[stepIndex];
      
      // For consultation button steps (1, 2, 5), ensure proper positioning first
      if (step.target === '[data-tour="start-consultation"]') {
        // Execute step trigger first to position elements
        if (step.trigger) {
          step.trigger();
        }
        
        // Wait for positioning, then set step and disable scroll
        setTimeout(() => {
          setCurrentStep(stepIndex);
          highlightTarget(step.target);
        }, 200);
      } else {
        // For other steps, normal flow
        setCurrentStep(stepIndex);
        
        if (step.trigger) {
          setTimeout(step.trigger, 100);
        }
        
        setTimeout(() => {
          highlightTarget(step.target);
        }, step.trigger ? 300 : 100);
      }
    } else {
      setCurrentStep(stepIndex);
      setHighlightedElement(null);
    }
  }, [tourSteps, highlightTarget]);

  // Sidebar control helper
  const controlSidebar = useCallback((shouldOpen) => {
    const sidebarToggle = document.querySelector('button[aria-label*="sidebar"]') || 
                         document.querySelector('.sidebar-toggle') ||
                         document.querySelector('[class*="sidebar"]')?.parentElement?.querySelector('button');
    
    if (sidebarToggle) {
      const isSidebarOpen = document.querySelector('[class*="sidebar"]')?.classList.contains('translate-x-0') ||
                           document.querySelector('[data-tour="chat-history"]')?.offsetParent !== null;
      
      if (shouldOpen && !isSidebarOpen) {
        sidebarToggle.click();
      } else if (!shouldOpen && isSidebarOpen) {
        sidebarToggle.click();
      }
    }
  }, []);

  // Navigation handlers with sidebar control
  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;
    
    // Handle sidebar - only open on step 2 (chat history), close otherwise
    if (nextStep === 2) {
      // Going to chat history step - open sidebar
      setTimeout(() => controlSidebar(true), 100);
    } else {
      // Going to any other step - close sidebar
      setTimeout(() => controlSidebar(false), 100);
    }
    
    if (currentStep < tourSteps.length - 1) {
      goToStep(nextStep);
    } else {
      setCurrentStep(tourSteps.length); // Go to completion screen
    }
  }, [currentStep, tourSteps.length, goToStep, controlSidebar]);

  const handleBack = useCallback(() => {
    const prevStep = currentStep - 1;
    
    // Handle sidebar - only open on step 2 (chat history), close otherwise
    if (prevStep === 2) {
      // Going back to chat history step - open sidebar
      setTimeout(() => controlSidebar(true), 100);
    } else {
      // Going to any other step - close sidebar
      setTimeout(() => controlSidebar(false), 100);
    }
    
    if (currentStep > 0) {
      goToStep(prevStep);
    } else if (currentStep === 0) {
      setCurrentStep(-1); // Go back to welcome screen
    }
  }, [currentStep, goToStep, controlSidebar]);

  const handleSkip = useCallback(() => {
    // Always close sidebar when exiting tour
    controlSidebar(false);
    onClose();
  }, [onClose, controlSidebar]);

  const handleComplete = useCallback(() => {
    // Always close sidebar when completing tour
    controlSidebar(false);
    onComplete();
    onClose();
  }, [onComplete, onClose, controlSidebar]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    goToStep(0);
  }, [goToStep]);

  // Initialize tour
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(-1); // Start with welcome screen
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      setHighlightedElement(null);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Disable scroll and fix positioning when tour is active
  useEffect(() => {
    if (isVisible && currentStep >= 0) {
      // Disable scroll completely during tour
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Update tooltip position initially
      if (highlightedElement && currentStep < tourSteps.length) {
        const newPosition = calculateTooltipPosition(highlightedElement, tourSteps[currentStep].placement);
        setTooltipPosition(newPosition);
      }
    } else if (isVisible && currentStep === -1) {
      // Welcome screen - allow normal scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      // Cleanup - restore normal scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isVisible, currentStep, highlightedElement, calculateTooltipPosition, tourSteps]);

  if (!isVisible) return null;

  // Welcome Screen
  if (currentStep === -1) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={(e) => e.target === e.currentTarget && handleSkip()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl tour-entrance ${
              isDark 
                ? 'bg-slate-900/95 border border-slate-700/50 text-white' 
                : 'bg-white/95 border border-slate-200/50 text-slate-900'
            }`}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-violet-400/20 rounded-full blur-xl" />
            
            {/* Close button */}
            <button
              onClick={handleSkip}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                isDark 
                  ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200' 
                  : 'hover:bg-slate-100/50 text-slate-500 hover:text-slate-700'
              }`}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 inline-flex"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#22577a] to-[#5cacde] rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#22577a] to-[#5cacde] bg-clip-text text-transparent"
              >
                🏛️ Welcome to MeraBakil
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-base mb-8 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                🎯 <strong>Your legal companion is ready!</strong> Let us show you how MeraBakil makes legal assistance simple and accessible.
                <br />✨ <em>AI Chat • Voice Assistant • Case History • Expert Guidance</em>
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <button
                  onClick={startTour}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22577a] to-[#5cacde] text-white rounded-xl font-medium hover:from-[#1a4460] hover:to-[#4a9bc9] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>Show Me MeraBakil</span>
                  <ArrowRight size={16} />
                </button>
                
                <button
                  onClick={handleSkip}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700/30' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  Skip Tour
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Completion Screen
  if (currentStep === tourSteps.length) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'none'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl tour-entrance ${
              isDark 
                ? 'bg-slate-900/95 border border-slate-700/50 text-white' 
                : 'bg-white/95 border border-slate-200/50 text-slate-900'
            }`}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-emerald-400/20 rounded-full blur-xl" />
            
            {/* Content */}
            <div className="text-center relative z-10">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 inline-flex"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              >
                🎉 You're All Set with MeraBakil!
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-base mb-8 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                🚀 <strong>Your legal journey starts now!</strong> 
                <br />⚡ Ask legal questions • 🎙️ Speak to MeraBakil • 📚 Review past cases • 🌙 Customize experience
                <br />💡 <em>From property disputes to contracts - MeraBakil is here to help!</em>
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3"
              >
                <button
                  onClick={handleComplete}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>Ask MeraBakil</span>
                  <Zap size={16} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Tour Steps
  const currentStepData = tourSteps[currentStep];
  if (!currentStepData) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] tour-overlay"
        style={{ 
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'none'
        }}
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        {/* Clean element highlight */}
        {highlightedElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top + window.scrollY - 8,
              left: highlightedElement.getBoundingClientRect().left + window.scrollX - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
              borderRadius: '12px',
              border: '3px solid rgba(34, 87, 122, 0.8)',
              background: 'transparent',
              boxShadow: '0 0 0 2px rgba(34, 87, 122, 0.3)'
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`tour-tooltip w-72 max-w-sm p-5 rounded-xl shadow-2xl tour-entrance ${
            isDark 
              ? 'bg-slate-900/98 border border-[#5cacde]/50 text-white' 
              : 'bg-white/98 border border-[#22577a]/50 text-slate-900'
          }`}
          style={{
            ...tooltipPosition,
            backdropFilter: 'blur(12px)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(34, 87, 122, 0.2),
              0 10px 30px rgba(92, 172, 222, 0.1)
            `,
            zIndex: 10000
          }}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className={`absolute top-3 right-3 p-1 rounded-full transition-all duration-200 ${
              isDark 
                ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200' 
                : 'hover:bg-slate-100/50 text-slate-500 hover:text-slate-700'
            }`}
          >
            <X size={16} />
          </button>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              {currentStepData.icon}
              {currentStepData.title}
            </h3>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {currentStepData.content}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between tour-navigation">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-300'
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}
              
              <button
                onClick={handleSkip}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Skip Tour
              </button>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#22577a] to-[#5cacde] text-white rounded-lg text-sm font-medium hover:from-[#1a4460] hover:to-[#4a9bc9] transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;