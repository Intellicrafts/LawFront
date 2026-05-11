/**
 * Signup.jsx
 * =============================================================================
 * Two-step registration screen with the same four entry points as Login:
 *
 *   1. Email + Password registration   →  authService.register
 *   2. Google popup                    →  authService.loginWithGoogle
 *   3. Google One Tap                  →  authService.loginWithGoogle
 *
 *   (Email-OTP is a sign-IN flow only — there's no "register via OTP" path.)
 *
 * Step 1: Account type, email, password, T&C  → "Continue".
 * Step 2: First/Last/Phone/Confirm-password + (if lawyer) enrollment number
 *          → "Create Account".
 *
 * Like Login.jsx, ALL business logic goes through `authService` and
 * `runPostAuthActions` — this file just orchestrates form UX.
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Check, User as UserIcon, Briefcase as BriefcaseIcon,
  Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Smartphone,
} from 'lucide-react';

import authService, { parseAuthError } from '../../api/authService';
import { tokenStorage } from '../../utils/auth/tokenStorage';
import { runPostAuthActions } from '../../utils/auth/postAuthActions';
import { AUTH_ROUTES } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';

import { Logo, PrimaryButton, CustomCheckbox, InputField, GoogleAuthButton } from './_components';

/* ───────────────────────────── Constants ─────────────────────────────────── */

const POST_AUTH_REDIRECT_DELAY_MS = 1500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Backend's required password complexity: 8+ chars, upper, digit, symbol. */
function passwordStrength(pw = '') {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s;
}

/* ───────────────────────────── Main Component ────────────────────────────── */

