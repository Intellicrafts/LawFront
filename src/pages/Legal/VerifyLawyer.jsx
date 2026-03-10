import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Search, AlertCircle, CheckCircle, MapPin, Calendar, User, Briefcase, ChevronRight, Loader2, Phone, Mail, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { verificationService } from '../../services/verificationService';
import { authAPI } from '../../api/apiService';

const VerifyLawyer = () => {
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';


    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [state, setState] = useState('Uttar Pradesh');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loadingText, setLoadingText] = useState('Connecting to Bar Council...');

    const states = [
        'Uttar Pradesh',
        'Delhi',
        'Andhra Pradesh',
        'Rajasthan'
    ];

    // Dynamic loading messages
    React.useEffect(() => {
        let interval;
        if (loading) {
            const messages = [
                'Connecting to Bar Council...',
                'Searching official records...',
                'Verifying credentials...',
                'This is taking a bit longer...',
                'Still trying to fetch data...'
            ];
            let i = 0;
            setLoadingText(messages[0]);
            interval = setInterval(() => {
                i = (i + 1) % messages.length;
                setLoadingText(messages[i]);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Helper functions for masking PII
    const maskName = (name) => {
        if (!name) return '';
        const parts = name.split(' ');
        return parts.map((part, index) => {
            if (index === 0) return part;
            return part.charAt(0) + '*'.repeat(part.length - 1);
        }).join(' ');
    };

    const maskMobile = (mobile) => {
        if (!mobile || mobile.length < 4) return '******';
        return mobile.slice(0, 2) + '*'.repeat(mobile.length - 4) + mobile.slice(-2);
    };

    const maskEmail = (email) => {
        if (!email) return '';
        const [user, domain] = email.split('@');
        if (!user || !domain) return email;
        return `${user.charAt(0)}****@${domain}`;
    };

    const maskAddress = (address) => {
        if (!address || address.length < 10) return '******';
        return address.slice(0, 8) + '******' + address.slice(-5);
    };

    const validateStateMismatch = (enrollment, selectedState) => {
        const cleanEnrollment = enrollment.trim().toUpperCase();
        if (selectedState === 'Delhi' && !cleanEnrollment.startsWith('D/')) return 'Start with "D/" for Delhi';
        if (selectedState === 'Uttar Pradesh' && !cleanEnrollment.startsWith('UP')) return 'Start with "UP" for Uttar Pradesh';
        if (selectedState === 'Rajasthan' && !cleanEnrollment.startsWith('R/')) return 'Start with "R/" for Rajasthan';
        if (selectedState === 'Andhra Pradesh' && !cleanEnrollment.startsWith('AP/')) return 'Start with "AP/" for Andhra Pradesh';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!enrollmentNumber.trim()) return;

        const warning = validateStateMismatch(enrollmentNumber, state);
        if (warning) {
            if (!window.confirm(`Potential mismatch: Enrollment number for ${state} usually should ${warning}. Continue anyway?`)) {
                return;
            }
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await verificationService.verifyLawyer(enrollmentNumber, state);
            setResult(data);

            // If user is logged in, try to update their status
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    if (user && user.id && user.user_type === 2) { // 2 = Lawyer
                        console.log('[VerifyLawyer] Logged-in lawyer verified, updating status...');
                        await authAPI.updateLawyerStatus(user.id, 'Bar Council Verified', data);
                    }
                } catch (e) {
                    console.error('[VerifyLawyer] Error updating lawyer status:', e);
                }
            }
        } catch (err) {
            console.error("Verification Error:", err);
            let userMessage = 'Failed to verify lawyer details. Please check the enrollment number and try again.';

            if (err.message && (
                err.message.includes('Page.click') ||
                err.message.includes('Target page') ||
                err.message.includes('browser has been closed') ||
                err.message.includes('Timeout')
            )) {
                userMessage = 'Verification Failed: The lawyer may not be registered with the State Bar Council, or the council\'s server is temporarily unavailable.';
            } else {
                userMessage = err.message || userMessage;
            }
            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark
            ? 'bg-[#0A0A0A]'
            : 'bg-white'
            }`}
        >
            {/* Zoomed-out wrapper */}
            <div className="scale-[0.92] origin-top pt-24 pb-12 px-4">

                {/* Ambient Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? 'bg-verified-500/5' : 'bg-verified-100/40'}`} />
                    <div className={`absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${isDark ? 'bg-brand-500/5' : 'bg-brand-100/30'}`} />
                </div>

                <div className="relative max-w-4xl mx-auto">

                    {/* Page Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5
                                ${isDark
                                    ? 'bg-verified-500/10 text-verified-400 border border-verified-500/20 backdrop-blur-sm'
                                    : 'bg-verified-50 text-verified-700 border border-verified-200'
                                }`}
                            >
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Official Bar Council Verification
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className={`text-3xl md:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-brand-900'}`}
                        >
                            Verify Your Lawyer
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                            Instantly verify a lawyer's credentials against official State Bar Council records. Ensure you're hiring a licensed professional.
                        </motion.p>
                    </div>

                    {/* Search Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`p-6 md:p-8 rounded-2xl mb-8 transition-all duration-300 ${isDark
                            ? 'bg-[#111111]/80 backdrop-blur-sm border border-gray-800/60 shadow-2xl shadow-black/20'
                            : 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl shadow-gray-200/50'
                            }`}
                    >
                        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr,auto,auto] gap-4">
                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Enrollment Number
                                </label>
                                <div className="relative">
                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        value={enrollmentNumber}
                                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                                        placeholder="e.g. UP1234/2020"
                                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 text-sm font-medium ${isDark
                                            ? 'bg-[#0A0A0A] border-gray-700/60 focus:border-verified-500/50 text-white placeholder-gray-600'
                                            : 'bg-gray-50 border-gray-200 focus:border-verified-500 text-gray-900 placeholder-gray-400'
                                            } border-2 focus:ring-2 focus:ring-verified-500/10`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    State Bar Council
                                </label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={`w-full md:w-56 px-4 py-3.5 rounded-xl outline-none transition-all duration-300 appearance-none text-sm font-medium ${isDark
                                        ? 'bg-[#0A0A0A] border-gray-700/60 focus:border-verified-500/50 text-white'
                                        : 'bg-gray-50 border-gray-200 focus:border-verified-500 text-gray-900'
                                        } border-2 focus:ring-2 focus:ring-verified-500/10`}
                                >
                                    {states.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto h-[52px] px-7 bg-gradient-to-r from-verified-500 to-verified-600 hover:from-verified-600 hover:to-verified-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-verified-500/20 hover:shadow-verified-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Now
                                            <ChevronRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Progress Bar for Loading */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6"
                                >
                                    <div className="flex justify-between items-center mb-2 text-xs font-medium">
                                        <span className="text-verified-500">{loadingText}</span>
                                        <span className={`animate-pulse ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Please wait...</span>
                                    </div>
                                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-verified-500 to-verified-400 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: '90%' }}
                                            transition={{ duration: 15, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className={`text-[10px] mt-2 text-center font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        This usually takes 10-20 seconds to fetch live data.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-xl flex items-start gap-3 mb-8 border ${isDark
                                    ? 'bg-red-500/5 border-red-500/20 text-red-400'
                                    : 'bg-red-50 border-red-200 text-red-600'
                                    }`}
                            >
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-sm">Verification Failed</h3>
                                    <p className="text-xs mt-1 opacity-80">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Result Card */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl overflow-hidden border ${isDark
                                    ? 'bg-[#111111]/80 border-gray-800 backdrop-blur-sm'
                                    : 'bg-white border-gray-200 shadow-xl'
                                    }`}
                            >
                                {/* Header Banner */}
                                <div className="bg-gradient-to-r from-verified-600 via-verified-500 to-verified-600 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm text-white">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-white font-bold text-base">Verified Lawyer</h2>
                                            <p className="text-verified-100 text-xs font-medium">Official Record Found</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                                        Active
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                    {/* Primary Details */}
                                    <div className="space-y-5">
                                        <div className="flex gap-3">
                                            <User className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Full Name</p>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.name || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Briefcase className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Enrollment Number</p>
                                                <p className={`text-base font-mono font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.enrollment_number || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Calendar className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Enrollment Date</p>
                                                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.enrollment_date || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Details */}
                                    <div className="space-y-5">
                                        <div className="flex gap-3">
                                            <User className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Father's Name</p>
                                                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {result.father_name ? maskName(result.father_name) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <MapPin className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Registered Address</p>
                                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{result.address ? maskAddress(result.address) : 'N/A'}</p>
                                            </div>
                                        </div>

                                        {result.email && result.email !== 'Not Applicable' && (
                                            <div className="flex gap-3">
                                                <Mail className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
                                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{maskEmail(result.email)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {result.mobile_no && (
                                            <div className="flex gap-3">
                                                <Phone className={`h-4 w-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Mobile</p>
                                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{maskMobile(result.mobile_no)}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                            <p className={`text-[10px] text-center font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                                Source: Bar Council of {state}. Verified at {new Date().toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Feature Cards */}
                    <div className="mt-10 grid md:grid-cols-3 gap-4">
                        {[
                            { icon: Shield, title: '100% Free', desc: 'No hidden charges or subscriptions.' },
                            { icon: BadgeCheck, title: 'Official Data', desc: 'Sourced directly from Bar Councils.' },
                            { icon: Search, title: 'Real-time', desc: 'Live check, not a stale database.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className={`p-5 rounded-xl text-center transition-all duration-300 hover:scale-[1.02] ${isDark
                                    ? 'bg-[#111111]/60 border border-gray-800/50 hover:border-verified-500/20'
                                    : 'bg-white/80 border border-gray-100 shadow-sm hover:shadow-md hover:border-verified-200'
                                    }`}
                            >
                                <feature.icon className={`h-5 w-5 mx-auto mb-2 ${isDark ? 'text-verified-400' : 'text-verified-500'}`} />
                                <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyLawyer;
