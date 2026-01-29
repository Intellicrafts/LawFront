import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setTheme } from './redux/themeSlice';
import { initializeTheme } from './utils/theme';
import FloatingThemeToggle from './components/common/FloatingThemeToggle';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import './index.css';
import './styles/darkMode.css';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import PracticeAreas from './components/PracticeAreas';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import { Login as AuthComponent } from './components/AuthComponent';
import { Signup as SignupComponent } from './components/SignupComponent';
import { ForgotPassword } from './components/ForgotPassword';
import LegalCosultation from './components/LegalCosultation';
import TaskAutomation from './components/TaskAutomation';
import LegalDocumentsReview from './components/LegalDocumentsReview';
import VoiceModal from './components/VoiceModal';
import Profile from './components/Auth/Profile';
import LegalAIPortfolio from './components/LegalAIPortfolio';
import { tokenManager } from './api/apiService';
import PersonalRoom from './components/PersonalRoom';
import LawyerAdmin from './components/Lawyer/LawyerAdmin';
import ProfileTypeSelection from './components/ProfileTypeSelection';
import LawyerAdditionalDetails from './components/LawyerAdditionalDetails';
import UserOnboarding from './components/UserOnboarding';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';

// Home Route component
const HomeRoute = () => {
  return <LandingPage />;
};

// Layout wrapper to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLawyerAdmin = location.pathname.startsWith('/lawyer-admin');
  const isLandingPage = location.pathname === '/' || location.pathname === '/pricing' || location.pathname === '/contact';
  const isChatbotPage = location.pathname === '/chatbot';
  const { chatHistory } = useSelector((state) => state.chat);

  // Manage chatbot-mode class on body for fixed height stability on mobile
  useEffect(() => {
    if (isChatbotPage) {
      document.body.classList.add('chatbot-mode');
    } else {
      document.body.classList.remove('chatbot-mode');
    }
    return () => document.body.classList.remove('chatbot-mode');
  }, [isChatbotPage]);

  return (
    <>
      {!isLawyerAdmin && <Navbar isLandingPage={isLandingPage} />}
      <ScrollToTop />
      <div className="flex flex-1 min-h-0">
        {!isLawyerAdmin && !isLandingPage && <Sidebar chatHistory={chatHistory} />}
        <main className="flex-1 min-w-0 min-h-0 relative">
          {children}
        </main>
      </div>
      {!isLawyerAdmin && !isLandingPage && <FloatingThemeToggle />}
    </>
  );
};

const App = () => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const isAuthenticated = tokenManager.isAuthenticated();

  // Initialize theme on app load
  useEffect(() => {
    // Get theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }

    // Initialize theme by applying the class to document
    initializeTheme();
  }, [dispatch]);

  // Apply dark mode to document element
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <ToastProvider>
          <div className="app-container">
            <Routes>
              {/* LawyerAdmin with its own layout (no main Navbar/Footer) */}
              <Route path="/lawyer-admin/*" element={<LawyerAdmin />} />

              {/* All other routes with the main layout */}
              <Route path="/*" element={
                <AppLayout>
                  <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<HomeRoute />} />

                    {/* AI Chatbot Route */}
                    <Route path="/chatbot" element={<Hero />} />

                    {/* Public Routes */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/legal-consoltation" element={<LegalCosultation />} />
                    <Route path="/task-automation" element={<TaskAutomation />} />
                    <Route path="/legal-documents-review" element={<LegalDocumentsReview />} />
                    <Route path="/voice-modal" element={<VoiceModal />} />
                    <Route path="/portfolio" element={<LegalAIPortfolio />} />
                    <Route path="/personal-room" element={<PersonalRoom />} />
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Authentication Routes */}
                    <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthComponent />} />
                    <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupComponent />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Profile Setup Routes */}
                    <Route path="/profile-setup/type-selection" element={isAuthenticated ? <ProfileTypeSelection /> : <Navigate to="/auth" replace />} />
                    <Route path="/profile-setup/lawyer-details" element={isAuthenticated ? <LawyerAdditionalDetails /> : <Navigate to="/auth" replace />} />

                    {/* Protected Routes */}
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} />
                    <Route path="/user-onboard" element={isAuthenticated ? <UserOnboarding /> : <Navigate to="/auth" replace />} />

                    {/* Catch-all Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
          </div>
        </ToastProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
