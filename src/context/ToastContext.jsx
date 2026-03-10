import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

// Create context
const ToastContext = createContext();

/**
 * Toast Provider Component
 * Unified toast notification system for the entire application.
 * 
 * Usage:
 *   const { showSuccess, showError, showInfo, showWarning } = useToast();
 *   
 *   // Simple message:
 *   showSuccess('Profile saved successfully!');
 *   
 *   // With title and message:
 *   showSuccess('Profile Updated', 'Your changes have been saved.');
 *   
 *   // With custom duration:
 *   showError('Upload Failed', 'File size too large.', 8000);
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast — supports (type, message), (type, title, message), (type, title, message, duration)
  const showToast = useCallback((type, titleOrMessage, messageOrDuration, maybeDuration) => {
    const id = Date.now() + Math.random();

    let title, message, duration;

    if (typeof messageOrDuration === 'string') {
      // Called as showToast(type, title, message, duration?)
      title = titleOrMessage;
      message = messageOrDuration;
      duration = maybeDuration || 4500;
    } else {
      // Called as showToast(type, message, duration?)
      title = null;
      message = titleOrMessage;
      duration = typeof messageOrDuration === 'number' ? messageOrDuration : 4500;
    }

    setToasts(prev => [...prev, { id, type, title, message, duration }]);

    // Safety: auto-remove after duration + buffer
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, (duration || 4500) + 500);

    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods — all support (message), (title, message), (title, message, duration)
  const showSuccess = useCallback((titleOrMsg, msgOrDuration, duration) => {
    return showToast('success', titleOrMsg, msgOrDuration, duration);
  }, [showToast]);

  const showError = useCallback((titleOrMsg, msgOrDuration, duration) => {
    return showToast('error', titleOrMsg, msgOrDuration, duration);
  }, [showToast]);

  const showInfo = useCallback((titleOrMsg, msgOrDuration, duration) => {
    return showToast('info', titleOrMsg, msgOrDuration, duration);
  }, [showToast]);

  const showWarning = useCallback((titleOrMsg, msgOrDuration, duration) => {
    return showToast('warning', titleOrMsg, msgOrDuration, duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning, showToast, removeToast }}>
      {children}
      {/* Toast container — top-right, below navbar, properly stacked */}
      <div
        className="fixed top-[70px] right-4 z-[9999] flex flex-col items-end pointer-events-none"
        style={{ maxHeight: 'calc(100vh - 90px)', overflowY: 'hidden' }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;