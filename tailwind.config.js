/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Typography ─────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in-right': 'fadeInRight 0.3s ease-out',
        'fade-out-right': 'fadeOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      /* ── Brand Colors ─────────────────────────────── */
      colors: {
        // Primary brand palette — navy/blue for trust & authority
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',  // Primary blue — CTAs, links
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#0F172A',  // Navy — dark background, headings
          950: '#020617',
        },
        // Accent palette — gold for premium features & wallet
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Gold — pricing, credits, premium
          600: '#D97706',
          700: '#B45309',
        },
        // Verified palette — emerald for trust badges, verification
        verified: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          400: '#34D399',
          500: '#10B981',  // Emerald — verified badges, success
          600: '#059669',
          700: '#047857',
        },
        // Dark mode surface colors (kept from original)
        'dark-bg': {
          DEFAULT: '#0A0A0A',
          secondary: '#111111',
          tertiary: '#1A1A1A',
        },
        'dark-text': {
          DEFAULT: '#F8FAFC',
          secondary: '#E2E8F0',
          tertiary: '#CBD5E1',
          muted: '#94A3B8',
        },
        'dark-border': {
          DEFAULT: '#334155',
          secondary: '#475569',
        },
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
