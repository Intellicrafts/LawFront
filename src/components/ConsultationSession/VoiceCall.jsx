import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    memo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    PhoneOff,
    PhoneCall,
    PhoneIncoming,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    X,
    Shield,
    Wifi,
    WifiOff,
    User,
} from 'lucide-react';
import { voiceCallAPI } from '../../api/apiService';

// ─── Dynamic Twilio Voice SDK Loader ─────────────────────────────────────────
let TwilioDevice = null;
async function loadTwilioSDK() {
    if (TwilioDevice) return TwilioDevice;
    try {
        const { Device } = await import('@twilio/voice-sdk');
        TwilioDevice = Device;
        return Device;
    } catch (err) {
        console.error('Failed to load Twilio Voice SDK:', err);
        return null;
    }
}

// ─── Call States ─────────────────────────────────────────────────────────────
const CALL_STATE = {
    IDLE: 'idle',
    CONNECTING: 'connecting',
    RINGING: 'ringing',
    INCOMING: 'incoming',
    ACTIVE: 'active',
    ENDING: 'ending',
    ERROR: 'error',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Sound Wave Bars ─────────────────────────────────────────────────────────
const SoundWaveBars = memo(({ active, color = '#6366f1' }) => {
    const bars = [3, 6, 8, 5, 9, 4, 7, 5, 6, 3];
    return (
        <div className="flex items-center gap-[3px]" style={{ height: 28 }}>
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    animate={active ? {
                        scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                    } : { scaleY: 0.2 }}
                    transition={active ? {
                        duration: 0.8 + i * 0.07,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.06,
                    } : { duration: 0.3 }}
                    style={{
                        width: 3,
                        height: height,
                        background: color,
                        borderRadius: 2,
                        transformOrigin: 'bottom',
                        opacity: active ? 1 : 0.3,
                    }}
                />
            ))}
        </div>
    );
});

