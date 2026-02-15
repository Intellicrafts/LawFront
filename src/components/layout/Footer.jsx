import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaMapMarkerAlt,
  FaEnvelopeOpenText,
  FaPhoneAlt
} from 'react-icons/fa';
import { Shield, Scale, Bot } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Footer Component — Mera Vakil
   Displays brand info, legal links, categories,
   contact info, and compliance badges.
   ────────────────────────────────────────────────── */

const categories = [
  'Criminal',
  'Family',
  'Corporate',
  'Immigration',
  'Civil',
  'Property',
];

const Footer = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  // Reusable link style
  const linkClass = isDark
    ? 'text-gray-400 hover:text-brand-400 transition-colors'
    : 'text-gray-600 hover:text-brand-600 transition-colors';

  return (
    <footer
      className={`transition-colors duration-300 py-12 px-4 md:px-8
      ${isDark
          ? 'bg-brand-950 border-t border-gray-800 text-gray-300'
          : 'bg-gray-50 border-t border-gray-200 text-gray-800'}`}
    >
      <div className="container mx-auto max-w-6xl">
        {/* ── Main Grid ────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-brand-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Mera Vakil
              </span>
            </Link>
            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              India's AI-powered legal marketplace. Get instant legal guidance, consult verified lawyers, and draft documents — pay only for what you use.
            </p>
            {/* Trust badges row */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge-verified">
                <Shield className="h-3 w-3" /> 256-bit Encrypted
              </span>
              <span className="badge-verified">
                <Bot className="h-3 w-3" /> AI-Powered
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Practice Areas
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map(cat => (
                <li key={cat}>
                  <Link to="/consultation" className={linkClass}>
                    {cat} Law
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/consultation" className={linkClass}>Find a Lawyer</Link></li>
              <li><Link to="/chatbot" className={linkClass}>AI Assistant</Link></li>
              <li><Link to="/pricing" className={linkClass}>Pricing</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact Us</Link></li>
            </ul>
            {/* Legal / Compliance links */}
            <h4 className={`font-semibold mt-6 mb-3 text-sm uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className={linkClass}>Terms of Service</Link></li>
              <li><Link to="/disclaimer" className={linkClass}>Legal Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className={`flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaMapMarkerAlt className="mt-0.5 flex-shrink-0" /> Greater Noida, India
              </li>
              <li className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaPhoneAlt className="flex-shrink-0" /> +91 95578 24745
              </li>
              <li className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaEnvelopeOpenText className="flex-shrink-0" /> support@meravakil.com
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────── */}
        <div className={`mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm
          ${isDark
            ? 'border-t border-gray-800 text-gray-500'
            : 'border-t border-gray-200 text-gray-500'}`}
        >
          <p>© {new Date().getFullYear()} Mera Vakil. All rights reserved.</p>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Mera Vakil is a technology platform — not a law firm. AI features are informational and do not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;