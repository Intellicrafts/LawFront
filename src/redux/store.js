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

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default store;