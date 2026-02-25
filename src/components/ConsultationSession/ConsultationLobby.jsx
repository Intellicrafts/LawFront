import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, User, LogOut, Wifi, WifiOff, FileText, Lock, MessageSquare, Award, Briefcase, Info, CheckCircle2 } from 'lucide-react';

const ConsultationLobby = ({
    session,
    userType,
    otherParticipant,
    isDarkMode,
    timeRemaining,
    connectionStatus,
    onLeave
}) => {
    const [dots, setDots] = useState('');
    const [networkStrength, setNetworkStrength] = useState(4);

    // Network connection strength tracker
    useEffect(() => {
        const checkConnection = () => {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                if (conn.downlink >= 6) setNetworkStrength(4);
                else if (conn.downlink >= 2) setNetworkStrength(3);
                else if (conn.downlink >= 0.5) setNetworkStrength(2);
                else setNetworkStrength(1);
            } else {
                // Fallback smooth random toggling for premium effect if unsupported
                setNetworkStrength(prev => Math.random() > 0.8 ? Math.max(2, prev - 1) : Math.min(4, prev + 1));
            }
        };
        checkConnection();
        const interval = setInterval(checkConnection, 3000);
        return () => clearInterval(interval);
    }, []);

    // Animated dots: "..." effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const NetworkSignal = ({ strength }) => (
        <div className="flex items-end gap-[1.5px] h-[10px] ml-1">
            {[1, 2, 3, 4].map((bar) => (
                <div
                    key={bar}
                    className={`w-[2.5px] rounded-[1px] transition-all duration-300 ${bar <= strength ? 'bg-emerald-500 shadow-[0_0_2px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/20'}`}
                    style={{ height: `${(bar * 25)}%` }}
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
    const otherName = otherParticipant?.name || (isUser ? 'Assigned Lawyer' : 'Your Client');
    const initials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Container Variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1, scale: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1, duration: 0.5, ease: "easeOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } }
    };

    return (
        <div className={`min-h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col font-sans selection:bg-slate-500/30 ${isDarkMode ? 'bg-dark-bg text-slate-200' : 'bg-[#f4f7fb] text-slate-800'}`}>

            {/* Top Navigation / Status Bar (Premium Glassmorphism) */}
            <div className={`shrink-0 z-40 backdrop-blur-2xl border-b ${isDarkMode ? 'bg-dark-bg/70 border-white/5' : 'bg-white/70 border-slate-200/60 shadow-sm'}`}>
                <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className={`hidden sm:block p-2.5 rounded-2xl relative group ${isDarkMode ? 'bg-gradient-to-br from-slate-500/20 to-slate-400/10' : 'bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner'}`}>
                            <Shield size={18} className="text-slate-500 relative z-10" />
                            <div className="absolute inset-0 rounded-2xl bg-slate-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
                        </div>
                        <div>
                            <h1 className={`text-sm sm:text-base font-extrabold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                Secure Consultation Lounge
                            </h1>
                            <p className={`hidden sm:block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5 ${isDarkMode ? 'text-slate-400/80' : 'text-slate-600/80'}`}>
                                End-to-End Encrypted Session
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-widest border shadow-sm ${connectionStatus === 'connected'
                            ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                            {connectionStatus === 'connected' ? (
                                <>
                                    <span className="relative flex h-2 w-2 mr-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Connected
                                    <NetworkSignal strength={networkStrength} />
                                </>
                            ) : (
                                <>
                                    <WifiOff size={12} className="animate-pulse" />
                                    Reconnecting
                                    <NetworkSignal strength={1} />
                                </>
                            )}
                        </div>

                        {/* Timer */}
                        {timeRemaining !== null && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${isDarkMode ? 'bg-dark-bg-secondary border-white/10' : 'bg-white border-slate-200'}`}>
                                <Clock size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                                <span className={`text-xs sm:text-sm font-bold tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden">

                {/* Background Ambient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-3xl z-10"
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-12 mt-4 sm:mt-0">
                        <div className="inline-flex items-center justify-center relative mb-4 sm:mb-6">
                            {/* Pulse Rings */}
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#ff007f] to-[#ff4d4d] blur-[2px]`}
                            />
                            <motion.div
                                animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                                className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#ff007f] to-[#ff4d4d]`}
                            />
                            <div className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-2xl font-black shadow-2xl backdrop-blur-sm border-2 ${isDarkMode
                                ? 'bg-[#1a1a1a] text-white border-[#ff007f]/30'
                                : 'bg-white text-slate-800 border-[#ff007f]/20'
                                }`}>
                                {initials}
                            </div>
                        </div>

                        <motion.h2
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className={`text-xl sm:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3 bg-gradient-to-r from-[#ff007f] to-[#ff4d4d] text-transparent bg-clip-text`}
                        >
                            Waiting for {otherName}{dots}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className={`hidden sm:block text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-white/5 text-slate-300 border border-white/5' : 'bg-slate-50 text-slate-600 border border-slate-100 shadow-sm'}`}
                        >
                            The session will begin automatically as soon as the <span className="font-bold text-[#ff007f]">{otherRole.toLowerCase()}</span> joins. Please stay on this screen to ensure a seamless connection.
                        </motion.p>
                    </motion.div>

                    {/* Dual Cards Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                        {/* Card 1: Expert/Participant Profile */}
                        <motion.div variants={itemVariants} className={`group relative rounded-[1.5rem] overflow-hidden border shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
                            {/* Card Header Image */}
                            <div className="h-16 sm:h-28 relative overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800')` }}
                                />
                                <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                    <User size={10} className="text-white" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">{otherRole} Profile</span>
                                </div>
                            </div>

                            <div className="relative px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-5">
                                {/* Profile Avatar overlapping header */}
                                <div className="absolute -top-8 sm:-top-8 left-4 sm:left-6">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-subtitle font-black text-lg shadow-lg border-2 sm:border-[3px] ${isDarkMode ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-slate-300 border-[#111]' : 'bg-gradient-to-br from-white to-slate-50 text-slate-700 border-white'}`}>
                                        {initials}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-5 sm:mt-8">
                                    <h3 className={`text-lg font-bold tracking-tight mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {otherName}
                                    </h3>
                                    <p className={`text-xs font-semibold mb-5 flex items-center gap-1.5 ${isDarkMode ? 'text-[#ff007f]' : 'text-[#ff007f]'}`}>
                                        {isUser ? <Briefcase size={12} /> : <User size={12} />}
                                        {isUser ? 'Verified Legal Practitioner' : 'Registered Client'}
                                    </p>

                                    <div className="space-y-3">
                                        <div className={`flex items-start gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                            <div className={`p-1.5 rounded-lg mt-0.5 ${isDarkMode ? 'bg-[#ff007f]/10 text-[#ff007f]' : 'bg-[#ff007f]/10 text-[#ff007f]'}`}>
                                                <Award size={14} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    Secure Connection
                                                </p>
                                                <p className={`text-[11px] mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Your conversation is protected with enterprise-grade encryption.
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex items-start gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                            <div className={`p-1.5 rounded-lg mt-0.5 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                                <Clock size={14} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    Dedicated Time
                                                </p>
                                                <p className={`text-[11px] mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Session duration is booked for {session?.duration_minutes || 55} minutes of uninterrupted focus.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Session Preparation */}
                        <motion.div variants={itemVariants} className={`hidden lg:flex relative rounded-[1.5rem] overflow-hidden border shadow-xl flex-col ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
                            {/* Card Header Image */}
                            <div className="h-24 sm:h-28 relative overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 hover:scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800')` }}
                                />
                                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                    <Info size={10} className="text-[#ff007f]" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">Guidelines</span>
                                </div>
                                <div className="absolute bottom-3 left-5 z-20">
                                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-0.5">
                                        Session Preparation
                                    </h3>
                                    <p className="text-[10px] font-medium text-slate-300">
                                        Review these tips before you begin
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                                <ul className="space-y-4 pt-1">
                                    {[
                                        { icon: FileText, title: 'Compile Your Documents', desc: 'Have any relevant case files, contracts, or notices ready to share.', color: 'text-amber-500', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50' },
                                        { icon: MessageSquare, title: 'Note Your Questions', desc: 'Jot down key points you want to discuss to maximize your time.', color: 'text-sky-500', bg: isDarkMode ? 'bg-sky-500/10' : 'bg-sky-50' },
                                        { icon: Lock, title: '100% Confidential', desc: 'Everything discussed remains strictly confidential under attorney-client privilege.', color: 'text-[#ff007f]', bg: isDarkMode ? 'bg-[#ff007f]/10' : 'bg-[#ff007f]/10' }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 group">
                                            <div className={`p-2 rounded-lg h-fit shrink-0 transition-colors ${item.bg}`}>
                                                <item.icon size={14} className={item.color} />
                                            </div>
                                            <div>
                                                <h4 className={`text-xs font-bold mb-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {item.title}
                                                </h4>
                                                <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                                    <button
                                        onClick={onLeave}
                                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700'
                                            }`}
                                    >
                                        <LogOut size={14} />
                                        Leave Waiting Room
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Mobile-Only Action & Security Information */}
                    <motion.div variants={itemVariants} className="flex flex-col lg:hidden items-center mt-6 gap-4 w-full px-2">
                        <div className={`flex items-center gap-2 py-1.5 px-4 rounded-full border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                            <Shield size={12} className="text-emerald-500" />
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                End-to-End Encrypted
                            </span>
                        </div>

                        <button
                            onClick={onLeave}
                            className={`flex items-center justify-center gap-2 w-full max-w-[260px] py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-md transition-all ${isDarkMode
                                ? 'bg-[#1a1a1a] text-rose-500 border border-white/5 hover:bg-rose-500/10'
                                : 'bg-white text-rose-600 border border-slate-200 shadow-slate-200/50 hover:bg-rose-50'
                                }`}
                        >
                            <LogOut size={16} />
                            Leave Meeting
                        </button>
                    </motion.div>

                </motion.div>
            </div>

            {/* Custom CSS overrides if needed */}
            <style>{`
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </div>
    );
};

export default ConsultationLobby;

