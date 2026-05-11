/**
 * authService.js
 * -----------------------------------------------------------------------------
 * The ONLY module the UI talks to for authentication.
 *
 * Design goals:
 *   - One function per user-visible action (register, loginWithPassword, ...).
 *   - Every function returns a NORMALIZED shape: { token, user, raw } where
 *     `raw` is the original backend body so callers can read extra fields
 *     (e.g. `lawyer` block) if needed.
 *   - Every function throws on failure; callers just `try/catch`.
 *   - NO direct axios usage, NO hardcoded URLs — everything goes through
 *     `apiClient` and `AUTH_ENDPOINTS`.
 *   - CSRF cookie is fetched automatically before any state-changing request
 *     so callers don't have to remember.
 *
 * Login methods supported:
 *   1. Email + Password .................. loginWithPassword
 *   2. Email OTP (passwordless) .......... sendLoginOtp + verifyLoginOtp
 *   3. Google OAuth (Continue with Google) loginWithGoogle (access_token path)
 *   4. Google One Tap ..................... loginWithGoogle (id_token path)
 *      → Both 3 and 4 use the SAME backend endpoint and the SAME FE function;
 *        the backend (`GoogleAuthController`) detects the token type itself.
 *
 * Plus: register, logout, refresh, password reset.
 * -----------------------------------------------------------------------------
 */

import { apiClient, getCsrfCookie } from './httpClient';
import { AUTH_ENDPOINTS } from './endpoints';
import { tokenStorage } from '../utils/auth/tokenStorage';

/* ───────────────────────────── Response normalisation ──────────────────────── */

/**
 * Backend sometimes returns FLAT: { access_token, user, ... }
 * Sometimes WRAPPED: { data: { token, user, ... } }   (Google flow uses this)
 * This helper turns both into one shape so the UI never has to care.
 *
 * @param {object} body Raw response body from any auth endpoint.
 * @returns {{ token: string|null, user: object|null, raw: object }}
 */
export function extractAuthPayload(body) {
  if (!body || typeof body !== 'object') {
    return { token: null, user: null, raw: body };
  }
  const wrap =
    body.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? body.data
      : null;

  const token =
    body.access_token ||
    body.token ||
    (wrap && (wrap.access_token || wrap.token)) ||
    null;

  const user = body.user || (wrap && wrap.user) || null;
  return { token, user, raw: body };
}

/**
 * Persist a successful auth response: stash token+user, broadcast event, return
 * the normalised payload so the caller can navigate / show toast.
 *
 * @throws Error if the backend response didn't actually contain a token.
 */
function persistAndReturn(body) {
  const payload = extractAuthPayload(body);
  if (!payload.token) {
    const err = new Error('Authentication response missing access token.');
    err.code = 'NO_TOKEN_IN_RESPONSE';
    throw err;
  }
  tokenStorage.save(payload.token, payload.user, { broadcast: true });
  return payload;
}

/* ─────────────────────────────────── Register ─────────────────────────────── */

/**
 * Register a new user (client or lawyer).
 *
 * @param {object} input
 * @param {string} input.name                    Full name.
 * @param {string} input.email
 * @param {string} input.phone
 * @param {string} input.password
 * @param {string} input.password_confirmation
 * @param {1|2|'personal'|'business'} input.account_type  1=client, 2=lawyer.
 * @param {string} [input.enrollment_no]         Required if account_type=2.
 * @param {string} [input.specialization]        Required if account_type=2.
 * @param {number} [input.years_of_experience]   Optional, lawyer profile.
 * @param {number} [input.consultation_fee]      Optional, lawyer profile.
 * @returns {Promise<{token: string, user: object, raw: object}>}
 */
export async function register(input) {
  await getCsrfCookie();
  const { data } = await apiClient.post(AUTH_ENDPOINTS.REGISTER, input);
  return persistAndReturn(data);
}

/* ────────────────────────── 1. Email + Password login ─────────────────────── */

/**
 * Standard email + password login.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object, raw: object}>}
 */
export async function loginWithPassword(email, password) {
  await getCsrfCookie();
  const { data } = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
    email: email.trim().toLowerCase(),
    password,
  });
  return persistAndReturn(data);
}

/* ─────────────────────────── 2. Email OTP login flow ──────────────────────── */

/**
 * Step 1 of the passwordless flow: ask the backend to e-mail a 6-digit OTP.
 *
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string, user_name?: string }>}
 *          The raw backend body (no token here, token only comes from verify).
 */
export async function sendLoginOtp(email) {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.OTP_SEND, {
    email: email.trim().toLowerCase(),
  });
  return data;
}

/**
 * Step 2 of the passwordless flow: submit the 6-digit OTP. On success the user
 * is fully authenticated (token + user are saved).
 *
 * @param {string} email
 * @param {string} otp   Exactly 6 digits.
 * @returns {Promise<{token: string, user: object, raw: object}>}
 */
export async function verifyLoginOtp(email, otp) {
  await getCsrfCookie();
  const { data } = await apiClient.post(AUTH_ENDPOINTS.OTP_VERIFY, {
    email: email.trim().toLowerCase(),
    otp,
  });
  return persistAndReturn(data);
}