export const Signup = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const { mode } = useSelector((s) => s.theme);
  const isDarkMode = mode === 'dark';
  const { showSuccess, showError, showInfo } = useToast();

  /* ── Step 1 fields ─────────────────────────────────────────────────────── */
  const [accountType, setAccountType] = useState('personal'); // 'personal' | 'business'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* ── Step 2 fields ─────────────────────────────────────────────────────── */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enrollmentNo, setEnrollmentNo] = useState('');

  /* ── UI state ──────────────────────────────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ── Redirect already-authenticated users away from /signup ────────────── */
  useEffect(() => {
    if (tokenStorage.isAuthenticated()) navigate(AUTH_ROUTES.HOME, { replace: true });
  }, [navigate]);

  /* ── Clear lawyer-only fields when account type changes ────────────────── */
  useEffect(() => {
    if (accountType === 'personal') setEnrollmentNo('');
  }, [accountType]);

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  /* ════════════════════════════════════════════════════════════════════════
   * Generic success handler (shared by email register + Google)
   * ════════════════════════════════════════════════════════════════════════ */
  const handleAuthSuccess = async (payload, { greeting }) => {
    const user = payload.user;
    showSuccess(`${greeting}${user?.name ? `, ${user.name}` : ''}! Setting up your account...`);

    const { redirectTo } = await runPostAuthActions({ user, isSignup: true });

    // Lawyers go through Satyapan verification next — stash enrollment for the
    // banner on the dashboard.
    if (accountType === 'business' && enrollmentNo.trim()) {
      sessionStorage.setItem('lawyerEnrollmentNo', enrollmentNo.trim());
    }

    onSignupSuccess?.({ ...payload.raw, access_token: payload.token, user });

    setTimeout(() => navigate(redirectTo, { replace: true }), POST_AUTH_REDIRECT_DELAY_MS);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Step 1 → Step 2 (no network call yet — just validate the basics)
   * ════════════════════════════════════════════════════════════════════════ */
  const goToStep2 = (e) => {
    e?.preventDefault();
    if (!email || !EMAIL_REGEX.test(email)) return showError('Please enter a valid email address.');
    if (passwordStrength(password) < 4) {
      return showError('Password needs 8+ chars, uppercase, number, and a special character.');
    }
    if (!agreeTerms) return showError('Please accept the Terms of Service.');
    setStep(2);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Final submission: register against /api/register
   * ════════════════════════════════════════════════════════════════════════ */
  const handleEmailRegister = async (e) => {
    e?.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      return showError('Please fill in your name and phone number.');
    }
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      return showError('Please enter a valid phone number (10+ digits).');
    }
    if (!passwordsMatch) return showError('Passwords do not match.');
    if (accountType === 'business' && !enrollmentNo.trim()) {
      return showError('Bar Council Enrollment Number is required for lawyer accounts.');
    }

    setLoading(true);
    try {
      showInfo('Creating your account...');
      const payload = await authService.register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        password,
        password_confirmation: confirmPassword,
        account_type: accountType === 'business' ? 2 : 1,
        ...(accountType === 'business' && { enrollment_no: enrollmentNo.trim() }),
      });
      await handleAuthSuccess(payload, { greeting: 'Welcome to MeraBakil' });
    } catch (err) {
      showError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Google (popup access_token + One Tap id_token funnel through one fn)
   * ════════════════════════════════════════════════════════════════════════ */
  const handleGoogleToken = async (googleToken) => {
    if (!googleToken) return showError('Google sign-up was cancelled.');
    if (loading) return;

    setLoading(true);
    try {
      showInfo('Signing up with Google...');
      const payload = await authService.loginWithGoogle(googleToken);
      await handleAuthSuccess(payload, { greeting: 'Welcome' });
    } catch (err) {
      showError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
   * Render
   * ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`relative flex flex-col min-h-screen pt-20 pb-12 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      <BackgroundGlow isDarkMode={isDarkMode} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 z-10"
      >
        <div
          className={`w-full max-w-lg overflow-hidden transition-all duration-300 ${
            isDarkMode ? 'bg-[#121212] border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-100 shadow-2xl shadow-blue-500/5'
          } rounded-2xl p-6 sm:p-8`}
        >
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <Logo />
            </motion.div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Create Account</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join MeraBakil's professional legal network</p>
          </div>

          <StepIndicator step={step} />

          <form onSubmit={step === 1 ? goToStep2 : handleEmailRegister} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <GoogleAuthButton onGoogleToken={handleGoogleToken} loading={loading} />

                  <Divider label="or sign up with email" />

                  <AccountTypeSelector selected={accountType} onSelect={setAccountType} isDarkMode={isDarkMode} />

                  <FormRow label="Email Address" htmlFor="email">
                    <InputField
                      type="email" id="email" name="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lawyer@merabakil.com"
                      icon={<Mail size={16} />}
                      disabled={loading}
                    />
                  </FormRow>

                  <FormRow label="Password" htmlFor="password">
                    <InputField
                      type={showPassword ? 'text' : 'password'}
                      id="password" name="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      icon={<Lock size={16} />}
                      rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onRightIconClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                    />
                    <PasswordRequirements password={password} isDarkMode={isDarkMode} />
                  </FormRow>

                  <div className="flex items-start py-2">
                    <CustomCheckbox
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      disabled={loading}
                      label={(
                        <span>
                          I agree to the <a href="/terms-of-service" className="text-brand-500 hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-brand-500 hover:underline">Privacy Policy</a>
                        </span>
                      )}
                    />
                  </div>

                  <PrimaryButton type="submit" loading={loading} disabled={!email || password.length < 8 || !agreeTerms || loading}>
                    Continue <ArrowRight size={18} className="ml-2" />
                  </PrimaryButton>
                </motion.div>
              ) : (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormRow label="First Name" htmlFor="firstName">
                      <InputField type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} icon={<UserIcon size={16} />} disabled={loading} />
                    </FormRow>
                    <FormRow label="Last Name" htmlFor="lastName">
                      <InputField type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} icon={<UserIcon size={16} />} disabled={loading} />
                    </FormRow>
                  </div>

                  <FormRow label="WhatsApp Number *" htmlFor="phoneNumber" hint="Appointment reminders are sent via WhatsApp.">
                    <InputField
                      type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                      placeholder="+91 9876543210"
                      icon={<Smartphone size={16} />}
                      disabled={loading}
                    />
                  </FormRow>

                  <FormRow label="Confirm Password" htmlFor="confirmPassword">
                    <InputField
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword" name="confirmPassword" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<Lock size={16} />}
                      rightIcon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onRightIconClick={() => setShowConfirmPassword((v) => !v)}
                      disabled={loading}
                    />
                    {!passwordsMatch && confirmPassword && (
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Passwords do not match</p>
                    )}
                  </FormRow>

                  {accountType === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                      <FormRow label="Bar Council Enrollment No." htmlFor="enrollmentNo">
                        <InputField type="text" id="enrollmentNo" name="enrollmentNo" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} icon={<Scale size={16} />} disabled={loading} />
                      </FormRow>
                    </motion.div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className={`flex-1 h-12 rounded-xl border font-bold text-sm flex items-center justify-center transition-all ${
                        isDarkMode ? 'border-gray-800 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowLeft size={18} className="mr-2" /> Back
                    </button>
                    <div className="flex-[2]">
                      <PrimaryButton type="submit" loading={loading} disabled={loading || !firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !passwordsMatch}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </PrimaryButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="pt-8 text-center border-t border-gray-100 dark:border-gray-800 mt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <a href={AUTH_ROUTES.LOGIN} className="font-bold text-brand-500 hover:text-brand-600 transition-colors">Sign In</a>
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
      animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className={`absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? 'bg-indigo-600' : 'bg-blue-200'}`}
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 2 }}
      className={`absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-blue-500' : 'bg-indigo-200'}`}
    />
  </div>
);

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center mb-8 gap-4">
    <Crumb idx={1} step={step} label="Account" />
    <div className={`h-px w-8 ${step > 1 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
    <Crumb idx={2} step={step} label="Personal" />
  </div>
);

const Crumb = ({ idx, step, label }) => {
  const active = step >= idx;
  const current = step === idx;
  const completed = step > idx;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
        active || current ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
      }`}>
        {completed ? <Check size={14} /> : idx}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-brand-500' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
};

