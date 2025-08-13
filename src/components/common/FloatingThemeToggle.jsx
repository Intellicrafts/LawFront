import React, { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';

/**
 * A floating theme toggle button that appears after scrolling
 */
const FloatingThemeToggle = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-40 transition-all duration-300 transform animate-fade-in">
      <DarkModeToggle 
        size="lg" 
        variant="icon-only" 
        className="shadow-lg hover:shadow-xl"
      />
    </div>
  );
};

export default FloatingThemeToggle;

// Add this to your tailwind.config.js to support the animation:
// animation: {
//   'fade-in': 'fadeIn 0.3s ease-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0', transform: 'translateY(10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// },