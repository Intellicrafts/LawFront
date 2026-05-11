/**
 * endpoints.js
 * -----------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every backend URL used by the frontend.
 *
 *  - Origin (scheme + host + port) is resolved by `src/config.js` from .env.
 *  - The HTTP client (`httpClient.js`) is configured with `baseURL = ORIGIN/api`,
 *    so paths defined here must be RELATIVE TO `/api` (start with `/`, no `/api`
 *    in the path itself). Example: use `/login`, NOT `/api/login`.
 *  - The ONE exception is Laravel Sanctum's CSRF endpoint, which lives outside
 *    the /api prefix. It is exposed below as `SANCTUM_CSRF_PATH` and the http
 *    client knows to call it on the bare origin (not via the /api baseURL).
 *  - Never hardcode a domain in feature code. If you need a different host
 *    (e.g. wallet microservice), declare it via .env + `src/config.js` and
 *    add a constant here.
 *
 * This file is intentionally pure data — no imports, no side effects — so it is
 * trivially tree-shakable and unit-testable.
 * -----------------------------------------------------------------------------
 */

// Sanctum CSRF cookie lives OUTSIDE the /api prefix.
// httpClient.getCsrfCookie() bypasses the /api baseURL and hits this directly.
export const SANCTUM_CSRF_PATH = '/sanctum/csrf-cookie';

/**
 * All authentication-related paths, relative to `/api`.
 * Group by flow for readability.
 */
export const AUTH_ENDPOINTS = Object.freeze({
  // ── Email + Password ────────────────────────────────────────────────────────
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/refresh',

  // ── Email OTP (passwordless) ────────────────────────────────────────────────
  OTP_SEND: '/login/send-otp',
  OTP_VERIFY: '/login/verify-otp',

  // ── Google OAuth (handles both ID Token from One Tap and access_token) ──────
  GOOGLE_LOGIN: '/auth/google',
  GOOGLE_SAVE_ADDITIONAL: '/auth/save/additional',

  // ── Password reset (forgot-password flow) ───────────────────────────────────
  PASSWORD_SEND_OTP: '/password/send-otp',
  PASSWORD_VERIFY_OTP: '/password/verify-otp',
  PASSWORD_RESET: '/password/reset',

  // ── Current user / profile ──────────────────────────────────────────────────
  CURRENT_USER: '/user',
  USER_PROFILE: '/user/profile',
});

/**
 * Frontend routes used by auth redirects. Defined here so post-login
 * navigation has a single, refactor-safe set of constants.
 */
export const AUTH_ROUTES = Object.freeze({
  LOGIN: '/auth',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  HOME: '/',
  LAWYER_DASHBOARD: '/lawyer-admin',
  PROFILE_TYPE_SETUP: '/profile-setup/type-selection',
});
