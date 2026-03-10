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

  const [currentStep, setCurrentStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);

  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);

  const tourSteps = [
    {
      target: '[data-tour="start-consultation"]',
      title: "Type Your Legal Question",
      content: "Ask anything about Indian law. Share relevant details like case names, dates, or jurisdiction to get smarter answers tailored to your situation.",
      icon: <MessageSquare className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
        const consultBtn = document.querySelector('[data-tour="start-consultation"]');
        const chatInput = document.querySelector('[data-tour="chat-input"]');
        if (consultBtn && chatInput) {
          const buttonRect = consultBtn.getBoundingClientRect();
          const inputRect = chatInput.getBoundingClientRect();

          if (buttonRect.top < 100 || buttonRect.bottom > window.innerHeight - 200) {
            const averageTop = (buttonRect.top + inputRect.top) / 2;
            window.scrollTo({
              top: window.scrollY + averageTop - window.innerHeight / 2,
              behavior: 'smooth'
            });

            setTimeout(() => { }, 500);
          }
        }
      }
    },
    {
      target: '[data-tour="voice-button"]',
      title: "Speak Your Question",
      content: "Prefer to talk? Just click the microphone and speak naturally. We'll understand and respond instantly—perfect for when you are on the go.",
      icon: <Mic className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
        const voiceBtn = document.querySelector('[data-tour="voice-button"]');
        if (voiceBtn) {
          voiceBtn.classList.add('tour-voice-highlight');
          setTimeout(() => {
            voiceBtn.classList.remove('tour-voice-highlight');
          }, 4000);
        }
      }
    },
    {
      target: '[data-tour="chat-history"]',
      title: "Your Private Vault",
      content: "Every conversation is securely saved here. Review past consultations, search through your history, and revisit important legal discussions anytime.",
      icon: <History className="w-5 h-5" />,
      placement: 'right',
      trigger: () => {
        const chatHistory = document.querySelector('[data-tour="chat-history"]');
        if (chatHistory) {
          chatHistory.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
    {
      target: '[data-tour="navbar"]',
      title: "More Tools Available",
      content: (
        <>
          Explore powerful features to help with your legal needs:
          <ul className="list-none mt-3 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-base">💬</span>
              <strong className="text-gray-700 dark:text-gray-300">Private Chat</strong> — One-on-one consultation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">⚖️</span>
              <strong className="text-gray-700 dark:text-gray-300">Consultation</strong> — Expert legal advice
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">📄</span>
              <strong className="text-gray-700 dark:text-gray-300">Documents</strong> — Draft & review
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">📖</span>
              <strong className="text-gray-700 dark:text-gray-300">Legal Hub</strong> — Learn & research
            </li>
          </ul>
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
      title: "You are Ready to Begin",
      content: "Start asking your legal questions right now! Remember: for critical matters, always consult a qualified lawyer. We are here to help guide you 24/7.",
      icon: <Zap className="w-5 h-5" />,
      placement: 'bottom',
      trigger: () => {
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

  /* 
   * Centralized Slide-Based Tour Logic
   * We no longer calculate dynamic positions. Instead, we show a central modal 
   * and smoothly scroll the relevant element into view for context.
   */

  const highlightTarget = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      setHighlightedElement(element);

      // Smooth scroll to the element to give context
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add a temporary highlight class to the element for visual cue
      element.classList.add('tour-focus-ring');
      return element;
    }
    return null;
  }, [currentStep, tourSteps.length]);

  // Effect to manage focus rings and cleanup
  useEffect(() => {
    // Remove previous highlights
    document.querySelectorAll('.tour-focus-ring').forEach(el => {
      el.classList.remove('tour-focus-ring');
    });

    // Apply new highlight if active
    if (isVisible && currentStep >= 0 && currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      // Small delay to allow scroll and dom update
      setTimeout(() => {
        highlightTarget(step.target);
      }, 100);
    }
  }, [currentStep, highlightTarget, tourSteps, isVisible]);




  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      const step = tourSteps[stepIndex];
      setCurrentStep(stepIndex);
      if (step.trigger) {
        step.trigger();
      }
    } else {
      setCurrentStep(stepIndex);
      setHighlightedElement(null);
    }
  }, [tourSteps]);

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

  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;

    if (nextStep === 2) {
      setTimeout(() => controlSidebar(true), 100);
    } else {
      setTimeout(() => controlSidebar(false), 100);
    }

    if (currentStep < tourSteps.length - 1) {
      goToStep(nextStep);
    } else {
      setCurrentStep(tourSteps.length);
    }
  }, [currentStep, tourSteps.length, goToStep, controlSidebar]);

  const handleBack = useCallback(() => {
    const prevStep = currentStep - 1;

    if (prevStep === 2) {
      setTimeout(() => controlSidebar(true), 100);
    } else {
      setTimeout(() => controlSidebar(false), 100);
    }

    if (currentStep > 0) {
      goToStep(prevStep);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
    }
  }, [currentStep, goToStep, controlSidebar]);

  const handleSkip = useCallback(() => {
    controlSidebar(false);
    onClose();
  }, [onClose, controlSidebar]);

  const handleComplete = useCallback(() => {
    controlSidebar(false);
    onComplete();
    onClose();
  }, [onComplete, onClose, controlSidebar]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    goToStep(0);
  }, [goToStep]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(-1);
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

  useEffect(() => {
    if (isVisible && currentStep >= 0) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';


    } else if (isVisible && currentStep === -1) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isVisible, currentStep, highlightedElement, tourSteps]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Enhanced Dark Overlay with Blur */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[9998]"
            onClick={handleSkip}
          />

          {/* Welcome Screen - Premium Modal */}
          {currentStep === -1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none"
            >
              <div className={`pointer-events-auto rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden group ${isDark
                ? 'bg-[#1a1a1a]/95 border border-white/10'
                : 'bg-white/95 border border-black/5'
                } backdrop-blur-xl ring-1 ring-black/5`}>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10' : 'bg-gradient-to-br from-blue-50 to-purple-50 ring-1 ring-black/5'
                      }`}>
                      <Crown className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <button
                      onClick={handleSkip}
                      className={`p-2 rounded-full transition-all duration-200 ${isDark
                        ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                        : 'hover:bg-black/5 text-gray-400 hover:text-black'
                        }`}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h2 className={`text-3xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">MeraBakil</span>
                  </h2>

                  <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Experience the future of legal assistance. Our AI-powered platform provides instant expert guidance, document drafting, and secure consultations tailored just for you.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSkip}
                      className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ${isDark
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                    >
                      Skip Intro
                    </button>
                    <button
                      onClick={startTour}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group/btn"
                    >
                      Start Tour
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tour Steps - Floating Tooltip */}
          {currentStep >= 0 && currentStep < tourSteps.length && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] w-[360px] rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl ring-1 ${isDark
                ? 'bg-[#1E1E1E]/90 ring-white/10'
                : 'bg-white/95 ring-black/5'
                }`}
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-2xl bg-gray-200 dark:bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>

              <div className="mt-2 flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl shadow-inner ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                  {React.cloneElement(tourSteps[currentStep].icon, { size: 24 })}
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tourSteps[currentStep].title}
                  </h3>
                  <p className={`text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    STEP {currentStep + 1} OF {tourSteps.length}
                  </p>
                </div>
              </div>

              <div className={`text-sm leading-relaxed mb-6 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tourSteps[currentStep].content}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSkip}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Skip
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${currentStep === 0
                      ? 'opacity-0 cursor-default'
                      : isDark
                        ? 'bg-white/5 hover:bg-white/10 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-1.5 transform active:scale-95"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Completion Screen - Premium Finish */}
          {currentStep >= tourSteps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
            >
              <div className={`rounded-3xl p-10 max-w-md w-full text-center shadow-2xl overflow-hidden relative ${isDark
                ? 'bg-[#1a1a1a] border border-white/10'
                : 'bg-white border border-black/5'
                }`}>
                {/* Background Confetti Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-500/30 to-purple-500/30 blur-3xl rounded-full animate-pulse"></div>
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mb-8 inline-flex p-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl shadow-green-500/30"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  You're All Set!
                </h2>

                <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ready to transform your legal journey? Whether you need quick advice or deep research, MeraBakil is here to assist you 24/7.
                </p>

                <button
                  onClick={handleComplete}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-lg font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-1 active:translate-y-0"
                >
                  Get Started Now
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
