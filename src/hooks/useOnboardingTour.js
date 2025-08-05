// src/hooks/useOnboardingTour.js
import { useState, useEffect } from 'react';
import { tokenManager } from '../api/apiService';

export const useOnboardingTour = () => {
  const [showTour, setShowTour] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and if it's their first time
    const checkFirstLogin = () => {
      const isAuthenticated = tokenManager.isAuthenticated();
      const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
      const lastLoginCheck = localStorage.getItem('lastLoginCheck');
      const currentTime = Date.now();

      // If user is authenticated and hasn't seen the tour
      if (isAuthenticated && !hasSeenTour) {
        // Check if this is a fresh login (within last 5 seconds)
        if (!lastLoginCheck || (currentTime - parseInt(lastLoginCheck)) < 5000) {
          setIsFirstLogin(true);
          setShowTour(true);
        }
      }

      // Update last login check
      if (isAuthenticated) {
        localStorage.setItem('lastLoginCheck', currentTime.toString());
      }
    };

    // Initial check
    checkFirstLogin();

    // Listen for authentication changes
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token') {
        checkFirstLogin();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for login success
    const handleLoginSuccess = () => {
      checkFirstLogin();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  const startTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
    setIsFirstLogin(false);
  };

  const completeTour = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setShowTour(false);
    setIsFirstLogin(false);
  };

  const resetTour = () => {
    localStorage.removeItem('hasSeenOnboardingTour');
    setShowTour(true);
  };

  return {
    showTour,
    isFirstLogin,
    startTour,
    closeTour,
    completeTour,
    resetTour
  };
};