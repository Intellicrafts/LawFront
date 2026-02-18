import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';

/**
 * Premium Toast Notification Component
 * Professional, compact, theme-aware toast used across the entire application.
 * 
 * @param {Object} props
 * @param {'success'|'error'|'warning'|'info'} props.type - Toast type
 * @param {string} props.title - Optional title (bold header)
 * @param {string} props.message - Toast message body
 * @param {number} props.duration - Auto-dismiss time in ms (default 4500)
 * @param {function} props.onClose - Callback when toast is dismissed
 */
const Toast = ({ type = 'info', title, message, duration = 4500, onClose }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Auto-dismiss timer
    timerRef.current = setTimeout(() => {
      onClose && onClose();
    }, duration);

    // Progress bar animation
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle size={15} strokeWidth={2.5} />,
      iconBg: isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200/80',
      progressColor: 'bg-emerald-500',
      accentGlow: isDarkMode ? 'shadow-emerald-500/8' : 'shadow-emerald-500/5',
    },
    error: {
      icon: <AlertCircle size={15} strokeWidth={2.5} />,
      iconBg: isDarkMode ? 'bg-red-500/15' : 'bg-red-50',
      iconColor: 'text-red-500',
      border: isDarkMode ? 'border-red-500/20' : 'border-red-200/80',
      progressColor: 'bg-red-500',
      accentGlow: isDarkMode ? 'shadow-red-500/8' : 'shadow-red-500/5',
    },
    warning: {
      icon: <AlertTriangle size={15} strokeWidth={2.5} />,
      iconBg: isDarkMode ? 'bg-amber-500/15' : 'bg-amber-50',
      iconColor: 'text-amber-500',
      border: isDarkMode ? 'border-amber-500/20' : 'border-amber-200/80',
      progressColor: 'bg-amber-500',
      accentGlow: isDarkMode ? 'shadow-amber-500/8' : 'shadow-amber-500/5',
    },
    info: {
      icon: <Info size={15} strokeWidth={2.5} />,
      iconBg: isDarkMode ? 'bg-blue-500/15' : 'bg-blue-50',
      iconColor: 'text-blue-500',
      border: isDarkMode ? 'border-blue-500/20' : 'border-blue-200/80',
      progressColor: 'bg-blue-500',
      accentGlow: isDarkMode ? 'shadow-blue-500/8' : 'shadow-blue-500/5',
    },
  };

  const c = config[type] || config.info;

  // Handle both old API (message only) and new API (title + message)
  const displayTitle = title || null;
  const displayMessage = message || null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`pointer-events-auto relative flex items-start gap-2.5 
        pl-3 pr-2.5 py-2.5 rounded-xl border ${c.border} 
        backdrop-blur-xl shadow-lg ${c.accentGlow}
        ${isDarkMode
          ? 'bg-[#1A1A1A]/95 ring-1 ring-white/5'
          : 'bg-white/95 ring-1 ring-black/5'}
        min-w-[260px] max-w-[360px] mb-2.5 overflow-hidden`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 p-1.5 rounded-lg ${c.iconBg} ${c.iconColor} mt-0.5`}>
        {c.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        {displayTitle && (
          <p className={`text-[12px] font-semibold leading-tight tracking-wide mb-0.5
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {displayTitle}
          </p>
        )}
        {displayMessage && (
          <p className={`text-[11.5px] leading-snug
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
            ${!displayTitle ? 'font-medium' : ''}`}>
            {displayMessage}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-md transition-all duration-200 mt-0.5
          ${isDarkMode
            ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300'
            : 'hover:bg-black/5 text-gray-400 hover:text-gray-600'}`}
        aria-label="Dismiss notification"
      >
        <X size={13} strokeWidth={2.5} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden rounded-b-xl">
        <div
          className={`h-full ${c.progressColor} opacity-40 transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;