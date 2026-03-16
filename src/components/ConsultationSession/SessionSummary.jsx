import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Clock, MessageCircle, Shield, Star,
    Download, ArrowLeft, Calendar, User, Briefcase, FileText,
    BarChart2, Lock, Award, ChevronRight, ThumbsUp,
    BookOpen, Scale, X, Sun, Moon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { deriveKey, decryptText } from '../../utils/e2ee';

const SessionSummary = ({
    session,
    messages,
    userType,
    otherParticipant,
    isDarkMode,
    onBack
}) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeTab, setActiveTab] = useState('summary');
    const [e2eKey, setE2eKey] = useState(null);
    const [decryptedMessages, setDecryptedMessages] = useState([]);

    const otherName = otherParticipant?.name || (userType === 'user' ? 'Lawyer' : 'Client');
    const otherInitials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // ── Stats calculations ──
    useEffect(() => {
        const initKey = async () => {
            if (session?.session_token) {
                const key = await deriveKey(session.session_token, 'meravakil_secure_salt');
                setE2eKey(key);
            }
        };
        initKey();
    }, [session?.session_token]);

    const realMessages = messages.filter(m =>
        m.sender_type !== 'system' &&
        !m.content?.startsWith('_REACTION_') &&
        !m.content?.startsWith('_REACTION_REMOVE_:')
    );

    useEffect(() => {
        const decryptAll = async () => {
            if (!e2eKey || !realMessages) return;

            try {
                const decrypted = await Promise.all(realMessages.map(async (msg) => {
                    let plainContent = msg.content;
                    
                    if (msg.message_type === 'file') {
                        plainContent = `📎 ${msg.file_name || 'Attached file'}`;
                    } else if (msg.content && !msg.content.startsWith('_REACTION_')) {
                        try {
                            plainContent = await decryptText(msg.content, e2eKey);
                        } catch (err) {
                            console.warn("Could not decrypt message in summary", err);
                            plainContent = "Message encrypted";
                        }
                    }

                    return {
                        ...msg,
                        plain_content: plainContent
                    };
                }));
                // Set and sort just in case
                setDecryptedMessages(decrypted.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)));
            } catch (error) {
                console.error("Failed to decrypt summary messages:", error);
            }
        };

        decryptAll();
    }, [messages, e2eKey]);
    const totalMessages = realMessages.length;
    const userMessages = realMessages.filter(m => m.sender_type === 'user').length;
    const lawyerMessages = realMessages.filter(m => m.sender_type === 'lawyer').length;
    const fileMessages = messages.filter(m => m.message_type === 'file').length;

    const startTime = session?.actual_start_time || session?.scheduled_start_time;
    const endTime = session?.actual_end_time || session?.scheduled_end_time;

    let durationMinutes = session?.duration_minutes || 55;
    if (startTime && endTime) {
        const diff = new Date(endTime) - new Date(startTime);
        durationMinutes = Math.max(1, Math.round(diff / (1000 * 60)));
    }

    const engagementRate = totalMessages > 0
        ? Math.round(((userType === 'user' ? userMessages : lawyerMessages) / totalMessages) * 100)
        : 0;

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
        const textMessages = decryptedMessages
            .filter(m => m.sender_type !== 'system' && !m.content?.startsWith('_REACTION_'))
            .map(m => {
                const time = formatTime(m.created_at);
                const sender = m.sender_type === 'user' ? '[CLIENT]' : '[LAWYER]';
                return `[${time}] ${sender}: ${m.plain_content || '[File Attachment]'}`;
            })
            .join('\n');

        const header = `═══════════════════════════════\n` +
            `   MERAVAKIL CONSULTATION LOG   \n` +
            `═══════════════════════════════\n` +
            `Date:     ${formatDate(startTime)}\n` +
            `Duration: ${durationMinutes} minutes\n` +
            `With:     ${otherName}\n` +
            `Messages: ${totalMessages}\n` +
            `Files:    ${fileMessages}\n` +
            `═══════════════════════════════\n\n`;

        const blob = new Blob([header + textMessages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRatingSubmit = () => {
        setRatingSubmitted(true);
    };

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    const stats = [
        {
            icon: Clock,
            label: 'Duration',
            value: `${durationMinutes}m`,
            subValue: 'session time',
            color: isDarkMode ? 'text-violet-400' : 'text-violet-600',
            bg: isDarkMode ? 'bg-violet-500/10' : 'bg-violet-50',
        },
        {
            icon: MessageCircle,
            label: 'Messages',
            value: totalMessages,
            subValue: 'exchanged',
            color: isDarkMode ? 'text-sky-400' : 'text-sky-600',
            bg: isDarkMode ? 'bg-sky-500/10' : 'bg-sky-50',
        },
        {
            icon: BarChart2,
            label: 'Engagement',
            value: `${engagementRate}%`,
            subValue: 'participation',
            color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
            bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
        },
        {
            icon: FileText,
            label: 'Files',
            value: fileMessages,
            subValue: 'shared',
            color: isDarkMode ? 'text-amber-400' : 'text-amber-600',
            bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50',
        },
    ];

    return (
        <div className={`fixed inset-0 w-screen h-[100dvh] flex flex-col font-sans overflow-hidden ${isDarkMode ? 'bg-[#0d0d14] text-slate-200' : 'bg-[#f2f5fa] text-slate-800'}`}>

            {/* Ambient bg */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

            {/* ── HEADER ── */}
            <div className={`shrink-0 z-40 border-b backdrop-blur-xl ${isDarkMode ? 'bg-[#0d0d14]/80 border-white/[0.06]' : 'bg-white/80 border-slate-200/60 shadow-sm'}`}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-200/50'}`}
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <div>
                        <h1 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            Session Summary
                        </h1>
                        <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Consultation Completed
                        </p>
                    </div>

                    {/* Tabs + dark mode toggle */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className={`p-2 rounded-xl transition-all border ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border-white/[0.07] text-amber-400 hover:text-amber-300'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm'
                                }`}
                        >
                            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        {/* Tab switcher */}
                        <div className={`flex items-center gap-1 p-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            {['summary', 'messages'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize tracking-wide transition-all ${activeTab === tab
                                        ? isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-800 shadow-sm'
                                        : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-4">

                    <AnimatePresence mode="wait">
                        {activeTab === 'summary' ? (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {/* ── SUCCESS BANNER ── */}
                                <div className={`relative rounded-2xl overflow-hidden p-5 border ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-md shadow-slate-100/50'}`}>
                                    {/* gradient accent */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />

                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl flex-shrink-0 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                            <CheckCircle size={26} className="text-emerald-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className={`text-lg font-extrabold tracking-tight mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                                Consultation Completed
                                            </h2>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Your session with <span className="font-bold">{otherName}</span> ended successfully.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {[
                                                    { label: `${durationMinutes} min`, icon: Clock },
                                                    { label: `${totalMessages} messages`, icon: MessageCircle },
                                                    { label: `${fileMessages} files`, icon: FileText },
                                                ].map((chip, i) => (
                                                    <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                        <chip.icon size={9} />
                                                        {chip.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── STATS GRID ── */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                            className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}
                                        >
                                            <div className={`w-9 h-9 mx-auto mb-2.5 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                                <stat.icon size={16} className={stat.color} />
                                            </div>
                                            <p className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                                {stat.value}
                                            </p>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                {stat.label}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* ── SESSION DETAILS CARD ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}
                                >
                                    <div className={`px-4 py-3 border-b flex items-center gap-2 ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                                        <Scale size={13} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Session Details
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        {/* Participant */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isDarkMode ? 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400 border border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-700 border border-violet-100'}`}>
                                                {otherInitials}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{otherName}</p>
                                                <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {userType === 'user' ? 'Legal Consultant' : 'Client'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date/time grid */}
                                        <div className={`grid grid-cols-2 gap-px rounded-xl overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/[0.06]' : 'bg-slate-100 border-slate-200/50'}`}>
                                            <div className={`flex flex-col items-center py-3.5 gap-1.5 ${isDarkMode ? 'bg-[#1a1a28]' : 'bg-white'}`}>
                                                <Calendar size={13} className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Date</span>
                                                <span className={`text-[11px] font-bold text-center px-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {formatDate(startTime).split(',').slice(0, 2).join(',')}
                                                </span>
                                            </div>
                                            <div className={`flex flex-col items-center py-3.5 gap-1.5 ${isDarkMode ? 'bg-[#1a1a28]' : 'bg-white'}`}>
                                                <Clock size={13} className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Time</span>
                                                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {formatTime(startTime)} – {formatTime(endTime)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ── RATING CARD ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}
                                >
                                    <AnimatePresence mode="wait">
                                        {ratingSubmitted ? (
                                            <motion.div
                                                key="submitted"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center gap-2 py-2"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                                    <ThumbsUp size={18} className="text-emerald-500" />
                                                </div>
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    Thank you for your feedback!
                                                </p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={14} fill={s <= rating ? '#f59e0b' : 'none'} className={s <= rating ? 'text-amber-400' : isDarkMode ? 'text-slate-700' : 'text-slate-300'} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="rating" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Award size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-500'} />
                                                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        Rate Your Session
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-2">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <button
                                                            key={s}
                                                            onMouseEnter={() => setHoveredStar(s)}
                                                            onMouseLeave={() => setHoveredStar(0)}
                                                            onClick={() => setRating(s)}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <Star
                                                                size={24}
                                                                fill={s <= (hoveredStar || rating) ? '#f59e0b' : 'none'}
                                                                className={`transition-colors ${s <= (hoveredStar || rating) ? 'text-amber-400' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                    {(hoveredStar || rating) > 0 && (
                                                        <span className={`ml-1 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                            {ratingLabels[hoveredStar || rating]}
                                                        </span>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {rating > 0 && !showFeedback && (
                                                        <motion.button
                                                            initial={{ opacity: 0, y: 4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 4 }}
                                                            onClick={() => setShowFeedback(true)}
                                                            className={`text-[11px] text-left font-medium mt-1 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                                                        >
                                                            + Add written feedback (optional)
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>

                                                <AnimatePresence>
                                                    {showFeedback && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-2 overflow-hidden"
                                                        >
                                                            <textarea
                                                                value={feedbackText}
                                                                onChange={e => setFeedbackText(e.target.value)}
                                                                placeholder="Share your thoughts about the consultation..."
                                                                rows={3}
                                                                className={`w-full text-[13px] rounded-xl p-3 border outline-none resize-none transition-all ${isDarkMode
                                                                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-200 placeholder:text-slate-600 focus:border-white/20'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-slate-300'
                                                                    }`}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {rating > 0 && (
                                                    <motion.button
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        onClick={handleRatingSubmit}
                                                        className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[11px] font-bold uppercase tracking-widest shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-amber-600 transition-all active:scale-[0.98]"
                                                    >
                                                        Submit Rating
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* ── ACTIONS ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <button
                                        onClick={downloadTranscript}
                                        className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/[0.08]'
                                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
                                            }`}
                                    >
                                        <Download size={13} />
                                        Download Transcript
                                    </button>
                                    <button
                                        onClick={onBack}
                                        className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
                                    >
                                        <ArrowLeft size={13} />
                                        Back to Consultations
                                    </button>
                                </motion.div>

                                {/* ── SECURITY FOOTER ── */}
                                <div className="text-center pb-3">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06] text-slate-600' : 'bg-white border-slate-100 text-slate-400 shadow-sm'}`}>
                                        <Shield size={9} className="text-emerald-500/70" />
                                        Session data encrypted &amp; stored securely
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* ── MESSAGES TAB ── */
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                {/* Breakdown */}
                                <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Message Breakdown
                                    </p>
                                    {[
                                        {
                                            label: userType === 'user' ? 'You (Client)' : 'You (Lawyer)',
                                            count: userType === 'user' ? userMessages : lawyerMessages,
                                            pct: totalMessages > 0 ? Math.round(((userType === 'user' ? userMessages : lawyerMessages) / totalMessages) * 100) : 0,
                                            color: 'from-indigo-500 to-violet-500',
                                            icon: User,
                                        },
                                        {
                                            label: userType === 'user' ? otherName + ' (Lawyer)' : otherName + ' (Client)',
                                            count: userType === 'user' ? lawyerMessages : userMessages,
                                            pct: totalMessages > 0 ? Math.round(((userType === 'user' ? lawyerMessages : userMessages) / totalMessages) * 100) : 0,
                                            color: 'from-amber-500 to-orange-500',
                                            icon: Briefcase,
                                        },
                                    ].map((p, i) => (
                                        <div key={i} className="mb-3 last:mb-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <p.icon size={11} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                                    <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{p.label}</span>
                                                </div>
                                                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{p.count} <span className="font-normal opacity-60 text-[10px]">({p.pct}%)</span></span>
                                            </div>
                                            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/8' : 'bg-slate-100'}`}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${p.pct}%` }}
                                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message list */}
                                <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#141420] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={12} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                Transcript ({totalMessages})
                                            </span>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${isDarkMode ? 'bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20' : 'bg-[#ff007f]/5 text-[#ff007f] border border-[#ff007f]/10'}`}>
                                            <Lock size={8} />
                                            Encrypted
                                        </div>
                                    </div>
                                    <div className="max-h-[380px] overflow-y-auto px-3 py-2 space-y-1">
                                        {decryptedMessages.length === 0 ? (
                                            <div className="text-center py-8">
                                                <MessageCircle size={24} className={`mx-auto mb-2 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                                                <p className={`text-[12px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>No messages in this session</p>
                                            </div>
                                        ) : decryptedMessages.map((msg, i) => {
                                            const isOwn = (userType === 'user' && msg.sender_type === 'user') ||
                                                (userType === 'lawyer' && msg.sender_type === 'lawyer');
                                            return (
                                                <div key={i} className={`flex gap-2 py-1.5 px-2 rounded-xl ${isOwn
                                                    ? isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-50/50'
                                                    : isDarkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50'
                                                    }`}>
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold mt-0.5 ${isOwn
                                                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                                                        : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                                        }`}>
                                                        {isOwn ? 'Y' : otherInitials[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className={`text-[10px] font-bold ${isOwn
                                                                ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                                                                : isDarkMode ? 'text-amber-400' : 'text-amber-500'
                                                                }`}>
                                                                {isOwn ? 'You' : otherName}
                                                            </span>
                                                            <span className={`text-[9px] ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`}>
                                                                {formatTime(msg.created_at)}
                                                            </span>
                                                            {msg.message_type === 'file' && (
                                                                <span className={`text-[8px] font-bold uppercase px-1 py-0.5 rounded ${isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-500'}`}>
                                                                    FILE
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-[12px] leading-snug break-words ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {msg.plain_content}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={downloadTranscript}
                                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/[0.08]'
                                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
                                        }`}
                                >
                                    <Download size={13} />
                                    Download Full Transcript
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SessionSummary;
