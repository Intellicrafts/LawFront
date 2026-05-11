/**
 * Login.jsx
 * =============================================================================
 * Unified login screen. Supports FOUR ways to sign in:
 *
 *   1. Email + Password   →  authService.loginWithPassword
 *   2. Email OTP          →  authService.sendLoginOtp + verifyLoginOtp
 *   3. Google popup       →  authService.loginWithGoogle  (access_token)
 *   4. Google One Tap     →  authService.loginWithGoogle  (id_token)
 *
 * The page is intentionally THIN: every API call goes through `authService`
 * (which knows the endpoints, CSRF, error normalisation, and token storage)
 * and every post-success side-effect (wallet, redirect, event) goes through
 * `runPostAuthActions`. So this file only concerns itself with form UX.
 *
 * Refactored from a 1173-line god-component down to ~480 lines, removing:
 *   - Three duplicate redirect-by-role blocks (now in redirectByRole.js)
 *   - Three duplicate wallet-create blocks (now in postAuthActions.js)
 *   - Three duplicate token-store + event-dispatch blocks (now in tokenStorage)
 *   - An unused LegalStrip component
 *   - A dead, multi-line block of commented-out CSS at the EOF
 *   - A no-op auto-submit handler whose own comment said it didn't work
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Smartphone, Shield, ArrowLeft } from 'lucide-react';

import authService, { parseAuthError } from '../../api/authService';
import { tokenStorage } from '../../utils/auth/tokenStorage';
import { runPostAuthActions } from '../../utils/auth/postAuthActions';
import { AUTH_ROUTES } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';

import { Logo, PrimaryButton, CustomCheckbox, InputField, GoogleAuthButton } from './_components';

/* ───────────────────────────── Constants ─────────────────────────────────── */

const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 60;
const POST_LOGIN_REDIRECT_DELAY_MS = 1200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ───────────────────────────── Helpers ───────────────────────────────────── */

const isValidEmail = (e) => EMAIL_REGEX.test((e || '').trim());

/* ───────────────────────────── Main Component ────────────────────────────── */

