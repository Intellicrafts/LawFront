import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';

const Toast = ({ type = 'info', message, duration = 5000, onClose }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={16} className="text-emerald-500" />,
          border: 'border-emerald-500/20',
          bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
          glow: 'shadow-emerald-500/10'
        };
      case 'error':
        return {
          icon: <AlertCircle size={16} className="text-red-500" />,
          border: 'border-red-500/20',
          bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50',
          glow: 'shadow-red-500/10'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={16} className="text-amber-500" />,
          border: 'border-amber-500/20',
          bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50',
          glow: 'shadow-amber-500/10'
        };
      case 'info':
      default:
        return {
          icon: <Info size={16} className="text-blue-500" />,
          border: 'border-blue-500/20',
          bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
          glow: 'shadow-blue-500/10'
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 px-3 py-2.5 rounded-xl border ${style.border} ${style.bg} backdrop-blur-md shadow-lg ${style.glow} min-w-[280px] max-w-[380px] mb-3`}
    >
      <div className="flex-shrink-0">
        {style.icon}
      </div>

      <p className={`flex-1 text-[13px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} leading-snug tracking-wide`}>
        {message}
      </p>

      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-500'
          }`}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export default Toast;