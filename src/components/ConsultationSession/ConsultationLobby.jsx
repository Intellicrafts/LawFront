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

    // Animated dots: "..." effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

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
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans selection:bg-slate-500/30 ${isDarkMode ? 'bg-dark-bg text-slate-200' : 'bg-[#f4f7fb] text-slate-800'}`}>

            {/* Top Navigation / Status Bar (Premium Glassmorphism) */}
            <div className={`sticky top-0 z-40 backdrop-blur-2xl border-b ${isDarkMode ? 'bg-dark-bg/70 border-white/5' : 'bg-white/70 border-slate-200/60 shadow-sm'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-2xl relative group ${isDarkMode ? 'bg-gradient-to-br from-slate-500/20 to-slate-400/10' : 'bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner'}`}>
                            <Shield size={18} className="text-slate-500 relative z-10" />
                            <div className="absolute inset-0 rounded-2xl bg-slate-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
                        </div>
                        <div>
                            <h1 className={`text-sm sm:text-base font-extrabold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                Secure Consultation Lounge
                            </h1>
                            <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5 ${isDarkMode ? 'text-slate-400/80' : 'text-slate-600/80'}`}>
                                End-to-End Encrypted Session
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border shadow-sm ${connectionStatus === 'connected'
                            ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                            {connectionStatus === 'connected' ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Connected
                                </>
                            ) : (
                                <>
                                    <WifiOff size={12} className="animate-pulse" />
                                    Reconnecting
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
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

                {/* Background Ambient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-5xl z-10"
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
                        <div className="inline-flex items-center justify-center relative mb-6">
                            {/* Pulse Rings */}
                            <motion.div
                                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                                className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                                className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}
                            />
                            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl backdrop-blur-sm ${isDarkMode
                                ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-slate-400 border border-slate-500/30'
                                : 'bg-gradient-to-br from-white to-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {initials}
                            </div>
                        </div>

                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Waiting for {otherName}{dots}
                        </h2>
                        <p className={`text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            The session will begin automatically as soon as the {otherRole.toLowerCase()} joins. Please stay on this screen to ensure a seamless connection.
                        </p>
                    </motion.div>

                    {/* Dual Cards Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                        {/* Card 1: Expert/Participant Profile */}
                        <motion.div variants={itemVariants} className={`group relative rounded-[2rem] overflow-hidden border shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl ${isDarkMode ? 'bg-dark-bg-tertiary border-white/5 shadow-black/50' : 'bg-white border-slate-200/50 shadow-slate-200/50'}`}>
                            {/* Card Header Image */}
                            <div className="h-40 relative overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800')` }}
                                />
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                    <User size={12} className="text-white" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">{otherRole} Profile</span>
                                </div>
                            </div>

                            <div className="relative px-6 sm:px-8 pb-8 pt-8">
                                {/* Profile Avatar overlapping header */}
                                <div className="absolute -top-12 left-6 sm:left-8">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-subtitle font-bold text-2xl shadow-xl border-4 ${isDarkMode ? 'bg-dark-bg-secondary text-slate-400 border-[#111]' : 'bg-white text-slate-600 border-white'}`}>
                                        {initials}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-8">
                                    <h3 className={`text-xl font-bold tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {otherName}
                                    </h3>
                                    <p className={`text-sm font-medium mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {isUser ? <Briefcase size={16} /> : <User size={16} />}
                                        {isUser ? 'Verified Legal Practitioner' : 'Registered Client'}
                                    </p>

                                    <div className="space-y-4">
                                        <div className={`flex items-start gap-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className={`p-2 rounded-xl mt-0.5 ${isDarkMode ? 'bg-slate-500/10' : 'bg-slate-100'}`}>
                                                <Award size={18} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <p className={`text-user text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    Secure Connection
                                                </p>
                                                <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Your conversation is protected with enterprise-grade encryption.
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex items-start gap-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className={`p-2 rounded-xl mt-0.5 ${isDarkMode ? 'bg-slate-500/10' : 'bg-slate-100'}`}>
                                                <Clock size={18} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <p className={`text-user text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    Dedicated Time
                                                </p>
                                                <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Session duration is booked for {session?.duration_minutes || 55} minutes of uninterrupted focus.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Session Preparation */}
                        <motion.div variants={itemVariants} className={`relative rounded-[2rem] overflow-hidden border shadow-2xl flex flex-col ${isDarkMode ? 'bg-dark-bg-tertiary border-white/5 shadow-black/50' : 'bg-white border-slate-200/50 shadow-slate-200/50'}`}>
                            {/* Card Header Image */}
                            <div className="h-40 relative overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 hover:scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800')` }}
                                />
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                    <Info size={12} className="text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Guidelines</span>
                                </div>
                                <div className="absolute bottom-4 left-6 z-20">
                                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
                                        Session Preparation
                                    </h3>
                                    <p className="text-xs font-medium text-slate-300">
                                        Review these tips before you begin
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                                <ul className="space-y-5">
                                    {[
                                        { icon: FileText, title: 'Compile Your Documents', desc: 'Have any relevant case files, contracts, or notices ready to share.', color: 'text-amber-500', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100' },
                                        { icon: MessageSquare, title: 'Note Your Questions', desc: 'Jot down key points you want to discuss to maximize your time.', color: 'text-sky-500', bg: isDarkMode ? 'bg-sky-500/10' : 'bg-sky-100' },
                                        { icon: Lock, title: '100% Confidential', desc: 'Everything discussed remains strictly confidential under attorney-client privilege.', color: 'text-emerald-500', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100' }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <div className={`p-2.5 rounded-xl h-fit shrink-0 transition-colors ${item.bg}`}>
                                                <item.icon size={18} className={item.color} />
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {item.title}
                                                </h4>
                                                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                                    <button
                                        onClick={onLeave}
                                        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all ${isDarkMode
                                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700'
                                            }`}
                                    >
                                        <LogOut size={16} />
                                        Leave Waiting Room
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
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

