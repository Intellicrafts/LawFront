// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/themeSlice';
import { getThemeColors } from '../utils/theme';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  
  // Theme toggle function
  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };
  
  // Set specific theme
  const setThemeMode = (themeMode) => {
    dispatch(setTheme(themeMode));
  };
  
  // Get current theme colors
  const colors = getThemeColors(mode === 'dark');
  
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
  
  // Context value
  const value = {
    isDark: mode === 'dark',
    mode,
    toggleTheme: toggleThemeMode,
    setTheme: setThemeMode,
    colors
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;