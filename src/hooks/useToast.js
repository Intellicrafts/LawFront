import { useState, useCallback } from 'react';

const useToast = (initialState = { show: false, type: 'info', title: '', message: '', duration: 5000 }) => {
  const [toast, setToast] = useState(initialState);

  const showToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    setToast({
      show: true,
      type,
      title,
      message,
      duration
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((title, message = '', duration = 5000) => {
    showToast({ type: 'success', title, message, duration });
  }, [showToast]);

  const showError = useCallback((title, message = '', duration = 5000) => {
    showToast({ type: 'error', title, message, duration });
  }, [showToast]);

  const showWarning = useCallback((title, message = '', duration = 5000) => {
    showToast({ type: 'warning', title, message, duration });
  }, [showToast]);

  const showInfo = useCallback((title, message = '', duration = 5000) => {
    showToast({ type: 'info', title, message, duration });
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;