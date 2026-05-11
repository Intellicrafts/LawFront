/**
 * AuthContext.js
 * -----------------------------------------------------------------------------
 * One React Context that every component can subscribe to for the current
 * authentication state. Source of truth = `tokenStorage` (localStorage), but
 * exposed reactively so navbar / route guards re-render on changes.
 *
 *  - `isAuthenticated` — boolean
 *  - `user`            — the cached user object (or null)
 *  - `login(token, user)` — convenience wrapper around tokenStorage.save
 *  - `logout()`        — clears storage + delegates to authService for token
 *                        revocation on the server
 *
 * Reactivity sources:
 *   1. `auth-status-changed` CustomEvent — fired by tokenStorage on every
 *      save/clear (works in-tab).
 *   2. `storage` event — for cross-tab sync (logout in one tab → others react).
 * -----------------------------------------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStorage, AUTH_EVENT_NAME } from '../utils/auth/tokenStorage';
import authService from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialise SYNCHRONOUSLY from localStorage so first render is already correct
  // (no "guest UI flash" for already-logged-in users).
  const [isAuthenticated, setIsAuthenticated] = useState(() => tokenStorage.isAuthenticated());
  const [user, setUser] = useState(() => tokenStorage.getUser());

  /* ── Keep React state in sync with storage ─────────────────────────────── */
  useEffect(() => {
    const refresh = () => {
      setIsAuthenticated(tokenStorage.isAuthenticated());
      setUser(tokenStorage.getUser());
    };

    // In-tab event from tokenStorage.save/clear or any other module.
    const onAuthChanged = (event) => {
      const detail = event?.detail;
      if (detail && typeof detail.authenticated === 'boolean') {
        setIsAuthenticated(detail.authenticated);
        setUser(detail.user ?? tokenStorage.getUser());
      } else {
        refresh();
      }
    };

    // Cross-tab sync: another tab logged in/out → react here.
    const onStorage = (e) => {
      if (e.key === 'auth_token' || e.key === 'user') refresh();
    };

    window.addEventListener(AUTH_EVENT_NAME, onAuthChanged);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  /* ── Convenience helpers exposed to the rest of the app ────────────────── */
  const login = useCallback((token, userObj) => {
    tokenStorage.save(token, userObj, { broadcast: true });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout(); // best-effort: revoke token on server + clear local
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Convenience hook for consumers. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>.');
  return ctx;
};
