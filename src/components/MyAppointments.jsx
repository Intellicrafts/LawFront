import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiServices, consultationAPI, appointmentAPI } from '../api/apiService';
import { useToast } from '../context/ToastContext';
import AppointmentReportModal from './ConsultationSession/AppointmentReportModal';
import {
    Calendar, Clock, Search, Filter, ArrowLeft,
    Video, Mail, Shield, Hourglass, Briefcase,
    FileText, Zap, CheckCircle, X, CalendarDays, Loader,
    MessageCircle, PhoneCall, Lock, Timer, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyAppointments = ({ onBack }) => {
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const isDarkMode = mode === 'dark';
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [joiningId, setJoiningId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [reportAppointment, setReportAppointment] = useState(null); // which apt's report modal is open

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await apiServices.getUserProfile();
                console.log('Full API Response:', response);
                const userData = response.data || response;
                // Use tokenManager logic or user profile to get ID
                const userId = userData.id || userData.user_id;

                let rawAppointments = [];
                try {
                    if (userId) {
                        const aptResponse = await appointmentAPI.getUserAppointments(userId);
                        rawAppointments = aptResponse.data || [];
                        console.log('Fetched Appointments via ID:', rawAppointments);
                    } else {
                        console.warn('User ID not found, falling back to profile activity');
                        rawAppointments = userData.recent_activity?.appointments || [];
                    }
                } catch (aptError) {
                    console.error('Error fetching appointments via ID:', aptError);
                    rawAppointments = userData.recent_activity?.appointments || [];
                }

                // If rawAppointments is empty, check if we got it from profile
                if (!rawAppointments || rawAppointments.length === 0) {
                    rawAppointments = userData.recent_activity?.appointments || [];
                }

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
                console.log('Processed & Sorted Appointments:', sorted);
                if (sorted.length > 0) {
                    console.log('Sample Appointment Structure:', {
                        id: sorted[0].id,
                        appointment_id: sorted[0].appointment_id,
                        allKeys: Object.keys(sorted[0])
                    });
                }
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

    // Live clock for join button countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Enhanced join logic: Active throughout the appointment hour
    const getJoinState = useCallback((apt) => {
        if (!apt?.dateObj) return { state: 'unavailable', timeInfo: null };

        const now = currentTime;
        const appointmentTime = new Date(apt.dateObj);
        const durationMinutes = apt.duration_minutes || 60;
        const endTime = new Date(appointmentTime.getTime() + durationMinutes * 60 * 1000);

        // Calculate time differences
        const msUntilStart = appointmentTime - now;
        const msUntilEnd = endTime - now;

        // If cancelled or completed, not joinable
        if (apt.status === 'cancelled') return { state: 'cancelled', timeInfo: null };
        if (apt.status === 'completed') return { state: 'completed', timeInfo: null };

        // If appointment has ended
        if (now > endTime) return { state: 'past', timeInfo: null };

        // If currently in the appointment window (from start to end)
        if (now >= appointmentTime && now <= endTime) {
            const msRemaining = endTime - now;
            const minutesRemaining = Math.floor(msRemaining / (1000 * 60));
            const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
            return {
                state: 'active',
                timeInfo: { minutesRemaining, secondsRemaining }
            };
        }

        // If before appointment (show countdown)
        if (msUntilStart > 0) {
            const totalSeconds = Math.floor(msUntilStart / 1000);
            const days = Math.floor(totalSeconds / (24 * 60 * 60));
            const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            return {
                state: 'countdown',
                timeInfo: { days, hours, minutes, seconds, totalMinutes: Math.floor(msUntilStart / (1000 * 60)) }
            };
        }

        return { state: 'unavailable', timeInfo: null };
    }, [currentTime]);

    // Handle join consultation
    const handleJoinConsultation = async (appointment) => {
        try {
            // Ensure we have a valid appointment ID
            const appointmentId = appointment.id || appointment.appointment_id;

            if (!appointmentId) {
                showError('Invalid appointment. Please refresh and try again.');
                return;
            }

            console.log('=== JOINING CONSULTATION ===');
            console.log('Appointment ID:', appointmentId);
            console.log('Appointment ID Type:', typeof appointmentId);

            setJoiningId(appointmentId);
            showInfo('Connecting to consultation session...');

            const result = await consultationAPI.startSession(appointmentId);
            console.log('Session started successfully:', result);

            if (result.session_token) {
                showSuccess('Secure Tunnel Established. Entering chamber...');
                setTimeout(() => {
                    navigate(`/consultation/${result.session_token}`);
                }, 800);
            } else {
                throw new Error('No session token received from server');
            }
        } catch (err) {
            console.error('=== CONSULTATION JOIN ERROR ===');
            console.error('Error Object:', err);
            console.error('Error Response:', err.response);
            console.error('Error Data:', err.response?.data);

            // Extract error message
            let errorMessage = 'Failed to join consultation. Please try again.';

            if (err.response?.data) {
                const errorData = err.response.data;
                console.log('Error Data Details:', errorData);

                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }

                // Handle specific errors
                if (errorData.message && errorData.message.includes('No query results')) {
                    errorMessage = 'This appointment does not exist in our system. It may have been cancelled or deleted. Please create a new appointment.';
                    console.error('CRITICAL: Appointment ID', appointment.id, 'not found in database');
                    console.error('Appointment data from profile:', appointment);
                } else if (errorData.can_join === false) {
                    const minutes = errorData.minutes_until_join || 'a few';
                    errorMessage = `You can join ${minutes} minutes before the appointment time.`;
                } else if (errorData.error === 'Unauthorized') {
                    errorMessage = 'You are not authorized to join this consultation.';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            showError(errorMessage);
        } finally {
            setJoiningId(null);
        }
    };

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
        if (status === 'completed') return { text: 'Completed', icon: CheckCircle, color: 'text-slate-400', bg: 'bg-slate-500/5', border: 'border-slate-500/10' };
        if (isPast) return { text: 'Past', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-500/5', border: 'border-slate-500/10' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        return { text: `In ${timeText}`, icon: Hourglass, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' };
    };

    // Stats calculation
    const stats = {
        total: appointments.length,
        upcoming: appointments.filter(a => a.dateObj > new Date() && a.status !== 'cancelled').length,
        completed: appointments.filter(a => a.status === 'completed').length
    };

    return (
        <div className={`min-h-[100dvh] overflow-x-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-50/50'}`}>

            {/* Premium Sticky Header */}
            <div className={`sticky top-0 z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#0A0A0A]/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/[0.03]' : 'border-slate-200/60'}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">

                    {/* Compact Header */}
                    <div className={`p-2.5 sm:p-3 rounded-2xl border transition-all duration-500 ${isDarkMode ? 'bg-white/[0.02] border-white/[0.03]' : 'bg-slate-50/40 border-slate-200/40'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                            {/* Left: Back & Title */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onBack}
                                    className={`p-2 rounded-xl transition-all ${isDarkMode
                                        ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                                        : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-200/50'
                                        }`}
                                >
                                    <ArrowLeft size={14} />
                                </button>
                                <div className="space-y-0">
                                    <h1 className={`text-sm sm:text-base font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>My Appointments</h1>
                                    <p className={`text-[9px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Legal Sessions • {stats.total} Total</p>
                                </div>
                            </div>

                            {/* Right: Search & Filter */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                                <div className={`relative flex-1 sm:w-64 group transition-all duration-500 ${isDarkMode
                                    ? 'bg-black/20 hover:bg-black/40'
                                    : 'bg-white hover:bg-slate-50'
                                    } rounded-xl border ${isDarkMode
                                        ? 'border-white/[0.03] focus-within:border-blue-500/30'
                                        : 'border-slate-200 focus-within:border-blue-500/20'
                                    } shadow-sm overflow-hidden`}>
                                    <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <Search className={`transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} size={11} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search sessions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-10 pr-8 py-2.5 bg-transparent border-none text-[10px] font-medium tracking-wide focus:ring-0 focus:outline-none ${isDarkMode ? 'text-slate-100 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-500/10 rounded-lg transition-all"
                                        >
                                            <X size={10} className="opacity-40" />
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-300 ${showFilters
                                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                        : isDarkMode
                                            ? 'bg-white/5 border-white/[0.03] text-slate-400 hover:bg-white/10'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    <Filter size={11} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Filters</span>
                                </button>
                            </div>
                        </div>

                        {/* Filters Panel */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className={`mx-1 mt-3 mb-1 pt-3 flex flex-wrap gap-2 border-t ${isDarkMode ? 'border-white/[0.03]' : 'border-slate-200/50'}`}>
                                        <div className={`flex p-0.5 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-slate-100'}`}>
                                            {['all', 'upcoming', 'past'].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setSelectedFilter(f)}
                                                    className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${selectedFilter === f
                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${isDarkMode
                                                ? 'bg-black/20 border-white/5 text-slate-100 focus:border-blue-500/50'
                                                : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500/20'
                                                }`}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {[
                            { label: 'Total', value: stats.total, icon: CalendarDays, color: 'blue' },
                            { label: 'Upcoming', value: stats.upcoming, icon: Hourglass, color: 'blue' },
                            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'violet' }
                        ].map((stat, i) => (
                            <div key={i} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-white/[0.02] border-white/[0.03]' : 'bg-white border-slate-200/40 shadow-sm'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg bg-${stat.color}-500/10`}>
                                        <stat.icon size={12} className={`text-${stat.color}-500`} />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{stat.value}</p>
                                        <p className={`text-[8px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield size={14} className="text-blue-500/40" />
                            </div>
                        </div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Syncing sessions...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className={`text-center py-20 border-2 border-dashed rounded-3xl transition-all ${isDarkMode ? 'border-white/[0.03] bg-white/[0.01]' : 'border-slate-200 bg-slate-50/50'}`}>
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
                            <CalendarDays size={24} className="opacity-20" />
                        </div>
                        <h3 className={`text-sm font-bold tracking-tight mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>No sessions found</h3>
                        <p className={`text-[10px] font-medium opacity-40 max-w-xs mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        {filteredAppointments.map((apt, i) => {
                            const status = getStatusInfo(apt.dateObj, apt.status);
                            const joinState = getJoinState(apt);
                            const isPast = apt.dateObj < new Date();
                            const isJoining = joiningId === apt.id;

                            return (
                                <motion.div
                                    key={apt.id || i}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${isDarkMode
                                        ? 'bg-[#0D0D0D] border-white/[0.03] hover:border-blue-500/20'
                                        : 'bg-white border-slate-200/60 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'
                                        } ${isPast && apt.status !== 'upcoming' ? 'opacity-50 grayscale-[0.15]' : ''}`}
                                >
                                    {/* Premium Gradient */}
                                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/[0.02] blur-3xl rounded-full transition-all duration-700 group-hover:bg-blue-500/[0.04]" />

                                    <div className="p-4">
                                        {/* Status Header */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div className={`px-2 py-1 rounded-lg border ${status.bg} ${status.color} ${status.border} text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                                                <status.icon size={10} strokeWidth={2.5} />
                                                {status.text}
                                            </div>
                                            <div className={`flex items-center gap-1 text-[8px] font-semibold opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <Shield size={10} className="text-blue-500/60" />
                                                <span>Secure</span>
                                            </div>
                                        </div>

                                        {/* Lawyer Info */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-500 group-hover:scale-105 ${isDarkMode
                                                ? 'bg-gradient-to-br from-white/[0.06] to-transparent text-blue-400 border border-white/[0.03]'
                                                : 'bg-gradient-to-br from-blue-50 to-white text-blue-600 border border-blue-100/50 shadow-sm'
                                                }`}>
                                                {apt.lawyerName?.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden space-y-0">
                                                <h3 className={`text-xs font-bold truncate tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800 group-hover:text-blue-600'}`}>{apt.lawyerName}</h3>
                                                <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider opacity-40">
                                                    <Briefcase size={9} strokeWidth={2} />
                                                    <span className="truncate">{apt.lawyerSpec}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className={`grid grid-cols-2 gap-px rounded-xl overflow-hidden border mb-4 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.03]' : 'bg-slate-100/50 border-slate-100'}`}>
                                            <div className={`flex flex-col items-center justify-center py-2.5 px-2 gap-1.5 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                                                <Calendar size={12} className="opacity-30" />
                                                <span className={`text-[10px] font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatDate(apt.dateObj)}</span>
                                            </div>
                                            <div className={`flex flex-col items-center justify-center py-2.5 px-2 gap-1.5 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                                                <Clock size={12} className="opacity-30" />
                                                <span className={`text-[10px] font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formatTime(apt.dateObj)}</span>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {apt.notes && (
                                            <div className={`relative p-3 rounded-xl text-[10px] font-medium leading-relaxed mb-4 italic ${isDarkMode ? 'bg-white/[0.015] text-slate-400 border border-white/[0.03]' : 'bg-slate-50/80 text-slate-600 border border-slate-100'}`}>
                                                <FileText size={10} className="absolute -left-1 -top-1 opacity-10" />
                                                <p className="line-clamp-2 pl-1 border-l-2 border-blue-500/20">"{apt.notes}"</p>
                                            </div>
                                        )}

                                        {/* Join Button Logic */}
                                        {(() => {
                                            // Cancelled
                                            if (joinState.state === 'cancelled') {
                                                return (
                                                    <div className={`w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider text-center border ${isDarkMode
                                                        ? 'bg-white/[0.02] border-white/[0.03] text-slate-600'
                                                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                                                        }`}>
                                                        Session Cancelled
                                                    </div>
                                                );
                                            }

                                            // Completed or Past → View Report
                                            if (joinState.state === 'completed' || joinState.state === 'past') {
                                                return (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setReportAppointment(apt)}
                                                        className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center border flex items-center justify-center gap-2 transition-all ${isDarkMode
                                                                ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border-indigo-500/25 text-indigo-300 hover:from-indigo-500/25 hover:to-violet-500/25'
                                                                : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-violet-100 shadow-sm'
                                                            }`}
                                                    >
                                                        <FileText size={12} />
                                                        View Session Report
                                                    </motion.button>
                                                );
                                            }

                                            // Active - Can Join Now
                                            if (joinState.state === 'active') {
                                                return (
                                                    <div className="space-y-2">
                                                        <button
                                                            onClick={() => handleJoinConsultation(apt)}
                                                            disabled={isJoining}
                                                            className="relative flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow-xl shadow-black/10 active:scale-[0.98] transition-all overflow-hidden group"
                                                        >
                                                            {/* Animated glow */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-pulse" />

                                                            {isJoining ? (
                                                                <>
                                                                    <Loader size={12} className="animate-spin" />
                                                                    Establishing Connection...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play size={12} strokeWidth={2.5} className="animate-pulse" />
                                                                    Enter Secure Chamber
                                                                </>
                                                            )}
                                                        </button>
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                            <span className={`text-[8px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>
                                                                Live • {joinState.timeInfo.minutesRemaining}m {joinState.timeInfo.secondsRemaining}s remaining
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Countdown - Before Appointment
                                            if (joinState.state === 'countdown' && joinState.timeInfo) {
                                                const { days, hours, minutes, seconds, totalMinutes } = joinState.timeInfo;
                                                const showDetailedCountdown = totalMinutes < 60; // Show detailed countdown if less than 1 hour

                                                return (
                                                    <div className="space-y-2">
                                                        <div className={`relative w-full py-3 rounded-xl border overflow-hidden ${isDarkMode
                                                            ? 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20'
                                                            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50'
                                                            }`}>
                                                            <div className="flex flex-col items-center justify-center gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Timer size={12} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
                                                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                        Starts In
                                                                    </span>
                                                                </div>

                                                                {showDetailedCountdown ? (
                                                                    <div className="flex items-center gap-2">
                                                                        {hours > 0 && (
                                                                            <div className={`px-2.5 py-1.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                                                                                <span className={`text-base font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{hours}</span>
                                                                                <span className={`text-[8px] font-semibold ml-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>h</span>
                                                                            </div>
                                                                        )}
                                                                        <div className={`px-2.5 py-1.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                                                                            <span className={`text-base font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{minutes}</span>
                                                                            <span className={`text-[8px] font-semibold ml-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>m</span>
                                                                        </div>
                                                                        <div className={`px-2.5 py-1.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                                                                            <span className={`text-base font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{seconds}</span>
                                                                            <span className={`text-[8px] font-semibold ml-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>s</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                        {days > 0 && `${days}d `}{hours}h {minutes}m
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Lock size={8} className={isDarkMode ? 'text-blue-400/50' : 'text-blue-500/50'} />
                                                            <span className={`text-[8px] font-semibold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                                Join button activates at appointment time
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Fallback
                                            return (
                                                <div className={`w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider text-center border ${isDarkMode
                                                    ? 'bg-white/[0.02] border-white/[0.03] text-slate-600'
                                                    : 'bg-slate-50/50 border-slate-100 text-slate-400'
                                                    }`}>
                                                    Pending
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Footer */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-8 text-center">
                <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border transition-all ${isDarkMode ? 'bg-white/[0.015] border-white/[0.03] text-slate-500' : 'bg-white border-slate-200/60 text-slate-400 shadow-sm'}`}>
                    <Zap size={10} className="text-amber-500 opacity-80" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Verified Secure Protocol</span>
                </div>
            </div>

            {/* ── Session Report Modal ── */}
            <AnimatePresence>
                {reportAppointment && (
                    <AppointmentReportModal
                        appointment={reportAppointment}
                        isDarkMode={isDarkMode}
                        viewerType="user"
                        onClose={() => setReportAppointment(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyAppointments;
