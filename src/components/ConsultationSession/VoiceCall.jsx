import React, {
    useState, useEffect, useRef, useCallback, memo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, PhoneOff, PhoneCall, PhoneIncoming,
    PhoneMissed, Mic, MicOff, Volume2, VolumeX,
    X, Shield, Wifi, WifiOff, Lock,
} from 'lucide-react';
import { voiceCallAPI } from '../../api/apiService';

// ─── Twilio SDK dynamic loader ───────────────────────────────────────────────
let _TwilioDevice = null;
async function loadTwilioSDK() {
    if (_TwilioDevice) return _TwilioDevice;
    try {
        const { Device } = await import('@twilio/voice-sdk');
        _TwilioDevice = Device;
        return Device;
    } catch (e) {
        console.error('Twilio SDK load error:', e);
        return null;
    }
}

// ─── Call States ─────────────────────────────────────────────────────────────
const CS = {
    IDLE: 'idle',
    INIT: 'init',        // Loading SDK / token
    READY: 'ready',       // SDK ready, waiting
    CALLING: 'calling',     // Outgoing, waiting for other side to pick up
    RINGING: 'ringing',     // Other side phone is ringing
    INCOMING: 'incoming',    // We received an incoming call ring
    ACTIVE: 'active',      // Call connected both sides
    ENDING: 'ending',
    ERROR: 'error',
};

// ─── Ringing tone via Web Audio ──────────────────────────────────────────────
function useRingtone() {
    const ctxRef = useRef(null);
    const intervalRef = useRef(null);

    const play = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!ctxRef.current || ctxRef.current.state === 'closed') {
                ctxRef.current = new AudioCtx();
            }
            const ctx = ctxRef.current;

            const beep = () => {
                try {
                    const osc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    osc.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(480, ctx.currentTime);
                    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.8);
                } catch (_) { }
            };

            beep();
            intervalRef.current = setInterval(beep, 3000);
        } catch (_) { }
    }, []);

    const stop = useCallback(() => {
        clearInterval(intervalRef.current);
        try { ctxRef.current?.close(); } catch (_) { }
        ctxRef.current = null;
    }, []);

    useEffect(() => () => stop(), [stop]);

    return { play, stop };
}

