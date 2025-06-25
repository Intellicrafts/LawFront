import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

const VoiceModal = ({ isOpen, onClose }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  // State management
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'entering', 'entered', 'exiting'
  const [isClosing, setIsClosing] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  
  // Create ref
  const modalContentRef = useRef(null);
  
  // Handle modal opening animation
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      setAnimationState('entering');
      setTimeout(() => {
        setAnimationState('entered');
      }, 50); // Small delay to ensure CSS transition works
    } else {
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure body scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleCloseWithAnimation();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCloseModal = useCallback(() => {
    // Call the onClose prop to properly close the modal
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Enhanced close handler with animation
  const handleCloseWithAnimation = useCallback(() => {
    setAnimationState('exiting');
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      handleCloseModal();
      setIsClosing(false);
    }, 400); // Match this with the CSS transition duration
  }, [handleCloseModal]);
  
  // Handle click outside
  const handleBackdropClick = useCallback((e) => {
    // Only close if clicking on the backdrop, not the modal content
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      handleCloseWithAnimation();
    }
  }, [handleCloseWithAnimation]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        animationState === 'entering' ? 'opacity-0' : 
        animationState === 'entered' ? 'opacity-100' : 
        animationState === 'exiting' ? 'opacity-0' : 'opacity-0'
      } ${isDarkMode ? 'bg-[#0F172A]/95' : 'bg-[#F8F9FA]/95'}`}
      onClick={handleBackdropClick}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div 
        ref={modalContentRef}
        className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
          animationState === 'entering' ? 'scale-95 opacity-0 translate-y-4' : 
          animationState === 'entered' ? 'scale-100 opacity-100 translate-y-0' : 
          animationState === 'exiting' ? 'scale-95 opacity-0 translate-y-4' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Main visualization */}
        <div className={`relative w-[85vw] h-[90vw] sm:w-[550px] sm:h-[550px] md:w-[600px] md:h-[600px] rounded-full overflow-hidden shadow-0xl ${
          isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8F9FA]'
        }`}>
          <img
            src="/modal.gif"
            alt="Voice activity visualization"
            className={`w-full h-full object-cover ${isDarkMode ? 'opacity-90 contrast-125 brightness-75' : 'opacity-100'}`}
          />
          
          {/* Enhanced close button with hover effects */}
          <button
            onClick={handleCloseWithAnimation}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full z-50 
              transition-all duration-300 flex items-center justify-center
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              shadow-lg hover:shadow-xl hover:scale-110`}
            style={{
              boxShadow: buttonHover 
                ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 0 2px rgba(59, 130, 246, 0.3)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            aria-label="Close Voice Assistant"
          >
            <X className={`w-5 h-5 transition-transform duration-300 ${buttonHover ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;