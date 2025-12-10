import React, { useEffect, useRef, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/professionalTour.css';

const ProfessionalTour = ({ isOpen, onClose, onComplete, isDark }) => {
  const driverRef = useRef(null);
  const currentStepRef = useRef(0);
  const updateTimeoutRef = useRef(null);
  
  const openSidebarForTour = useCallback(() => {
    try {
      const sidebar = document.querySelector('[data-tour="chat-history"]');
      if (!sidebar) return;

      const sidebarRect = sidebar.getBoundingClientRect();
      const isOpen = sidebarRect.left < 100;

      if (!isOpen) {
        const menuBtn = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="toggle"]');
        if (menuBtn && menuBtn !== document.activeElement) {
          menuBtn.click();
        }
      }
    } catch (error) {
      console.error('Error opening sidebar:', error);
    }
  }, []);

  const closeSidebarIfNeeded = useCallback(() => {
    try {
      const sidebar = document.querySelector('[data-tour="chat-history"]');
      if (!sidebar) return;

      const sidebarRect = sidebar.getBoundingClientRect();
      const isOpen = sidebarRect.left < 100;

      if (isOpen) {
        const closeBtn = sidebar.querySelector('button[aria-label*="close"], button[aria-label*="Close"]');
        
        if (closeBtn && closeBtn !== document.activeElement) {
          closeBtn.click();
        } else {
          const menuBtn = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="toggle"]');
          if (menuBtn && menuBtn !== document.activeElement) {
            menuBtn.click();
          }
        }
      }
    } catch (error) {
      console.error('Error closing sidebar:', error);
    }
  }, []);

  const updatePointerPosition = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      try {
        const popover = document.querySelector('.driver-popover');
        if (!popover) return;
        
        const element = driverRef.current?.currentStep?.element;
        if (!element || element === document.body) return;
        
        const elementRect = element.getBoundingClientRect();
        
        const VIEWPORT_PADDING = 16;
        const MIN_SPACING = 12;
        const SCROLL_MARGIN = 80;
        
        let position = 'bottom';
        let top = 0;
        let left = 0;
        
        const popoverWidth = 360;
        const popoverHeight = 200;
        
        const spaceTop = elementRect.top;
        const spaceBottom = window.innerHeight - elementRect.bottom;
        const spaceLeft = elementRect.left;
        const spaceRight = window.innerWidth - elementRect.right;
        
        const maxHeight = Math.max(spaceTop, spaceBottom);
        const maxWidth = Math.max(spaceLeft, spaceRight);
        
        if (spaceBottom >= popoverHeight + MIN_SPACING + SCROLL_MARGIN) {
          position = 'bottom';
          top = elementRect.bottom + MIN_SPACING;
          left = elementRect.left + (elementRect.width - popoverWidth) / 2;
        } else if (spaceTop >= popoverHeight + MIN_SPACING + SCROLL_MARGIN) {
          position = 'top';
          top = elementRect.top - popoverHeight - MIN_SPACING;
          left = elementRect.left + (elementRect.width - popoverWidth) / 2;
        } else if (spaceRight >= popoverWidth + MIN_SPACING) {
          position = 'right';
          top = Math.max(SCROLL_MARGIN, elementRect.top + (elementRect.height - popoverHeight) / 2);
          left = elementRect.right + MIN_SPACING;
        } else if (spaceLeft >= popoverWidth + MIN_SPACING) {
          position = 'left';
          top = Math.max(SCROLL_MARGIN, elementRect.top + (elementRect.height - popoverHeight) / 2);
          left = elementRect.left - popoverWidth - MIN_SPACING;
        } else {
          position = 'center';
          top = Math.max(SCROLL_MARGIN, (window.innerHeight - popoverHeight) / 2);
          left = (window.innerWidth - popoverWidth) / 2;
        }
        
        left = Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - popoverWidth - VIEWPORT_PADDING));
        top = Math.max(VIEWPORT_PADDING, Math.min(top, window.innerHeight - popoverHeight - VIEWPORT_PADDING));
        
        popover.setAttribute('data-popover-side', position);
        popover.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
        popover.style.position = 'fixed';
        popover.style.zIndex = '99999';
      } catch (error) {
        console.error('Error updating pointer position:', error);
      }
    }, 30);
  }, []);



  useEffect(() => {
    if (!isOpen) return;

    const handleTourClose = () => {
      closeSidebarIfNeeded();
      if (onClose) {
        onClose();
      }
    };

    const handleTourComplete = () => {
      closeSidebarIfNeeded();
      if (onComplete) {
        onComplete();
      }
    };

    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Finish',
      showButtons: ['next', 'previous', 'close'],
      allowClose: true,
      overlayColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
      
      onDestroyed: () => {
        handleTourClose();
      },
      
      onDestroyStarted: () => {
        if (driverObj.hasNextStep() || driverObj.hasPreviousStep()) {
          const confirmed = window.confirm('Are you sure you want to exit the tour? You can restart it anytime from the help menu.');
          if (!confirmed) {
            return;
          }
        }
        driverObj.destroy();
      },

      onHighlightStarted: (element, step, index) => {
        currentStepRef.current = index;
        setTimeout(() => updatePointerPosition(), 100);
        
        if (index === 3) {
          setTimeout(() => openSidebarForTour(), 150);
        } else {
          setTimeout(() => closeSidebarIfNeeded(), 100);
        }
      },

      onNextClick: () => {
        if (driverObj && driverObj.hasNextStep()) {
          driverObj.moveNext();
        }
      },

      onPrevClick: () => {
        if (driverObj && driverObj.hasPreviousStep()) {
          driverObj.movePrevious();
        }
      },

      steps: [
        {
          element: '[data-tour="welcome-title"]',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg> Welcome to Mera Vakil</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-1.svg" alt="Legal Excellence" class="tour-step-image" /></div><div class="tour-description-compact"><strong>Your trusted AI legal companion</strong><br/>Get instant answers to legal questions, draft documents professionally, and receive expert guidance on Indian law—all in one intelligent platform.</div>',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tour="chat-input"]',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Ask Anything Legal</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-2.svg" alt="Ask Questions" class="tour-step-image" /></div><div class="tour-description-compact">Type your legal question here. Share relevant details like case names, dates, or jurisdiction to get more tailored answers.</div>',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tour="voice-button"]',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg> Speak Your Question</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-3.svg" alt="Voice Input" class="tour-step-image" /></div><div class="tour-description-compact">No time to type? Just click the microphone to speak your legal question naturally. We\'ll transcribe and answer instantly.</div>',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tour="chat-history"]',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Your Secure Library</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-4.svg" alt="Secure Library" class="tour-step-image" /></div><div class="tour-description-compact">All your legal conversations are safely stored here. Search, manage, and revisit your previous consultations anytime—completely private and encrypted.</div>',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '[data-tour="navbar"]',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path></svg> Explore More Features</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-5.svg" alt="Full Suite Tools" class="tour-step-image" /></div><div class="tour-description-compact"><strong>Discover what\'s available:</strong><br/><div class="tour-feature-mini">💬 <strong>Private Chat</strong> - Confidential legal help</div><div class="tour-feature-mini">⚖️ <strong>Consultation</strong> - Expert guidance</div><div class="tour-feature-mini">📄 <strong>Documents</strong> - Smart review & drafting</div><div class="tour-feature-mini">📖 <strong>Legal Hub</strong> - Learn & explore</div></div>',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: 'body',
          popover: {
            title: '<div class="tour-title-compact"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></svg> You\'re All Set!</div>',
            description: '<div class="tour-image-container"><img src="/tour-step-6.svg" alt="Success" class="tour-step-image" /></div><div class="tour-description-compact"><strong>Ready to get legal help?</strong><br/>Start by asking anything related to Indian law—contracts, property, corporate matters, or general legal advice. Our AI is here to help 24/7.</div>',
            side: 'center',
            align: 'center'
          }
        }
      ]
    });

    driverRef.current = driverObj;
    currentStepRef.current = 0;
    
    driverObj.drive();
    
    const handleResize = () => {
      updatePointerPosition();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch (error) {
          console.error('Error destroying tour:', error);
        }
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isOpen, isDark, updatePointerPosition, openSidebarForTour, closeSidebarIfNeeded]);

  return null;
};

export default ProfessionalTour;