const Divider = ({ label }) => (
  <div className="relative flex items-center py-2">
    <div className="flex-grow border-t border-gray-100 dark:border-gray-800" />
    <span className="flex-shrink mx-4 text-xs font-medium text-gray-400">{label}</span>
    <div className="flex-grow border-t border-gray-100 dark:border-gray-800" />
  </div>
);

const FormRow = ({ label, htmlFor, hint, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
  </div>
);

const AccountTypeSelector = ({ selected, onSelect, isDarkMode }) => {
  const Option = ({ type, Icon, title, subtitle }) => {
    const active = selected === type;
    return (
      <button
        type="button"
        onClick={() => onSelect(type)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
          active
            ? isDarkMode ? 'border-brand-500 bg-brand-500/10' : 'border-brand-500 bg-brand-50'
            : isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
          active ? 'bg-brand-500 text-white' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          <Icon size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{subtitle}</span>
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">I'm a:</label>
      <div className="grid grid-cols-2 gap-3">
        <Option type="personal" Icon={UserIcon} title="Client" subtitle="I need legal help" />
        <Option type="business" Icon={BriefcaseIcon} title="Lawyer" subtitle="I provide legal services" />
      </div>
    </div>
  );
};

const PasswordRequirements = ({ password, isDarkMode }) => {
  const items = [
    { text: 'At least 8 characters', ok: password.length >= 8 },
    { text: 'At least 1 uppercase letter', ok: /[A-Z]/.test(password) },
    { text: 'At least 1 number', ok: /[0-9]/.test(password) },
    { text: 'At least 1 special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  return (
    <div className="mt-2 space-y-1">
      {items.map((it, i) => (
        <div key={i} className="flex items-center text-xs">
          <span className={`mr-2 ${it.ok ? 'text-green-500' : 'text-gray-500'}`}>
            {it.ok ? <Check size={12} /> : '○'}
          </span>
          <span className={it.ok ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{it.text}</span>
        </div>
      ))}
    </div>
  );
};
