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
        sans: ['DM Sans', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['Lora', 'Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-right': 'fadeInRight 0.3s ease-out',
        'fade-out-right': 'fadeOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'badge-pulse': 'badgePulse 2.5s ease-in-out 1',
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
        badgePulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(26, 92, 87, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(26, 92, 87, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(26, 92, 87, 0)' },
        },
      },
      /* ── Brand Colors ─────────────────────────────── */
      colors: {
        // Primary brand palette — Deep Teal for trust & authority
        // HSL(175, 65%, 28%) family — sits between blue (trust) and green (growth)
        brand: {
          50: '#edfaf9',
          100: '#d1f4f1',
          200: '#a3e8e4',
          300: '#67d5cf',
          400: '#35bab4',
          500: '#1a9e99',  // Base teal — CTAs, links
          600: '#157f7b',  // Hover state
          700: '#126663',  // Active state
          800: '#0e4e4c',  // Dark teal — headings, strong authority
          900: '#0a3331',  // Deep ink teal — major headings
          950: '#051f1e',  // Near-black teal — darkest
        },
        // Accent palette — Institutional Gold for badges & highlights
        // HSL(40, 80%, 48%) — Indian cultural resonance, premium feel
        accent: {
          50: '#fdf8ec',
          100: '#faefd0',
          200: '#f5d99e',
          300: '#efc06a',
          400: '#e8a83f',
          500: '#d4891f',  // Base gold — pricing, badges, premium
          600: '#b96d16',
          700: '#975412',
          800: '#723e0f',
          900: '#4d2a0b',
        },
        // Verified palette — deep semantic green for trust badges
        verified: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          400: '#34d399',
          500: '#10b981',  // Emerald — verified badges, success states
          600: '#059669',
          700: '#047857',
        },
        // Surface colors for light mode — warm paper tones (not clinical white)
        surface: {
          DEFAULT: 'hsl(40, 20%, 97%)',   // Warm off-white base
          card: 'hsl(220, 10%, 93%)',  // Card / panel
          muted: 'hsl(220, 12%, 86%)',  // Dividers, borders
        },
        // Dark mode surface colors
        'dark-bg': {
          DEFAULT: '#0d1110',  // Deep charcoal with slight teal tint
          secondary: '#121917',
          tertiary: '#18211f',
        },
        'dark-text': {
          DEFAULT: '#f0f7f6',  // Near-white with teal tint
          secondary: '#c8dedd',
          tertiary: '#92b5b3',
          muted: '#5c8482',
        },
        'dark-border': {
          DEFAULT: '#1f3533',
          secondary: '#2a4442',
        },
      },
      boxShadow: {
        // Standard dark mode shadows
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        // Brand teal glow — for hover states, verification badge
        'teal-glow': '0 4px 16px rgba(26, 158, 153, 0.25)',
        'teal-glow-lg': '0 8px 32px rgba(26, 158, 153, 0.30)',
        // Gold glow — for accent elements
        'gold-glow': '0 4px 16px rgba(212, 137, 31, 0.25)',
        // Card — subtle, professional
        'card': '0 1px 4px rgba(10, 51, 49, 0.06), 0 4px 12px rgba(10, 51, 49, 0.05)',
        'card-hover': '0 4px 20px rgba(10, 51, 49, 0.10)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
