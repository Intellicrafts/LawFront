import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Award, Shield,
    Camera, Edit3, Check, X, ShieldCheck, Globe,
    Linkedin, Twitter, CheckCircle,
    Loader2, AlertCircle, Clock, RefreshCw, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../api/apiService';
import { verificationService } from '../../services/verificationService';
import Avatar from '../common/Avatar';

// ─── Premium UI Components ────────────────────────────────────────

const GlassCard = ({ children, className = "", darkMode, hover = true, glow = false }) => (
    <motion.div
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
        className={`
      relative overflow-hidden rounded-3xl border transition-all duration-300
      ${darkMode
                ? 'bg-neutral-900/40 border-white/5 backdrop-blur-2xl'
                : 'bg-white/70 border-slate-200/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            }
      ${glow && darkMode ? 'shadow-[0_0_30px_rgba(255,255,255,0.03)]' : ''}
      ${glow && !darkMode ? 'shadow-[0_0_30px_rgba(0,0,0,0.03)]' : ''}
      ${className}
    `}
    >
        {children}
    </motion.div>
);

const PremiumBadge = ({ icon: Icon, children, color = 'blue', darkMode, glow = false }) => {
    const colorStyles = {
        blue: darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-500/10',
        amber: darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/10',
        green: darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-500/10',
        red: darkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-500/10',
        default: darkMode ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${colorStyles[color]} ${glow ? 'shadow-lg' : ''} transition-all`}>
            {Icon && <Icon size={12} strokeWidth={3} className={glow ? 'animate-pulse' : ''} />}
            {children}
        </span>
    );
};

// ─── Verification Workflow Card ────────────────────────────────────────

const VerificationStatusCard = ({ userData, lawyerStatus, darkMode, onVerificationSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stateVal, setStateVal] = useState('Uttar Pradesh');
    const [manualEnrollment, setManualEnrollment] = useState('');
    const [verifyResult, setVerifyResult] = useState(null);

    const enrollmentNo = userData?.lawyer_data?.enrollment_no || '';
    const hasEnrollment = !!enrollmentNo;

    const statusToLevel = (s) =>
        (s === 'Bar Council Verified' || s === "1" || s === 1) ? 1 : (s === 'Admin Verified' || s === "2" || s === 2) ? 2 : 0;

    const [localLevel, setLocalLevel] = useState(statusToLevel(lawyerStatus));

    useEffect(() => {
        setLocalLevel(statusToLevel(lawyerStatus));
    }, [lawyerStatus]);

    const statesList = ['Uttar Pradesh', 'Delhi', 'Andhra Pradesh', 'Rajasthan', 'Maharashtra', 'Karnataka'];
    const hasTriggeredRef = React.useRef(false);

    useEffect(() => {
        const currentLevel = statusToLevel(lawyerStatus);
        if (!enrollmentNo || currentLevel >= 1 || hasTriggeredRef.current) return;

        const run = async () => {
            hasTriggeredRef.current = true;
            setLoading(true); setError(null);
            try {
                const result = await verificationService.verifyLawyer(enrollmentNo, stateVal);
                setVerifyResult(result);
                setLocalLevel(1);
                await authAPI.updateLawyerStatus(userData.id, 'Bar Council Verified', result);
                if (onVerificationSuccess) onVerificationSuccess();
            } catch (err) {
                console.warn('[ProfileVerification] Auto-verification could not complete:', err.message);
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
            const result = await verificationService.verifyLawyer(num, stateVal);
            setVerifyResult(result);
            setLocalLevel(1);
            await authAPI.updateLawyerStatus(userData.id, 'Bar Council Verified', result);
            if (onVerificationSuccess) onVerificationSuccess();
        } catch (err) {
            setError(err.message || 'Verification failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Bar Council Identity',
            sub: 'Instant API Verification via Satyapan',
            done: localLevel >= 1,
            active: localLevel === 0,
            icon: ShieldCheck
        },
        {
            title: 'Final Access Approval',
            sub: 'Manual review by safety team',
            done: localLevel >= 2,
            active: localLevel === 1,
            icon: Award
        },
    ];

    return (
        <GlassCard darkMode={darkMode} className="p-6 relative overflow-hidden ring-1 ring-inset ring-slate-900/5 dark:ring-white/5">
            {/* Subtle Gradient Backdrop */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-30 ${localLevel >= 2 ? 'bg-emerald-500' : localLevel === 1 ? 'bg-amber-500' : 'bg-red-500'}`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Trust & Verification
                    </h3>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Account Status</p>
                </div>
                {localLevel >= 2 ? (
                    <PremiumBadge color="green" darkMode={darkMode} icon={ShieldCheck} glow>Verified Officer</PremiumBadge>
                ) : localLevel === 1 ? (
                    <PremiumBadge color="amber" darkMode={darkMode} icon={Clock} glow>Review Pending</PremiumBadge>
                ) : (
                    <PremiumBadge color="red" darkMode={darkMode} icon={AlertCircle} glow>Action Needed</PremiumBadge>
                )}
            </div>

            <div className="relative space-y-8 z-10">
                {/* Connecting Line */}
                <div className={`absolute left-[1.15rem] top-6 bottom-6 w-0.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`} />

                {steps.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-5">
                        <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                            ${step.done ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110' :
                                step.active ? (darkMode ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-slate-900 text-white shadow-[0_0_20px_rgba(15,23,42,0.2)] scale-110') :
                                    (darkMode ? 'bg-neutral-800 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                            {step.done ? <Check size={20} strokeWidth={3} /> : <step.icon size={18} strokeWidth={2.5} />}
                        </div>

                        <div className="flex-1 pt-1">
                            <p className={`text-[13px] font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'} ${!step.active && !step.done && 'opacity-50'}`}>
                                {step.title}
                            </p>
                            <p className={`text-[11px] font-medium leading-relaxed mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'} ${!step.active && !step.done && 'opacity-50'}`}>
                                {step.sub}
                            </p>

                            {/* Active Action Area for Step 1 */}
                            <AnimatePresence>
                                {i === 0 && step.active && localLevel === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-5 space-y-4"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="text"
                                                placeholder="Enter Bar Council Enrollment No."
                                                className={`w-full text-xs h-11 px-4 rounded-xl border outline-none font-bold transition-all
                                                    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                                                    ${darkMode ? 'bg-black/50 border-white/10 text-white placeholder-slate-600' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'}`}
                                                value={hasEnrollment ? enrollmentNo : manualEnrollment}
                                                onChange={e => setManualEnrollment(e.target.value)}
                                                disabled={loading || hasEnrollment}
                                            />
                                            <div className="relative">
                                                <select
                                                    className={`w-full text-xs h-11 px-4 rounded-xl border outline-none font-bold transition-all appearance-none cursor-pointer
                                                        focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                                                        ${darkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}
                                                    value={stateVal}
                                                    onChange={e => setStateVal(e.target.value)}
                                                    disabled={loading}
                                                >
                                                    {statesList.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <Globe size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleVerify}
                                                disabled={loading}
                                                className={`w-full h-11 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                                                    ${darkMode ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'} shadow-xl disabled:opacity-50`}
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                                {loading ? 'Authenticating...' : 'Verify Identity Now'}
                                            </button>
                                        </div>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <p className="text-[11px] font-bold text-red-500 flex items-start gap-2 leading-tight">
                                                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                    {error}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className={`w-12 h-12 rounded-full border-2 border-t-transparent animate-spin ${darkMode ? 'border-white/20 border-t-white' : 'border-slate-200 border-t-slate-900'}`} />
            <p className={`text-xs font-black uppercase tracking-widest animate-pulse ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading Profile...</p>
        </div>
    );

    const ld = userData?.lawyer_data || {};
    const name = userData?.name || 'Advocate';
    const email = userData?.email || '—';
    const phone = userData?.phone || '—';
    const location = userData?.city || userData?.state || '—';
    const bio = ld.bio || null;
    const enrollmentNo = ld.enrollment_no || null;
    const experience = ld.years_of_experience ? `${ld.years_of_experience}` : null;
    const rating = ld.average_rating ? parseFloat(ld.average_rating).toFixed(1) : null;
    const totalReviews = ld.total_reviews || 0;
    const specializations = ld.specialization ? [ld.specialization] : [];
    const lawyerStatus = ld.status || 'pending';
    const verificationLevel = (lawyerStatus === 'Admin Verified' || lawyerStatus === "2" || lawyerStatus === 2) ? 2 : (lawyerStatus === 'Bar Council Verified' || lawyerStatus === "1" || lawyerStatus === 1) ? 1 : 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto max-w-[1400px] font-sans pb-24">
            {/* Header Banner Area */}
            <div className="relative h-48 md:h-64 rounded-b-[40px] md:rounded-b-[60px] overflow-hidden -mx-4 sm:mx-0 shadow-2xl z-0">
                {/* Abstract Premium Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-slate-900 via-neutral-900 to-slate-800' : 'from-slate-800 via-slate-900 to-slate-800'}`}>
                    <div className="absolute inset-0 opacity-20 transition-transform duration-[20s] ease-linear hover:scale-110" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c1.38 0 2.5-1.12 2.5-2.5S12.38 13 11 13s-2.5 1.12-2.5 2.5S9.62 18 11 18zM11 18c1.38 0 2.5-1.12 2.5-2.5S12.38 13 11 13s-2.5 1.12-2.5 2.5S9.62 18 11 18zM11 18c1.38 0 2.5-1.12 2.5-2.5S12.38 13 11 13s-2.5 1.12-2.5 2.5S9.62 18 11 18z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                    }} />
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 ${darkMode ? 'bg-blue-500/20' : 'bg-white/10'}`} />
                </div>

                {/* Actions overlaying banner */}
                <div className="absolute top-6 right-6 flex items-center gap-3">
                    <button onClick={fetchProfile} className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg active:scale-95 border border-white/20">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={() => setIsEditing(!isEditing)} className="h-10 px-5 rounded-2xl bg-white/10 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all shadow-lg active:scale-95 border border-white/20">
                        {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <div className="px-4 sm:px-8 xl:px-12 -mt-24 md:-mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* ── Left Sidebar: Identity & Stats ── */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                    {/* Main Identity Card */}
                    <GlassCard darkMode={darkMode} className="p-1 pt-1 border border-white/10 dark:border-white/5" glow>
                        <div className={`p-6 md:p-8 rounded-[22px] flex flex-col items-center text-center ${darkMode ? 'bg-black/50' : 'bg-white'}`}>
                            <div className="relative mb-6 group">
                                <div className="relative border-4 border-white dark:border-neutral-900 rounded-[35px] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]">
                                    <Avatar src={userData?.profileImage} name={name} size={140} className="rounded-none bg-slate-100" />
                                </div>
                                <button className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-[3px] border-white dark:border-neutral-900 group-hover:scale-110 transition-all cursor-pointer
                                    ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="space-y-2 w-full">
                                <h1 className={`text-2xl font-black tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{name}</h1>

                                <div className="flex items-center justify-center gap-2 pt-1">
                                    {verificationLevel >= 2 ? (
                                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                                            <ShieldCheck size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Fully Verified</span>
                                        </div>
                                    ) : verificationLevel >= 1 ? (
                                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                                            <CheckCircle size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Council Verified</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                                            <Shield size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                                        </div>
                                    )}
                                </div>

                                {enrollmentNo && (
                                    <p className={`text-[11px] font-mono font-bold mt-2 pt-2 border-t ${darkMode ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                                        ID: {enrollmentNo}
                                    </p>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Stats Grid */}
                    {(rating || totalReviews || experience) && (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Rating', val: rating ? `${rating}★` : '—', color: 'from-amber-400 to-orange-500' },
                                { label: 'Reviews', val: totalReviews || '0', color: 'from-blue-400 to-indigo-500' },
                                { label: 'Experience', val: experience ? `${experience} Yrs` : '—', color: 'from-emerald-400 to-teal-500' },
                            ].map((s, i) => (
                                <GlassCard key={i} darkMode={darkMode} className="p-4 text-center flex flex-col items-center justify-center">
                                    <span className={`bg-gradient-to-br ${s.color} text-transparent bg-clip-text text-xl font-black mb-1`}>{s.val}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</span>
                                </GlassCard>
                            ))}
                        </div>
                    )}

                    {/* Contact Details */}
                    <GlassCard darkMode={darkMode} className="p-6 space-y-5">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                            <Phone size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} /> Direct Contact
                        </h3>
                        <div className="space-y-4">
                            {[
                                { Icon: Mail, label: 'Email', val: email },
                                { Icon: Phone, label: 'Phone', val: phone },
                                { Icon: MapPin, label: 'Location', val: location },
                            ].map(({ Icon, label, val }, i) => (
                                <div key={i} className={`flex items-start gap-4 p-3 rounded-2xl transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                    <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white shadow-md'}`}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">{label}</p>
                                        <p className={`text-[13px] font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'} ${val === '—' ? 'opacity-40 italic' : ''}`}>{val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* ── Main Content: Bio, Verification, Details ── */}
                <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8 pt-4 lg:pt-0">

                    {/* Professional Summary */}
                    <GlassCard darkMode={darkMode} className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Briefcase size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} /> Professional Summary
                            </h3>
                            <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}>
                                <Edit3 size={14} />
                            </button>
                        </div>

                        {bio ? (
                            <p className={`text-sm md:text-base leading-relaxed font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{bio}</p>
                        ) : (
                            <div className={`p-6 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center ${darkMode ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-slate-50'}`}>
                                <Edit3 size={24} className={`mb-3 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                <p className={`text-[13px] font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Your story is empty</p>
                                <p className={`text-[11px] font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Add a professional summary to stand out to clients.</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                            <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Areas of Expertise</h4>
                            {specializations.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {specializations.map((tag, i) => (
                                        <span key={i} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer
                                            ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-slate-800'} shadow-md`}>
                                            {tag}
                                        </span>
                                    ))}
                                    <button className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border border-dashed transition-colors
                                        ${darkMode ? 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white' : 'border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-900'}`}>
                                        + Add Focus
                                    </button>
                                </div>
                            ) : (
                                <button className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border border-dashed transition-colors
                                    ${darkMode ? 'border-white/20 text-slate-400 hover:border-white/40' : 'border-slate-300 text-slate-500 hover:border-slate-500'}`}>
                                    + Define Practice Areas
                                </button>
                            )}
                        </div>
                    </GlassCard>

                    {/* Verification Status Heavy Lift */}
                    <VerificationStatusCard userData={userData} lawyerStatus={lawyerStatus} darkMode={darkMode} onVerificationSuccess={fetchProfile} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Digital Presence */}
                        <GlassCard darkMode={darkMode} className="p-6">
                            <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                <Globe size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} /> Digital Footprint
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { Icon: Linkedin, label: 'LinkedIn', color: 'bg-[#0A66C2]', val: userData?.linkedin_url },
                                    { Icon: Twitter, label: 'Twitter / X', color: 'bg-black dark:bg-white dark:text-black', val: userData?.twitter_url },
                                    { Icon: Globe, label: 'Personal Website', color: 'bg-slate-600', val: userData?.website_url },
                                ].map(({ Icon, label, color, val }, i) => (
                                    <div key={i} className={`flex items-center justify-between group p-3 rounded-2xl transition-colors ${val ? (darkMode ? 'hover:bg-white/5 cursor-pointer' : 'hover:bg-slate-50 cursor-pointer') : 'opacity-60'}`}>
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${color}`}>
                                                <Icon size={16} />
                                            </div>
                                            <div>
                                                <p className={`text-[12px] font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{label}</p>
                                                {val ? (
                                                    <p className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Connected</p>
                                                ) : (
                                                    <p className={`text-[10px] font-medium mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Not linked</p>
                                                )}
                                            </div>
                                        </div>
                                        {!val && (
                                            <button className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}>
                                                Link
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Accolades */}
                        <GlassCard darkMode={darkMode} className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                    <Award size={14} className={darkMode ? 'text-amber-400' : 'text-amber-500'} /> Accolades
                                </h3>
                                <button className={`w-6 h-6 rounded-lg flex items-center justify-center border border-dashed transition-colors ${darkMode ? 'border-white/20 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-500 hover:text-slate-900'}`}>
                                    <Check size={12} />
                                </button>
                            </div>

                            {userData?.awards?.length > 0 ? (
                                <div className="space-y-4">
                                    {userData.awards.map((a, i) => (
                                        <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-amber-50/50'}`}>
                                            <div className="mt-0.5 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <Award size={12} className="text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <span className={`text-[12px] font-bold leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{a}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={`h-32 rounded-2xl flex flex-col items-center justify-center text-center ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <Award size={24} className={`mb-2 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                    <p className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>No accolades added yet</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerProfile;

