import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, User, Phone, LogOut, Wifi, WifiOff, Loader } from 'lucide-react';

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
        }, 600);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const otherRole = userType === 'user' ? 'Lawyer' : 'Client';
    const otherName = otherParticipant?.name || otherRole;
    const initials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#080808]' : 'bg-slate-50/50'}`}>

            {/* Top Status Bar */}
            <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#080808]/80 border-white/5' : 'bg-white/80 border-slate-200/60'}`}>
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Shield size={14} className="text-blue-500" />
                        </div>
                        <div>
                            <p className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                Consultation Session
                            </p>
                            <p className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>
                                Secure Channel Established
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Connection Status */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${connectionStatus === 'connected'
                            ? isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                            : isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                            }`}>
                            {connectionStatus === 'connected' ? <Wifi size={10} /> : <WifiOff size={10} />}
                            {connectionStatus === 'connected' ? 'Live' : 'Reconnecting'}
                        </div>

                        {/* Timer */}
                        {timeRemaining !== null && (
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                <Clock size={10} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                                <span className={`text-[10px] font-bold tracking-wider font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Lobby Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    <div className={`p-8 rounded-[28px] border text-center ${isDarkMode
                        ? 'bg-[#121212] border-white/5'
                        : 'bg-white border-slate-200/60 shadow-2xl shadow-slate-200/40'
                        }`}>
                        {/* Avatar with pulse ring */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            {/* Pulse rings */}
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                                className="absolute inset-0 rounded-full bg-blue-500/20"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                                className="absolute inset-0 rounded-full bg-blue-500/15"
                            />

                            {/* Avatar circle */}
                            <div className={`relative w-full h-full rounded-full flex items-center justify-center text-2xl font-bold ${isDarkMode
                                ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border-2 border-blue-500/20'
                                : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border-2 border-blue-200/50'
                                }`}>
                                {initials}
                            </div>
                        </div>

                        {/* Waiting Text */}
                        <h2 className={`text-lg font-bold tracking-tight mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            Waiting for {otherName}{dots}
                        </h2>
                        <p className={`text-xs font-medium mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {otherRole} has been notified and will join shortly
                        </p>

                        {/* Session Info Cards */}
                        <div className={`grid grid-cols-2 gap-px rounded-2xl overflow-hidden border mb-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-100'}`}>
                            <div className={`flex flex-col items-center py-4 gap-2 ${isDarkMode ? 'bg-[#151515]' : 'bg-white'}`}>
                                <User size={14} className="opacity-30" />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {otherRole}
                                </span>
                                <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {otherName}
                                </span>
                            </div>
                            <div className={`flex flex-col items-center py-4 gap-2 ${isDarkMode ? 'bg-[#151515]' : 'bg-white'}`}>
                                <Clock size={14} className="opacity-30" />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Duration
                                </span>
                                <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {session?.duration_minutes || 55} min
                                </span>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDarkMode ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-blue-50 border border-blue-100'}`}>
                            <Shield size={12} className="text-blue-500" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                End-to-End Encrypted
                            </span>
                        </div>

                        {/* Loading Indicator */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                                        className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Leave Button */}
                        <button
                            onClick={onLeave}
                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                ? 'bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20'
                                : 'bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200'
                                }`}
                        >
                            <LogOut size={12} />
                            Leave Waiting Room
                        </button>
                    </div>

                    {/* Tips below the card */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`mt-6 text-center px-4`}
                    >
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                            💡 Tip: Prepare your questions while waiting for the best experience
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ConsultationLobby;
