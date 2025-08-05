// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Example: load auth status from localStorage or a token check
  useEffect(() => {
    const token = localStorage.getItem('token'); // or your auth logic
    setIsAuthenticated(!!token);
  }, []);

  // Optional: implement login/logout handlers here
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    
    // Dispatch custom event for onboarding tour
    window.dispatchEvent(new CustomEvent('loginSuccess'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the context easily
export const useAuth = () => useContext(AuthContext);