/* ────────────────── 3 & 4. Google OAuth ("Continue with Google" + One Tap) ── */

/**
 * Sign in or sign up with Google.
 *
 * Accepts EITHER:
 *   - An access_token from the popup flow (`useGoogleLogin().tokenResponse.access_token`)
 *   - An ID token (JWT) from One Tap (`useGoogleOneTapLogin().credential`)
 * The backend GoogleAuthController detects which one it received and validates
 * it with Google before issuing our own Sanctum personal access token.
 *
 * @param {string} googleToken access_token OR id_token.
 * @returns {Promise<{token: string, user: object, raw: object}>}
 */
export async function loginWithGoogle(googleToken) {
  if (!googleToken) {
    throw new Error('Google token is required.');
  }
  await getCsrfCookie();
  const { data } = await apiClient.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, {
    token: googleToken,
  });
  return persistAndReturn(data);
}

/* ──────────────────────────── Logout / Current User ───────────────────────── */

/**
 * Revoke the current Sanctum token on the server AND clear local storage.
 * Always clears local state, even if the network call fails (offline logout).
 */
export async function logout() {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch {
    /* ignore — we still want to clear local session below */
  } finally {
    tokenStorage.clear({ broadcast: true });
  }
}

/** Fetch the currently authenticated user. Throws 401 if not logged in. */
export async function fetchCurrentUser() {
  const { data } = await apiClient.get(AUTH_ENDPOINTS.CURRENT_USER);
  return data;
}

/* ──────────────────────── Forgot password / reset flow ────────────────────── */

/**
 * Step 1: send a password-reset OTP to the user's e-mail.
 *
 * @param {string} email
 * @returns {Promise<object>} raw backend body
 */
export async function requestPasswordResetOtp(email) {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.PASSWORD_SEND_OTP, {
    email: email.trim().toLowerCase(),
  });
  return data;
}

/**
 * Step 2: verify the OTP without consuming it (used to advance the wizard).
 *
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<object>} raw backend body
 */
export async function verifyPasswordResetOtp(email, otp) {
  // The backend exposes this as GET with query parameters.
  const { data } = await apiClient.get(AUTH_ENDPOINTS.PASSWORD_VERIFY_OTP, {
    params: { email: email.trim().toLowerCase(), otp },
  });
  return data;
}

/**
 * Step 3: reset the password using the verified OTP. On success the user is
 * fully authenticated (token + user are saved) so they can be redirected
 * straight into the app.
 *
 * @param {string} email
 * @param {string} otp
 * @param {string} password
 * @param {string} password_confirmation
 * @returns {Promise<{token: string, user: object, raw: object}>}
 */
export async function resetPassword(email, otp, password, password_confirmation) {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.PASSWORD_RESET, {
    email: email.trim().toLowerCase(),
    otp,
    password,
    password_confirmation,
  });
  // Some backends return a token after reset; if not, just return raw.
  const payload = extractAuthPayload(data);
  if (payload.token) {
    tokenStorage.save(payload.token, payload.user, { broadcast: true });
  }
  return payload;
}

/* ─────────────────────── Friendly error message extractor ─────────────────── */

/**
 * Turn an axios error from any auth endpoint into a single human-readable
 * string suitable for a toast. Used by Login/Signup/ForgotPassword so error
 * UX is consistent everywhere.
 *
 * @param {Error & { response?: { status?: number, data?: any } }} error
 * @returns {string}
 */
export function parseAuthError(error) {
  const status = error?.response?.status;
  const body = error?.response?.data;

  // Laravel validation errors come as { message, errors: { field: [msg] } }
  if (status === 422 && body?.errors) {
    const firstField = Object.keys(body.errors)[0];
    const firstMsg = body.errors[firstField]?.[0];
    if (firstMsg) return firstMsg;
  }

  if (status === 401) return 'Invalid credentials. Please check and try again.';
  if (status === 403) return 'Access denied. Please contact support.';
  if (status === 404) return body?.message || 'Account not found for this email.';
  if (status === 409) return 'This email is already registered.';
  if (status === 429) return 'Too many attempts. Please try again in a few minutes.';
  if (status >= 500) return body?.message || 'Server error. Please try again shortly.';

  if (body?.message) return body.message;
  if (error?.message?.includes('Network')) return 'Network error. Please check your connection.';
  return 'Something went wrong. Please try again.';
}

/* ─────────────────────────────────── Aggregate ────────────────────────────── */

/**
 * Default export: a single object with every auth function. Use it like
 *   `import authService from '@/api/authService';`
 *   `await authService.loginWithPassword(email, pw);`
 * OR import the named functions directly (preferred for tree-shaking).
 */
const authService = {
  register,
  loginWithPassword,
  sendLoginOtp,
  verifyLoginOtp,
  loginWithGoogle,
  logout,
  fetchCurrentUser,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  parseAuthError,
  extractAuthPayload,
};

export default authService;
