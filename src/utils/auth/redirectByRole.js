/**
 * redirectByRole.js
 * -----------------------------------------------------------------------------
 * Decide where to send the user immediately after login/signup.
 * Used by ALL auth paths (password, OTP, Google, signup) so the rules live in
 * ONE place — fix a routing bug here, every login flow gets it.
 *
 * Priority (highest wins):
 *   1. `?redirect=/some/path` query parameter (deep-link support).
 *   2. Role / user_type from the backend response.
 *   3. Fallback: home page.
 * -----------------------------------------------------------------------------
 */

import { AUTH_ROUTES } from '../../api/endpoints';

/** Backend stores `user_type` as integer; map to a string we can switch on. */
function normaliseRole(user) {
  if (!user) return 'unknown';

  const type = user.user_type;
  const role = (user.role || '').toString().toLowerCase();

  const isLawyer =
    type === 2 ||
    type === '2' ||
    type === 'business' ||
    type === 'lawyer' ||
    role === 'lawyer';

  const isClient =
    type === 1 ||
    type === '1' ||
    type === 'personal' ||
    type === 'user' ||
    role === 'user' ||
    role === 'client';

  if (isLawyer) return 'lawyer';
  if (isClient) return 'client';
  return 'unknown'; // user_type null / 0 / undefined → needs profile setup
}

/** Read `?redirect=...` from the current URL, if present and non-empty. */
function readRedirectParam() {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get('redirect');
  return param && param.length > 0 ? param : null;
}

/**
 * Compute the URL we should navigate to after authentication.
 *
 * @param {object} user        The user payload returned by the backend.
 * @param {object} [options]
 * @param {string} [options.queryRedirect]  Optional override; if not given,
 *                                          we read it from the current URL.
 * @returns {string}  Pathname suitable for react-router `navigate(...)`.
 */
export function resolvePostAuthRedirect(user, options = {}) {
  const explicit = options.queryRedirect ?? readRedirectParam();
  if (explicit) return explicit;

  switch (normaliseRole(user)) {
    case 'lawyer':
      return AUTH_ROUTES.LAWYER_DASHBOARD;
    case 'client':
      return AUTH_ROUTES.HOME;
    case 'unknown':
    default:
      return AUTH_ROUTES.PROFILE_TYPE_SETUP;
  }
}
