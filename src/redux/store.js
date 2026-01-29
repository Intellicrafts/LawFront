// import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from './counterSlice'

// const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// })

// export default store



import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import sidebarReducer from './sidebarSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    sidebar: sidebarReducer,
    chat: chatReducer,
  },
});

export default store;