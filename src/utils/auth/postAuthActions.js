/**
 * postAuthActions.js
 * -----------------------------------------------------------------------------
 * Side-effects that run AFTER any successful authentication, regardless of
 * which login method was used (password, OTP, Google popup, Google One Tap,
 * or a fresh registration).
 *
 * Centralising these here means:
 *   - The five duplicate "auto-create wallet" blocks become ONE.
 *   - The three duplicate "build redirect URL by role" blocks become ONE
 *     (via redirectByRole.js).
 *   - The four duplicate "dispatch auth-status-changed event" lines disappear
 *     (tokenStorage.save() already dispatches it for us).
 *
 * `runPostAuthActions` is intentionally fail-soft: a wallet 404 or 500 must
 * NEVER block the user from getting into the app.
 * -----------------------------------------------------------------------------
 */

import { walletAPI } from '../../api/apiService';
import { resolvePostAuthRedirect } from './redirectByRole';

/**
 * Best-effort wallet creation. The Kuberdhan wallet service is separate from
 * the Laravel API and may not be running in dev. We swallow ALL errors here
 * because failing to create a wallet must never break the auth flow.
 *
 * @param {object} user The authenticated user payload (must have `id`).
 */
async function tryCreateWallet(user) {
  if (!user?.id) return;
  const userType =
    user.user_type === 2 || user.user_type === 'business' || user.user_type === 'lawyer' || (user.role || '').toLowerCase() === 'lawyer'
      ? 'LAWYER'
      : 'CUSTOMER';
  try {
    await walletAPI.createWallet({
      user_id: user.id.toString(),
      user_type: userType,
      currency: 'INR',
    });
  } catch {
    /* fail-soft: dev environments often have no wallet service */
  }
}

/**
 * Run every post-success side-effect in the right order.
 *
 * @param {object}  args
 * @param {object}  args.user       The authenticated user payload.
 * @param {boolean} [args.isSignup] True if this came from registration (turns on
 *                                  the onboarding tour flag + welcome-bonus flag).
 * @returns {Promise<{ redirectTo: string }>}  Where the caller should navigate.
 */
export async function runPostAuthActions({ user, isSignup = false }) {
  // 1. Auto-create wallet (best effort, never throws).
  await tryCreateWallet(user);

  // 2. Signal the onboarding tour for first-time visitors.
  if (isSignup && typeof window !== 'undefined') {
    sessionStorage.setItem('isSignupSession', 'true');
    sessionStorage.setItem('showPromoCeremony', '499');
  }

  // 3. Decide where to send the user (role-based + ?redirect= deep link).
  const redirectTo = resolvePostAuthRedirect(user);

  return { redirectTo };
}
