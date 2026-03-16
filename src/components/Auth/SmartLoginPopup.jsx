import React, { useEffect, useState } from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Scale } from 'lucide-react';
import { authAPI, tokenManager, walletAPI } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';

/**
 * SmartLoginPopup
 * A professionally designed, floating glassmorphism container that wraps
 * Google's One Tap Login. It is fully dark/light mode compatible.
 * It waits for the user to explicitly click (auto_select: false).
 */
const SmartLoginPopup = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [isVisible, setIsVisible] = useState(false);
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';

    // Set visibility with a slight delay so it drops in elegantly
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useGoogleOneTapLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await authAPI.googleLogin(tokenResponse.credential);
                
                if (response.data.data && (response.data.data.token || response.data.data.access_token)) {
                    const token = response.data.data.token || response.data.data.access_token;
                    tokenManager.setToken(token);
            
                    if (response.data.data.user) {
                      tokenManager.setUser(response.data.data.user);
                    }
                    
                    window.dispatchEvent(new CustomEvent('auth-status-changed', {
                        detail: { authenticated: true, user: response.data.data.user }
                    }));
            
                    showSuccess(`Smart Login Successful! Welcome back.`);
                    setIsVisible(false);
                    
                    const user = response.data.data.user;
                    const userType = user?.user_type;
                    const role = user?.role?.toLowerCase();
                    
                    let redirectUrl = '/';
                    if (userType === 2 || userType === 'business' || userType === 'lawyer' || role === 'lawyer') {
                      redirectUrl = '/lawyer-admin';
                    } else if (userType === 1 || userType === 'personal' || userType === 'user' || role === 'user' || role === 'client') {
                      redirectUrl = '/';
                    } else if (userType === null || userType === undefined || userType === 0) {
                      redirectUrl = '/profile-setup/type-selection';
                    }
                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error("Smart Login Error:", error);
                showError("Google login failed. Please try again.");
            }
        },
        onError: (error) => {
            // Silently ignore dismissed one tap prompt errors as this is expected behavior
        },
        auto_select: false,
        prompt_parent_id: "google-one-tap-container", // Mount point for iframe
        cancel_on_tap_outside: false
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`fixed top-[80px] right-4 md:right-8 z-[9999] w-[350px] md:w-[400px] overflow-hidden rounded-2xl border backdrop-blur-md shadow-2xl ${isDark
                            ? 'bg-gray-900/80 border-gray-700 shadow-teal-900/20'
                            : 'bg-white/90 border-gray-200 shadow-gray-200/50'
                        }`}
                >
                    {/* Header Strip */}
                    <div className={`px-4 py-3 flex items-center justify-between border-b ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/80'}`}>
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-brand-900/50' : 'bg-brand-50'}`}>
                                <Scale className={`w-4 h-4 ${isDark ? 'text-brand-400' : 'text-brand-600'}`} />
                            </div>
                            <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                MeraBakil <span className="text-xs font-normal opacity-70 ml-1">Smart Login</span>
                            </span>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            aria-label="Close smart login"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 relative">
                        {/* Decorative background vectors */}
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10 blur-xl pointer-events-none">
                            <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`}></div>
                        </div>

                        <div className="mb-4">
                            <h3 className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Sparkles className="w-4 h-4 text-brand-500" />
                                Seamless Access
                            </h3>
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                We've detected your Google account. Tap below to securely sign in without a password.
                            </p>
                        </div>

                        {/* Google One Tap Mount Point */}
                        <div className="w-full flex justify-center py-2 relative z-10 min-h-[50px] items-center">
                            {/* The Google library will inject the iframe directly into this div */}
                            <div id="google-one-tap-container" className="w-full flex justify-center scale-95 transform origin-center"></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SmartLoginPopup;
