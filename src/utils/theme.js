// src/utils/theme.js

/**
 * Initialize theme based on localStorage or system preference
 * This function applies the appropriate class to the document element
 */
export const initializeTheme = () => {
  // On page load or when changing themes, apply the correct theme class
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || 
       (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

/**
 * Get CSS variables for the current theme
 * This can be used to apply theme colors to non-Tailwind elements
 */
export const getThemeColors = (isDark = false) => {
  return {
    // Background colors
    background: isDark ? '#111827' : '#ffffff',
    backgroundSecondary: isDark ? '#1f2937' : '#f9fafb',
    backgroundTertiary: isDark ? '#374151' : '#f3f4f6',
    
    // Text colors
    textPrimary: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#d1d5db' : '#4b5563',
    textTertiary: isDark ? '#9ca3af' : '#6b7280',
    
    // Border colors
    border: isDark ? '#374151' : '#e5e7eb',
    borderHover: isDark ? '#4b5563' : '#d1d5db',
    
    // Brand colors (unchanged by theme)
    primary: '#22577a',
    primaryLight: '#5cacde',
    primaryDark: '#1a4057',
    
    // Accent colors
    accent: isDark ? '#60a5fa' : '#3b82f6',
    accentHover: isDark ? '#3b82f6' : '#2563eb',
    
    // Status colors
    success: isDark ? '#10b981' : '#059669',
    warning: isDark ? '#f59e0b' : '#d97706',
    error: isDark ? '#ef4444' : '#dc2626',
    info: isDark ? '#3b82f6' : '#2563eb',
  };
};

/**
 * Apply theme colors to an element's style
 * @param {HTMLElement} element - The element to apply colors to
 * @param {boolean} isDark - Whether to apply dark theme colors
 */
export const applyThemeToElement = (element, isDark) => {
  if (!element) return;
  
  const colors = getThemeColors(isDark);
  
  // Apply colors as CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    element.style.setProperty(`--color-${key}`, value);
  });
};