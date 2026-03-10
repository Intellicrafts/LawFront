import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Clock, MessageCircle, FileText, Download, Shield,
    CheckCircle, BarChart2, Calendar, User, Briefcase,
    TrendingUp, Star, Mic, Image, ChevronDown, ChevronUp,
    Lock, Zap, Activity, Award, Scale
} from 'lucide-react';
import { consultationAPI } from '../../api/apiService';

/* ─────────────────────────────────────────────
   Tiny bar-chart rendered with divs (no recharts dependency)
───────────────────────────────────────────────*/
const MiniBar = ({ value, max, color, isDark }) => (
    <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} overflow-hidden`}>
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${max > 0 ? Math.round((value / max) * 100) : 0}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`h-full rounded-full ${color}`}
        />
    </div>
);

/* ─────────────────────────────────────────────
   Stat chip
───────────────────────────────────────────────*/
const StatChip = ({ icon: Icon, label, value, accent, isDark }) => (
    <div className={`flex flex-col gap-1.5 p-3.5 rounded-2xl border ${isDark
        ? 'bg-white/[0.03] border-white/[0.06]'
        : 'bg-white border-slate-100 shadow-sm'
        }`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
            <Icon size={14} className="text-white" />
        </div>
        <p className={`text-xl font-extrabold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {value}
        </p>
        <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            {label}
        </p>
    </div>
);

