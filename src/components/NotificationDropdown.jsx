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
  userId
}) => {
  // Get appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
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
    switch(type) {
      case 'success':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
      case 'appointment':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
      case 'message':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
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
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none relative"
        onClick={onToggle}
        aria-label="Notifications"
        whileTap={{ scale: 0.95 }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        {notificationsCount > 0 ? (
          <FaBell size={20} className="text-blue-500 dark:text-blue-400" />
        ) : (
          <Bell size={20} />
        )}
        
        {notificationsLoading ? (
          <motion.span 
            className="absolute -top-1 -right-1 h-5 w-5 bg-gray-300 dark:bg-gray-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Loader size={10} className="animate-spin" />
          </motion.span>
        ) : notificationsCount > 0 ? (
          <motion.span 
            className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm"
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
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750">
          <div className="flex items-center">
            <FaBell size={16} className="text-blue-600 dark:text-blue-400 mr-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</p>
            {notificationsCount > 0 && (
              <motion.span 
                className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {notificationsCount} new
              </motion.span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {notificationsCount > 0 && (
              <motion.button 
                onClick={onMarkAllAsRead}
                className="text-xs px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-colors flex items-center shadow-sm"
                disabled={notificationsLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCheckCircle className="mr-1" size={12} />
                Mark all read
              </motion.button>
            )}
            {notificationsLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader size={14} className="text-blue-500" />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Content */}
        {notificationsError ? (
          <motion.div 
            className="px-4 py-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3 shadow-inner"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: 3, duration: 1 }}
            >
              <AlertCircle size={28} className="text-red-500 dark:text-red-400" />
            </motion.div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{notificationsError}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">There was a problem loading your notifications</p>
            <motion.button 
              onClick={() => onRefresh(userId)}
              className="mt-1 px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try again
            </motion.button>
          </motion.div>
        ) : notifications.length === 0 ? (
          <motion.div 
            className="px-4 py-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 shadow-inner"
              animate={{ 
                y: [0, -5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                repeatType: "reverse"
              }}
            >
              <Bell size={32} className="text-gray-400 dark:text-gray-500" />
            </motion.div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No notifications yet</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We'll notify you when something arrives</p>
          </motion.div>
        ) : (
          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification, index) => (
              <motion.li 
                key={notification.id} 
                className={`px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
                  ${!notification.read_at ? 'bg-blue-50/70 dark:bg-blue-900/10' : ''}`}
                onClick={() => onNotificationClick(notification)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
              >
                <div className={`p-2 rounded-full flex-shrink-0 ${getNotificationStyle(notification.type)} shadow-sm`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 text-sm flex-1">
                  <div className="flex justify-between">
                    <p className="text-gray-800 dark:text-gray-200 font-medium line-clamp-2">
                      {notification.message || notification.title || notification.description}
                    </p>
                    {!notification.read_at && (
                      <motion.span 
                        className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      ></motion.span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="mr-1" />
                      {formatDate(notification.created_at)}
                    </div>
                    {notification.link && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                        View details
                        <ChevronRight size={14} className="ml-1" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 text-sm flex justify-between items-center">
          <motion.button 
            onClick={() => onRefresh(userId)}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
            disabled={notificationsLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={notificationsLoading ? { rotate: 360 } : {}}
              transition={notificationsLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            Refresh
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/notifications" 
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-medium transition-colors shadow-sm flex items-center" 
              onClick={onToggle}
            >
              View all notifications
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </motion.div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;