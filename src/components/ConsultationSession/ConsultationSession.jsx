import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { consultationAPI } from '../../api/apiService';
import ConsultationLobby from './ConsultationLobby';
import ConsultationChat from './ConsultationChat';
import SessionSummary from './SessionSummary';
import { Shield, AlertTriangle, Loader, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ConsultationSession = () => {
    const { sessionToken } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const isDarkMode = mode === 'dark';
    const isRejoinRoute = searchParams.get('rejoin') === '1';

    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userType, setUserType] = useState(null);
    const [otherParticipant, setOtherParticipant] = useState(null);
    const [otherJoined, setOtherJoined] = useState(false);
    const [opponentAction, setOpponentAction] = useState('none');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [partnerLive, setPartnerLive] = useState(false);

    const pollIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const lastMessageIdRef = useRef(0);
    const rejoinAtRef = useRef(null);
    const timerEndedRef = useRef(false);

    const otherName = useMemo(() => {
        const p = otherParticipant;
        return p?.full_name || p?.name || (userType === 'user' ? 'your lawyer' : 'your client');
    }, [otherParticipant, userType]);

    const loadSession = useCallback(async () => {
        try {
            const data = await consultationAPI.getSession(sessionToken);
            setSession(data.session);
            setUserType(data.user_type);
            setOtherParticipant(data.other_participant);
            setOtherJoined(Boolean(data.other_participant_joined));
            setConnectionStatus('connected');

            if (data.session?.scheduled_end_time) {
                const endTime = new Date(data.session.scheduled_end_time);
                const remaining = Math.max(0, Math.floor((endTime - new Date()) / 1000));
                setTimeRemaining(remaining);
            }

            const endedStatuses = ['completed', 'expired', 'cancelled'];
            if (endedStatuses.includes(data.session?.status)) {
                if (isRejoinRoute && data.session?.status === 'completed') {
                    setSessionEnded(false);
                } else if (!isRejoinRoute) {
                    setSessionEnded(true);
                }
            } else {
                setSessionEnded(false);
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
    }, [sessionToken, isRejoinRoute]);

    const loadMessages = useCallback(async () => {
        try {
            const data = await consultationAPI.getMessages(sessionToken);
            const newMessages = data.messages || [];

            if (data.other_action !== undefined && data.other_action !== null) {
                setOpponentAction(data.other_action);
            } else {
                setOpponentAction('none');
            }

            setMessages(newMessages);
            if (newMessages.length > 0) {
                lastMessageIdRef.current = newMessages[newMessages.length - 1]?.id || 0;
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    }, [sessionToken]);

    const handleSendMessage = useCallback(async (content, file = null) => {
        try {
            const result = await consultationAPI.sendMessage(sessionToken, content, file);
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

    const handleEndSession = useCallback(async (reason = 'completed') => {
        try {
            await consultationAPI.endSession(sessionToken, reason);
            setSessionEnded(true);
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        } catch (err) {
            console.error('Error ending session:', err);
        }
    }, [sessionToken]);

    const handleLeaveChamber = useCallback(() => {
        if (userType === 'lawyer') {
            navigate('/lawyer-admin?tab=appointments');
        } else {
            navigate('/legal-consoltation');
        }
    }, [navigate, userType]);

    const handleAction = useCallback(async (actionType) => {
        try {
            await consultationAPI.sendActionIndicator(sessionToken, actionType);
        } catch {
            /* ignore */
        }
    }, [sessionToken]);

    useEffect(() => {
        lastMessageIdRef.current = 0;
        rejoinAtRef.current = isRejoinRoute ? Date.now() : null;
        timerEndedRef.current = false;
        setMessages([]);
        setPartnerLive(false);
        setSessionEnded(false);
        setError(null);
    }, [sessionToken, isRejoinRoute]);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const data = await loadSession();

                const endedStatuses = ['completed', 'expired'];
                const sessionStatus = data?.session?.status;
                const appointmentId =
                    data?.session?.appointment_id || data?.session?.appointment?.id;

                if (
                    isRejoinRoute &&
                    endedStatuses.includes(sessionStatus) &&
                    appointmentId
                ) {
                    await consultationAPI.startSession(appointmentId, { rejoin: true });
                    await loadSession();
                }

                await loadMessages();
            } catch {
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
    }, [sessionToken, isRejoinRoute]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (sessionEnded || error) return;

        pollIntervalRef.current = setInterval(async () => {
            try {
                await Promise.all([loadSession(), loadMessages()]);
            } catch {
                /* ignore */
            }
        }, 1500);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [sessionEnded, error, loadSession, loadMessages]);

    useEffect(() => {
        if (timeRemaining === null || sessionEnded) return;

        const terminalStatuses = ['completed', 'expired', 'cancelled'];
        if (session?.status !== 'active' || terminalStatuses.includes(session?.status)) {
            return;
        }

        if (timeRemaining <= 0) {
            if (!timerEndedRef.current) {
                timerEndedRef.current = true;
                handleEndSession('completed');
            }
            return;
        }

        timerIntervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 1) {
                    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                    if (!timerEndedRef.current) {
                        timerEndedRef.current = true;
                        handleEndSession('completed');
                    }
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
    }, [timeRemaining, sessionEnded, session?.status, handleEndSession]);

    useEffect(() => {
        if (!isRejoinRoute || sessionEnded || error) return;

        handleAction('presence');
        const presenceInterval = setInterval(() => {
            handleAction('presence');
        }, 3000);

        return () => clearInterval(presenceInterval);
    }, [isRejoinRoute, sessionEnded, error, handleAction]);

    useEffect(() => {
        if (!isRejoinRoute) {
            setPartnerLive(session?.status === 'active');
            return;
        }

        const otherType = userType === 'user' ? 'lawyer' : 'user';
        const since = rejoinAtRef.current || Date.now();
        const recentFromOpponent = messages.some((m) => {
            if (m.sender_type !== otherType) return false;
            if (m.message_type === 'system') return false;
            const ts = new Date(m.created_at).getTime();
            return ts >= since - 15000;
        });
        const liveSignal = ['typing', 'recording', 'presence', 'rejoin'].includes(opponentAction);
        const sessionLive = session?.status === 'active';
        setPartnerLive(Boolean(sessionLive && otherJoined && (recentFromOpponent || liveSignal)));
    }, [isRejoinRoute, otherJoined, messages, opponentAction, userType, session?.status]);

    const viewMode = useMemo(() => {
        if (!session) return 'none';
        if (sessionEnded && !isRejoinRoute) return 'summary';

        if (isRejoinRoute) {
            return 'chat';
        }

        if (session.status === 'active') {
            return 'chat';
        }

        if (session.status === 'waiting') {
            return 'lobby';
        }

        return 'summary';
    }, [session, sessionEnded, isRejoinRoute]);

    const chatEnabled = !isRejoinRoute || partnerLive;
    const waitingMessage = isRejoinRoute && !partnerLive
        ? `Waiting for ${otherName} to rejoin the secure chamber…`
        : null;

    if (loading) {
        return (
            <div className={`fixed inset-0 w-screen h-[100dvh] overflow-hidden flex flex-col items-center justify-center font-sans ${isDarkMode ? 'bg-dark-bg' : 'bg-[#f4f7fb]'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col items-center gap-8 relative z-10"
                >
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative ${isDarkMode ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-slate-500/30' : 'bg-gradient-to-br from-white to-slate-100 border border-slate-200'}`}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-[2rem] border-[3px] border-b-blue-500 border-r-indigo-500 border-t-transparent border-l-transparent"
                        />
                        <Shield size={28} className="text-slate-500" />
                    </div>
                    <div className="text-center space-y-3">
                        <p className={`text-lg md:text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Establishing Secure Connection
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Loader size={14} className={`animate-spin ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400/80' : 'text-slate-600/80'}`}>
                                Initializing consultation session…
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`fixed inset-0 w-screen h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-4 font-sans ${isDarkMode ? 'bg-dark-bg' : 'bg-[#f4f7fb]'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border text-center shadow-2xl ${isDarkMode
                        ? 'bg-dark-bg-tertiary border-white/5'
                        : 'bg-white border-slate-200/50'
                        }`}
                >
                    <AlertTriangle size={32} className="text-rose-500 mx-auto mb-6" />
                    <h2 className={`text-2xl font-extrabold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Access Denied</h2>
                    <p className={`text-sm mb-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-600 text-white text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Return Safely
                    </button>
                </motion.div>
            </div>
        );
    }

    if (viewMode === 'summary') {
        return (
            <SessionSummary
                session={session}
                messages={messages}
                userType={userType}
                otherParticipant={otherParticipant}
                isDarkMode={isDarkMode}
                onBack={handleLeaveChamber}
            />
        );
    }

    if (viewMode === 'lobby') {
        return (
            <ConsultationLobby
                session={session}
                userType={userType}
                otherParticipant={otherParticipant}
                isDarkMode={isDarkMode}
                timeRemaining={timeRemaining}
                connectionStatus={connectionStatus}
                onLeave={handleLeaveChamber}
            />
        );
    }

    if (viewMode === 'chat') {
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
                onLeave={handleLeaveChamber}
                onAction={handleAction}
                opponentAction={opponentAction}
                chatEnabled={chatEnabled}
                waitingMessage={waitingMessage}
                isRejoinMode={isRejoinRoute}
            />
        );
    }

    return null;
};

export default ConsultationSession;
