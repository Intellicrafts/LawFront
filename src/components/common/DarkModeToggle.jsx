import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { Sun, Moon } from 'lucide-react';

/**
 * A reusable dark mode toggle button component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the toggle button ('sm', 'md', 'lg')
 * @param {string} [props.variant='default'] - Visual style ('default', 'minimal', 'icon-only')
 * @param {string} [props.className] - Additional CSS classes
 */
const DarkModeToggle = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const isDark = mode === 'dark';
  
  // Size classes
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3 text-lg'
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
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
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

export default DarkModeToggle;