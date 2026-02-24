import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { consultationAPI } from '../../api/apiService';
import ConsultationLobby from './ConsultationLobby';
import ConsultationChat from './ConsultationChat';
import SessionSummary from './SessionSummary';
import { Shield, AlertTriangle, Loader, ArrowLeft, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsultationSession = () => {
    const { sessionToken } = useParams();
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const isDarkMode = mode === 'dark';

    // Core state
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userType, setUserType] = useState(null);
    const [otherParticipant, setOtherParticipant] = useState(null);
    const [otherJoined, setOtherJoined] = useState(false);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    // Refs
    const pollIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const lastMessageIdRef = useRef(0);

    /**
     * Load session details
     */
    const loadSession = useCallback(async () => {
        try {
            const data = await consultationAPI.getSession(sessionToken);
            setSession(data.session);
            setUserType(data.user_type);
            setOtherParticipant(data.other_participant);
            setOtherJoined(data.other_participant_joined);
            setConnectionStatus('connected');

            // Calculate time remaining
            if (data.session?.scheduled_end_time) {
                const endTime = new Date(data.session.scheduled_end_time);
                const remaining = Math.max(0, Math.floor((endTime - new Date()) / 1000));
                setTimeRemaining(remaining);
            }

            // Check if session has ended
            if (['completed', 'expired', 'cancelled'].includes(data.session?.status)) {
                setSessionEnded(true);
            }

            return data;
        } catch (err) {
            console.error('Error loading session:', err);
            if (err.response?.status === 403) {
                setError('You are not authorized to access this consultation session.');
            } else if (err.response?.status === 404) {
                setError('Consultation session not found.');
            } else {
                setConnectionStatus('disconnected');
            }
            throw err;
        }
    }, [sessionToken]);

    /**
     * Load messages
     */
    const loadMessages = useCallback(async () => {
        try {
            const data = await consultationAPI.getMessages(sessionToken);
            const newMessages = data.messages || [];

            // Only update if we have new messages
            if (newMessages.length > 0) {
                const latestId = newMessages[newMessages.length - 1]?.id || 0;
                if (latestId > lastMessageIdRef.current) {
                    lastMessageIdRef.current = latestId;
                    setMessages(newMessages);
                }
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    }, [sessionToken]);

    /**
     * Send a message
     */
    const handleSendMessage = useCallback(async (content, file = null) => {
        try {
            const result = await consultationAPI.sendMessage(sessionToken, content, file);

            // Optimistically add message
            if (result.data) {
                setMessages(prev => [...prev, result.data]);
                lastMessageIdRef.current = result.data.id;
            }

            return result;
        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    }, [sessionToken]);

    /**
     * End the session
     */
    const handleEndSession = useCallback(async (reason = 'completed') => {
        try {
            await consultationAPI.endSession(sessionToken, reason);
            setSessionEnded(true);

            // Stop polling
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        } catch (err) {
            console.error('Error ending session:', err);
        }
    }, [sessionToken]);

    /**
     * Handle typing indicator
     */
    const handleTyping = useCallback(async (isTyping) => {
        try {
            await consultationAPI.sendTypingIndicator(sessionToken, isTyping);
        } catch (err) {
            // Silently fail
        }
    }, [sessionToken]);

    /**
     * Initial load
     */
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                await loadSession();
                await loadMessages();
            } catch (err) {
                if (!error) {
                    setError('Failed to load consultation session. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        init();

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [sessionToken]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Polling for updates (messages + session status)
     */
    useEffect(() => {
        if (sessionEnded || error) return;

        pollIntervalRef.current = setInterval(async () => {
            try {
                await Promise.all([
                    loadSession(),
                    loadMessages()
                ]);
            } catch {
                // Handle silently
            }
        }, 3000); // Poll every 3 seconds

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [sessionEnded, error, loadSession, loadMessages]);

    /**
     * Countdown timer
     */
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0 || sessionEnded) return;

        timerIntervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerIntervalRef.current);
                    handleEndSession('completed');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [timeRemaining, sessionEnded, handleEndSession]);

    // ==================== RENDER ====================

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${isDarkMode ? 'bg-dark-bg' : 'bg-[#f4f7fb]'}`}>
                {/* Background Ambient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center gap-8 relative z-10"
                >
                    <div className="relative">
                        {/* Pulse rings */}
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                            className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}
                        />
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 ${isDarkMode ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-slate-500/30' : 'bg-gradient-to-br from-white to-slate-100 border border-slate-200'}`}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 rounded-[2rem] border-[3px] border-b-blue-500 border-r-indigo-500 border-t-transparent border-l-transparent"
                            />
                            <Shield size={28} className="text-slate-500" />
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <p className={`text-lg md:text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Establishing Secure Connection
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Loader size={14} className={`animate-spin ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400/80' : 'text-slate-600/80'}`}>
                                Initializing consultation session...
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center px-4 font-sans ${isDarkMode ? 'bg-dark-bg' : 'bg-[#f4f7fb]'}`}>
                {/* Background Ambient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border text-center shadow-2xl relative z-10 ${isDarkMode
                        ? 'bg-dark-bg-tertiary border-white/5 shadow-black/50'
                        : 'bg-white border-slate-200/50 shadow-slate-200/50'
                        }`}
                >
                    <div className={`w-20 h-20 mx-auto mb-8 rounded-[2rem] flex items-center justify-center shadow-inner ${isDarkMode ? 'bg-gradient-to-br from-rose-500/20 to-red-500/10' : 'bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100'}`}>
                        <AlertTriangle size={32} className="text-rose-500" />
                    </div>
                    <h2 className={`text-2xl font-extrabold tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Access Denied
                    </h2>
                    <p className={`text-sm font-medium leading-relaxed mb-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {error}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-lg transition-all ${isDarkMode
                            ? 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-slate-900/40 hover:from-slate-500 hover:to-slate-400'
                            : 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-slate-500/20 hover:from-slate-700 hover:to-slate-600'
                            }`}
                    >
                        <ArrowLeft size={16} />
                        Return Safely
                    </button>
                </motion.div>
            </div>
        );
    }

    // Session ended - show summary
    if (sessionEnded && session) {
        return (
            <SessionSummary
                session={session}
                messages={messages}
                userType={userType}
                otherParticipant={otherParticipant}
                isDarkMode={isDarkMode}
                onBack={() => navigate('/legal-consoltation')}
            />
        );
    }

    // Waiting for other participant
    if (session && !otherJoined) {
        return (
            <ConsultationLobby
                session={session}
                userType={userType}
                otherParticipant={otherParticipant}
                isDarkMode={isDarkMode}
                timeRemaining={timeRemaining}
                connectionStatus={connectionStatus}
                onLeave={() => {
                    handleEndSession('cancelled');
                    navigate('/legal-consoltation');
                }}
            />
        );
    }

    // Active chat session
    if (session && otherJoined) {
        return (
            <ConsultationChat
                session={session}
                messages={messages}
                userType={userType}
                otherParticipant={otherParticipant}
                isDarkMode={isDarkMode}
                timeRemaining={timeRemaining}
                connectionStatus={connectionStatus}
                onSendMessage={handleSendMessage}
                onEndSession={() => handleEndSession('completed')}
                onTyping={handleTyping}
            />
        );
    }

    return null;
};

export default ConsultationSession;
