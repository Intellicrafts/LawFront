// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize synchronously so first render is correct (no guest-UI flash for logged-in users)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('auth_token'));

  // Optional: implement login/logout handlers here
  const login = (token) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);

    // Dispatch custom event for onboarding tour
    window.dispatchEvent(new CustomEvent('loginSuccess'));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  // Sync state with other parts of the app (e.g. Navbar, external login flows)
  React.useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    };

    const handleAuthChange = (e) => {
      if (e.detail && typeof e.detail.authenticated === 'boolean') {
        setIsAuthenticated(e.detail.authenticated);
      } else {
        syncAuth();
      }
    };

    window.addEventListener('auth-status-changed', handleAuthChange);
    window.addEventListener('storage', syncAuth); // For cross-tab sync

    return () => {
      window.removeEventListener('auth-status-changed', handleAuthChange);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the context easily
export const useAuth = () => useContext(AuthContext);