export const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { mode } = useSelector((s) => s.theme);
  const isDarkMode = mode === 'dark';
  const { showSuccess, showError, showInfo } = useToast();

  /* ── Form state ─────────────────────────────────────────────────────────── */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Which tab is active in the email-based section: 'password' | 'otp'
  const [method, setMethod] = useState('password');
  // OTP flow stage: 'send' (we ask for code) | 'verify' (we have one)
  const [otpStage, setOtpStage] = useState('send');
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  /* ── Redirect already-authenticated users away from /auth ──────────────── */
  useEffect(() => {
    if (tokenStorage.isAuthenticated()) {
      navigate(AUTH_ROUTES.HOME, { replace: true });
    }
  }, [navigate]);

  /* ── OTP resend countdown ──────────────────────────────────────────────── */
  useEffect(() => {
    if (otpStage !== 'verify' || resendSecondsLeft <= 0) return undefined;
    const t = setInterval(() => setResendSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [otpStage, resendSecondsLeft]);

  /* ════════════════════════════════════════════════════════════════════════
   * Generic success handler — shared by ALL four login paths.
   * Saves nothing locally (authService already did that). Just runs the
   * cross-cutting side-effects and navigates.
   * ════════════════════════════════════════════════════════════════════════ */
  const handleAuthSuccess = async (payload, { greeting }) => {
    const user = payload.user;
    showSuccess(`${greeting}${user?.name ? `, ${user.name}` : ''}! Redirecting...`);

    const { redirectTo } = await runPostAuthActions({ user });

    onLoginSuccess?.({ ...payload.raw, access_token: payload.token, user });

    setTimeout(() => navigate(redirectTo, { replace: true }), POST_LOGIN_REDIRECT_DELAY_MS);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * 1. EMAIL + PASSWORD
   * ════════════════════════════════════════════════════════════════════════ */
  const validatePasswordForm = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePasswordLogin = async (event) => {
    event?.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      showInfo('Signing you in securely...');
      const payload = await authService.loginWithPassword(email, password);
      await handleAuthSuccess(payload, { greeting: 'Welcome back' });
    } catch (err) {
      showError(parseAuthError(err));
      setPassword(''); // clear sensitive input on failure
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
   * 2. EMAIL OTP (passwordless)
   * ════════════════════════════════════════════════════════════════════════ */
  const handleSendOtp = async (event) => {
    event?.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      setErrors({ email: 'Enter a valid email to receive a code.' });
      return;
    }
    setLoading(true);
    try {
      showInfo('Sending one-time code...');
      await authService.sendLoginOtp(email);
      showSuccess('Code sent. Check your inbox.');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpStage('verify');
      setResendSecondsLeft(OTP_RESEND_SECONDS);
    } catch (err) {
      showError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event?.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== OTP_LENGTH) {
      showError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      showInfo('Verifying code...');
      const payload = await authService.verifyLoginOtp(email, code);
      await handleAuthSuccess(payload, { greeting: 'Welcome back' });
    } catch (err) {
      showError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP input UX: per-digit boxes, paste, backspace nav ───────────────── */
  const onOtpDigitChange = (idx, raw) => {
    if (raw && !/^\d$/.test(raw)) return;
    const next = [...otpDigits];
    next[idx] = raw;
    setOtpDigits(next);
    // Auto-advance focus to the next input on entry.
    if (raw && idx < OTP_LENGTH - 1) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };
  const onOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    } else if (e.key === 'Enter' && otpDigits.join('').length === OTP_LENGTH) {
      handleVerifyOtp();
    }
  };
  const onOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    [...pasted].forEach((c, i) => (next[i] = c));
    setOtpDigits(next);
    document.getElementById(`otp-${Math.min(pasted.length, OTP_LENGTH - 1)}`)?.focus();
  };

  /* ════════════════════════════════════════════════════════════════════════
   * 3 & 4. GOOGLE OAuth (popup access_token OR One Tap id_token)
   *
   * Both flows funnel through this ONE handler — the backend tells them apart.
   * ════════════════════════════════════════════════════════════════════════ */
  const handleGoogleToken = async (googleToken) => {
    if (!googleToken) {
      showError('Google sign-in was cancelled.');
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      showInfo('Signing in with Google...');
      const payload = await authService.loginWithGoogle(googleToken);
      await handleAuthSuccess(payload, { greeting: 'Welcome' });
    } catch (err) {
      showError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Navigation helpers
   * ════════════════════════════════════════════════════════════════════════ */
  const goToRegister = (e) => {
    e?.preventDefault();
    if (onSwitchToRegister) onSwitchToRegister();
    else navigate(AUTH_ROUTES.SIGNUP);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Render
   * ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`relative flex flex-col min-h-screen pt-20 pb-10 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      {/* Decorative blurred background */}
      <BackgroundGlow isDarkMode={isDarkMode} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 z-10"
      >
        <div
          className={`w-full max-w-md overflow-hidden transition-all duration-300 ${
            isDarkMode ? 'bg-[#121212] border border-gray-800' : 'bg-white border border-gray-100 shadow-2xl shadow-blue-500/5'
          } rounded-2xl p-6 sm:p-8`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <Logo />
            </motion.div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Welcome Back</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your MeraBakil account</p>
          </div>

          {/* Google block (covers both popup + One Tap) */}
          <div className="grid gap-3 mb-6">
            <GoogleAuthButton onGoogleToken={handleGoogleToken} loading={loading} />
          </div>

          <Divider label="or sign in with email" />

          {otpStage === 'send' ? (
            <>
              {/* Method tabs: Password ↔ OTP */}
              <MethodTabs method={method} setMethod={(m) => { setMethod(m); setErrors({}); }} disabled={loading} />

              <form
                onSubmit={method === 'password' ? handlePasswordLogin : handleSendOtp}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <Field label="Email Address" htmlFor="email" error={errors.email}>
                  <InputField
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="name@example.com"
                    autoComplete="email"
                    error={!!errors.email}
                    disabled={loading}
                    icon={<Mail size={16} />}
                  />
                </Field>

                <AnimatePresence mode="wait">
                  {method === 'password' && (
                    <motion.div key="pw" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                      <div className="space-y-2 mb-4 mt-4">
                        <div className="flex justify-between items-center">
                          <label htmlFor="password" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
                          <a href={AUTH_ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">Forgot Password?</a>
                        </div>
                        <InputField
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          error={!!errors.password}
                          disabled={loading}
                          icon={<Lock size={16} />}
                          rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          onRightIconClick={() => setShowPassword((v) => !v)}
                        />
                        {errors.password && <ErrorLine>{errors.password}</ErrorLine>}
                      </div>

                      <div className="flex items-center justify-between pb-4">
                        <CustomCheckbox id="rememberMe" name="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} label="Remember me" disabled={loading} />
                      </div>

                      <PrimaryButton type="submit" loading={loading} disabled={loading || !email || !password || password.length < 8} className="rounded-xl h-11">
                        {loading ? 'Signing in...' : 'Sign In'}
                      </PrimaryButton>
                    </motion.div>
                  )}

                  {method === 'otp' && (
                    <motion.div key="otp" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="pt-2">
                      <PrimaryButton type="submit" loading={loading} disabled={loading || !email} className="rounded-xl h-11">
                        {loading ? 'Sending Code...' : 'Send Secure OTP'}
                      </PrimaryButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          ) : (
            <OtpVerifySection
              email={email}
              isDarkMode={isDarkMode}
              loading={loading}
              digits={otpDigits}
              onDigitChange={onOtpDigitChange}
              onKeyDown={onOtpKeyDown}
              onPaste={onOtpPaste}
              onSubmit={handleVerifyOtp}
              onBack={() => { setOtpStage('send'); setOtpDigits(Array(OTP_LENGTH).fill('')); }}
              canResend={resendSecondsLeft === 0}
              resendSecondsLeft={resendSecondsLeft}
              onResend={handleSendOtp}
            />
          )}

          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              New to MeraBakil?{' '}
              <button type="button" onClick={goToRegister} disabled={loading} className="font-bold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none">
                Create an Account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ───────────────────────────── Sub-components ────────────────────────────── */

const BackgroundGlow = ({ isDarkMode }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-600' : 'bg-blue-300'}`}
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 1 }}
      className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-blue-500' : 'bg-blue-200'}`}
    />
  </div>
);

const Divider = ({ label }) => (
  <div className="relative flex items-center mb-6">
    <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
    <span className="flex-shrink mx-4 text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
    <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
  </div>
);

const MethodTabs = ({ method, setMethod, disabled }) => (
  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
    {[
      { key: 'password', label: 'Password', Icon: Lock },
      { key: 'otp', label: 'OTP Code', Icon: Smartphone },
    ].map(({ key, label, Icon }) => (
      <button
        key={key}
        type="button"
        onClick={() => setMethod(key)}
        disabled={disabled}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
          method === key
            ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-400'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <Icon size={16} /> {label}
      </button>
    ))}
  </div>
);

const Field = ({ label, htmlFor, children, error }) => {
  const { mode } = useSelector((s) => s.theme);
  const dark = mode === 'dark';
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={`block text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </label>
      {children}
      {error && <ErrorLine>{error}</ErrorLine>}
    </div>
  );
};

const ErrorLine = ({ children }) => (
  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
    {children}
  </motion.p>
);

const OtpVerifySection = ({
  email, isDarkMode, loading, digits,
  onDigitChange, onKeyDown, onPaste, onSubmit, onBack,
  canResend, resendSecondsLeft, onResend,
}) => (
  <div className="space-y-6">
    <div className="mb-2 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-blue-500 dark:text-blue-400"><Shield size={18} /></div>
        <div>
          <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Enter Verification Code</h4>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We sent a 6-digit code to <span className="font-semibold text-brand-500">{email}</span>. Valid for 5 minutes.
          </p>
        </div>
      </div>
    </div>

    <div className="flex justify-between gap-2 sm:gap-4 mb-2">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => onDigitChange(idx, e.target.value)}
          onKeyDown={(e) => onKeyDown(idx, e)}
          onPaste={onPaste}
          disabled={loading}
          className={`w-10 h-10 sm:w-12 sm:h-14 text-center text-lg sm:text-2xl font-bold rounded-xl outline-none transition-all duration-300 ${
            isDarkMode
              ? 'bg-[#121212] border-gray-700 text-white focus:border-brand-500 focus:bg-[#1e1e1e]'
              : 'bg-white border-gray-300 text-brand-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm'
          } border-2 ${digit ? 'border-brand-500 bg-brand-50/10' : ''}`}
        />
      ))}
    </div>

    <PrimaryButton onClick={onSubmit} loading={loading} disabled={loading || digits.join('').length !== 6} className="rounded-xl h-11 w-full mt-2">
      {loading ? 'Verifying...' : 'Verify Secure Code'}
    </PrimaryButton>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
      <button onClick={onBack} disabled={loading} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>
      <div className="text-sm">
        {canResend ? (
          <button type="button" onClick={onResend} disabled={loading} className="font-semibold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none">
            Resend Code
          </button>
        ) : (
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Resend code in <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{resendSecondsLeft}s</strong>
          </span>
        )}
      </div>
    </div>
  </div>
);