// ─── Duration formatter ──────────────────────────────────────────────────────
function fmtDur(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Sound wave bars (live audio visualiser bars) ────────────────────────────
const SoundBars = memo(({ active, color }) => (
    <div className="flex items-center gap-[3px]" style={{ height: 22 }}>
        {[4, 8, 12, 7, 14, 6, 10, 5, 9, 4].map((h, i) => (
            <motion.div
                key={i}
                animate={active ? { scaleY: [0.2, 1, 0.4, 0.9, 0.2] } : { scaleY: 0.15 }}
                transition={active ? {
                    duration: 0.7 + i * 0.08, repeat: Infinity,
                    ease: 'easeInOut', delay: i * 0.05,
                } : { duration: 0.3 }}
                style={{
                    width: 2.5, height: h, background: color || '#10b981',
                    borderRadius: 2, transformOrigin: 'bottom',
                    opacity: active ? 1 : 0.25,
                }}
            />
        ))}
    </div>
));

// ─── Animated avatar with pulse rings ────────────────────────────────────────
const Avatar = memo(({ name, state, isDark }) => {
    const initials = (name || '??').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const isRinging = state === CS.RINGING || state === CS.CALLING;
    const isIncoming = state === CS.INCOMING;
    const isActive = state === CS.ACTIVE;

    const ringColor = isIncoming
        ? 'rgba(16,185,129,0.45)'
        : isActive
            ? 'rgba(99,102,241,0.4)'
            : 'rgba(99,102,241,0.3)';

    const bg = isActive
        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
        : isIncoming
            ? 'linear-gradient(135deg,#10b981,#059669)'
            : isRinging
                ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                : isDark
                    ? 'linear-gradient(135deg,#1e2035,#2a2d45)'
                    : 'linear-gradient(135deg,#e2e8f0,#cbd5e1)';

    const glow = isActive
        ? '0 0 0 3px rgba(99,102,241,0.25),0 16px 48px rgba(99,102,241,0.45)'
        : isIncoming
            ? '0 0 0 3px rgba(16,185,129,0.25),0 16px 48px rgba(16,185,129,0.45)'
            : isDark
                ? '0 8px 28px rgba(0,0,0,0.5)'
                : '0 8px 28px rgba(0,0,0,0.12)';

    return (
        <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
            {/* Expanding pulse rings */}
            {(isActive || isIncoming || isRinging) && [0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
                    style={{ width: 128, height: 128, background: ringColor }}
                />
            ))}

            {/* Main circle */}
            <div
                className="relative z-10 rounded-full flex items-center justify-center font-black text-2xl select-none transition-all duration-500"
                style={{
                    width: 128, height: 128,
                    background: bg, boxShadow: glow,
                    color: (isActive || isIncoming || isRinging) ? '#fff' : isDark ? '#94a3b8' : '#64748b',
                }}
            >
                {initials}
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
//  VoiceCall ── main component
//
//  Props:
//    sessionToken      – consultation session token (string)
//    userType          – 'user' | 'lawyer'
//    otherParticipant  – { name?, full_name? }
//    isDarkMode        – boolean
//    compact           – if true, renders only a round icon button (for lobby)
// ═══════════════════════════════════════════════════════════════════════════════
const VoiceCall = ({
    sessionToken,
    userType,
    otherParticipant,
    isDarkMode = false,
    compact = false,
}) => {
    // ── refs ─────────────────────────────────────────────────────────────────
    const deviceRef = useRef(null);
    const callRef = useRef(null);
    const timerRef = useRef(null);
    const initDoneRef = useRef(false);
    const vibRef = useRef(null);

    // ── state ─────────────────────────────────────────────────────────────────
    const [callState, setCallState] = useState(CS.IDLE);
    const [panelOpen, setPanelOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [speakerOff, setSpeakerOff] = useState(false);
    const [duration, setDuration] = useState(0);
    const [calleeInfo, setCalleeInfo] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [incomingCall, setIncoming] = useState(null);

    const ringtone = useRingtone();

    const calleeName = calleeInfo?.callee_name
        ?? otherParticipant?.name
        ?? otherParticipant?.full_name
        ?? (userType === 'user' ? 'Your Lawyer' : 'Your Client');

    const isActive = callState === CS.ACTIVE;
    const isIncoming = callState === CS.INCOMING;
    const isCalling = callState === CS.CALLING || callState === CS.RINGING;

    // ── call duration timer ───────────────────────────────────────────────────
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            clearInterval(timerRef.current);
            if (!isActive) setDuration(0);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    // ── vibrate on incoming (mobile) ──────────────────────────────────────────
    useEffect(() => {
        if (isIncoming && navigator.vibrate) {
            vibRef.current = setInterval(() => navigator.vibrate([400, 200, 400]), 1200);
        } else {
            clearInterval(vibRef.current);
            if (navigator.vibrate) navigator.vibrate(0);
        }
        return () => {
            clearInterval(vibRef.current);
            if (navigator.vibrate) navigator.vibrate(0);
        };
    }, [isIncoming]);

    // ── ringtone control ──────────────────────────────────────────────────────
    useEffect(() => {
        if (isIncoming) {
            ringtone.play();
        } else {
            ringtone.stop();
        }
    }, [isIncoming, ringtone]);

    // ── init Twilio device (as soon as component mounts) ──────────────────────
    const initDevice = useCallback(async () => {
        if (initDoneRef.current || !sessionToken) return;
        initDoneRef.current = true;
        setCallState(CS.INIT);
        try {
            const Device = await loadTwilioSDK();
            if (!Device) throw new Error('Twilio Voice SDK unavailable');

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

            device.on('registered', () => setCallState(CS.READY));
            device.on('error', err => {
                setErrMsg('Connection error: ' + (err.message || 'Unknown'));
                setCallState(CS.ERROR);
            });
            device.on('incoming', call => {
                setIncoming(call);
                setCallState(CS.INCOMING);
                setPanelOpen(true);

                call.on('disconnect', () => {
                    setCallState(CS.READY);
                    setIncoming(null);
                });
                call.on('cancel', () => {
                    setCallState(CS.READY);
                    setIncoming(null);
                    setPanelOpen(false);
                });
            });
            device.on('tokenWillExpire', async () => {
                try {
                    const fresh = await voiceCallAPI.getToken(sessionToken);
                    device.updateToken(fresh.token);
                } catch (_) { }
            });

            await device.register();
            deviceRef.current = device;
        } catch (err) {
            console.error('VoiceCall init error:', err);
            setErrMsg(err.message || 'Setup failed');
            setCallState(CS.ERROR);
            initDoneRef.current = false;
        }
    }, [sessionToken]);

    // Auto-init on mount
    useEffect(() => {
        initDevice();
        return () => {
            clearInterval(timerRef.current);
            clearInterval(vibRef.current);
            ringtone.stop();
            if (callRef.current) try { callRef.current.disconnect(); } catch (_) { }
            if (deviceRef.current) try { deviceRef.current.destroy(); } catch (_) { }
        };
    }, [initDevice]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── outgoing call ─────────────────────────────────────────────────────────
    const startCall = useCallback(async () => {
        if (!deviceRef.current || !calleeInfo) return;
        setErrMsg('');
        setCallState(CS.CALLING);
        setPanelOpen(true);
        try {
            const call = await deviceRef.current.connect({
                params: { To: calleeInfo.callee_identity },
            });
            callRef.current = call;
            call.on('ringing', () => setCallState(CS.RINGING));
            call.on('accept', () => setCallState(CS.ACTIVE));
            call.on('disconnect', () => {
                setCallState(CS.READY);
                callRef.current = null;
            });
            call.on('error', err => {
                setErrMsg(err.message || 'Call failed');
                setCallState(CS.ERROR);
                callRef.current = null;
            });
        } catch (err) {
            setErrMsg(err.message || 'Failed to call');
            setCallState(CS.ERROR);
        }
    }, [calleeInfo]);

    const acceptCall = useCallback(() => {
        if (!incomingCall) return;
        incomingCall.accept();
        callRef.current = incomingCall;
        setCallState(CS.ACTIVE);
        incomingCall.on('disconnect', () => {
            setCallState(CS.READY);
            callRef.current = null;
            setIncoming(null);
        });
    }, [incomingCall]);

    const declineCall = useCallback(() => {
        if (incomingCall) incomingCall.reject();
        setIncoming(null);
        setCallState(CS.READY);
        setPanelOpen(false);
    }, [incomingCall]);

    const endCall = useCallback(() => {
        setCallState(CS.ENDING);
        if (callRef.current) { try { callRef.current.disconnect(); } catch (_) { } callRef.current = null; }
        if (incomingCall) { try { incomingCall.reject(); } catch (_) { } }
        setTimeout(() => {
            setCallState(CS.READY);
            setIsMuted(false);
            setSpeakerOff(false);
            setPanelOpen(false);
        }, 600);
    }, [incomingCall]);

    const toggleMute = useCallback(() => {
        if (!callRef.current) return;
        const next = !isMuted;
        callRef.current.mute(next);
        setIsMuted(next);
    }, [isMuted]);

    // ── derived style shortcuts ───────────────────────────────────────────────
    const dp = isDarkMode ? 'text-white' : 'text-slate-900';
    const ds = isDarkMode ? 'text-slate-400' : 'text-slate-500';
    const glassBg = isDarkMode
        ? 'bg-[#12141f]/98 border-white/10'
        : 'bg-white/98 border-slate-200/60';

    // Call button colour/state
    const btnGrad = isActive
        ? 'linear-gradient(135deg,#10b981,#059669)'
        : isIncoming
            ? 'linear-gradient(135deg,#10b981,#0d9488)'
            : isCalling
                ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)';

    const btnGlow = isActive || isIncoming
        ? '0 4px 20px rgba(16,185,129,0.55)'
        : '0 4px 20px rgba(99,102,241,0.5)';

    // Status text per state
    const statusMap = {
        [CS.IDLE]: { text: 'Tap to call', color: '#64748b' },
        [CS.INIT]: { text: 'Setting up…', color: '#f59e0b' },
        [CS.READY]: { text: 'Ready', color: '#10b981' },
        [CS.CALLING]: { text: 'Calling…', color: '#6366f1' },
        [CS.RINGING]: { text: 'Ringing…', color: '#6366f1' },
        [CS.INCOMING]: { text: 'Incoming Call', color: '#10b981' },
        [CS.ACTIVE]: { text: fmtDur(duration), color: '#10b981' },
        [CS.ENDING]: { text: 'Ending…', color: '#ef4444' },
        [CS.ERROR]: { text: 'Connection failed', color: '#ef4444' },
    };
    const status = statusMap[callState] || statusMap[CS.IDLE];

    // ═════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═════════════════════════════════════════════════════════════════════════
    return (
        <>
            {/* ─────────────────────────────────────────────────────────────
                CALL TRIGGER BUTTON
                compact=true  → round icon  (Lobby)
                compact=false → pill button (Chat header)
            ───────────────────────────────────────────────────────────── */}
            <motion.button
                id="vc-trigger"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                    if (callState === CS.READY || callState === CS.ERROR || callState === CS.IDLE) {
                        startCall();
                    } else {
                        setPanelOpen(p => !p);
                    }
                }}
                className="relative flex-shrink-0"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: compact ? 0 : 7,
                    padding: compact ? 0 : '8px 14px',
                    width: compact ? 44 : 'auto',
                    height: compact ? 44 : 38,
                    borderRadius: compact ? '50%' : 20,
                    background: btnGrad,
                    boxShadow: btnGlow,
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 13,
                    overflow: 'hidden',
                }}
            >
                {/* Incoming pulse halo */}
                {(isIncoming || isActive) && (
                    <motion.div
                        animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
                        style={{
                            position: 'absolute', inset: 0,
                            borderRadius: 'inherit',
                            background: 'rgba(16,185,129,0.55)',
                        }}
                    />
                )}

                {/* Icon */}
                <span className="relative z-10 flex items-center justify-center">
                    {isActive ? (
                        <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                            <Phone size={compact ? 20 : 16} />
                        </motion.span>
                    ) : isIncoming ? (
                        <motion.span animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.5, repeat: Infinity }}>
                            <PhoneIncoming size={compact ? 20 : 16} />
                        </motion.span>
                    ) : isCalling ? (
                        <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                            <PhoneCall size={compact ? 20 : 16} />
                        </motion.span>
                    ) : (
                        <Phone size={compact ? 20 : 16} />
                    )}
                </span>

                {/* Label (pill only) */}
                {!compact && (
                    <span className="relative z-10">
                        {isActive ? fmtDur(duration) : isIncoming ? 'Incoming' : 'Call'}
                    </span>
                )}

                {/* Active timer dot */}
                {isActive && (
                    <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
            </motion.button>

            {/* ─────────────────────────────────────────────────────────────
                FULL CALL PANEL — opens on top of everything
            ───────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {panelOpen && (
                    <motion.div
                        key="call-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            display: 'flex', alignItems: 'flex-end',
                            justifyContent: 'center',
                            backdropFilter: 'blur(18px)',
                            background: 'rgba(0,0,0,0.65)',
                        }}
                        // Clicking backdrop only closes when idle/ready
                        onClick={e => {
                            if (e.target === e.currentTarget &&
                                (callState === CS.READY || callState === CS.IDLE)) {
                                setPanelOpen(false);
                            }
                        }}
                    >
                        <motion.div
                            key="call-panel"
                            initial={{ y: 100, opacity: 0, scale: 0.94 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 370, damping: 28 }}
                            className={`relative w-full max-w-xs mx-4 mb-6 sm:mb-0 sm:rounded-[2.5rem] rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl overflow-hidden ${glassBg}`}
                            style={{ maxHeight: '90dvh' }}
                        >
                            {/* ── coloured top glow ───────────────────── */}
                            <div
                                style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.28,
                                    background: isActive
                                        ? 'radial-gradient(circle at 50% 0%,rgba(99,102,241,0.7) 0%,transparent 60%)'
                                        : isIncoming
                                            ? 'radial-gradient(circle at 50% 0%,rgba(16,185,129,0.7) 0%,transparent 60%)'
                                            : 'radial-gradient(circle at 50% 0%,rgba(99,102,241,0.5) 0%,transparent 60%)',
                                }}
                            />

                            <div className="relative z-10 flex flex-col items-center px-7 pt-7 pb-8 gap-5">

                                {/* ── header row ──────────────────────── */}
                                <div className="w-full flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Lock size={11} className="text-indigo-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                                            Secure Call · E2E
                                        </span>
                                    </div>
                                    {(callState === CS.READY || callState === CS.IDLE || callState === CS.ERROR) && (
                                        <button
                                            onClick={() => setPanelOpen(false)}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDarkMode
                                                    ? 'text-slate-500 hover:text-white hover:bg-white/10'
                                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* ── avatar ──────────────────────────── */}
                                <Avatar name={calleeName} state={callState} isDark={isDarkMode} />

                                {/* ── name / role ─────────────────────── */}
                                <div className="text-center -mt-1 space-y-0.5">
                                    <h3 className={`text-xl font-extrabold tracking-tight ${dp}`}>{calleeName}</h3>
                                    <p className={`text-[11px] font-semibold uppercase tracking-widest ${ds}`}>
                                        {calleeInfo?.callee_role === 'lawyer' ? '⚖️ Advocate' : '👤 Client'}
                                    </p>
                                </div>

                                {/* ── status row ──────────────────────── */}
                                <div className="flex items-center gap-2.5 min-h-[26px]">
                                    {isActive && <SoundBars active color="#10b981" />}

                                    <motion.span
                                        key={callState + duration}
                                        initial={{ opacity: 0, y: 3 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm font-bold tabular-nums"
                                        style={{ color: status.color }}
                                    >
                                        {status.text}
                                    </motion.span>

                                    {isActive && <SoundBars active color="#10b981" />}

                                    {/* Ringing dots */}
                                    {isCalling && (
                                        <div className="flex gap-1 ml-1">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── error notice ────────────────────── */}
                                {errMsg && (
                                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium w-full justify-center ${isDarkMode ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'
                                        }`}>
                                        <WifiOff size={12} />
                                        {errMsg}
                                    </div>
                                )}

                                {/* ── initialising notice ─────────────── */}
                                {callState === CS.INIT && (
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        <WifiOff size={11} className="animate-spin" />
                                        Initialising secure connection…
                                    </div>
                                )}

                                {/* ════════════════════════════════════════
                                    INCOMING CALL ACTIONS
                                ════════════════════════════════════════ */}
                                {isIncoming && (
                                    <div className="flex items-end gap-10 mt-1">
                                        {/* Decline */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.12 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={declineCall}
                                                style={{
                                                    width: 66, height: 66, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                                    boxShadow: '0 6px 24px rgba(239,68,68,0.55)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >
                                                <PhoneMissed size={26} color="#fff" />
                                            </motion.button>
                                            <span className={`text-[11px] font-semibold ${ds}`}>Decline</span>
                                        </div>

                                        {/* Accept */}
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.12 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={acceptCall}
                                                style={{
                                                    width: 66, height: 66, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg,#10b981,#059669)',
                                                    boxShadow: '0 6px 24px rgba(16,185,129,0.55)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: [0, 18, -18, 0] }}
                                                    transition={{ duration: 0.55, repeat: Infinity }}
                                                >
                                                    <PhoneIncoming size={26} color="#fff" />
                                                </motion.div>
                                            </motion.button>
                                            <span className={`text-[11px] font-semibold ${ds}`}>Answer</span>
                                        </div>
                                    </div>
                                )}

                                {/* ════════════════════════════════════════
                                    OUTGOING / ACTIVE CONTROLS
                                ════════════════════════════════════════ */}
                                {(isActive || isCalling) && (
                                    <div className="flex items-end gap-5 mt-1 w-full justify-center">

                                        {/* Mute */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={toggleMute}
                                                disabled={!isActive}
                                                style={{
                                                    width: 52, height: 52, borderRadius: 16,
                                                    background: isMuted
                                                        ? (isDarkMode ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.1)')
                                                        : (isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                                                    border: `1.5px solid ${isMuted ? 'rgba(239,68,68,0.4)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                                                    color: isMuted ? '#ef4444' : isDarkMode ? '#e2e8f0' : '#475569',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: isActive ? 1 : 0.35, cursor: isActive ? 'pointer' : 'default',
                                                }}
                                            >
                                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                            </motion.button>
                                            <span className={`text-[10px] font-semibold ${ds}`}>
                                                {isMuted ? 'Unmute' : 'Mute'}
                                            </span>
                                        </div>

                                        {/* End call */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={endCall}
                                                style={{
                                                    width: 72, height: 72, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                                    boxShadow: '0 8px 32px rgba(239,68,68,0.6)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >
                                                <PhoneOff size={28} color="#fff" />
                                            </motion.button>
                                            <span className="text-[10px] font-semibold text-red-500">End Call</span>
                                        </div>

                                        {/* Speaker */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={() => setSpeakerOff(s => !s)}
                                                style={{
                                                    width: 52, height: 52, borderRadius: 16,
                                                    background: speakerOff
                                                        ? (isDarkMode ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.1)')
                                                        : (isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                                                    border: `1.5px solid ${speakerOff ? 'rgba(245,158,11,0.4)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                                                    color: speakerOff ? '#f59e0b' : isDarkMode ? '#e2e8f0' : '#475569',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >
                                                {speakerOff ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                            </motion.button>
                                            <span className={`text-[10px] font-semibold ${ds}`}>
                                                {speakerOff ? 'Speaker Off' : 'Speaker'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* ════════════════════════════════════════
                                    READY/IDLE — START CALL
                                ════════════════════════════════════════ */}
                                {(callState === CS.READY) && (
                                    <div className="flex flex-col items-center gap-2.5 w-full mt-1">
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={startCall}
                                            className="flex items-center gap-3 py-4 rounded-2xl font-bold text-base text-white w-full justify-center"
                                            style={{
                                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                                boxShadow: '0 6px 28px rgba(99,102,241,0.55)',
                                            }}
                                        >
                                            <PhoneCall size={20} />
                                            Call {calleeName.split(' ')[0]}
                                        </motion.button>
                                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                                            <Wifi size={11} /> Ready to call
                                        </div>
                                    </div>
                                )}

                                {/* Error retry */}
                                {callState === CS.ERROR && (
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => {
                                            setCallState(CS.IDLE);
                                            setErrMsg('');
                                            initDoneRef.current = false;
                                            initDevice();
                                        }}
                                        className="px-6 py-3 rounded-2xl text-sm font-bold text-white w-full justify-center flex items-center gap-2"
                                        style={{
                                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                                        }}
                                    >
                                        <Wifi size={14} /> Retry Connection
                                    </motion.button>
                                )}

                                {/* Footer */}
                                <p className={`text-[9px] font-medium text-center ${ds} opacity-50`}>
                                    End-to-end encrypted · MeraVakil Secure Chambers
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
