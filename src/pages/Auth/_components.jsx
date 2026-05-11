/**
 * pages/Auth/_components.jsx
 * -----------------------------------------------------------------------------
 * Small visual primitives shared by Login.jsx, Signup.jsx and ForgotPassword.jsx.
 *
 * Each component is intentionally:
 *   - "Dumb": no business logic, no API calls.
 *   - Theme-aware: reads `state.theme.mode` from Redux to flip dark / light.
 *   - Accessible: proper labels, aria-attributes, keyboard support.
 *
 * Pulled OUT of the original Login.jsx (and a near-identical copy in Signup.jsx)
 * to remove ~400 lines of duplicated JSX.
 * -----------------------------------------------------------------------------
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Scale, Check } from 'lucide-react';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { getGoogleClientId } from '../../config';

/* ───────────────────────── Brand Logo ─────────────────────────────────────── */

/** Brand mark — the centered "MeraBakil" logo at the top of every auth card. */
export function Logo() {
  const { mode } = useSelector((s) => s.theme);
  const dark = mode === 'dark';
  return (
    <div className="flex justify-center mb-4">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${dark ? 'bg-brand-500/10' : 'bg-brand-50'}`}>
        <Scale size={22} className="text-brand-500" strokeWidth={2.5} />
        <span className={`text-lg font-bold ${dark ? 'text-white' : 'text-brand-900'}`}>MeraBakil</span>
      </div>
    </div>
  );
}

/* ───────────────────────── Primary Button ─────────────────────────────────── */

/**
 * The brand-coloured primary action button used everywhere in /auth pages.
 * Shows a spinner when `loading`. Auto-disables on loading or `disabled`.
 */
export function PrimaryButton({ children, loading, onClick, type = 'button', className = '', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`group w-full py-2.5 px-4 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 hover:bg-brand-600 ${className}`}
    >
      <span className="relative z-10 flex items-center tracking-wide">
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
}

/* ───────────────────────── Checkbox ───────────────────────────────────────── */

/** Brand-styled checkbox. Native `<input>` is kept (sr-only) for a11y. */
export function CustomCheckbox({ id, name, checked, onChange, label, disabled = false }) {
  const { mode } = useSelector((s) => s.theme);
  const dark = mode === 'dark';
  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        <input id={id} name={name || id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only" />
        <label
          htmlFor={id}
          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110'
          } ${
            checked
              ? dark ? 'bg-white border-white' : 'bg-gray-900 border-gray-900'
              : dark ? 'bg-gray-800 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-300 hover:border-gray-400'
          }`}
        >
          {checked && <Check size={14} className={dark ? 'text-gray-900' : 'text-white'} strokeWidth={3} />}
        </label>
      </div>
      <label htmlFor={id} className={`ml-2.5 block text-xs cursor-pointer select-none ${dark ? 'text-gray-400' : 'text-gray-600'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        {label}
      </label>
    </div>
  );
}

/* ───────────────────────── Input Field ────────────────────────────────────── */

/** Generic icon-prefixed text input used for email, password, name, phone, etc. */
export function InputField({
  type, id, name, value, onChange, placeholder, icon,
  rightIcon, onRightIconClick, error = false, disabled = false, autoComplete,
}) {
  const { mode } = useSelector((s) => s.theme);
  const dark = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
        error ? 'text-red-400' : disabled ? 'text-gray-300' : dark ? 'text-gray-500 group-focus-within:text-gray-300' : 'text-gray-400 group-focus-within:text-gray-600'
      }`}>
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={error}
        className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${
          dark
            ? error
              ? 'border-2 border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-900 bg-gray-700 text-white placeholder-gray-400'
              : disabled
                ? 'border border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed placeholder-gray-600'
                : 'border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500 placeholder-gray-400'
            : error
              ? 'border-2 border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400'
              : disabled
                ? 'border border-gray-200 bg-gray-50 cursor-not-allowed placeholder-gray-400'
                : 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 placeholder-gray-400'
        }`}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          disabled={disabled}
          aria-label={type === 'password' ? 'Toggle password visibility' : 'Toggle input'}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
            disabled ? 'text-gray-300 cursor-not-allowed' : dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── Google Buttons (popup + One Tap) ──────────────── */

/**
 * Single "Continue with Google" button + invisible One Tap prompt.
 *
 * Both flows call back through `onGoogleToken(token)` with whatever Google
 * returned — the consuming page (Login/Signup) doesn't care which flow it was
 * because authService.loginWithGoogle handles both id_token and access_token.
 *
 * @param {object}  props
 * @param {(token: string) => void} props.onGoogleToken  Called with the Google token.
 * @param {boolean} [props.loading]   Disables the button.
 * @param {boolean} [props.oneTap]    Enable One Tap prompt (default true).
 */
export function GoogleAuthButton({ onGoogleToken, loading = false, oneTap = true }) {
  const { mode } = useSelector((s) => s.theme);
  const dark = mode === 'dark';
  const googleClientId = getGoogleClientId();

  // Popup flow: returns { access_token } via tokenResponse.access_token.
  const popupLogin = useGoogleLogin({
    onSuccess: (resp) => onGoogleToken?.(resp.access_token),
    onError: () => onGoogleToken?.(null),
  });

  // One Tap flow: returns { credential } which is a Google-signed JWT id_token.
  useGoogleOneTapLogin({
    onSuccess: (resp) => onGoogleToken?.(resp.credential),
    onError: () => { /* silently ignore: user dismissed One Tap */ },
    auto_select: true,
    disabled: !oneTap || !googleClientId,
  });

  const cls = `w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${
    dark
      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
      : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
  }`;

  return (
    <button type="button" onClick={() => popupLogin()} disabled={loading} className={cls} aria-label="Continue with Google">
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span className="text-sm">Continue with Google</span>
    </button>
  );
}
