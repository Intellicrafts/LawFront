import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setTheme } from './redux/themeSlice';
import { initializeTheme } from './utils/theme';
import WalletLayout from './components/Wallet/WalletLayout';
import FloatingThemeToggle from './components/common/FloatingThemeToggle';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import './index.css';
import './styles/darkMode.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import Sidebar from './components/layout/Sidebar';
import PracticeAreas from './components/features/PracticeAreas';
import ScrollToTop from './components/layout/ScrollToTop';
import { Login as AuthComponent } from './pages/Auth/Login';
import { Signup as SignupComponent } from './pages/Auth/Signup';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import LegalCosultation from './pages/Legal/FindLawyer';
import TaskAutomation from './components/features/TaskAutomation';
import LegalDocumentsReview from './pages/Legal/DocumentReview';
import VoiceModal from './components/VoiceModal';
import Profile from './components/Auth/Profile';
import LegalAIPortfolio from './components/LegalAIPortfolio';
import { tokenManager } from './api/apiService';
import PersonalRoom from './components/PersonalRoom';
import LawyerAdmin from './components/Lawyer/LawyerAdmin';
import ProfileTypeSelection from './components/ProfileTypeSelection';
import LawyerAdditionalDetails from './components/LawyerAdditionalDetails';
import UserOnboarding from './components/UserOnboarding';
import LandingPage from './pages/General/LandingPage';
import Pricing from './pages/General/Pricing';
import Contact from './pages/General/Contact';
import { ConsultationSession } from './components/ConsultationSession';
// Compliance pages
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LegalDisclaimer from './components/LegalDisclaimer';
import RefundPolicy from './components/RefundPolicy';
import VerifyLawyer from './pages/Legal/VerifyLawyer';
import SmartLoginPopup from './components/Auth/SmartLoginPopup';

import { fetchChatSessions } from './redux/chatSlice';

// Home Route component
const HomeRoute = () => {
  const user = tokenManager.getUser();
  const isAuthenticated = tokenManager.isAuthenticated();
  const userType = user?.user_type;
  const userRole = user?.role?.toLowerCase();

  if (isAuthenticated) {
    // Redirect lawyers to lawyer admin
    if (userType === 2 || userType === 'business' || userType === 'lawyer' || userRole === 'lawyer') {
      return <Navigate to="/lawyer-admin" replace />;
    }

    // Redirect users without type set to selection
    if (userType === null || userType === undefined || userType === 0) {
      return <Navigate to="/profile-setup/type-selection" replace />;
    }
  }

  return <LandingPage />;
};

// Layout wrapper to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch(); // Get dispatch
  const isLawyerAdmin = location.pathname.startsWith('/lawyer-admin');
  const isConsultation = location.pathname.startsWith('/consultation/');
  const isFindLawyer = location.pathname === '/legal-consoltation';
  const isLandingPage = location.pathname === '/' || location.pathname === '/pricing' || location.pathname === '/contact' || location.pathname === '/terms-of-service' || location.pathname === '/privacy-policy' || location.pathname === '/refund-policy' || location.pathname === '/disclaimer';
  const isChatbotPage = location.pathname.startsWith('/chatbot');
  const isWalletPage = location.pathname === '/wallet';
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/signup';
  const { chatHistory } = useSelector((state) => state.chat);

  // Fetch chat sessions when layout mounts (or when user logs in theoretically)
  useEffect(() => {
    if (!isLawyerAdmin && !isLandingPage && !isWalletPage) {
      dispatch(fetchChatSessions());
    }
  }, [dispatch, isLawyerAdmin, isLandingPage, isWalletPage]);

  // Manage immersive page modes for fixed viewport stability on mobile
  useEffect(() => {
    if (isChatbotPage) {
      document.body.classList.add('chatbot-mode');
    } else {
      document.body.classList.remove('chatbot-mode');
    }
    if (isConsultation) {
      document.body.classList.add('consultation-mode');
    } else {
      document.body.classList.remove('consultation-mode');
    }
    return () => {
      document.body.classList.remove('chatbot-mode');
      document.body.classList.remove('consultation-mode');
    };
  }, [isChatbotPage, isConsultation]);

  return (
    <>
      {!isLawyerAdmin && !isConsultation && <Navbar isLandingPage={isLandingPage} />}
      <ScrollToTop />
      <div className={`flex flex-1 min-h-0 ${isConsultation ? 'h-[100dvh] overflow-hidden' : ''}`}>
        {!isLawyerAdmin && !isLandingPage && !isConsultation && !isFindLawyer && !isWalletPage && !isAuthPage && <Sidebar chatHistory={chatHistory} />}
        <main className={`flex-1 min-w-0 min-h-0 relative ${isConsultation ? 'overflow-hidden' : ''}`}>
          {children}
        </main>
      </div>
      {/* Footer — shown on landing pages; other pages get FloatingThemeToggle */}
      {!isLawyerAdmin && isLandingPage && <Footer />}
      {!isLawyerAdmin && !isLandingPage && !isConsultation && <FloatingThemeToggle />}
      {!tokenManager.isAuthenticated() && (isLandingPage || isAuthPage) && <SmartLoginPopup />}
    </>
  );
};

