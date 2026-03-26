import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Wallet, ArrowRight, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const PromoCeremonyPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState('0');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the flag is stored in sessionStorage
    const promoAmount = sessionStorage.getItem('showPromoCeremony');
    
    // Do not show on auth or setup pages
    const isAuthPage = window.location.pathname.includes('/auth') || 
                       window.location.pathname.includes('/signup') ||
                       window.location.pathname.includes('/profile-setup');
    
    if (promoAmount && !isAuthPage) {
      setAmount(promoAmount);
      
      // Delay showing the popup for 3.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Clear it so it doesn't show again
        sessionStorage.removeItem('showPromoCeremony');
      }, 3500);

      // Handle window resize for confetti
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
        {/* Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm pointer-events-auto"
          onClick={() => setIsVisible(false)}
        />
        
        {/* Confetti */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              gravity={0.15}
            />
        </div>

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-sm mx-4 pointer-events-auto"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors z-20 border border-gray-100 dark:border-gray-700"
          >
            <X size={14} />
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl overflow-hidden border border-brand-100 dark:border-brand-900/30">
            {/* Header / Graphic Area */}
            <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 px-5 py-8 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-300 opacity-20 rounded-full -ml-5 -mb-5 blur-xl"></div>
              
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-white/30"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <Gift className="text-brand-600 w-6 h-6" />
                </div>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white text-xl font-bold mt-5 mb-1"
              >
                Welcome to MeraBakil!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-brand-100 text-[13px] font-medium"
              >
                Your account is ready and we have a gift for you.
              </motion.p>
            </div>

            {/* Content Area */}
            <div className="p-5 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="inline-flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-5 py-2.5 rounded-xl mb-4 border border-green-100 dark:border-green-800"
              >
                <span className="text-lg font-bold tracking-tight">₹{amount}</span>
                <span className="text-xs font-semibold">Promotional Credits Added</span>
              </motion.div>

              <p className="text-gray-600 dark:text-gray-300 text-[13px] mb-6 leading-relaxed">
                We've instantly credited your wallet with ₹{amount} to help you get started. Enjoy our premium legal services immediately!
              </p>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    setIsVisible(false);
                    navigate('/wallet');
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-brand-500/20"
                >
                  <Wallet size={16} />
                  <span>Check My Wallet</span>
                </button>
                
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors"
                >
                  <span>Explore Services</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PromoCeremonyPopup;
