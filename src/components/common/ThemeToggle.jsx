import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle - A reusable component for toggling between light and dark themes
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='default'] - Size of the toggle button ('small', 'default', 'large')
 * @param {string} [props.variant='default'] - Visual style ('default', 'minimal', 'icon-only')
 * @param {string} [props.className] - Additional CSS classes
 */
const ThemeToggle = ({ 
  size = 'default', 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { isDark, toggleTheme } = useTheme();
  
  // Size classes
  const sizeClasses = {
    small: 'p-1 text-sm',
    default: 'p-2',
    large: 'p-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    default: `rounded-full transition-all duration-200 
              ${isDark 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`,
    minimal: 'transition-colors duration-200',
    'icon-only': `rounded-full transition-all duration-200 
                  ${isDark 
                    ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`
  };
  
  // Icon sizes
  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  };
  
  return (
    <button
      onClick={toggleTheme}
      className={`focus:outline-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      {...props}
    >
      {isDark ? (
        <Sun size={iconSizes[size]} className="transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={iconSizes[size]} className="transition-transform duration-300 hover:rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;