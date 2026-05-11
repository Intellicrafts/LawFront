/**
 * httpClient.js
 * -----------------------------------------------------------------------------
 * ONE axios instance for the whole app.
 *
 * Why centralised?
 *   - `baseURL` is set ONCE here. Every feature can write `apiClient.post('/login')`
 *     without worrying about whether the backend expects `/api/` or not.
 *   - Request interceptor attaches the Bearer token automatically.
 *   - Response interceptor distinguishes "token expired" 401s from "wrong
 *     credentials" 401s, so a failed login attempt no longer logs the user out.
 *   - A safe `getCsrfCookie()` helper exists for Laravel Sanctum which is the
 *     ONLY auth call that does NOT use the /api prefix.
 *
 * URL resolution rules:
 *   API_ORIGIN = config.API_BASE_URL with any trailing `/` or `/api` stripped.
 *   apiClient.baseURL = `${API_ORIGIN}/api`  → all paths are joined to /api/...
 *   Sanctum CSRF      = `${API_ORIGIN}/sanctum/csrf-cookie` (NOT under /api)
 * -----------------------------------------------------------------------------
 */

import axios from 'axios';
import config from '../config';
import { SANCTUM_CSRF_PATH } from './endpoints';
import { tokenStorage } from '../utils/auth/tokenStorage';

/**
 * Normalise the API origin from config:
 *   - drop a trailing `/api` if someone put it in .env by mistake
 *   - drop any trailing slash
 * Result is always: `protocol://host[:port]` (no path, no slash).
 */
function resolveOrigin() {
  const raw = String(config.API_BASE_URL || 'http://127.0.0.1:8000').trim();
  return raw.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
}

export const API_ORIGIN = resolveOrigin();

/**
 * The shared axios instance.
 * - 15 s timeout: long enough for slow networks, short enough to surface real failures.
 * - withCredentials: required so Sanctum's XSRF cookie is sent back on subsequent calls.
 */
export const apiClient = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: attach Bearer token if we have one ──────────────────
apiClient.interceptors.request.use(
  (cfg) => {
    const token = tokenStorage.getToken();
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error) => Promise.reject(error),
);

/**
 * Public auth endpoints legitimately answer 401 for "bad credentials".
 * We must NOT wipe an existing session in those cases — only treat a 401 as
 * "expired token" when it comes from a protected endpoint.
 */
const PUBLIC_AUTH_PATH_FRAGMENTS = ['/login', '/register', '/auth/google', '/password/', '/logout'];

function isPublicAuthCall(error) {
  const url = String(error?.config?.url || '').toLowerCase();
  return PUBLIC_AUTH_PATH_FRAGMENTS.some((p) => url.includes(p));
}

// ── Response interceptor: friendly error normalisation + smart 401 handling ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !isPublicAuthCall(error)) {
      // Protected call → token gone/expired → fully clear local session and let
      // the AuthContext listener react. (Public auth 401s like "wrong password"
      // are LEFT ALONE so we don't kick out an already-logged-in user.)
      tokenStorage.clear({ broadcast: true });
    }

    // Convert "no response at all" (CORS / DNS / offline) into a clean message.
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  },
);

/**
 * Fetch the Laravel Sanctum CSRF cookie. This is the ONLY auth call that does
 * not live under `/api`, so it bypasses the apiClient baseURL.
 *
 * Returns the underlying axios promise so callers can `await` it before
 * issuing the protected POST that needs the XSRF cookie.
 */
export function getCsrfCookie() {
  return axios.get(`${API_ORIGIN}${SANCTUM_CSRF_PATH}`, {
    withCredentials: true,
    timeout: 10000,
    headers: { Accept: 'application/json' },
  });
}
