import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; // ✅ Keep this just once
import { Provider } from 'react-redux';
import store from './redux/store'; // ✅ Default import, no {}
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {/* Wrap the entire app with AuthProvider */}
    <Provider store={store}>
      <App />
    </Provider>
    </AuthProvider>
  </React.StrictMode>
);

// Optional: measure performance
reportWebVitals();