// Role-based protection helper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = tokenManager.getUser();
  const isAuthenticated = tokenManager.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const userType = user?.user_type;

  // Check if user has any of the allowed roles, either via the role field or user_type
  const hasLawyerAccess = userRole === 'lawyer' || userType === 2 || userType === 'business' || userType === 'lawyer';
  const hasUserAccess = userRole === 'user' || userRole === 'client' || userType === 1 || userType === 'personal' || userType === 'user';

  let isAllowed = false;
  if (allowedRoles.length === 0) {
    isAllowed = true;
  } else {
    isAllowed = allowedRoles.some(role => {
      if (role === 'lawyer') return hasLawyerAccess;
      if (role === 'user' || role === 'client') return hasUserAccess;
      return userRole === role;
    });
  }

  if (!isAllowed) {
    // If lawyer tries to access user routes, redirect to lawyer-admin
    if (hasLawyerAccess) {
      return <Navigate to="/lawyer-admin" replace />;
    }
    // If user tries to access lawyer routes, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(tokenManager.isAuthenticated());

  // Listen for authentication status changes
  useEffect(() => {
    const handleAuthStatusChange = (event) => {
      console.log('App: Auth status changed, updating isAuthenticated to:', !!event.detail.authenticated);
      setIsAuthenticated(!!event.detail.authenticated);
    };

    window.addEventListener('auth-status-changed', handleAuthStatusChange);
    return () => {
      window.removeEventListener('auth-status-changed', handleAuthStatusChange);
    };
  }, []);

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
              <Route
                path="/lawyer-admin"
                element={
                  <ProtectedRoute allowedRoles={['lawyer']}>
                    <LawyerAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lawyer-admin/*"
                element={
                  <ProtectedRoute allowedRoles={['lawyer']}>
                    <LawyerAdmin />
                  </ProtectedRoute>
                }
              />

              {/* All other routes with the main layout */}
              <Route path="/*" element={
                <AppLayout>
                  <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<HomeRoute />} />

                    {/* AI Chatbot Route */}
                    <Route path="/chatbot/:sessionId?" element={<Hero />} />

                    {/* Public Routes */}
                    <Route path="/contact" element={<Contact />} />

                    {/* User Specific Protected Routes */}
                    <Route path="/verify-lawyer" element={<VerifyLawyer />} />
                    <Route path="/legal-consoltation" element={<LegalCosultation />} />
                    <Route path="/task-automation" element={
                      <ProtectedRoute allowedRoles={['user', 'client']}>
                        <TaskAutomation />
                      </ProtectedRoute>
                    } />
                    <Route path="/legal-documents-review" element={
                      <ProtectedRoute allowedRoles={['user', 'client']}>
                        <LegalDocumentsReview />
                      </ProtectedRoute>
                    } />
                    <Route path="/personal-room" element={
                      <ProtectedRoute allowedRoles={['user', 'client']}>
                        <PersonalRoom />
                      </ProtectedRoute>
                    } />

                    <Route path="/voice-modal" element={<VoiceModal />} />
                    <Route path="/portfolio" element={<LegalAIPortfolio />} />
                    <Route path="/wallet" element={isAuthenticated ? <WalletLayout /> : <Navigate to="/auth" replace />} />
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Compliance / Legal Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/disclaimer" element={<LegalDisclaimer />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />

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
                    <Route path="/consultation/:sessionToken" element={isAuthenticated ? <ConsultationSession /> : <Navigate to="/auth" replace />} />

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
