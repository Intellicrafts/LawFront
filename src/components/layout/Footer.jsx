import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Scale,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Bot,
  FileText,
  Shield,
  ArrowRight,
} from 'lucide-react';

const Footer = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const currentYear = new Date().getFullYear();

  const practiceAreas = [
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Property Law',
    'Tax Law',
    'Intellectual Property',
  ];

  const quickLinks = [
    { label: 'AI Assistant', to: '/chatbot', icon: Bot },
    { label: 'Find Lawyers', to: '/legal-consoltation', icon: Scale },
    { label: 'Verify Lawyer', to: '/verify-lawyer', icon: BadgeCheck },
    { label: 'Documents', to: '/legal-documents-review', icon: FileText },
  ];

  const legalLinks = [
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Refund Policy', to: '/refund-policy' },
  ];

  return (
    <footer className={`transition-colors duration-500 ${isDark
      ? 'bg-[#0A0A0A] border-t border-gray-800/60'
      : 'bg-white border-t border-gray-200'
      }`}
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-300 transition-all">
                Mera Vakil
              </span>
            </Link>
            <p className={`text-xs leading-relaxed mb-4 max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              India's AI-powered legal marketplace. Get instant legal guidance, connect with verified lawyers, and manage legal documents — all from one platform.
            </p>
            <div className="space-y-1.5">
              <a href="mailto:info@meravakil.com" className={`flex items-center gap-2 text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <Mail className="h-3 w-3" />
                info@meravakil.com
              </a>
              <a href="tel:+917017858269" className={`flex items-center gap-2 text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <Phone className="h-3 w-3" />
                +91 7017858269
              </a>
              <p className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <MapPin className="h-3 w-3" />
                Greater Noida, India
              </p>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Practice Areas
            </h4>
            <ul className="space-y-1.5">
              {practiceAreas.map((area, i) => (
                <li key={i}>
                  <span className={`text-xs cursor-default ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-2 text-xs font-medium transition-colors group ${isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-brand-600'
                      }`}
                  >
                    <link.icon className="h-3 w-3" />
                    {link.label}
                    <ArrowRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Legal
            </h4>
            <ul className="space-y-1.5">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className={`text-xs font-medium transition-colors ${isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-brand-600'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className={`text-[11px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            © {currentYear} Mera Vakil. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-[10px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <Shield className="h-2.5 w-2.5" />
              256-bit SSL
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <BadgeCheck className="h-2.5 w-2.5" />
              Verified Lawyers
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <Bot className="h-2.5 w-2.5" />
              AI-Powered
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;