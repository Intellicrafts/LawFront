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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
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
            
            setTimeout(() => {}, 500);
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

  const calculateTooltipPosition = useCallback((targetElement, placement) => {
    if (!targetElement || !tooltipRef.current) return { top: 0, left: 0 };

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const PADDING = 16;
    const MIN_SPACING = 12;
    const SCROLL_MARGIN = 80;
    
    const tooltipHeight = tooltipRect.height || 220;
    const tooltipWidth = tooltipRect.width || 320;
    
    let position = { top: 0, left: 0 };

    if (targetElement.getAttribute('data-tour') === 'start-consultation') {
      const spaceBelow = viewportHeight - targetRect.bottom;
      
      if (spaceBelow >= tooltipHeight + MIN_SPACING + SCROLL_MARGIN) {
        position = {
          top: targetRect.bottom + MIN_SPACING,
          left: Math.max(PADDING, Math.min(
            targetRect.left + (targetRect.width - tooltipWidth) / 2,
            viewportWidth - tooltipWidth - PADDING
          ))
        };
      } else {
        position = {
          top: Math.max(SCROLL_MARGIN, targetRect.top - tooltipHeight - MIN_SPACING),
          left: Math.max(PADDING, Math.min(
            targetRect.left + (targetRect.width - tooltipWidth) / 2,
            viewportWidth - tooltipWidth - PADDING
          ))
        };
      }
    }
    else if (placement === 'right') {
      position = {
        top: Math.max(SCROLL_MARGIN, Math.min(
          targetRect.top + (targetRect.height - tooltipHeight) / 2,
          viewportHeight - tooltipHeight - PADDING
        )),
        left: Math.min(targetRect.right + MIN_SPACING, viewportWidth - tooltipWidth - PADDING)
      };
    }
    else if (placement === 'bottom') {
      const spaceBelow = viewportHeight - targetRect.bottom;
      
      if (spaceBelow >= tooltipHeight + MIN_SPACING) {
        position = {
          top: targetRect.bottom + MIN_SPACING,
          left: Math.max(PADDING, Math.min(
            targetRect.left + (targetRect.width - tooltipWidth) / 2,
            viewportWidth - tooltipWidth - PADDING
          ))
        };
      } else {
        position = {
          top: Math.max(SCROLL_MARGIN, targetRect.top - tooltipHeight - MIN_SPACING),
          left: Math.max(PADDING, Math.min(
            targetRect.left + (targetRect.width - tooltipWidth) / 2,
            viewportWidth - tooltipWidth - PADDING
          ))
        };
      }
    }
    else {
      position = {
        top: Math.max(SCROLL_MARGIN, (viewportHeight - tooltipHeight) / 2),
        left: Math.max(PADDING, (viewportWidth - tooltipWidth) / 2)
      };
    }

    return position;
  }, []);



  const highlightTarget = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      setHighlightedElement(element);
      if (currentStep === -1 || currentStep >= tourSteps.length) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return element;
    }
    return null;
  }, [currentStep, tourSteps.length]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      const step = tourSteps[stepIndex];
      
      if (step.target === '[data-tour="start-consultation"]') {
        if (step.trigger) {
          step.trigger();
        }
        
        setTimeout(() => {
          setCurrentStep(stepIndex);
          highlightTarget(step.target);
        }, 200);
      } else {
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
      
      if (highlightedElement && currentStep < tourSteps.length) {
        const newPosition = calculateTooltipPosition(highlightedElement, tourSteps[currentStep].placement);
        setTooltipPosition(newPosition);
      }
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
  }, [isVisible, currentStep, highlightedElement, tourSteps, calculateTooltipPosition]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {currentStep === -1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className={`rounded-xl p-8 max-w-md shadow-2xl ${isDark ? 'bg-[#2C2C2C]' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <Sparkles className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                  <button onClick={handleSkip} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#3A3A3A]' : 'hover:bg-gray-100'}`}>
                    <X size={20} />
                  </button>
                </div>
                <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome to Mera Vakil</h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your AI-powered legal companion. Get instant answers, draft documents, and receive expert guidance on Indian law—all in one intelligent platform.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${isDark ? 'bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                  >
                    Skip
                  </button>
                  <button
                    onClick={startTour}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    Start Tour
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep >= 0 && currentStep < tourSteps.length && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                zIndex: 60
              }}
              className={`w-80 rounded-xl p-6 shadow-xl ${isDark ? 'bg-[#2C2C2C] border border-[#3A3A3A]' : 'bg-white border border-gray-200'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
                  {tourSteps[currentStep].icon}
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tourSteps[currentStep].title}
                </h3>
              </div>
              
              <div className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tourSteps[currentStep].content}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentStep + 1} of {tourSteps.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                      currentStep === 0
                        ? isDark ? 'bg-[#3A3A3A] text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isDark ? 'bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep >= tourSteps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className={`rounded-xl p-8 max-w-md shadow-2xl text-center ${isDark ? 'bg-[#2C2C2C]' : 'bg-white'}`}>
                <CheckCircle className={`w-14 h-14 mx-auto mb-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>All Set!</h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  You are ready to start exploring Mera Vakil. Begin with your first legal question and experience intelligent guidance instantly.
                </p>
                <button
                  onClick={handleComplete}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Get Started
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
