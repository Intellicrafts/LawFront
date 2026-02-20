
import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase, Award, Shield,
    Camera, Edit3, Check, X, ShieldCheck, Globe, Star,
    Linkedin, Twitter, Facebook, ExternalLink, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../api/apiService';
import { verificationService } from '../../services/verificationService';
import Avatar from '../common/Avatar';

const GlassCard = ({ children, className = "", darkMode, hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -2, shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } : {}}
        className={`
      relative overflow-hidden rounded-[20px] border transition-all duration-300
      ${darkMode
                ? 'bg-neutral-900/60 border-white/5 backdrop-blur-xl'
                : 'bg-white/80 border-slate-200/50 backdrop-blur-lg shadow-sm'
            }
      ${className}
    `}
    >
        {children}
    </motion.div>
);

const PremiumBadge = ({ text, type = 'primary' }) => {
    const styles = {
        primary: 'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20',
        secondary: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[type]}`}>
            {text}
        </span>
    );
};

const VerificationStatusCard = ({ userData, darkMode, onVerificationSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [stateVal, setStateVal] = useState('Uttar Pradesh');
    const [manualEnrollment, setManualEnrollment] = useState('');

    const getEnrollmentValue = () => {
        if (!userData) return '';
        return userData.enrollment_no ||
            userData.enrollment_number ||
            userData.lawyer_details?.enrollment_no ||
            userData.lawyer_profile?.enrollment_number ||
            '';
    };

    const initialEnrollment = getEnrollmentValue();
    const hasEnrollmentInProfile = !!initialEnrollment;

    // Determine verification level
    // Assuming backend returns userData.verification_level (0=Pending, 1=Level1, 2=Admin)
    // If not, we infer: if is_verified is true, it's Level 2 (Admin). Else 0.
    const [localLevel, setLocalLevel] = useState(userData?.verification_level != null ? userData?.verification_level : (userData?.is_verified ? 2 : 0));

    const statesList = [
        'Uttar Pradesh', 'Delhi', 'Andhra Pradesh', 'Rajasthan'
    ];

    const handleVerifyClick = async () => {
        const finalEnrollment = hasEnrollmentInProfile ? initialEnrollment : manualEnrollment.trim();

        if (!finalEnrollment) {
            setError("Please enter your Bar Council Enrollment Number.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await verificationService.verifyLawyer(finalEnrollment, stateVal);
            setSuccess(true);
            setLocalLevel(1); // Satyapan verified successfully
            if (onVerificationSuccess) onVerificationSuccess();
        } catch (err) {
            setError(err.message || 'Verification failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard darkMode={darkMode} className="p-4 space-y-4">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Verification Status</h3>

            <div className="space-y-4">
                {/* Step 1: Satyapan Verification */}
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${localLevel >= 1 ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {localLevel >= 1 ? <Check size={12} strokeWidth={3} /> : <span className="text-[10px] font-bold">1</span>}
                    </div>
                    <div className="flex-1">
                        <p className={`text-[12px] font-black ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Level 1: Bar Council</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 mb-2">Automated verification via Satyapan API</p>

                        {localLevel === 0 && (
                            <div className="space-y-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                {!hasEnrollmentInProfile && (
                                    <>
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mt-1">Enrollment Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. UP1234/2020"
                                            className={`w-full text-[11px] font-medium p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${darkMode ? 'bg-[#0A0A0A] border-slate-700 text-slate-200 placeholder-slate-600' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400 shadow-sm'}`}
                                            value={manualEnrollment}
                                            onChange={(e) => setManualEnrollment(e.target.value)}
                                            disabled={loading}
                                        />
                                    </>
                                )}

                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mt-1">Select State Council</label>
                                <select
                                    className={`w-full text-[11px] font-medium p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${darkMode ? 'bg-[#0A0A0A] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
                                    value={stateVal}
                                    onChange={(e) => setStateVal(e.target.value)}
                                    disabled={loading}
                                >
                                    {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <button
                                    onClick={handleVerifyClick}
                                    disabled={loading}
                                    className="w-full mt-1 py-2 px-3 rounded-lg text-[11px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                    {loading ? 'Verifying...' : 'Verify Credentials Now'}
                                </button>
                                {error && <p className="text-[10px] font-medium text-red-500 mt-2 flex items-start gap-1"><AlertCircle size={12} className="flex-shrink-0 mt-0.5" /> <span>{error}</span></p>}
                            </div>
                        )}
                        {localLevel >= 1 && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded-md w-max">
                                <CheckCircle size={12} /> Verified successfully
                            </div>
                        )}
                    </div>
                </div>

                <div className="ml-2.5 w-0.5 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>

                {/* Step 2: Admin Verification */}
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${localLevel >= 2 ? 'bg-verified-500 text-white shadow-lg shadow-verified-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {localLevel >= 2 ? <Check size={12} strokeWidth={3} /> : <span className="text-[10px] font-bold">2</span>}
                    </div>
                    <div className="flex-1">
                        <p className={`text-[12px] font-black ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Level 2: Admin Approval</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 mb-2">Manual review by MeraBakil team</p>

                        {localLevel === 1 && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md w-max">
                                <AlertCircle size={12} /> Awaiting manual review
                            </div>
                        )}
                        {localLevel >= 2 && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-verified-500 bg-verified-500/10 px-2 py-1 rounded-md w-max">
                                <CheckCircle size={12} /> Fully Verified
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

const LawyerProfile = ({ darkMode }) => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await authAPI.getUserProfile();
                setUserData(profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? 'border-white/20 border-t-white' : 'border-slate-200 border-t-slate-900'}`} />
        </div>
    );

    return (
        <div className="p-4 sm:p-5 space-y-5 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Flare */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <PremiumBadge text="Professional Identity" type="secondary" />
                        <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Portfolio</span>
                    </div>
                    <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Academic <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Profile</span>
                    </h1>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${isEditing
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : (darkMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800')
                        }`}
                >
                    {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                    {isEditing ? 'Cancel' : 'Modify'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-5">
                    <GlassCard darkMode={darkMode} className="p-5 flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className="relative border-4 border-white dark:border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02]">
                                <Avatar src={userData?.profileImage} name={userData?.name} size={120} className="rounded-none bg-slate-100" />
                            </div>
                            <button className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 group-hover:scale-110 transition-all ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="space-y-1 mt-2">
                            <h2 className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData?.name}</h2>
                            <div className="flex items-center justify-center gap-1.5">
                                {userData?.is_verified ? (
                                    <>
                                        <ShieldCheck size={12} className="text-verified-500" />
                                        <span className="text-[10px] font-bold text-verified-500 uppercase tracking-widest">Fully Verified Member</span>
                                    </>
                                ) : userData?.verification_level >= 1 ? (
                                    <>
                                        <ShieldCheck size={12} className="text-green-500" />
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Level 1 Verified</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Pending</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2">
                            {[
                                { label: 'Rating', val: '4.9', sub: 'Stars' },
                                { label: 'Cases', val: '154', sub: 'Won' },
                                { label: 'Exp.', val: '12', sub: 'Years' }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <p className={`text-[14px] font-black leading-none mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
                                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <VerificationStatusCard userData={userData} darkMode={darkMode} />

                    <GlassCard darkMode={darkMode} className="p-4 space-y-4">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contact Details</h3>
                        <div className="space-y-3">
                            {[
                                { icon: Mail, label: 'Email Address', val: userData?.email || 'lawyer@nexus.com' },
                                { icon: Phone, label: 'Contact Number', val: userData?.phone || '+91 98765-43210' },
                                { icon: MapPin, label: 'Office Location', val: 'High Court Chambers, ND' }
                            ].map((c, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                        <c.icon size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-0.5">{c.label}</p>
                                        <p className={`text-[11px] font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{c.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-5">
                    <GlassCard darkMode={darkMode} className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Professional Summary</h3>
                            <Edit3 size={14} className="text-slate-400 opacity-50" />
                        </div>
                        <p className={`text-[12px] leading-relaxed font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Highly dedicated legal practitioner with a profound focus on corporate litigation and constitutional law.
                            Over a decade of experience in representing major conglomerates and individual stakeholders in high-stakes judicial procedures.
                            Committed to legal excellence and strategic dispute resolution through digital-first methodologies.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {['Corporate Law', 'Litigation', 'Intellectual Property', 'Real Estate', 'Taxation'].map((tag) => (
                                <span key={tag} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <GlassCard darkMode={darkMode} className="p-5">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Digital Footprint</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Linkedin, label: 'LinkedIn Portfolio', color: 'text-blue-500' },
                                    { icon: Twitter, label: 'Twitter Insights', color: 'text-sky-400' },
                                    { icon: Globe, label: 'Official Website', color: darkMode ? 'text-slate-200' : 'text-slate-800' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-slate-50'} ${s.color}`}>
                                                <s.icon size={14} />
                                            </div>
                                            <span className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</span>
                                        </div>
                                        <ExternalLink size={12} className={`text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors`} />
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard darkMode={darkMode} className="p-5">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Accolades</h3>
                            <div className="space-y-3">
                                {[
                                    'Best Corporate Lawyer 2023',
                                    'Leading Intellectual Property Advisor',
                                    'Top Rated on MeraBakil Platform'
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <Award size={14} className="text-slate-400 flex-shrink-0" />
                                        <span className={`text-[11px] font-bold underline decoration-slate-400/20 underline-offset-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{a}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerProfile;
