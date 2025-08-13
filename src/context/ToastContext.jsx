import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// Create context
const ToastContext = createContext();

/**
 * Toast Provider Component
 * Manages toast notifications throughout the application
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = (type, message, duration = 5000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, type, message, duration }]);
    return id;
  };

  // Remove a toast by ID
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Convenience methods
  const showSuccess = (message, duration) => showToast('success', message, duration);
  const showError = (message, duration) => showToast('error', message, duration);
  const showInfo = (message, duration) => showToast('info', message, duration);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
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