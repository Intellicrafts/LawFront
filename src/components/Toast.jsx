import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Toast notification component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Toast type: 'success', 'error', 'info'
 * @param {string} props.message - Toast message
 * @param {number} props.duration - Duration in ms before auto-close (default: 5000)
 * @param {Function} props.onClose - Function to call when toast is closed
 */
const Toast = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Wait for fade-out animation
  };

  // Define styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-emerald-500 text-lg" />,
          bg: isDarkMode ? 'bg-slate-800' : 'bg-white',
          border: isDarkMode ? 'border-slate-700' : 'border-emerald-100',
          text: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
          shadow: 'shadow-lg shadow-emerald-100/20'
        };
      case 'error':
        return {
          icon: <FaExclamationTriangle className="text-red-500 text-lg" />,
          bg: isDarkMode ? 'bg-slate-800' : 'bg-white',
          border: isDarkMode ? 'border-slate-700' : 'border-red-100',
          text: isDarkMode ? 'text-red-400' : 'text-red-700',
          shadow: 'shadow-lg shadow-red-100/20'
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-blue-500 text-lg" />,
          bg: isDarkMode ? 'bg-slate-800' : 'bg-white',
          border: isDarkMode ? 'border-slate-700' : 'border-blue-100',
          text: isDarkMode ? 'text-blue-400' : 'text-blue-700',
          shadow: 'shadow-lg shadow-blue-100/20'
        };
    }
  };

  const { icon, bg, border, text, shadow } = getTypeStyles();

  return (
    <div 
      className={`fixed top-6 right-6 z-50 flex items-center p-4 rounded-lg ${shadow} border ${border} ${bg} transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3 flex-shrink-0">
          {icon}
        </div>
        <div className="mr-6">
          <p className={`font-medium ${text}`}>{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${text} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toast;