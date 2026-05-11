/**
 * tokenStorage.js
 * -----------------------------------------------------------------------------
 * Thin, safe wrapper over `localStorage` for the auth token and cached user.
 *
 * Why a wrapper?
 *   - One place that knows the localStorage KEYS — change them here, not in
 *     every component.
 *   - Defensive JSON.parse: corrupt user blobs don't crash the app.
 *   - Emits a `auth-status-changed` CustomEvent on every set/clear so the
 *     navbar, route guards and AuthContext stay in sync without coupling.
 *   - SSR-safe: every call no-ops when `window` is undefined.
 * -----------------------------------------------------------------------------
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const EVENT_NAME = 'auth-status-changed';

/** True iff `window` exists (browser) AND localStorage is reachable. */
function hasStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

/** Fire a CustomEvent so listeners (AuthContext, Navbar, ...) update at once. */
function broadcast(authenticated, user = null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: { authenticated, user } }),
  );
}

export const tokenStorage = {
  /** ── Token ─────────────────────────────────────────────────────────────── */
  setToken(token) {
    if (!hasStorage() || !token) return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    if (!hasStorage()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  /** ── Cached user ───────────────────────────────────────────────────────── */
  setUser(user) {
    if (!hasStorage() || !user) return;
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* serialization failure is non-fatal */
    }
  },
  getUser() {
    if (!hasStorage()) return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupt blob → drop it so subsequent reads don't keep failing.
      window.localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  /** ── Composite ─────────────────────────────────────────────────────────── */
  /** Persist a successful auth response and notify the app. */
  save(token, user, { broadcast: shouldBroadcast = true } = {}) {
    this.setToken(token);
    if (user) this.setUser(user);
    if (shouldBroadcast) broadcast(true, user);
  },

  /** Erase everything and (optionally) notify the app it's now logged out. */
  clear({ broadcast: shouldBroadcast = true } = {}) {
    if (!hasStorage()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    if (shouldBroadcast) broadcast(false, null);
  },

  /** Convenience boolean: do we have a token in storage? */
  isAuthenticated() {
    return !!this.getToken();
  },
};

export const AUTH_EVENT_NAME = EVENT_NAME;
