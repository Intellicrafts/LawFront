
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
  Video,
  FileText,
  Star,
  Timer,
  Users,
  TrendingUp,
  DollarSign,
  X,
  FilterX,
  Activity,
  Play,
  Zap,
  Bell,
  Maximize2,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  VideoOff,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { consultationAPI, lawyerAPI } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import AppointmentReportModal from '../ConsultationSession/AppointmentReportModal';

// --- Premium UI Components (Synced with LawyerAdmin) ---

const COLORS = {
  primary: '#1E293B',
  secondary: '#334155',
  warning: '#B45309',
  danger: '#991B1B',
  info: '#3B82F6',
};

const GlassCard = ({ children, className = "", darkMode, hover = true, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -2, shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } : {}}
    className={`
      relative overflow-hidden rounded-[20px] border transition-all duration-300
      ${darkMode
        ? 'bg-neutral-900/60 border-white/5 backdrop-blur-xl'
        : 'bg-white/80 border-slate-200/50 backdrop-blur-lg'
      }
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const PremiumBadge = ({ text, type = 'primary' }) => {
  const styles = {
    primary: 'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20',
    secondary: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[type]}`}>
      {text}
    </span>
  );
};

// --- Main Component ---

const LawyerAppointments = ({ darkMode, initialAppointments = [], userData, activeSession }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(initialAppointments);
  const [loading, setLoading] = useState(initialAppointments.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, today, upcoming, past
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only fetch if we don't have initial data passed down on first mount
    if (!initialAppointments || initialAppointments.length === 0) {
      fetchAppointments();
    }
  }, []); // Autonomous bootstrap check on mount

  useEffect(() => {
    // Synchronize with master dashboard data when it updates
    if (initialAppointments && initialAppointments.length > 0) {
      setAppointments(initialAppointments);
      setLoading(false);
    }
  }, [initialAppointments]); // React to parent data propagates

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const profile = userData || JSON.parse(localStorage.getItem('user_profile') || '{}');
      const response = await lawyerAPI.getLawyerAppointments(profile.id || 'me');

      // Smart extraction: Sync with profile activity if dedicated API returns empty
      let dataArray = response?.data || (Array.isArray(response) ? response : []);

      const profileAppointments = profile.recent_activity?.appointments;

      if ((!dataArray || dataArray.length === 0) && Array.isArray(profileAppointments)) {
        console.log(`Registry Recovery: Injected ${profileAppointments.length} sessions from profile stream`);
        dataArray = profileAppointments;
      }

      const processed = dataArray.map(apt => ({
        ...apt,
        client_name: apt.user?.name || apt.client_name || apt.client?.name || apt.user_name || 'Client',
        case_type: apt.case_type || apt.legal_service || 'Legal Consultation'
      }));

      setAppointments(processed);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Even on error, try to use cache
      const profile = userData || JSON.parse(localStorage.getItem('user_profile') || '{}');
      if (profile.recent_activity?.appointments) {
        setAppointments(profile.recent_activity.appointments);
      } else {
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch =
        apt.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.case_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.session_token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(apt.id).includes(searchQuery.toLowerCase());

      const aptDate = new Date(apt.appointment_time);
      const now = new Date();
      const isToday = aptDate.toDateString() === now.toDateString();
      const isPast = aptDate < now && !isToday;
      const isUpcoming = aptDate > now && !isToday;

      if (filterType === 'today') return matchesSearch && isToday;
      if (filterType === 'upcoming') return matchesSearch && isUpcoming;
      if (filterType === 'past') return matchesSearch && isPast;
      return matchesSearch;
    });
  }, [appointments, searchQuery, filterType]);

  const [actionLoading, setActionLoading] = useState(null);
  const [reportAppointment, setReportAppointment] = useState(null); // which apt's report modal is open

  const handleStartMeeting = async (aptId) => {
    setActionLoading(aptId);
    try {
      showInfo('Initializing secure legal chamber...');
      // Allow for a brief "establishing connection" transition
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = await consultationAPI.startSession(aptId);

      if (result.session_token) {
        showSuccess('Secure Tunnel Established. Entering session...');
        // Smooth fade out before navigation
        setTimeout(() => {
          navigate(`/consultation/${result.session_token}`);
        }, 600);
      } else {
        throw new Error('No session token received');
      }
    } catch (err) {
      console.error('Session start error:', err);
      showError(err.response?.data?.message || 'Verification failed. Please check schedule.');
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ apt }) => {
    const aptDate = new Date(apt.appointment_time);
    const now = new Date();
    const diff = aptDate.getTime() - now.getTime();

    if (apt.status === 'completed') return <PremiumBadge text="Completed" type="primary" />;
    if (apt.status === 'cancelled') return <PremiumBadge text="Cancelled" type="danger" />;

    // Logic for "Live" or "Soon"
    if (Math.abs(diff) < 30 * 60 * 1000) return (
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${darkMode ? 'bg-white/10 border-white/20' : 'bg-slate-900/10 border-slate-900/20'}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${darkMode ? 'bg-white' : 'bg-slate-900'}`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Live Now</span>
      </div>
    );

    if (diff > 0 && diff < 24 * 60 * 60 * 1000) return <PremiumBadge text="Starting Soon" type="warning" />;

    return <PremiumBadge text="Scheduled" type="info" />;
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <PremiumBadge text="Secure Vault" type="secondary" />
            <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Session Registry</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Professional <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Consultations</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center h-8 px-3 gap-2 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-white border-slate-200 focus-within:border-slate-900'}`}>
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-40 sm:w-56"
            />
          </div>
          <button className={`h-8 w-8 flex items-center justify-center rounded-xl shadow-lg transition-all ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-105'}`}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Tabs / Filter Row */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-xl border bg-slate-100/50 dark:bg-white/5 dark:border-white/5">
        {[
          { id: 'all', label: 'All Sessions' },
          { id: 'today', label: "Today" },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'past', label: 'History' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === tab.id
              ? (darkMode ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-900 text-white shadow-md')
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className={`h-40 rounded-3xl animate-pulse ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
          ))
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt, idx) => (
            <GlassCard key={apt.id || idx} darkMode={darkMode} className="group overflow-visible">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <Avatar name={apt.client_name} size={28} className="rounded-lg shadow-sm" />
                    </div>
                    <div>
                      <h3 className={`text-[12px] font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{apt.client_name}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{apt.case_type || 'Legal Adv.'}</p>
                    </div>
                  </div>
                  <StatusBadge apt={apt} />
                </div>

                <div className={`flex-1 p-3 rounded-xl mb-3 space-y-1.5 border transition-colors ${darkMode ? 'bg-white/3 group-hover:bg-white/5 border-white/5' : 'bg-slate-50 group-hover:bg-slate-100 border-slate-100'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <Calendar size={12} className={darkMode ? 'text-slate-300' : 'text-slate-900'} />
                    <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                      {new Date(apt.appointment_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <Clock size={12} className={darkMode ? 'text-slate-300' : 'text-slate-900'} />
                    <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                      {new Date(apt.appointment_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      <span className="opacity-50 mx-1">•</span>
                      {apt.duration_minutes || 30}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(() => {
                    const appointmentTime = new Date(apt.appointment_time);
                    const diffMs = appointmentTime.getTime() - currentTime.getTime();
                    const durationMinutes = apt.duration_minutes || 60;
                    const endTime = new Date(appointmentTime.getTime() + durationMinutes * 60 * 1000);
                    const isPastEnded = currentTime > endTime;

                    // Can join exactly 1 min before (or let's be lenient on UI: 5 minutes before) but backend uses 1 min
                    // To match user experience and backend, button is disabled if more than 1 minute before.
                    const canJoin = diffMs <= 60000 && !isPastEnded && apt.status === 'scheduled';

                    if (apt.status === 'scheduled') {
                      return (
                        <button
                          onClick={() => handleStartMeeting(apt.id)}
                          disabled={actionLoading === apt.id || !canJoin}
                          className={`flex-1 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${activeSession?.appointment_id === apt.id
                            ? (darkMode ? 'bg-white text-slate-900 shadow-white/20' : 'bg-slate-900 text-white shadow-black/20')
                            : (darkMode ? 'bg-white text-slate-900 shadow-white/5' : 'bg-slate-900 text-white shadow-black/10')
                            } ${actionLoading === apt.id ? 'opacity-80' : (!canJoin ? 'opacity-50 cursor-not-allowed bg-slate-400 text-white dark:bg-slate-700' : 'hover:scale-[1.02]')}`}
                        >
                          {actionLoading === apt.id ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              Establishing...
                            </>
                          ) : (
                            <>
                              <Video size={12} />
                              {activeSession?.appointment_id === apt.id
                                ? 'Return to Chamber'
                                : canJoin
                                  ? 'Join Live Chamber'
                                  : 'Join Unavailable'}
                            </>
                          )}
                        </button>
                      );
                    } else if (apt.status === 'completed' || isPastEnded) {
                      return (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setReportAppointment(apt)}
                          disabled={actionLoading === apt.id}
                          className={`flex-1 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${darkMode
                            ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/25 text-indigo-300 hover:from-indigo-500/25 hover:to-violet-500/25 shadow-md'
                            : 'bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-violet-100 shadow-md'
                            }`}
                        >
                          <FileText size={12} />
                          View Report
                        </motion.button>
                      );
                    } else {
                      return (
                        <button
                          disabled
                          className={`flex-1 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed`}
                        >
                          <VideoOff size={12} />
                          Unavailable
                        </button>
                      );
                    }
                  })()}
                  <button className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${darkMode ? 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Calendar size={28} className="text-slate-300" />
            </div>
            <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Registry Empty</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">No sessions match your criteria</p>
          </div>
        )}
      </div>

      {/* ── Session Report Modal ── */}
      <AnimatePresence>
        {reportAppointment && (
          <AppointmentReportModal
            appointment={reportAppointment}
            isDarkMode={darkMode}
            viewerType="lawyer"
            onClose={() => setReportAppointment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerAppointments;