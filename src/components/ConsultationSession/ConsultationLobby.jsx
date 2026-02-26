import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Clock, LogOut, WifiOff, FileText, Lock,
    MessageSquare, Briefcase, Info, CheckCircle2, Wifi,
    User, Star, BookOpen, Scale, Sun, Moon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';

const ConsultationLobby = ({
    session,
    userType,
    otherParticipant,
    isDarkMode,
    timeRemaining,
    connectionStatus,
    onLeave
}) => {
    const dispatch = useDispatch();
    const [dots, setDots] = useState('');
    const [networkStrength, setNetworkStrength] = useState(4);
    const [checklistItems, setChecklistItems] = useState([false, false, false]);
    const [elapsed, setElapsed] = useState(0);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Network connection strength
    useEffect(() => {
        const checkConnection = () => {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                if (conn.downlink >= 6) setNetworkStrength(4);
                else if (conn.downlink >= 2) setNetworkStrength(3);
                else if (conn.downlink >= 0.5) setNetworkStrength(2);
                else setNetworkStrength(1);
            } else {
                setNetworkStrength(prev => Math.random() > 0.8 ? Math.max(2, prev - 1) : Math.min(4, prev + 1));
            }
        };
        checkConnection();
        const interval = setInterval(checkConnection, 3000);
        return () => clearInterval(interval);
    }, []);

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Waiting elapsed timer
    useEffect(() => {
        const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const NetworkSignal = ({ strength }) => (
        <div className="flex items-end gap-[1.5px] h-[10px]">
            {[1, 2, 3, 4].map((bar) => (
                <div
                    key={bar}
                    className={`w-[2.5px] rounded-[1px] transition-all duration-300 ${bar <= strength
                        ? 'bg-emerald-500 shadow-[0_0_2px_rgba(16,185,129,0.5)]'
                        : 'bg-emerald-500/20'}`}
                    style={{ height: `${bar * 25}%` }}
                />
            ))}
        </div>
    );

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const isUser = userType === 'user';
    const otherRole = isUser ? 'Legal Expert' : 'Client';
    const otherName = otherParticipant?.name || (isUser ? 'Your Lawyer' : 'Your Client');
    const initials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const preparationItems = [
        { icon: FileText, label: 'Documents Ready', desc: 'Case files, contracts & notices prepared' },
        { icon: MessageSquare, label: 'Key Points Noted', desc: 'Questions & discussion topics listed' },
        { icon: Lock, label: 'Confidential Space', desc: 'Private, secure environment confirmed' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 22 } }
    };

    return (
        <div className={`fixed inset-0 w-screen h-[100dvh] flex flex-col font-sans overflow-hidden ${isDarkMode ? 'bg-[#0d0d14] text-slate-200' : 'bg-[#f2f5fa] text-slate-800'}`}>

            {/* Ambient orbs */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#ff007f]/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-slate-600/5 rounded-full blur-[140px] pointer-events-none" />

            {/* ── TOP NAV ── */}
            <div className={`shrink-0 z-40 border-b backdrop-blur-2xl ${isDarkMode ? 'bg-[#0d0d14]/90 border-white/[0.06]' : 'bg-white/90 border-slate-200/60 shadow-sm'}`}>
                <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">

                    {/* ── Logo ── */}
                    <div className="flex items-center gap-2">
                        {/* MeraBakil brand logo — same as main navbar */}
                        <div className="flex flex-col">
                            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#ff007f] to-[#ff6b6b] bg-clip-text text-transparent leading-none">
                                MeraBakil
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Lock size={8} className={isDarkMode ? 'text-emerald-500/60' : 'text-emerald-600/60'} />
                                <span className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    Secure Consultation
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Status chips + controls ── */}
                    <div className="flex items-center gap-1.5">

                        {/* Connection dot — icon only on mobile, text on sm+ */}
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${connectionStatus === 'connected'
                            ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                            {connectionStatus === 'connected' ? (
                                <>
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                    </span>
                                    <span className="hidden sm:inline tracking-wider uppercase">Connected</span>
                                    <NetworkSignal strength={networkStrength} />
                                </>
                            ) : (
                                <>
                                    <WifiOff size={10} className="animate-pulse" />
                                    <span className="hidden sm:inline">Retry</span>
                                </>
                            )}
                        </div>

                        {/* Session timer */}
                        {timeRemaining !== null && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold font-mono ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                                <Clock size={10} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                {formatTime(timeRemaining)}
                            </div>
                        )}

                        {/* Dark mode toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            title={isDarkMode ? 'Light mode' : 'Dark mode'}
                            className={`p-1.5 rounded-xl transition-all border ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border-white/[0.07] text-amber-400 hover:text-amber-300'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm'
                                }`}
                        >
                            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MAIN SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-3.5"
                    >

                        {/* ── HERO WAITING SECTION ── */}
                        <motion.div variants={itemVariants} className="text-center">
                            {/* Avatar with pulse ring */}
                            <div className="inline-flex items-center justify-center relative mb-2.5">
                                <motion.div
                                    animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff007f] to-[#ff4d4d]"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff007f] to-[#ff4d4d]"
                                />
                                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-lg font-black shadow-xl border-2 ${isDarkMode
                                    ? 'bg-[#1a1a2a] text-white border-[#ff007f]/30'
                                    : 'bg-white text-slate-800 border-[#ff007f]/25'
                                    }`}>
                                    {initials}
                                </div>
                            </div>

                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#ff007f] to-[#ff6b6b] text-transparent bg-clip-text mb-1">
                                Waiting for {otherName}{dots}
                            </h2>
                            <p className={`text-xs font-medium max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                The session begins automatically once the{' '}
                                <span className="font-bold text-[#ff007f]">{otherRole.toLowerCase()}</span> joins.
                            </p>

                            {/* Elapsed time badge */}
                            <div className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${isDarkMode ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                <Clock size={9} />
                                Waiting {formatTime(elapsed)}
                            </div>
                        </motion.div>

                        {/* ── TWO-COLUMN CARDS ── */}
                        {/* On mobile: only checklist card shows (profile card hidden) */}
                        {/* On desktop lg+: both cards in 2 columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                            {/* Card 1 — Lawyer/Participant Profile — HIDDEN on mobile */}
                            <motion.div
                                variants={itemVariants}
                                className={`hidden lg:block relative rounded-2xl overflow-hidden border group transition-all duration-300 hover:-translate-y-0.5 ${isDarkMode
                                    ? 'bg-[#141420] border-white/[0.07] shadow-black/40 shadow-xl'
                                    : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'
                                    }`}
                            >
                                {/* Header banner */}
                                <div className="h-16 sm:h-20 relative overflow-hidden bg-slate-900">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800')` }}
                                    />
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                        <User size={9} className="text-white" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white">{otherRole} Profile</span>
                                    </div>
                                </div>

                                <div className="relative px-3.5 sm:px-4 pb-4 pt-1.5">
                                    {/* Avatar overlapping banner */}
                                    <div className="absolute -top-5 left-3.5 sm:left-4">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shadow-md border-2 ${isDarkMode
                                            ? 'bg-gradient-to-br from-[#2a2a3a] to-[#1a1a2a] text-slate-300 border-[#0d0d14]'
                                            : 'bg-white text-slate-700 border-white'
                                            }`}>
                                            {initials}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{otherName}</h3>
                                        <p className={`text-[10px] font-semibold flex items-center gap-1 mt-0.5 mb-3 text-[#ff007f]`}>
                                            <Briefcase size={10} />
                                            {isUser ? 'Verified Legal Practitioner' : 'Registered Client'}
                                        </p>

                                        {/* Info rows */}
                                        <div className="space-y-2">
                                            {[
                                                {
                                                    icon: Shield,
                                                    color: isDarkMode ? 'text-[#ff007f] bg-[#ff007f]/10' : 'text-[#ff007f] bg-[#ff007f]/8',
                                                    title: 'Secure Connection',
                                                    desc: 'Enterprise-grade E2E encryption in effect.'
                                                },
                                                {
                                                    icon: Clock,
                                                    color: isDarkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50',
                                                    title: 'Dedicated Time',
                                                    desc: `${session?.duration_minutes || 55} min session booked.`
                                                },
                                                {
                                                    icon: Scale,
                                                    color: isDarkMode ? 'text-violet-400 bg-violet-500/10' : 'text-violet-600 bg-violet-50',
                                                    title: 'Attorney–Client Privilege',
                                                    desc: 'All discussions legally protected.'
                                                },
                                            ].map((item, idx) => (
                                                <div key={idx} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg border ${isDarkMode ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-50/60 border-slate-100'}`}>
                                                    <div className={`p-1 rounded-md flex-shrink-0 ${item.color}`}>
                                                        <item.icon size={11} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-[11px] font-bold leading-none ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</p>
                                                        <p className={`text-[10px] mt-0.5 leading-snug ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2 — Session Preparation Checklist */}
                            <motion.div
                                variants={itemVariants}
                                className={`relative rounded-2xl overflow-hidden border flex flex-col ${isDarkMode
                                    ? 'bg-[#141420] border-white/[0.07] shadow-black/40 shadow-xl'
                                    : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'
                                    }`}
                            >
                                {/* Header banner */}
                                <div className="h-16 sm:h-20 relative overflow-hidden bg-slate-900">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-50"
                                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800')` }}
                                    />
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                        <Info size={9} className="text-[#ff007f]" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white">Pre-Session Checklist</span>
                                    </div>
                                    <div className="absolute bottom-3 left-4 z-20">
                                        <h3 className="text-sm font-bold text-white">Session Preparation</h3>
                                        <p className="text-[9px] text-white/60 font-medium">Check off items before starting</p>
                                    </div>
                                </div>

                                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                                    {/* Checklist */}
                                    <ul className="space-y-2 flex-1">
                                        {preparationItems.map((item, idx) => (
                                            <li key={idx}>
                                                <button
                                                    onClick={() => setChecklistItems(prev => {
                                                        const next = [...prev];
                                                        next[idx] = !next[idx];
                                                        return next;
                                                    })}
                                                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${checklistItems[idx]
                                                        ? isDarkMode
                                                            ? 'bg-emerald-500/8 border-emerald-500/20'
                                                            : 'bg-emerald-50/80 border-emerald-200/60'
                                                        : isDarkMode
                                                            ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                                                            : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100/50'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${checklistItems[idx]
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : isDarkMode ? 'border-slate-600' : 'border-slate-300'
                                                        }`}>
                                                        {checklistItems[idx] && <CheckCircle2 size={11} className="text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[12px] font-bold ${checklistItems[idx]
                                                            ? isDarkMode ? 'text-emerald-400 line-through opacity-70' : 'text-emerald-700 line-through opacity-70'
                                                            : isDarkMode ? 'text-slate-200' : 'text-slate-800'
                                                            }`}>
                                                            {item.label}
                                                        </p>
                                                        <p className={`text-[11px] mt-0.5 leading-snug ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Progress indicator */}
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                Readiness
                                            </span>
                                            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {checklistItems.filter(Boolean).length}/{checklistItems.length}
                                            </span>
                                        </div>
                                        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-[#ff007f] to-emerald-500"
                                                animate={{ width: `${(checklistItems.filter(Boolean).length / checklistItems.length) * 100}%` }}
                                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Leave button */}
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                        <button
                                            onClick={() => setShowLeaveModal(true)}
                                            className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700'
                                                }`}
                                        >
                                            <LogOut size={13} />
                                            Leave Waiting Room
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── SECURITY FOOTER ── */}
                        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 pb-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                <Shield size={10} />
                                E2E Encrypted
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-white border-slate-200 text-slate-500'}`}>
                                <BookOpen size={10} />
                                Attorney–Client Privilege
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>

            {/* ── LEAVE CONFIRMATION MODAL ── */}
            <AnimatePresence>
                {showLeaveModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowLeaveModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                            className={`relative w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-[#1a1a24] border-white/10' : 'bg-white border-slate-100'
                                }`}
                        >
                            {/* Header Gradient */}
                            <div className={`h-12 w-full flex items-center justify-center ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'
                                }`}>
                                <LogOut size={20} className={isDarkMode ? 'text-rose-400' : 'text-rose-500'} />
                            </div>

                            {/* Content */}
                            <div className="p-5 text-center">
                                <h3 className={`text-[15px] font-bold mb-1.5 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    Leave Waiting Room?
                                </h3>
                                <p className={`text-[11.5px] font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                    Are you sure you want to exit? The {otherRole.toLowerCase()} could be joining anytime soon.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className={`grid grid-cols-2 gap-px border-t ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-slate-200 border-slate-100'
                                }`}>
                                <button
                                    onClick={() => setShowLeaveModal(false)}
                                    className={`py-3 text-[12px] font-bold tracking-wide transition-colors ${isDarkMode
                                            ? 'bg-[#1a1a24] text-slate-300 hover:bg-white/5'
                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onLeave}
                                    className={`py-3 text-[12px] font-bold tracking-wide transition-colors ${isDarkMode
                                            ? 'bg-[#1a1a24] text-rose-400 hover:bg-rose-500/10'
                                            : 'bg-white text-rose-600 hover:bg-rose-50'
                                        }`}
                                >
                                    Yes, Leave
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ConsultationLobby;
