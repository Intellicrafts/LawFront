
import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase, Award, Shield,
    Camera, Edit3, Check, X, ShieldCheck, Globe, Star,
    Linkedin, Twitter, Facebook, ExternalLink, CheckCircle,
    Loader2, AlertCircle, Clock, Scale, BadgeCheck, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../api/apiService';
import { verificationService } from '../../services/verificationService';
import Avatar from '../common/Avatar';

const GlassCard = ({ children, className = "", darkMode, hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -2 } : {}}
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

const FieldBadge = ({ children, color = 'default', darkMode }) => {
    const colors = {
        default: darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500',
        green: darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700 border border-green-200',
        amber: darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700 border border-amber-200',
        blue: darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50  text-blue-700  border border-blue-200',
        red: darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50   text-red-700   border border-red-200',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${colors[color]}`}>
            {children}
        </span>
    );
};

// ─── Premium Verification Status Card ────────────────────────────────────────

const VerificationStatusCard = ({ userData, lawyerStatus, darkMode, onVerificationSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stateVal, setStateVal] = useState('Uttar Pradesh');
    const [manualEnrollment, setManualEnrollment] = useState('');
    const [verifyResult, setVerifyResult] = useState(null);

    // Use lawyer_data nested object per actual API structure
    const enrollmentNo = userData?.lawyer_data?.enrollment_no || '';
    const hasEnrollment = !!enrollmentNo;

    // Level from the 3-state status string
    const statusToLevel = (s) =>
        s === 'Admin Verified' ? 2 : s === 'Bar Council Verified' ? 1 : 0;

    const [localLevel, setLocalLevel] = useState(statusToLevel(lawyerStatus));

    // Sync local level if props change (e.g. after global refetch)
    useEffect(() => {
        setLocalLevel(statusToLevel(lawyerStatus));
    }, [lawyerStatus]);

    const statesList = ['Uttar Pradesh', 'Delhi', 'Andhra Pradesh', 'Rajasthan'];

    const hasTriggeredRef = React.useRef(false);

    // Auto-trigger Satyapan on mount whenever enrollment exists and status is pending
    useEffect(() => {
        if (!enrollmentNo || lawyerStatus === 'Bar Council Verified' || hasTriggeredRef.current) return;

        const run = async () => {
            hasTriggeredRef.current = true;
            console.log('[ProfileVerification] Auto-triggering Satyapan for:', enrollmentNo);
            setLoading(true); setError(null);
            try {
                const result = await verificationService.verifyLawyer(enrollmentNo, stateVal);
                console.log('[ProfileVerification] Satyapan SUCCESS:', result);
                setVerifyResult(result);
                setLocalLevel(1);

                // ✅ Sync status to backend
                await authAPI.updateLawyerStatus('Bar Council Verified', result);
                if (onVerificationSuccess) onVerificationSuccess();
            } catch (err) {
                console.warn('[ProfileVerification] Auto-verification could not complete:', err.message);
                // We don't set global error here to avoid blocking UI, 
                // but let them try manually if they want.
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [enrollmentNo, lawyerStatus, onVerificationSuccess, stateVal]);

    const handleVerify = async () => {
        const num = hasEnrollment ? enrollmentNo : manualEnrollment.trim();
        if (!num) { setError('Enter your Bar Council Enrollment Number.'); return; }
        setLoading(true); setError(null);
        try {
            console.log('[ProfileVerification] Manual verification for:', num);
            const result = await verificationService.verifyLawyer(num, stateVal);
            setVerifyResult(result);
            setLocalLevel(1);
            await authAPI.updateLawyerStatus('Bar Council Verified', result);
            if (onVerificationSuccess) onVerificationSuccess();
        } catch (err) {
            setError(err.message || 'Verification failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    // Visual step config
    const steps = [
        {
            num: 1,
            title: 'Bar Council',
            sub: 'Automated via Satyapan API',
            done: localLevel >= 1,
            active: localLevel === 0,
        },
        {
            num: 2,
            title: 'Admin Approval',
            sub: 'Manual review by MeraBakil team',
            done: localLevel >= 2,
            active: localLevel === 1,
        },
    ];

    return (
        <GlassCard darkMode={darkMode} className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Verification Status
                </h3>
                {localLevel >= 2 ? (
                    <FieldBadge color="green" darkMode={darkMode}><BadgeCheck size={10} />Fully Verified</FieldBadge>
                ) : localLevel === 1 ? (
                    <FieldBadge color="amber" darkMode={darkMode}><Clock size={10} />In Review</FieldBadge>
                ) : (
                    <FieldBadge color="amber" darkMode={darkMode}><AlertCircle size={10} />Action Needed</FieldBadge>
                )}
            </div>

            {/* Progress track */}
            <div className="relative pl-2 space-y-1">
                {steps.map((step, i) => (
                    <div key={i}>
                        <div className="flex items-start gap-3">
                            {/* Circle */}
                            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black transition-all
                                ${step.done ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
                                    step.active ? 'bg-amber-400 text-white animate-pulse' :
                                        (darkMode ? 'bg-white/8 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                                {step.done ? <Check size={12} strokeWidth={3} /> : step.num}
                            </div>
                            <div className="flex-1 pb-4">
                                <p className={`text-[12px] font-black ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{step.title}</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{step.sub}</p>

                                {/* Step 1 action area */}
                                {i === 0 && step.active && localLevel === 0 && (
                                    <div className="mt-3 space-y-3">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enrollment Number"
                                                    className={`flex-1 text-[11px] h-9 px-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                                                        ${darkMode ? 'bg-black/30 border-slate-700 text-slate-200 placeholder-slate-600' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400 shadow-sm'}`}
                                                    value={hasEnrollment ? enrollmentNo : manualEnrollment}
                                                    onChange={e => setManualEnrollment(e.target.value)}
                                                    disabled={loading || hasEnrollment}
                                                />
                                                <select
                                                    className={`text-[11px] h-9 px-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                                                        ${darkMode ? 'bg-black/30 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
                                                    value={stateVal}
                                                    onChange={e => setStateVal(e.target.value)}
                                                    disabled={loading}
                                                >
                                                    {statesList.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <button
                                                onClick={handleVerify}
                                                disabled={loading}
                                                className={`w-full h-9 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                                                    ${darkMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} shadow-md disabled:opacity-50`}
                                            >
                                                {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                                {loading ? 'Verifying with Satyapan...' : 'Verify Credentials Now'}
                                            </button>
                                        </div>
                                        {error && (
                                            <p className="text-[9px] font-medium text-red-500 flex items-start gap-1.5 leading-tight">
                                                <AlertCircle size={10} className="mt-0.5 flex-shrink-0" />
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {i === 0 && step.done && (
                                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold
                                        ${darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                        <CheckCircle size={10} /> Enrollment Number Verified
                                    </div>
                                )}

                                {i === 1 && step.active && (
                                    <div className="mt-2">
                                        <FieldBadge color="amber" darkMode={darkMode}><Clock size={10} />Awaiting Final Admin Approval</FieldBadge>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div className={`ml-3 w-0.5 h-6 -mt-2 mb-1 rounded-full ${step.done ? 'bg-green-400' : (darkMode ? 'bg-white/8' : 'bg-slate-200')}`} />
                        )}
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

// ─── Main LawyerProfile ──────────────────────────────────────────────────────

const LawyerProfile = ({ darkMode }) => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await authAPI.getUserProfile();
            const profile = response.data?.data || response.data;
            setUserData(profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? 'border-white/20 border-t-white' : 'border-slate-200 border-t-slate-900'}`} />
        </div>
    );

    // All reads use the actual API structure: top-level fields + nested lawyer_data
    const ld = userData?.lawyer_data || {};   // lawyer_data nested object
    const name = userData?.name || 'Advocate';
    const email = userData?.email || '—';
    const phone = userData?.phone || '—';
    const location = userData?.city || userData?.state || '—';
    const bio = ld.bio || null;
    const enrollmentNo = ld.enrollment_no || null;
    const experience = ld.years_of_experience ? `${ld.years_of_experience}` : null;
    const rating = ld.average_rating ? parseFloat(ld.average_rating).toFixed(1) : null;
    const totalReviews = ld.total_reviews || 0;
    const consultationFee = ld.consultation_fee ? `₹${ld.consultation_fee}` : null;
    const specializations = ld.specialization ? [ld.specialization] : [];
    const lawyerStatus = ld.status || 'pending'; // 'pending' | 'Bar Council Verified' | 'Admin Verified'
    const verificationLevel = lawyerStatus === 'Admin Verified' ? 2 : lawyerStatus === 'Bar Council Verified' ? 1 : 0;

    return (
        <div className="p-4 sm:p-5 space-y-5 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                            ${darkMode ? 'bg-white/5 text-slate-400 border-white/10' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            Professional Identity
                        </span>
                        <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Portfolio</span>
                    </div>
                    <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Academic <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Profile</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchProfile}
                        className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all
                            ${darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="Refresh profile"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm
                            ${isEditing
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                : (darkMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800')
                            }`}
                    >
                        {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* ── Left sidebar ── */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Avatar + identity card */}
                    <GlassCard darkMode={darkMode} className="p-5 flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className="relative border-4 border-white dark:border-neutral-900 rounded-[28px] overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02]">
                                <Avatar src={userData?.profileImage} name={name} size={108} className="rounded-none bg-slate-100" />
                            </div>
                            <button className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 group-hover:scale-110 transition-all cursor-pointer
                                ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="space-y-1 mt-2">
                            <h2 className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{name}</h2>
                            <div className="flex items-center justify-center gap-1.5">
                                {verificationLevel >= 2 ? (
                                    <><ShieldCheck size={12} className="text-blue-500" /><span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Fully Verified</span></>
                                ) : verificationLevel >= 1 ? (
                                    <><CheckCircle size={12} className="text-green-500" /><span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Level 1 Verified</span></>
                                ) : (
                                    <><Shield size={12} className="text-amber-400" /><span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Verification Pending</span></>
                                )}
                            </div>
                            {enrollmentNo && (
                                <p className={`text-[10px] font-mono font-bold mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    #{enrollmentNo}
                                </p>
                            )}
                        </div>

                        {/* Stats — only show if real data available */}
                        {(rating || totalReviews || experience) && (
                            <div className="w-full mt-5 pt-5 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Rating', val: rating ? `${rating}★` : '—', show: true },
                                    { label: 'Reviews', val: totalReviews || '0', show: true },
                                    { label: 'Exp.', val: experience ? `${experience}y` : '—', show: true },
                                ].filter(s => s.show).map((s, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <p className={`text-[14px] font-black leading-none mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
                                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    {/* Verification Status */}
                    <VerificationStatusCard userData={userData} lawyerStatus={lawyerStatus} darkMode={darkMode} onVerificationSuccess={fetchProfile} />

                    {/* Contact Details */}
                    <GlassCard darkMode={darkMode} className="p-4 space-y-3">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contact Details</h3>
                        {[
                            { Icon: Mail, label: 'Email', val: email },
                            { Icon: Phone, label: 'Phone', val: phone },
                            { Icon: MapPin, label: 'Location', val: location },
                        ].map(({ Icon, label, val }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-white/5' : 'bg-slate-100'} text-slate-400`}>
                                    <Icon size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-0.5">{label}</p>
                                    <p className={`text-[11px] font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'} ${val === '—' ? 'opacity-40' : ''}`}>{val}</p>
                                </div>
                            </div>
                        ))}
                    </GlassCard>
                </div>

                {/* ── Main content ── */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Professional Summary */}
                    <GlassCard darkMode={darkMode} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Professional Summary</h3>
                            <button className="cursor-pointer"><Edit3 size={14} className="text-slate-400 opacity-50 hover:opacity-100 transition-opacity" /></button>
                        </div>
                        {bio ? (
                            <p className={`text-[12px] leading-relaxed font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{bio}</p>
                        ) : (
                            <div className={`text-[11px] leading-relaxed font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'} italic`}>
                                No bio added yet. Click Edit Profile to add your professional summary.
                            </div>
                        )}

                        {/* Specializations */}
                        {specializations.length > 0 ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {specializations.map((tag, i) => (
                                    <span key={i} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors
                                        ${darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className={`mt-4 flex flex-wrap gap-2`}>
                                {['Add Specialization', '+ Practice Area'].map((tag, i) => (
                                    <span key={i} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-dashed cursor-pointer transition-colors
                                        ${darkMode ? 'border-white/10 text-slate-600 hover:border-white/20' : 'border-slate-300 text-slate-400 hover:border-slate-400'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bar Council Details */}
                        <GlassCard darkMode={darkMode} className="p-5">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bar Council Details</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Enrollment No.', val: enrollmentNo || 'Not provided' },
                                    { label: 'Account Type', val: 'Advocate / Lawyer' },
                                    { label: 'Member Since', val: userData?.created_at ? new Date(userData.created_at).getFullYear() : '—' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{row.label}</p>
                                        <p className={`text-[11px] font-black font-mono ${darkMode ? 'text-slate-200' : 'text-slate-800'} ${row.val === 'Not provided' || row.val === '—' ? 'opacity-40' : ''}`}>{row.val}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Digital Presence */}
                        <GlassCard darkMode={darkMode} className="p-5">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Digital Presence</h3>
                            <div className="space-y-3">
                                {[
                                    { Icon: Linkedin, label: 'LinkedIn', color: 'text-blue-500', val: userData?.linkedin_url },
                                    { Icon: Twitter, label: 'Twitter / X', color: 'text-sky-400', val: userData?.twitter_url },
                                    { Icon: Globe, label: 'Website', color: darkMode ? 'text-slate-300' : 'text-slate-700', val: userData?.website_url },
                                ].map(({ Icon, label, color, val }, i) => (
                                    <div key={i} className={`flex items-center justify-between group ${val ? 'cursor-pointer' : 'opacity-40'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-slate-50'} ${color}`}>
                                                <Icon size={14} />
                                            </div>
                                            <div>
                                                <p className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</p>
                                                {val && <p className={`text-[9px] truncate max-w-[120px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{val}</p>}
                                            </div>
                                        </div>
                                        {val
                                            ? <ExternalLink size={12} className={`text-slate-400 group-hover:${darkMode ? 'text-white' : 'text-slate-900'} transition-colors`} />
                                            : <span className={`text-[9px] font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>Add</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Accolades — only if data present, otherwise prompt */}
                    <GlassCard darkMode={darkMode} className="p-5">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Accolades & Achievements</h3>
                        {userData?.awards?.length > 0 ? (
                            <div className="space-y-3">
                                {userData.awards.map((a, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <Award size={14} className="text-amber-400 flex-shrink-0" />
                                        <span className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{a}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`text-center py-6 text-[11px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                <Award size={24} className="mx-auto mb-2 opacity-30" />
                                <p className="font-medium">No accolades added yet.</p>
                                <p className="text-[10px] mt-1 opacity-70">Your achievements will appear here once added.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default LawyerProfile;
