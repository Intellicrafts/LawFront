// src/redux/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Check if dark mode is saved in localStorage or use system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    
    // Check system preference
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light'; // Default theme
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', state.mode);
      }
    },
    setTheme: (state, action) => {
      // Only accept valid theme values
      if (action.payload === 'light' || action.payload === 'dark') {
        state.mode = action.payload;
        // Save to localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('theme', state.mode);
        }
      }
    }
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;