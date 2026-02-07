
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiServices } from '../api/apiService';
import {
    Calendar, Clock, Search, Filter, ArrowLeft,
    Video, Mail, Shield, Hourglass, Briefcase,
    FileText, Zap, CheckCircle, X, CalendarDays, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyAppointments = ({ onBack }) => {
    const { mode } = useSelector((state) => state.theme);
    const isDarkMode = mode === 'dark';

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await apiServices.getUserProfile();
                const userData = response.data || response;
                const rawAppointments = userData.recent_activity?.appointments || [];

                const processed = rawAppointments.map(apt => {
                    const dateObj = new Date(apt.appointment_time);
                    const lawyerName = apt.lawyer?.full_name || apt.lawyer_name || 'Legal Consultant';
                    const lawyerSpec = apt.lawyer?.specialization || apt.lawyer_specialization || 'Legal Consultation';
                    const lawyerEmail = apt.lawyer?.email || '';

                    return {
                        ...apt,
                        dateObj,
                        lawyerName,
                        lawyerSpec,
                        lawyerEmail,
                        searchString: `${lawyerName} ${lawyerSpec} ${apt.status || ''} ${apt.notes || ''}`.toLowerCase()
                    };
                });

                const sorted = processed.sort((a, b) => b.dateObj - a.dateObj);
                setAppointments(sorted);
                setFilteredAppointments(sorted);
            } catch (err) {
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    useEffect(() => {
        let result = [...appointments];
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(apt => apt.searchString.includes(lowerQuery));
        }
        if (selectedFilter !== 'all') {
            const now = new Date();
            if (selectedFilter === 'upcoming') result = result.filter(apt => apt.dateObj > now && apt.status !== 'cancelled');
            else if (selectedFilter === 'past') result = result.filter(apt => apt.dateObj <= now && apt.status !== 'cancelled');
            else if (selectedFilter === 'cancelled') result = result.filter(apt => apt.status === 'cancelled');
        }
        if (selectedDate) {
            const filterDateStr = new Date(selectedDate).toDateString();
            result = result.filter(apt => apt.dateObj.toDateString() === filterDateStr);
        }
        setFilteredAppointments(result);
    }, [searchQuery, selectedFilter, selectedDate, appointments]);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusInfo = (dateObj, status) => {
        const now = new Date();
        const diff = dateObj - now;
        const isPast = diff < 0;

        if (status === 'cancelled') return { text: 'Cancelled', icon: X, color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/10' };
        if (status === 'completed') return { text: 'Completed', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' };
        if (isPast) return { text: 'Past', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-500/5', border: 'border-slate-500/10' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        return { text: `In ${timeText}`, icon: Hourglass, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' };
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#080808]' : 'bg-slate-50/50'}`}>

            {/* Premium Sticky Header Container */}
            <div className={`sticky top-0 z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#080808]/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200/60'}`}>
                <div className="max-w-6xl mx-auto px-4 py-4">

                    {/* Main Navigation & Title Wrapper */}
                    <div className={`p-2 rounded-[24px] border transition-all duration-500 ${isDarkMode ? 'bg-white/[0.03] border-white/5' : 'bg-slate-100/40 border-slate-200/50'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">

                            {/* Left Side: Back & Branding */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={onBack}
                                    className={`p-2.5 rounded-2xl transition-all ${isDarkMode
                                            ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                                            : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-200/50'
                                        }`}
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="space-y-0.5">
                                    <h1 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>My Appointments</h1>
                                    <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Legal Hub • Active Sessions</p>
                                </div>
                            </div>

                            {/* Right Side: Integrated Search & Action Bar */}
                            <div className="flex items-center gap-2 flex-1 md:flex-initial">
                                <div className={`relative flex-1 md:w-72 group transition-all duration-500 ${isDarkMode
                                        ? 'bg-black/20 hover:bg-black/40'
                                        : 'bg-white hover:bg-slate-50'
                                    } rounded-2xl border ${isDarkMode
                                        ? 'border-white/5 focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                        : 'border-slate-200 focus-within:border-blue-500/20 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.05)]'
                                    } shadow-sm overflow-hidden`}>
                                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'
                                        }`}>
                                        <Search className={`transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'
                                            }`} size={12} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search sessions or lawyers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-12 pr-10 py-3 bg-transparent border-none text-[11px] font-medium tracking-wide focus:ring-0 focus:outline-none ${isDarkMode ? 'text-slate-100 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'
                                            }`}
                                    />

                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-500/10 rounded-lg transition-all"
                                        >
                                            <X size={12} className="opacity-40" />
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-300 ${showFilters
                                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                                            : isDarkMode
                                                ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    <Filter size={12} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:inline">Filters</span>
                                </button>
                            </div>
                        </div>

                        {/* Sub-Filters Wrapper (Collapsible) */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className={`mx-2 mt-3 mb-2 pt-3 flex flex-wrap gap-3 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200/50'}`}>
                                        <div className={`flex p-1 rounded-2xl ${isDarkMode ? 'bg-black/20' : 'bg-slate-100'}`}>
                                            {['all', 'upcoming', 'past'].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setSelectedFilter(f)}
                                                    className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${selectedFilter === f
                                                            ? 'bg-white text-blue-600 shadow-sm'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className={`px-4 py-2 rounded-2xl text-[10px] font-bold border transition-all ${isDarkMode
                                                        ? 'bg-black/20 border-white/10 text-slate-100 focus:border-blue-500/50'
                                                        : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500/20'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield size={16} className="text-blue-500/40" />
                            </div>
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-40">Syncing database...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className={`text-center py-24 border-2 border-dashed rounded-[32px] transition-all ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-50/50'
                        }`}>
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'
                            }`}>
                            <CalendarDays size={28} className="opacity-20" />
                        </div>
                        <h3 className={`text-base font-bold tracking-tight mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>No sessions identified</h3>
                        <p className={`text-xs font-medium opacity-40 max-w-xs mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Refine your search parameters or check alternative filter options.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAppointments.map((apt, i) => {
                            const status = getStatusInfo(apt.dateObj, apt.status);
                            const isPast = apt.dateObj < new Date();

                            return (
                                <motion.div
                                    key={apt.id || i}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`group relative overflow-hidden rounded-[24px] border transition-all duration-500 ${isDarkMode
                                            ? 'bg-[#121212] border-white/5 hover:border-blue-500/30'
                                            : 'bg-white border-slate-200/60 hover:border-blue-200 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.08)]'
                                        } ${isPast && apt.status !== 'upcoming' ? 'opacity-60 grayscale-[0.2]' : ''}`}
                                >
                                    {/* Premium Background Gradient */}
                                    <div className="absolute -right-16 -top-16 w-40 h-40 bg-blue-500/[0.03] blur-[60px] rounded-full transition-all duration-700 group-hover:bg-blue-500/[0.06]" />

                                    <div className="p-5">
                                        {/* Status Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <div className={`px-2.5 py-1.5 rounded-xl border ${status.bg} ${status.color} ${status.border} text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}>
                                                <status.icon size={12} strokeWidth={2.5} />
                                                {status.text}
                                            </div>
                                            <div className={`flex items-center gap-1.5 text-[10px] font-semibold opacity-40 group-hover:opacity-80 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <Shield size={12} className="text-emerald-500/60" />
                                                <span>Secure</span>
                                            </div>
                                        </div>

                                        {/* Lawyer Briefing */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-transform duration-500 group-hover:scale-105 ${isDarkMode
                                                    ? 'bg-gradient-to-br from-white/[0.08] to-transparent text-blue-400 border border-white/5'
                                                    : 'bg-gradient-to-br from-blue-50 to-white text-blue-600 border border-blue-100/50 shadow-sm'
                                                }`}>
                                                {apt.lawyerName?.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden space-y-0.5">
                                                <h3 className={`text-[13px] font-bold truncate tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800 group-hover:text-blue-600'
                                                    }`}>{apt.lawyerName}</h3>
                                                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-50">
                                                    <Briefcase size={10} strokeWidth={2} />
                                                    <span className="truncate">{apt.lawyerSpec}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline Data */}
                                        <div className={`grid grid-cols-2 gap-px rounded-2xl overflow-hidden border mb-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-100'
                                            }`}>
                                            <div className={`flex flex-col items-center justify-center py-3.5 px-2 gap-2 ${isDarkMode ? 'bg-[#151515]' : 'bg-white'}`}>
                                                <Calendar size={14} className="opacity-30" />
                                                <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatDate(apt.dateObj)}</span>
                                            </div>
                                            <div className={`flex flex-col items-center justify-center py-3.5 px-2 gap-2 ${isDarkMode ? 'bg-[#151515]' : 'bg-white'}`}>
                                                <Clock size={14} className="opacity-30" />
                                                <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatTime(apt.dateObj)}</span>
                                            </div>
                                        </div>

                                        {/* Case Notes */}
                                        {apt.notes && (
                                            <div className={`relative p-4 rounded-2xl text-[11px] font-medium leading-relaxed mb-6 italic ${isDarkMode ? 'bg-white/[0.02] text-slate-400 border border-white/5' : 'bg-slate-50/80 text-slate-600 border border-slate-100'
                                                }`}>
                                                <FileText size={12} className="absolute -left-1.5 -top-1.5 opacity-10" />
                                                <p className="line-clamp-2 pl-1 border-l-2 border-blue-500/20">"{apt.notes}"</p>
                                            </div>
                                        )}

                                        {/* Operational Actions */}
                                        {apt.meeting_link && !isPast && apt.status !== 'cancelled' ? (
                                            <a
                                                href={apt.meeting_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                                            >
                                                <Video size={14} strokeWidth={2.5} />
                                                Join Briefing
                                            </a>
                                        ) : (
                                            <div className={`w-full py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center border ${isDarkMode
                                                    ? 'bg-white/[0.03] border-white/5 text-slate-600'
                                                    : 'bg-slate-50/50 border-slate-100 text-slate-400'
                                                }`}>
                                                {apt.status === 'cancelled' ? 'Briefing Terminated' : isPast ? 'Session Concluded' : 'Pending Operations'}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Security Footer */}
            <div className="max-w-6xl mx-auto px-4 pb-12 text-center">
                <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all ${isDarkMode ? 'bg-white/[0.02] border-white/5 text-slate-500' : 'bg-white border-slate-200/60 text-slate-400 shadow-sm'
                    }`}>
                    <Zap size={12} className="text-amber-500 opacity-80" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Verified Secure Protocol</span>
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;
