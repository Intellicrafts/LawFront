# Dark Mode Implementation

This document outlines the dark mode implementation for the LawFront application.

## Overview

The dark mode implementation uses:
- Redux for state management
- Tailwind CSS for styling with the `darkMode: 'class'` strategy
- CSS transitions for smooth theme changes
- System preference detection with fallback to light mode

## Key Components

1. **Redux Theme Slice**
   - Located at `src/redux/themeSlice.js`
   - Manages theme state with `light` and `dark` modes
   - Provides actions for toggling and setting the theme

2. **Theme Context**
   - Located at `src/context/ThemeContext.js`
   - Provides a React context for accessing theme information
   - Includes helper functions for theme management

3. **Dark Mode Hook**
   - Located at `src/hooks/useDarkMode.js`
   - Custom hook for accessing theme state and functions
   - Handles system preference detection and changes

4. **Theme Toggle Components**
   - `src/components/common/DarkModeToggle.jsx` - Reusable toggle button
   - `src/components/common/FloatingThemeToggle.jsx` - Floating toggle that appears after scrolling

5. **Dark Mode Styles**
   - `src/styles/darkMode.css` - Global dark mode styles
   - `src/index.css` - Base Tailwind styles with dark mode variants

6. **Tailwind Configuration**
   - `tailwind.config.js` - Configured with `darkMode: 'class'` and custom dark mode colors

7. **Helper Components**
   - `src/components/common/DarkModeImage.jsx` - Component for switching images based on theme

## Usage

### Toggling Dark Mode

The dark mode can be toggled in several ways:
1. Using the toggle button in the navbar
2. Using the floating toggle button that appears after scrolling
3. Programmatically using the `useDarkMode` hook

### Styling Components for Dark Mode

Use Tailwind's dark mode variant to style components:

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Dark mode compatible content
</div>
```

### Using the Theme Context

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Using the Dark Mode Hook

```jsx
import { useDarkMode } from '../hooks/useDarkMode';

function MyComponent() {
  const { isDark, toggle, setMode } = useDarkMode();
  
  return (
    <div>
      <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggle}>Toggle Theme</button>
      <button onClick={() => setMode('light')}>Light Mode</button>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Using the Dark Mode Image Component

```jsx
import DarkModeImage from '../components/common/DarkModeImage';

function MyComponent() {
  return (
    <DarkModeImage
      lightSrc="/images/logo-light.png"
      darkSrc="/images/logo-dark.png"
      alt="Logo"
      className="w-20 h-20"
    />
  );
}
```

## System Preference Detection

The application detects the user's system preference for dark mode and applies it automatically if the user hasn't explicitly set a preference. When the system preference changes, the theme will update accordingly if the user hasn't set a preference.

## Persistence

The user's theme preference is stored in localStorage under the key `theme` and persists across page reloads and sessions.

## Accessibility

The dark mode implementation includes:
- Proper color contrast ratios for text and backgrounds
- Focus styles that are visible in both light and dark modes
- Semantic HTML with appropriate ARIA attributes for theme toggle buttons