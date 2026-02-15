import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Search, AlertCircle, CheckCircle, MapPin, Calendar, User, Briefcase, ChevronRight, Loader2, Phone, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { verificationService } from '../../services/verificationService';

const VerifyLawyer = () => {
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';

    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [state, setState] = useState('Uttar Pradesh');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const states = [
        'Uttar Pradesh',
        'Delhi',
        'Andhra Pradesh',
        'Rajasthan'
    ];

    // Helper functions for masking PII
    const maskName = (name) => {
        if (!name) return '';
        const parts = name.split(' ');
        return parts.map((part, index) => {
            if (index === 0) return part; // Keep first name
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
        return user.charAt(0) + '****' + '@' + domain;
    };

    const maskAddress = (address) => {
        if (!address || address.length < 10) return '******';
        return address.slice(0, 8) + '******' + address.slice(-5);
    };

    const validateStateMismatch = (enrollment, selectedState) => {
        const cleanEnrollment = enrollment.trim().toUpperCase();
        if (selectedState === 'Delhi' && !cleanEnrollment.startsWith('D/')) return 'Start with "D/" for Delhi';
        if (selectedState === 'Uttar Pradesh' && !cleanEnrollment.startsWith('UP')) return 'Start with "UP" for UP';
        if (selectedState === 'Rajasthan' && !cleanEnrollment.startsWith('R/')) return 'Start with "R/" for Rajasthan';
        if (selectedState === 'Andhra Pradesh' && !cleanEnrollment.startsWith('AP/')) return 'Start with "AP/" for Andhra Pradesh';
        return null; // OK
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!enrollmentNumber.trim()) return;

        // Check for common mismatches
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
        } catch (err) {
            setError(err.message || 'Failed to verify lawyer details. Please check the enrollment number and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-12 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verified-100 text-verified-700 font-medium text-sm mb-4">
                        <BadgeCheck className="h-4 w-4" />
                        Official Bar Council Verification
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Verify Your Lawyer</h1>
                    <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Instantly verify a lawyer's credentials against official State Bar Council records. ensure you're hiring a licensed professional.
                    </p>
                </div>

                <div className={`p-6 md:p-8 rounded-2xl shadow-xl mb-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr,auto,auto] gap-4">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Enrollment Number
                            </label>
                            <div className="relative">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    value={enrollmentNumber}
                                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                                    placeholder="e.g. UP1234/2020"
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all ${isDark
                                        ? 'bg-gray-900 border-gray-700 focus:border-verified-500 text-white placeholder-gray-600'
                                        : 'bg-gray-50 border-gray-200 focus:border-verified-500 text-gray-900'
                                        } border-2`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                State Bar Council
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className={`w-full md:w-64 px-4 py-4 rounded-xl outline-none transition-all appearance-none ${isDark
                                    ? 'bg-gray-900 border-gray-700 focus:border-verified-500 text-white'
                                    : 'bg-gray-50 border-gray-200 focus:border-verified-500 text-gray-900'
                                    } border-2`}
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
                                className="w-full md:w-auto h-[60px] px-8 bg-verified-600 hover:bg-verified-700 text-white rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-verified-600/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Now
                                        <ChevronRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Progress Bar for Long Loading Times */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6"
                            >
                                <div className="flex justify-between items-center mb-2 text-sm text-verified-600 font-medium">
                                    <span>Connecting to Bar Council...</span>
                                    <span className="animate-pulse">Checking records...</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-verified-500"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '90%' }}
                                        transition={{ duration: 15, ease: "easeOut" }} // Slow progress for scrapping time
                                    />
                                </div>
                                <p className={`text-xs mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    This usually takes 10-20 seconds to fetch live data.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl flex items-start gap-3 mb-8"
                        >
                            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Verification Failed</h3>
                                <p className="text-sm mt-1">{error}</p>
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
                            className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl'}`}
                        >
                            <div className="bg-gradient-to-r from-verified-600 to-verified-500 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm text-white">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">Verified Lawyer</h2>
                                        <p className="text-verified-100 text-sm">Official Record Found</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                                    Active
                                </div>
                            </div>

                            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                {/* Primary Details - Always Present */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <User className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Briefcase className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enrollment Number</p>
                                            <p className={`text-lg font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.enrollment_number || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Calendar className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enrollment Date</p>
                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{result.enrollment_date || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Details - Dynamic */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <User className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Father's Name</p>
                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {result.father_name ? maskName(result.father_name) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <MapPin className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Registered Address</p>
                                            <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{result.address ? maskAddress(result.address) : 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Additional Dynamic Fields */}
                                    {/* Additional Dynamic Fields */}
                                    {result.email && result.email !== 'Not Applicable' && (
                                        <div className="flex gap-4">
                                            <Mail className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <div>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                                                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{maskEmail(result.email)}</p>
                                            </div>
                                        </div>
                                    )}
                                    {result.mobile_no && (
                                        <div className="flex gap-4">
                                            <Phone className={`h-5 w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <div>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
                                                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{maskMobile(result.mobile_no)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 text-center">
                                            Source: Bar Council of {state}. Verified at {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        { title: '100% Free', desc: 'No hidden charges or subscriptions.' },
                        { title: 'Official Data', desc: 'Sourced directly from Bar Councils.' },
                        { title: 'Real-time', desc: 'Live check, not a stale database.' }
                    ].map((feature, i) => (
                        <div key={i} className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
                            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VerifyLawyer;
