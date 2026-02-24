import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Clock, MessageCircle, Shield, Star,
    Download, ArrowLeft, Calendar, User, Briefcase, FileText
} from 'lucide-react';

const SessionSummary = ({
    session,
    messages,
    userType,
    otherParticipant,
    isDarkMode,
    onBack
}) => {
    const otherName = otherParticipant?.name || (userType === 'user' ? 'Lawyer' : 'Client');
    const otherInitials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Calculate stats
    const totalMessages = messages.filter(m => m.sender_type !== 'system').length;
    const userMessages = messages.filter(m => m.sender_type === 'user').length;
    const lawyerMessages = messages.filter(m => m.sender_type === 'lawyer').length;

    const startTime = session?.actual_start_time || session?.scheduled_start_time;
    const endTime = session?.actual_end_time || session?.scheduled_end_time;

    let durationMinutes = session?.duration_minutes || 55;
    if (startTime && endTime) {
        const diff = new Date(endTime) - new Date(startTime);
        durationMinutes = Math.max(1, Math.round(diff / (1000 * 60)));
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const downloadTranscript = () => {
        const textMessages = messages
            .map(m => {
                const time = formatTime(m.created_at);
                const sender = m.sender_type === 'system' ? '[SYSTEM]' :
                    m.sender_type === 'user' ? '[CLIENT]' : '[LAWYER]';
                return `[${time}] ${sender}: ${m.content}`;
            })
            .join('\n');

        const header = `=== CONSULTATION TRANSCRIPT ===\n` +
            `Date: ${formatDate(startTime)}\n` +
            `Duration: ${durationMinutes} minutes\n` +
            `Participants: Client & ${otherName}\n` +
            `Total Messages: ${totalMessages}\n` +
            `=============================\n\n`;

        const blob = new Blob([header + textMessages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_transcript_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const stats = [
        {
            icon: Clock,
            label: 'Duration',
            value: `${durationMinutes} min`,
            color: 'text-slate-500',
            bg: isDarkMode ? 'bg-slate-500/10' : 'bg-slate-50',
        },
        {
            icon: MessageCircle,
            label: 'Messages',
            value: totalMessages,
            color: 'text-slate-500',
            bg: isDarkMode ? 'bg-slate-500/10' : 'bg-slate-50',
        },
        {
            icon: User,
            label: 'Your Messages',
            value: userType === 'user' ? userMessages : lawyerMessages,
            color: 'text-emerald-500',
            bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
        },
        {
            icon: Briefcase,
            label: `${userType === 'user' ? 'Lawyer' : 'Client'} Messages`,
            value: userType === 'user' ? lawyerMessages : userMessages,
            color: 'text-violet-500',
            bg: isDarkMode ? 'bg-violet-500/10' : 'bg-violet-50',
        },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-50/50'}`}>

            {/* Header */}
            <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-dark-bg/80 border-white/5' : 'bg-white/80 border-slate-200/60'}`}>
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className={`p-2.5 rounded-2xl transition-all ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                            : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-200/50'
                            }`}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            Session Summary
                        </h1>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Consultation Completed
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Success Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-[24px] border text-center ${isDarkMode
                        ? 'bg-[#121212] border-white/5'
                        : 'bg-white border-slate-200/60 shadow-xl shadow-slate-200/30'
                        }`}
                >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                        <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h2 className={`text-xl font-bold tracking-tight mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        Consultation Completed
                    </h2>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Your session with {otherName} has been completed successfully.
                    </p>
                </motion.div>

                {/* Session Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-5 rounded-[24px] border ${isDarkMode
                        ? 'bg-[#121212] border-white/5'
                        : 'bg-white border-slate-200/60 shadow-lg shadow-slate-200/20'
                        }`}
                >
                    <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Session Details
                    </h3>

                    {/* Participant */}
                    <div className="flex items-center gap-4 mb-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold ${isDarkMode
                            ? 'bg-gradient-to-br from-slate-500/20 to-slate-400/20 text-slate-400 border border-slate-500/20'
                            : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border border-slate-200/50'
                            }`}>
                            {otherInitials}
                        </div>
                        <div>
                            <h4 className={`text-[13px] font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                {otherName}
                            </h4>
                            <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {userType === 'user' ? 'Legal Consultant' : 'Client'}
                            </p>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className={`grid grid-cols-2 gap-px rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-100'}`}>
                        <div className={`flex flex-col items-center py-4 gap-2 ${isDarkMode ? 'bg-dark-bg-secondary' : 'bg-white'}`}>
                            <Calendar size={14} className="opacity-30" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date</span>
                            <span className={`text-[11px] font-bold tracking-tight text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {formatDate(startTime).split(',').slice(0, 2).join(',')}
                            </span>
                        </div>
                        <div className={`flex flex-col items-center py-4 gap-2 ${isDarkMode ? 'bg-dark-bg-secondary' : 'bg-white'}`}>
                            <Clock size={14} className="opacity-30" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Time</span>
                            <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {formatTime(startTime)} – {formatTime(endTime)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-[20px] border text-center ${isDarkMode
                                ? 'bg-[#121212] border-white/5'
                                : 'bg-white border-slate-200/60 shadow-sm'
                                }`}
                        >
                            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                            <p className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    {/* Download Transcript */}
                    <button
                        onClick={downloadTranscript}
                        className={`flex items-center justify-center gap-3 flex-1 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
                            }`}
                    >
                        <Download size={14} />
                        Download Transcript
                    </button>

                    {/* Back to Appointments */}
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-3 flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-slate-500/20 active:scale-[0.98] transition-all"
                    >
                        <ArrowLeft size={14} />
                        Back to Consultations
                    </button>
                </motion.div>

                {/* Security Footer */}
                <div className="text-center pt-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-white border border-slate-100 shadow-sm'}`}>
                        <Shield size={10} className="text-emerald-500/60" />
                        <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Session data encrypted & stored securely
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SessionSummary;
