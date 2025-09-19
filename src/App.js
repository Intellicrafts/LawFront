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
import Services from './components/Services';
import PracticeAreas from './components/PracticeAreas';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Founders from './components/Founders';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Login as AuthComponent } from './components/AuthComponent';
import { Signup as SignupComponent } from './components/SignupComponent';
import { ForgotPassword } from './components/ForgotPassword';
import LegalCosultation from './components/LegalCosultation';
import TaskAutomation from './components/TaskAutomation';
import OurStory from './components/OurStory';
import OurTeam from './components/OurTeam';
import InformationHub from './components/InformationHub';
import LegalDocumentsReview from './components/LegalDocumentsReview';
import VoiceModal from './components/VoiceModal';
import Profile from './components/Auth/Profile';
import VirtualBakil from './components/VirtualBakil';
import LegalAIPortfolio from './components/LegalAIPortfolio';
import { tokenManager } from './api/apiService';
import PersonalRoom from './components/PersonalRoom';
import LawyerAdmin from './components/Lawyer/LawyerAdmin';
import ProfileTypeSelection from './components/ProfileTypeSelection';
import LawyerAdditionalDetails from './components/LawyerAdditionalDetails';
import TestEnhancedComponents from './components/TestEnhancedComponents';

// Layout wrapper to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLawyerAdmin = location.pathname.startsWith('/lawyer-admin');
  
  return (
    <>
      {!isLawyerAdmin && <Navbar />}
      <ScrollToTop />
      {children}
      {!isLawyerAdmin && <Footer />}
      {!isLawyerAdmin && <FloatingThemeToggle />}
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

  // Initialize chat widget
  // useEffect(() => {
  //   // Initialize Tawk.to chat widget
  //   var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
  //   (function () {
  //     var s1 = document.createElement("script"),
  //       s0 = document.getElementsByTagName("script")[0];
  //     s1.async = true;
  //     s1.src = 'https://embed.tawk.to/6824eb76f9b7b6191418efbe/1ir83ficf';
  //     s1.charset = 'UTF-8';
  //     s1.setAttribute('crossorigin', '*');
  //     s0.parentNode.insertBefore(s1, s0);
  //   })();
  // }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <ToastProvider>
          <div className={`app-container min-h-screen transition-colors duration-300 ${
            mode === 'dark' 
              ? 'dark bg-gray-900 text-gray-100' 
              : 'bg-white text-gray-900'
        }`}>
          <Routes>
            {/* LawyerAdmin with its own layout (no main Navbar/Footer) */}
            <Route path="/lawyer-admin/*" element={<LawyerAdmin />} />
            
            {/* All other routes with the main layout */}
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  {/* Home Route */}
                  <Route path="/" element={
                    <>
                      <Hero />
                      <Services />
                      <PracticeAreas />
                      <About />
                      <Testimonials />
                      <Founders />
                      <Contact />
                    </>
                  } />

                  {/* Public Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/legal-consoltation" element={<LegalCosultation />} />
                  <Route path="/task-automation" element={<TaskAutomation />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/our-team" element={<OurTeam />} />
                  <Route path="/information-hub" element={<InformationHub />} />
                  <Route path="/legal-documents-review" element={<LegalDocumentsReview />} />
                  <Route path="/voice-modal" element={<VoiceModal />} />
                  <Route path="/virtual-bakil" element={<VirtualBakil />} />
                  <Route path="/portfolio" element={<LegalAIPortfolio />} />
                  <Route path="/personal-room" element={<PersonalRoom />} />
                  <Route path="/test-enhanced" element={<TestEnhancedComponents />} />

                  {/* Authentication Routes */}
                  <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthComponent />} />
                  <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupComponent />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Profile Setup Routes */}
                  <Route path="/profile-setup/type-selection" element={isAuthenticated ? <ProfileTypeSelection /> : <Navigate to="/auth" replace />} />
                  <Route path="/profile-setup/lawyer-details" element={isAuthenticated ? <LawyerAdditionalDetails /> : <Navigate to="/auth" replace />} />

                  {/* Protected Routes */}
                  <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} />

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
