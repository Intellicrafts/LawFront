import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import './index.css';


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
import { ForgotPassword as ForgotPassword } from './components/ForgotPassword';
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
import { authAPI, tokenManager } from './api/apiService';
import PersonalRoom from './components/PersonalRoom';
import LawyerAdmin from './components/Lawyer/LawyerAdmin';

const App = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isAuthenticated = tokenManager.isAuthenticated();

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Initialize Tawk.to chat widget
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6824eb76f9b7b6191418efbe/1ir83ficf';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-mode bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <Navbar />
        <ScrollToTop />

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
          <Route path="/lawyer-admin" element={<LawyerAdmin />} />
          

          {/* Authentication Routes */}
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthComponent />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
