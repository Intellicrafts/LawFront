import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/themeSlice';

/**
 * Custom hook for managing dark mode
 * 
 * @returns {Object} Dark mode utilities
 * @returns {boolean} isDark - Whether dark mode is active
 * @returns {string} mode - Current theme mode ('light' or 'dark')
 * @returns {Function} toggle - Function to toggle between light and dark mode
 * @returns {Function} setMode - Function to set a specific mode
 * @returns {boolean} isSystemDark - Whether the system prefers dark mode
 */
export const useDarkMode = () => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  
  // Check if system prefers dark mode
  const isSystemDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  
  // Toggle between light and dark mode
  const toggle = () => {
    dispatch(toggleTheme());
  };
  
  // Set a specific mode
  const setMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      dispatch(setTheme(newMode));
    }
  };
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change theme if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      }
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [dispatch]);
  
  return {
    isDark: mode === 'dark',
    mode,
    toggle,
    setMode,
    isSystemDark
  };
};

export default useDarkMode;