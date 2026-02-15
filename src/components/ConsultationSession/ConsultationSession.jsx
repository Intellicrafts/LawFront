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
            <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#080808]' : 'bg-slate-50/50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield size={20} className="text-blue-500/60" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            Establishing Secure Connection
                        </p>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Initializing consultation session...
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDarkMode ? 'bg-[#080808]' : 'bg-slate-50/50'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md w-full p-8 rounded-[28px] border text-center ${isDarkMode
                        ? 'bg-[#121212] border-white/5'
                        : 'bg-white border-slate-200/60 shadow-xl shadow-slate-200/40'
                        }`}
                >
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                        <AlertTriangle size={28} className="text-rose-500" />
                    </div>
                    <h2 className={`text-lg font-bold tracking-tight mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        Access Denied
                    </h2>
                    <p className={`text-xs font-medium mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {error}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all"
                    >
                        <ArrowLeft size={14} />
                        Go Back
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
