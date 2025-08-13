import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for mobile keyboard handling with smooth animations
 * Provides mobile app-like experience with professional keyboard management
 */
export const useMobileKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardAnimating, setKeyboardAnimating] = useState(false);
  
  const initialViewportHeight = useRef(window.innerHeight);
  const keyboardAnimationTimeout = useRef(null);

  // Detect mobile device
  const detectMobile = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isTouch = 'ontouchstart' in window;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    
    return isTouch && (isMobileUA || isSmallScreen);
  }, []);

  // Handle viewport changes for keyboard detection
  const handleViewportChange = useCallback(() => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight.current - currentHeight;
    
    // Consider keyboard visible if height difference is significant
    const keyboardThreshold = 150;
    const isKeyboardVisible = heightDifference > keyboardThreshold;
    
    setViewportHeight(currentHeight);
    setKeyboardHeight(Math.max(0, heightDifference));
    
    if (isKeyboardVisible !== keyboardVisible) {
      setKeyboardAnimating(true);
      setKeyboardVisible(isKeyboardVisible);
      
      // Clear previous timeout
      if (keyboardAnimationTimeout.current) {
        clearTimeout(keyboardAnimationTimeout.current);
      }
      
      // Mark animation as complete after transition
      keyboardAnimationTimeout.current = setTimeout(() => {
        setKeyboardAnimating(false);
      }, 300);
    }
  }, [keyboardVisible]);

  // Enhanced resize handler with debouncing
  const handleWindowResize = useCallback(() => {
    const newIsMobile = detectMobile();
    setIsMobile(newIsMobile);
    
    if (newIsMobile) {
      handleViewportChange();
    } else {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      setViewportHeight(window.innerHeight);
    }
  }, [detectMobile, handleViewportChange]);

  // Initialize and setup listeners
  useEffect(() => {
    const mobile = detectMobile();
    setIsMobile(mobile);
    initialViewportHeight.current = window.innerHeight;

    if (mobile) {
      // Handle Visual Viewport API if available (better for iOS)
      if (window.visualViewport) {
        const handleVisualViewportChange = () => {
          const heightDifference = window.innerHeight - window.visualViewport.height;
          const isKeyboardVisible = heightDifference > 150;
          
          setKeyboardHeight(heightDifference);
          setViewportHeight(window.visualViewport.height);
          
          if (isKeyboardVisible !== keyboardVisible) {
            setKeyboardAnimating(true);
            setKeyboardVisible(isKeyboardVisible);
            
            if (keyboardAnimationTimeout.current) {
              clearTimeout(keyboardAnimationTimeout.current);
            }
            
            keyboardAnimationTimeout.current = setTimeout(() => {
              setKeyboardAnimating(false);
            }, 300);
          }
        };

        window.visualViewport.addEventListener('resize', handleVisualViewportChange);
        
        return () => {
          window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
          if (keyboardAnimationTimeout.current) {
            clearTimeout(keyboardAnimationTimeout.current);
          }
        };
      } else {
        // Fallback for Android and older browsers
        window.addEventListener('resize', handleWindowResize);
        
        return () => {
          window.removeEventListener('resize', handleWindowResize);
          if (keyboardAnimationTimeout.current) {
            clearTimeout(keyboardAnimationTimeout.current);
          }
        };
      }
    }

    return () => {
      if (keyboardAnimationTimeout.current) {
        clearTimeout(keyboardAnimationTimeout.current);
      }
    };
  }, [detectMobile, handleWindowResize, keyboardVisible]);

  // Input focus handlers
  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    
    // On mobile, scroll to input after a short delay
    if (isMobile) {
      setTimeout(() => {
        // Smooth scroll to ensure input is visible
        const activeElement = document.activeElement;
        if (activeElement && activeElement.scrollIntoView) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, [isMobile]);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  // Keyboard safe area calculation
  const getKeyboardSafeAreaStyle = useCallback(() => {
    if (!isMobile || !keyboardVisible) {
      return {};
    }

    return {
      paddingBottom: `${Math.max(keyboardHeight - 50, 0)}px`,
      transition: keyboardAnimating ? 'padding-bottom 0.3s ease-out' : 'none'
    };
  }, [isMobile, keyboardVisible, keyboardHeight, keyboardAnimating]);

  // Input container positioning for keyboard
  const getInputContainerStyle = useCallback(() => {
    if (!isMobile) {
      return {};
    }

    const baseStyle = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (keyboardVisible && inputFocused) {
      return {
        ...baseStyle,
        transform: `translateY(-${Math.min(keyboardHeight * 0.3, 100)}px)`,
        position: 'fixed',
        bottom: `${Math.max(keyboardHeight - 20, 20)}px`,
        left: '12px',
        right: '12px',
        zIndex: 1000,
      };
    }

    return baseStyle;
  }, [isMobile, keyboardVisible, inputFocused, keyboardHeight]);

  // Prevent body scroll and dragging when keyboard is open
  useEffect(() => {
    if (isMobile && keyboardVisible && inputFocused) {
      // Prevent scrolling and dragging
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.webkitTouchCallout = 'none';
      document.body.classList.add('mobile-keyboard-active');
    } else {
      // Restore normal behavior
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.classList.remove('mobile-keyboard-active');
    }

    return () => {
      // Cleanup all styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.classList.remove('mobile-keyboard-active');
    };
  }, [isMobile, keyboardVisible, inputFocused]);

  return {
    isMobile,
    keyboardVisible,
    keyboardHeight,
    viewportHeight,
    inputFocused,
    keyboardAnimating,
    handleInputFocus,
    handleInputBlur,
    getKeyboardSafeAreaStyle,
    getInputContainerStyle,
    isKeyboardTransitioning: keyboardAnimating
  };
};

export default useMobileKeyboard;