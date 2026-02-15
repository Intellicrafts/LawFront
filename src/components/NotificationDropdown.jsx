import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertCircle,
  Loader,
  Settings,
  Calendar,
  MessageSquare,
  User,
  FileText,
  CheckCircle,
  Clock,
  Mail,
  Shield,
  Award,
  Info,
  ChevronRight
} from 'lucide-react';
import { FaCheckCircle, FaBell, FaRegBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced Notification Dropdown Component
 * 
 * A professional-looking notification dropdown with improved styling and functionality
 */
const NotificationDropdown = ({
  notifications,
  notificationsCount,
  notificationsLoading,
  notificationsError,
  isOpen,
  onToggle,
  onMarkAllAsRead,
  onRefresh,
  onNotificationClick,
  userId,
  darkMode
}) => {
  // Get appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <AlertCircle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      case 'appointment':
        return <Calendar size={18} />;
      case 'message':
        return <MessageSquare size={18} />;
      case 'user':
        return <User size={18} />;
      case 'document':
        return <FileText size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  // Get appropriate background color based on notification type
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
      case 'appointment':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
      case 'message':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Animation variants for the notification panel
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -5,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#3A3A3A] focus:outline-none relative"
        onClick={onToggle}
        aria-label="Notifications"
        whileTap={{ scale: 0.95 }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        {notificationsCount > 0 ? (
          <FaBell size={20} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <Bell size={20} />
        )}

        {notificationsLoading ? (
          <motion.span
            className="absolute -top-1 -right-1 h-5 w-5 bg-gray-400 dark:bg-gray-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Loader size={10} className="animate-spin" />
          </motion.span>
        ) : notificationsCount > 0 ? (
          <motion.span
            className="absolute -top-1 -right-1 h-5 w-5 bg-gray-600 dark:bg-gray-500 text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {notificationsCount > 9 ? '9+' : notificationsCount}
          </motion.span>
        ) : null}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden border ${darkMode
              ? 'bg-neutral-900 border-white/10 shadow-black/50'
              : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className={`px-4 py-2.5 border-b flex justify-between items-center ${darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'
              }`}>
              <div className="flex items-center gap-2">
                <Bell size={14} className={darkMode ? 'text-slate-400' : 'text-slate-900'} />
                <p className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alerts</p>
                {notificationsCount > 0 && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-md shadow-lg ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                    {notificationsCount}
                  </span>
                )}
              </div>
              {notificationsCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className={`text-[9px] font-black uppercase tracking-wider transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Content */}
            {notificationsError ? (
              <div className="px-4 py-8 text-center">
                <AlertCircle size={24} className="text-red-500 mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Synchronicity Failure</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell size={28} className="text-slate-200 dark:text-white/5 mx-auto mb-3" />
                <p className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Inbox Clear</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1">Zero pending alerts</p>
              </div>
            ) : (
              <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map((n, index) => (
                  <motion.li
                    key={n.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer
                  ${!n.read_at ? (darkMode ? 'bg-white/[0.03]' : 'bg-slate-500/[0.03]') : ''}`}
                    onClick={() => onNotificationClick(n)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${getNotificationStyle(n.type)}`}>
                      {React.cloneElement(getNotificationIcon(n.type), { size: 14 })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-[11px] font-bold leading-tight mb-1 truncate line-clamp-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {n.message || n.title}
                        </p>
                        {!n.read_at && (
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 shadow-lg ${darkMode ? 'bg-white shadow-white/50' : 'bg-slate-900 shadow-slate-900/50'}`} />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <Clock size={10} />
                        {formatDate(n.created_at)}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Footer */}
            <div className={`px-4 py-2.5 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <Link
                to="/notifications"
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20'}`}
                onClick={onToggle}
              >
                Dossier View
                <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;