import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaMapMarkerAlt,
  FaEnvelopeOpenText,
  FaPhoneAlt
} from 'react-icons/fa';

const categories = [
  'All',
  'Criminal',
  'Family',
  'Corporate',
  'Immigration',
  'Civil',
];

const Footer = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  
  return (
    <footer className={`transition-colors duration-300 py-8 px-4 mt-12 mb-16 md:mb-0
      ${isDark 
        ? 'bg-gray-900 border-t border-gray-800 text-gray-300' 
        : 'bg-white border-t border-gray-200 text-gray-800'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))",
                WebkitBackgroundClip: "text",
              }}
            >
              Mera Bakil
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Find and book consultations with top-rated legal professionals.
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.filter(cat => cat !== 'All').map(cat => (
                <li key={cat}>
                  <a href="#" className={`${isDark 
                    ? 'text-gray-400 hover:text-blue-400' 
                    : 'text-gray-600 hover:text-blue-700'}`}>
                    {cat} Law
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className={`${isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-700'}`}>
                  Find a Lawyer
                </a>
              </li>
              <li>
                <a href="#" className={`${isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-700'}`}>
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className={`${isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-700'}`}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className={`${isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-700'}`}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaMapMarkerAlt /> Greater Noida India
              </li>
              <li className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaPhoneAlt /> +1 (91) 9557 824 745
              </li>
              <li className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaEnvelopeOpenText /> info@merabakil.com
              </li>
            </ul>
          </div>
        </div>
        <div className={`mt-8 pt-6 text-center text-sm 
          ${isDark 
            ? 'border-t border-gray-800 text-gray-500' 
            : 'border-t border-gray-200 text-gray-600'}`}
        >
          <p>© 2025 LegalConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;