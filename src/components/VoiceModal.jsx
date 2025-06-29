import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

const VoiceModal = ({ isOpen, onClose }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  // State management
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'entering', 'entered', 'exiting'
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
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      handleCloseModal();
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
        {/* Simple visualization */}
        <div className={`relative w-[85vw] h-[90vw] sm:w-[550px] sm:h-[550px] md:w-[600px] md:h-[600px] rounded-full overflow-hidden shadow-xl ${
          isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8F9FA]'
        }`}>
          <img
            src="/modal.gif"
            alt="Voice activity visualization"
            className={`w-full h-full object-cover ${isDarkMode ? 'opacity-90 contrast-125 brightness-75' : 'opacity-100'}`}
          />
          
          {/* Close button */}
          <button
            onClick={handleCloseWithAnimation}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            className={`absolute top-8 right-8 w-12 h-12 rounded-full z-50 
              transition-all duration-300 flex items-center justify-center
              ${isDarkMode 
                ? 'bg-gray-800/80 text-white hover:bg-gray-700/80' 
                : 'bg-white/80 text-gray-800 hover:bg-gray-100/80'
              } focus:outline-none shadow-lg`}
            aria-label="Close Voice Modal"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;