// ─── Avatar Pulse ─────────────────────────────────────────────────────────────
const AvatarPulse = memo(({ name, active, incoming, isDark }) => {
    const initials = name
        ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    return (
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            {/* Pulse rings */}
            {(active || incoming) && [0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.65,
                        ease: 'easeOut',
                    }}
                    className="absolute rounded-full"
                    style={{
                        width: 120,
                        height: 120,
                        background: incoming
                            ? 'rgba(16, 185, 129, 0.35)'
                            : active
                                ? 'rgba(99, 102, 241, 0.35)'
                                : 'rgba(148, 163, 184, 0.2)',
                    }}
                />
            ))}

            {/* Avatar circle */}
            <div
                className="relative z-10 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl select-none"
                style={{
                    width: 120,
                    height: 120,
                    background: incoming
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : active
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : isDark
                                ? 'linear-gradient(135deg, #374151, #1f2937)'
                                : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                    boxShadow: active || incoming
                        ? '0 0 0 4px rgba(99,102,241,0.3), 0 20px 60px rgba(99,102,241,0.4)'
                        : isDark
                            ? '0 8px 32px rgba(0,0,0,0.5)'
                            : '0 8px 32px rgba(0,0,0,0.15)',
                    color: active || incoming
                        ? '#fff'
                        : isDark ? '#e2e8f0' : '#64748b',
                }}
            >
                {initials}
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN VoiceCall Component
// ═══════════════════════════════════════════════════════════════════════════════
const VoiceCall = ({
    sessionToken,     // Consultation session token
    userType,         // 'user' | 'lawyer'
    otherParticipant, // { name, ... }
    isDarkMode = false,
    className = '',
}) => {
    // ── Refs ────────────────────────────────────────────────────────────────────
    const deviceRef = useRef(null);
    const callRef = useRef(null);
    const timerRef = useRef(null);
    const hasInitRef = useRef(false);

    // ── State ───────────────────────────────────────────────────────────────────
    const [callState, setCallState] = useState(CALL_STATE.IDLE);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOff, setIsSpeakerOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [calleeInfo, setCalleeInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [sdkReady, setSdkReady] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null); // active Twilio Call obj for incoming

    const calleeName = calleeInfo?.callee_name ?? otherParticipant?.name ?? otherParticipant?.full_name ?? 'Participant';
    const isActive = callState === CALL_STATE.ACTIVE;
    const isIncoming = callState === CALL_STATE.INCOMING;

    // ── Timer ───────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
        } else {
            clearInterval(timerRef.current);
            if (!isActive) setCallDuration(0);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    // ── Init Twilio Device ──────────────────────────────────────────────────────
    const initDevice = useCallback(async () => {
        if (hasInitRef.current) return;
        hasInitRef.current = true;

        try {
            const Device = await loadTwilioSDK();
            if (!Device) throw new Error('Twilio Voice SDK unavailable');

            // Fetch token + callee info in parallel
            const [tokenData, callee] = await Promise.all([
                voiceCallAPI.getToken(sessionToken),
                voiceCallAPI.getCalleeInfo(sessionToken),
            ]);

            setCalleeInfo(callee);

            const device = new Device(tokenData.token, {
                logLevel: 'warn',
                codecPreferences: ['opus', 'pcmu'],
                allowIncomingWhileBusy: false,
            });

            // Register device to receive incoming calls
            await device.register();
            deviceRef.current = device;

            // ── Event handlers ─────────────────────────────────────────────────────
            device.on('registered', () => {
                setSdkReady(true);
            });

            device.on('error', (err) => {
                console.error('Twilio Device error:', err);
                setErrorMessage(`Connection error: ${err.message}`);
                setCallState(CALL_STATE.ERROR);
            });

            device.on('incoming', (call) => {
                setIncomingCall(call);
                setCallState(CALL_STATE.INCOMING);
                setPanelOpen(true);

                call.on('disconnect', () => {
                    setCallState(CALL_STATE.IDLE);
                    setIncomingCall(null);
                });
                call.on('cancel', () => {
                    setCallState(CALL_STATE.IDLE);
                    setIncomingCall(null);
                    setPanelOpen(false);
                });
            });

            device.on('tokenWillExpire', async () => {
                try {
                    const fresh = await voiceCallAPI.getToken(sessionToken);
                    device.updateToken(fresh.token);
                } catch (e) {
                    console.warn('Token refresh failed:', e);
                }
            });

            setSdkReady(true);
        } catch (err) {
            console.error('VoiceCall init failed:', err);
            setErrorMessage(err.message || 'Failed to initialize voice call');
            setCallState(CALL_STATE.ERROR);
            hasInitRef.current = false;
        }
    }, [sessionToken]);

    // ── Auto-init when panel opens ──────────────────────────────────────────────
    useEffect(() => {
        if (panelOpen && !hasInitRef.current) {
            initDevice();
        }
    }, [panelOpen, initDevice]);

    // ── Cleanup ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            if (callRef.current) callRef.current.disconnect();
            if (deviceRef.current) deviceRef.current.destroy();
        };
    }, []);

    // ── Call Actions ─────────────────────────────────────────────────────────────
    const startCall = useCallback(async () => {
        if (!deviceRef.current || !calleeInfo) return;
        try {
            setCallState(CALL_STATE.CONNECTING);
            setErrorMessage('');
            setPanelOpen(true);

            const call = await deviceRef.current.connect({
                params: { To: calleeInfo.callee_identity },
            });

            callRef.current = call;

            call.on('ringing', () => setCallState(CALL_STATE.RINGING));
            call.on('accept', () => setCallState(CALL_STATE.ACTIVE));
            call.on('disconnect', () => {
                setCallState(CALL_STATE.IDLE);
                callRef.current = null;
            });
            call.on('error', (err) => {
                setErrorMessage(err.message || 'Call failed');
                setCallState(CALL_STATE.ERROR);
                callRef.current = null;
            });
        } catch (err) {
            console.error('Call start failed:', err);
            setErrorMessage(err.message || 'Failed to start call');
            setCallState(CALL_STATE.ERROR);
        }
    }, [calleeInfo]);

    const acceptIncomingCall = useCallback(() => {
        if (!incomingCall) return;
        incomingCall.accept();
        callRef.current = incomingCall;
        setCallState(CALL_STATE.ACTIVE);

        incomingCall.on('disconnect', () => {
            setCallState(CALL_STATE.IDLE);
            callRef.current = null;
            setIncomingCall(null);
        });
    }, [incomingCall]);

    const rejectIncomingCall = useCallback(() => {
        if (incomingCall) incomingCall.reject();
        setIncomingCall(null);
        setCallState(CALL_STATE.IDLE);
        setPanelOpen(false);
    }, [incomingCall]);

    const endCall = useCallback(() => {
        setCallState(CALL_STATE.ENDING);
        if (callRef.current) {
            callRef.current.disconnect();
            callRef.current = null;
        }
        if (incomingCall) incomingCall.reject();
        setTimeout(() => {
            setCallState(CALL_STATE.IDLE);
            setIsMuted(false);
            setIsSpeakerOff(false);
            setPanelOpen(false);
        }, 500);
    }, [incomingCall]);

    const toggleMute = useCallback(() => {
        if (!callRef.current) return;
        const next = !isMuted;
        callRef.current.mute(next);
        setIsMuted(next);
    }, [isMuted]);

    // ── Styles helpers ──────────────────────────────────────────────────────────
    const glass = isDarkMode
        ? 'bg-[#16181f]/95 border-white/10'
        : 'bg-white/95 border-slate-200/60';

    const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
    const textSecondary = isDarkMode ? 'text-slate-400' : 'text-slate-500';

    // ── Status label ────────────────────────────────────────────────────────────
    const statusConfig = {
        [CALL_STATE.IDLE]: { label: 'Call', color: '#64748b' },
        [CALL_STATE.CONNECTING]: { label: 'Connecting…', color: '#f59e0b' },
        [CALL_STATE.RINGING]: { label: 'Ringing…', color: '#6366f1' },
        [CALL_STATE.INCOMING]: { label: 'Incoming Call', color: '#10b981' },
        [CALL_STATE.ACTIVE]: { label: formatDuration(callDuration), color: '#10b981' },
        [CALL_STATE.ENDING]: { label: 'Ending…', color: '#ef4444' },
        [CALL_STATE.ERROR]: { label: 'Error', color: '#ef4444' },
    };

    const status = statusConfig[callState];

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════════
    return (
        <>
            {/* ── Call Button ── */}
            <motion.button
                id="voice-call-btn"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                    if (callState === CALL_STATE.IDLE || callState === CALL_STATE.ERROR) {
                        setPanelOpen(true);
                    } else {
                        setPanelOpen(p => !p);
                    }
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-lg transition-all duration-300 ${className}`}
                style={{
                    background: isActive
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : isIncoming
                            ? 'linear-gradient(135deg, #10b981, #0d9488)'
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    boxShadow: isActive
                        ? '0 4px 24px rgba(16,185,129,0.5)'
                        : isIncoming
                            ? '0 4px 24px rgba(16,185,129,0.6)'
                            : '0 4px 24px rgba(99,102,241,0.5)',
                }}
            >
                {/* Incoming pulse ring */}
                {isIncoming && (
                    <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: 'rgba(16,185,129,0.5)' }}
                    />
                )}

                <Phone size={16} className={isActive || isIncoming ? 'animate-bounce' : ''} />
                <span className="relative z-10">
                    {isActive ? formatDuration(callDuration) : isIncoming ? 'Incoming' : 'Call'}
                </span>

                {/* Green dot when active */}
                {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
            </motion.button>

            {/* ── Full-Screen Panel (mobile) / Floating Panel (desktop) ── */}
            <AnimatePresence>
                {panelOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
                        style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.6)' }}
                    >
                        <motion.div
                            initial={{ y: 80, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 80, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className={`relative w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl overflow-hidden ${glass}`}
                        >
                            {/* Background gradient accent */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-30"
                                style={{
                                    background: isActive
                                        ? 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.4) 0%, transparent 65%)'
                                        : isIncoming
                                            ? 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.5) 0%, transparent 65%)'
                                            : 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.4) 0%, transparent 65%)',
                                }}
                            />

                            <div className="relative z-10 flex flex-col items-center px-8 pt-10 pb-10 gap-6">

                                {/* Header bar */}
                                <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Shield size={12} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                            Secure Call
                                        </span>
                                    </div>
                                    {callState === CALL_STATE.IDLE && (
                                        <button
                                            onClick={() => setPanelOpen(false)}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="mt-6">
                                    <AvatarPulse
                                        name={calleeName}
                                        active={isActive}
                                        incoming={isIncoming}
                                        isDark={isDarkMode}
                                    />
                                </div>

                                {/* Name */}
                                <div className="text-center space-y-1">
                                    <h3 className={`text-xl font-extrabold tracking-tight ${textPrimary}`}>
                                        {calleeName}
                                    </h3>
                                    <p className={`text-xs font-semibold uppercase tracking-widest ${textSecondary}`}>
                                        {calleeInfo?.callee_role === 'lawyer' ? 'Advocate' : 'Client'}
                                    </p>
                                </div>

                                {/* Status row */}
                                <div className="flex items-center gap-2 min-h-[28px]">
                                    {(isActive || callState === CALL_STATE.RINGING) ? (
                                        <>
                                            <SoundWaveBars
                                                active={isActive}
                                                color={isActive ? '#10b981' : '#6366f1'}
                                            />
                                            <span
                                                className="text-sm font-bold tabular-nums"
                                                style={{ color: status.color }}
                                            >
                                                {status.label}
                                            </span>
                                            <SoundWaveBars
                                                active={isActive}
                                                color={isActive ? '#10b981' : '#6366f1'}
                                            />
                                        </>
                                    ) : (
                                        <motion.span
                                            key={callState}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm font-semibold"
                                            style={{ color: status.color }}
                                        >
                                            {status.label}
                                        </motion.span>
                                    )}
                                </div>

                                {/* SDK Not Ready Notice */}
                                {!sdkReady && callState !== CALL_STATE.ERROR && (
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        <WifiOff size={12} />
                                        Initializing secure connection…
                                    </div>
                                )}

                                {/* Error */}
                                {errorMessage && (
                                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium w-full text-center justify-center ${isDarkMode ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'
                                        }`}>
                                        <WifiOff size={12} />
                                        {errorMessage}
                                    </div>
                                )}

                                {/* ── INCOMING CALL ACTIONS ── */}
                                {callState === CALL_STATE.INCOMING && (
                                    <div className="flex items-center gap-6 mt-2">
                                        {/* Reject */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={rejectIncomingCall}
                                                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                                                style={{
                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    boxShadow: '0 6px 24px rgba(239,68,68,0.5)',
                                                }}
                                            >
                                                <PhoneOff size={24} color="#fff" />
                                            </motion.button>
                                            <span className={`text-xs font-semibold ${textSecondary}`}>Decline</span>
                                        </div>

                                        {/* Accept */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={acceptIncomingCall}
                                                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                                                style={{
                                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                                    boxShadow: '0 6px 24px rgba(16,185,129,0.5)',
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: [0, 20, -20, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity }}
                                                >
                                                    <PhoneIncoming size={24} color="#fff" />
                                                </motion.div>
                                            </motion.button>
                                            <span className={`text-xs font-semibold ${textSecondary}`}>Answer</span>
                                        </div>
                                    </div>
                                )}

                                {/* ── ACTIVE CALL CONTROLS ── */}
                                {(isActive || callState === CALL_STATE.CONNECTING || callState === CALL_STATE.RINGING) && (
                                    <div className="flex items-center gap-4 mt-2 w-full justify-center">
                                        {/* Mute */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={toggleMute}
                                                disabled={!isActive}
                                                className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all"
                                                style={{
                                                    width: 52, height: 52,
                                                    background: isMuted
                                                        ? (isDarkMode ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)')
                                                        : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                                                    border: `1.5px solid ${isMuted ? 'rgba(239,68,68,0.4)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                                                    color: isMuted ? '#ef4444' : isDarkMode ? '#e2e8f0' : '#475569',
                                                    opacity: isActive ? 1 : 0.4,
                                                }}
                                            >
                                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                            </motion.button>
                                            <span className={`text-[11px] font-semibold ${textSecondary}`}>
                                                {isMuted ? 'Unmute' : 'Mute'}
                                            </span>
                                        </div>

                                        {/* End Call */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={endCall}
                                                className="rounded-full flex items-center justify-center shadow-xl"
                                                style={{
                                                    width: 68, height: 68,
                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    boxShadow: '0 8px 32px rgba(239,68,68,0.55)',
                                                }}
                                            >
                                                <PhoneOff size={26} color="#fff" />
                                            </motion.button>
                                            <span className={`text-[11px] font-semibold text-red-500`}>End</span>
                                        </div>

                                        {/* Speaker toggle */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={() => setIsSpeakerOff(s => !s)}
                                                className="rounded-2xl flex items-center justify-center transition-all"
                                                style={{
                                                    width: 52, height: 52,
                                                    background: isSpeakerOff
                                                        ? (isDarkMode ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)')
                                                        : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                                                    border: `1.5px solid ${isSpeakerOff ? 'rgba(245,158,11,0.4)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                                                    color: isSpeakerOff ? '#f59e0b' : isDarkMode ? '#e2e8f0' : '#475569',
                                                }}
                                            >
                                                {isSpeakerOff ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                            </motion.button>
                                            <span className={`text-[11px] font-semibold ${textSecondary}`}>
                                                {isSpeakerOff ? 'Speaker Off' : 'Speaker'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* ── IDLE — CALL BUTTON ── */}
                                {callState === CALL_STATE.IDLE && (
                                    <div className="flex flex-col items-center gap-3 mt-2 w-full">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startCall}
                                            disabled={!sdkReady}
                                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all w-full justify-center"
                                            style={{
                                                background: sdkReady
                                                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                    : isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
                                                boxShadow: sdkReady ? '0 6px 28px rgba(99,102,241,0.55)' : 'none',
                                                opacity: sdkReady ? 1 : 0.6,
                                            }}
                                        >
                                            <PhoneCall size={20} />
                                            Call {calleeName.split(' ')[0]}
                                        </motion.button>

                                        {/* SDK status */}
                                        <div className={`flex items-center gap-1.5 text-xs font-medium ${sdkReady ? 'text-emerald-500' : textSecondary
                                            }`}>
                                            {sdkReady
                                                ? <><Wifi size={11} /> Ready</>
                                                : <><WifiOff size={11} /> Initializing...</>
                                            }
                                        </div>
                                    </div>
                                )}

                                {/* ── ERROR — RETRY ── */}
                                {callState === CALL_STATE.ERROR && (
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => {
                                            setCallState(CALL_STATE.IDLE);
                                            setErrorMessage('');
                                            hasInitRef.current = false;
                                            setSdkReady(false);
                                            initDevice();
                                        }}
                                        className="px-6 py-3 rounded-2xl text-sm font-bold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                                        }}
                                    >
                                        Retry Connection
                                    </motion.button>
                                )}

                                {/* Footer note */}
                                <p className={`text-[10px] font-medium text-center leading-relaxed ${textSecondary} opacity-60`}>
                                    End-to-end encrypted · Powered by MeraVakil
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceCall;