/* ─────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────────*/
const AppointmentReportModal = ({ appointment, isDarkMode, onClose, viewerType = 'user' }) => {
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAllMessages, setShowAllMessages] = useState(false);
    const overlayRef = useRef(null);

    const token = appointment?.session_token;

    /* ── Fetch data ── */
    useEffect(() => {
        if (!token) {
            // Build a synthetic summary from the appointment data alone
            setLoading(false);
            return;
        }
        const load = async () => {
            setLoading(true);
            try {
                const [sessionRes, messagesRes] = await Promise.all([
                    consultationAPI.getSession(token).catch(() => null),
                    consultationAPI.getMessages(token).catch(() => ({ messages: [] })),
                ]);
                setSession(sessionRes?.session || null);
                setMessages(messagesRes?.messages || []);
            } catch (e) {
                setError('Could not load session data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    /* ── Computed metrics ── */
    const realMessages = messages.filter(m =>
        m.sender_type !== 'system' &&
        !m.content?.startsWith('_REACTION_') &&
        !m.content?.startsWith('_REACTION_REMOVE_:')
    );
    const totalMessages = realMessages.length;
    const userMessages = realMessages.filter(m => m.sender_type === 'user').length;
    const lawyerMessages = realMessages.filter(m => m.sender_type === 'lawyer').length;
    const fileMessages = messages.filter(m => m.message_type === 'file').length;
    const audioMessages = messages.filter(m =>
        m.message_type === 'file' && (
            m.file_name?.match(/\.(webm|mp3|m4a|ogg|wav)$/i) ||
            m.file_type?.startsWith('audio/')
        )
    ).length;
    const imageMessages = messages.filter(m =>
        m.message_type === 'file' && (
            m.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
            m.file_type?.startsWith('image/')
        )
    ).length;

    const appt = appointment || {};
    const startTime = session?.actual_start_time || appt.appointment_time;
    const endTime = session?.actual_end_time || appt.end_time;
    const durationMinutes = (() => {
        if (appt.duration_minutes) return appt.duration_minutes;
        if (startTime && endTime) {
            const diff = new Date(endTime) - new Date(startTime);
            return Math.max(1, Math.round(diff / 60000));
        }
        return 0;
    })();

    const lawyerName = appt.lawyer?.full_name || appt.lawyerName || appt.lawyer_name ||
        (viewerType === 'lawyer' ? (appt.user?.name || appt.client_name || 'Client') : 'Lawyer');
    const clientName = viewerType === 'lawyer'
        ? (appt.user?.name || appt.client_name || 'Client')
        : (appt.lawyer?.full_name || appt.lawyerName || 'Advocate');

    const myMessages = viewerType === 'lawyer' ? lawyerMessages : userMessages;
    const theirMessages = viewerType === 'lawyer' ? userMessages : lawyerMessages;
    const engagementPct = totalMessages > 0 ? Math.round((myMessages / totalMessages) * 100) : 0;

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    /* ── Download transcript ── */
    const downloadTranscript = () => {
        const header =
            `═══════════════════════════════════════════\n` +
            `    MERAVAKIL SECURE CONSULTATION REPORT   \n` +
            `═══════════════════════════════════════════\n` +
            `Date:       ${formatDate(startTime)}\n` +
            `Duration:   ${durationMinutes} minutes\n` +
            `Lawyer:     ${lawyerName}\n` +
            `Messages:   ${totalMessages}\n` +
            `Files:      ${fileMessages}\n` +
            `Status:     ${session?.status || appt.status || 'Completed'}\n` +
            `Reference:  ${token || appt.id || 'N/A'}\n` +
            `═══════════════════════════════════════════\n\n`;

        const body = realMessages.map(m => {
            const t = formatTime(m.created_at);
            const who = m.sender_type === 'user' ? '[CLIENT]' : '[LAWYER]';
            return `[${t}] ${who}: ${m.content || `[${m.file_name || 'Attached file'}]`}`;
        }).join('\n');

        const blob = new Blob([header + body], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meravakil_report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const TABS = [
        { id: 'overview', label: 'Overview' },
        { id: 'metrics', label: 'Analytics' },
        { id: 'transcript', label: 'Transcript' },
    ];

    /* ── Close on overlay click ── */
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
                style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)' }}
                onClick={handleOverlayClick}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${isDarkMode
                            ? 'bg-[#0f0f1a] border-white/[0.07] shadow-black/80'
                            : 'bg-white border-slate-200/80 shadow-slate-300/50'
                        }`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* ── Top gradient accent bar ── */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

                    {/* ── Header ── */}
                    <div className={`flex items-center justify-between px-5 pt-5 pb-3 border-b flex-shrink-0 ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-indigo-500/15' : 'bg-indigo-50'}`}>
                                <Scale size={18} className="text-indigo-500" />
                            </div>
                            <div>
                                <h2 className={`text-base font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Session Report
                                </h2>
                                <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {formatDate(startTime)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Download */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadTranscript}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                title="Download transcript"
                            >
                                <Download size={11} />
                                <span className="hidden sm:inline">Export</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-500 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}
                            >
                                <X size={16} />
                            </motion.button>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className={`flex gap-1 px-5 pt-3 pb-0 flex-shrink-0`}>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${activeTab === tab.id
                                        ? isDarkMode
                                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/25'
                                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                        : isDarkMode
                                            ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Scrollable body ── */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="relative w-12 h-12">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                                        className={`absolute inset-0 rounded-full border-2 ${isDarkMode ? 'border-white/10 border-t-indigo-400' : 'border-slate-200 border-t-indigo-500'}`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Scale size={16} className={isDarkMode ? 'text-white/20' : 'text-slate-300'} />
                                    </div>
                                </div>
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    Loading session data…
                                </p>
                            </div>
                        ) : error ? (
                            <div className="py-12 text-center">
                                <p className="text-rose-500 text-sm font-semibold">{error}</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {/* ════════════ OVERVIEW TAB ════════════ */}
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="space-y-4"
                                    >
                                        {/* Completion banner */}
                                        <div className={`relative rounded-2xl p-4 border overflow-hidden ${isDarkMode ? 'bg-emerald-500/[0.06] border-emerald-500/15' : 'bg-emerald-50 border-emerald-100'
                                            }`}>
                                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-400" />
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100'}`}>
                                                    <CheckCircle size={20} className="text-emerald-500" />
                                                </div>
                                                <div>
                                                    <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                                        Consultation Completed Successfully
                                                    </h3>
                                                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-emerald-500/70' : 'text-emerald-600/80'}`}>
                                                        Session with <span className="font-bold">{lawyerName}</span> — {formatDate(startTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4-stat grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <StatChip icon={Clock} label="Duration" value={`${durationMinutes}m`} accent="bg-violet-500" isDark={isDarkMode} />
                                            <StatChip icon={MessageCircle} label="Messages" value={totalMessages} accent="bg-indigo-500" isDark={isDarkMode} />
                                            <StatChip icon={FileText} label="Files" value={fileMessages} accent="bg-cyan-500" isDark={isDarkMode} />
                                            <StatChip icon={TrendingUp} label="Engagement" value={`${engagementPct}%`} accent="bg-rose-500" isDark={isDarkMode} />
                                        </div>

                                        {/* Session details card */}
                                        <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                                                <Activity size={12} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Session Details</span>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {[
                                                    { label: 'Lawyer / Advocate', value: lawyerName, icon: Scale },
                                                    { label: 'Client', value: clientName, icon: User },
                                                    { label: 'Date', value: formatDate(startTime), icon: Calendar },
                                                    { label: 'Start Time', value: formatTime(startTime), icon: Clock },
                                                    { label: 'End Time', value: formatTime(endTime) || `~${formatTime(startTime)} +${durationMinutes}m`, icon: Clock },
                                                    { label: 'Case Type', value: appt.case_type || appt.lawyerSpec || 'Legal Consultation', icon: Briefcase },
                                                    { label: 'Status', value: (session?.status || appt.status || 'Completed').toUpperCase(), icon: CheckCircle },
                                                    { label: 'Session Token', value: token ? `${token.substring(0, 20)}…` : 'N/A', icon: Lock },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <item.icon size={12} className={`mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                                        <div className="flex-1 flex justify-between gap-4 min-w-0">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{item.label}</span>
                                                            <span className={`text-[11px] font-semibold text-right truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.value}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Security badge */}
                                        <div className={`flex items-center justify-center gap-2 p-3 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-50 border-slate-100'
                                            }`}>
                                            <Shield size={12} className="text-emerald-500" />
                                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                End-to-End Encrypted • Secure Session Log
                                            </span>
                                            <Lock size={10} className="text-emerald-500/60" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* ════════════ ANALYTICS TAB ════════════ */}
                                {activeTab === 'metrics' && (
                                    <motion.div
                                        key="metrics"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="space-y-4"
                                    >
                                        {/* Message breakdown */}
                                        <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <BarChart2 size={14} className="text-indigo-500" />
                                                <h3 className={`text-[12px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Message Analytics</h3>
                                            </div>
                                            <div className="space-y-3.5">
                                                {[
                                                    { label: 'Total Messages', value: totalMessages, max: totalMessages, color: 'bg-indigo-500' },
                                                    { label: 'User Messages', value: userMessages, max: totalMessages, color: 'bg-violet-500' },
                                                    { label: 'Lawyer Messages', value: lawyerMessages, max: totalMessages, color: 'bg-rose-500' },
                                                    { label: 'Files Shared', value: fileMessages, max: Math.max(fileMessages, 1), color: 'bg-cyan-500' },
                                                    { label: 'Voice Notes', value: audioMessages, max: Math.max(audioMessages, 1), color: 'bg-amber-500' },
                                                    { label: 'Images', value: imageMessages, max: Math.max(imageMessages, 1), color: 'bg-emerald-500' },
                                                ].map((row, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{row.label}</span>
                                                            <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row.value}</span>
                                                        </div>
                                                        <MiniBar value={row.value} max={row.max} color={row.color} isDark={isDarkMode} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Engagement rings */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                {
                                                    title: 'Your Share',
                                                    value: `${engagementPct}%`,
                                                    desc: `${myMessages} of ${totalMessages} messages`,
                                                    color: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
                                                    bg: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50',
                                                    border: isDarkMode ? 'border-indigo-500/20' : 'border-indigo-100',
                                                },
                                                {
                                                    title: 'Session Score',
                                                    value: totalMessages >= 10 ? 'High' : totalMessages >= 5 ? 'Medium' : 'Low',
                                                    desc: `Based on ${totalMessages} messages`,
                                                    color: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
                                                    bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
                                                    border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100',
                                                },
                                            ].map((card, i) => (
                                                <div key={i} className={`rounded-2xl border p-4 ${card.bg} ${card.border}`}>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 opacity-60 ${card.color}`}>{card.title}</p>
                                                    <p className={`text-2xl font-extrabold tracking-tight ${card.color}`}>{card.value}</p>
                                                    <p className={`text-[9px] mt-0.5 opacity-60 ${card.color}`}>{card.desc}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Timeline activity */}
                                        <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Activity size={13} className="text-rose-500" />
                                                <h3 className={`text-[12px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Session Timeline</h3>
                                            </div>
                                            <div className="relative pl-4">
                                                <div className={`absolute left-0 top-0 bottom-0 w-[1.5px] rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                                                {[
                                                    { time: formatTime(startTime), label: 'Session started', icon: Zap, color: 'text-emerald-500' },
                                                    ...(fileMessages > 0 ? [{ time: '—', label: `${fileMessages} file(s) shared`, icon: FileText, color: 'text-cyan-500' }] : []),
                                                    ...(audioMessages > 0 ? [{ time: '—', label: `${audioMessages} voice note(s) exchanged`, icon: Mic, color: 'text-amber-500' }] : []),
                                                    ...(imageMessages > 0 ? [{ time: '—', label: `${imageMessages} image(s) sent`, icon: Image, color: 'text-violet-500' }] : []),
                                                    { time: formatTime(endTime) || '—', label: 'Session ended', icon: CheckCircle, color: 'text-rose-500' },
                                                ].map((ev, i) => (
                                                    <div key={i} className="flex items-center gap-3 mb-3 last:mb-0 relative">
                                                        <div className={`absolute -left-[19px] w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'bg-[#0f0f1a] border-white/20' : 'bg-white border-slate-300'}`} />
                                                        <ev.icon size={11} className={`flex-shrink-0 ${ev.color}`} />
                                                        <span className={`text-[11px] font-semibold flex-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{ev.label}</span>
                                                        <span className={`text-[9px] font-mono ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{ev.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ════════════ TRANSCRIPT TAB ════════════ */}
                                {activeTab === 'transcript' && (
                                    <motion.div
                                        key="transcript"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="space-y-3"
                                    >
                                        {realMessages.length === 0 ? (
                                            <div className={`text-center py-12 rounded-2xl border ${isDarkMode ? 'border-white/[0.05] bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                                                <MessageCircle size={28} className={`mx-auto mb-3 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                                                <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    Transcript not available{!token ? ' — no session token' : ''}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    {(showAllMessages ? realMessages : realMessages.slice(0, 12)).map((msg, i) => {
                                                        const isOwn = (viewerType === 'lawyer' && msg.sender_type === 'lawyer') ||
                                                            (viewerType === 'user' && msg.sender_type === 'user');
                                                        return (
                                                            <motion.div
                                                                key={msg.id || i}
                                                                initial={{ opacity: 0, x: isOwn ? 10 : -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.02 }}
                                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${isOwn
                                                                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm'
                                                                        : isDarkMode
                                                                            ? 'bg-white/[0.07] text-slate-200 rounded-bl-sm border border-white/[0.07]'
                                                                            : 'bg-slate-50 text-slate-800 rounded-bl-sm border border-slate-100'
                                                                    }`}>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isOwn ? 'text-white/70' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                            {isOwn ? 'You' : (msg.sender_type === 'lawyer' ? lawyerName : clientName)}
                                                                        </span>
                                                                        <span className={`text-[8px] ${isOwn ? 'text-white/50' : isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                                            {formatTime(msg.created_at)}
                                                                        </span>
                                                                        {msg.message_type === 'file' && (
                                                                            <span className={`text-[8px] font-bold px-1 rounded ${isOwn ? 'bg-white/20' : isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                                                                FILE
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className={`text-[12px] leading-snug break-words ${isOwn ? 'text-white' : ''}`}>
                                                                        {msg.message_type === 'file'
                                                                            ? `📎 ${msg.file_name || 'Attached file'}`
                                                                            : (msg.content || '—')
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>

                                                {realMessages.length > 12 && (
                                                    <button
                                                        onClick={() => setShowAllMessages(v => !v)}
                                                        className={`w-full py-2.5 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1.5 border transition-all ${isDarkMode
                                                                ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        {showAllMessages ? (
                                                            <><ChevronUp size={13} /> Show less</>
                                                        ) : (
                                                            <><ChevronDown size={13} /> Show all {realMessages.length} messages</>
                                                        )}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={downloadTranscript}
                                                    className={`w-full py-2.5 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-2 border transition-all ${isDarkMode
                                                            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                                                        }`}
                                                >
                                                    <Download size={12} />
                                                    Download Full Transcript (.txt)
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AppointmentReportModal;
