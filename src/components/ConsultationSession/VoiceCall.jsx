import React, {
    useState, useEffect, useRef, useCallback, memo,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, PhoneOff, PhoneCall, PhoneIncoming,
    PhoneMissed, Mic, MicOff, Volume2, VolumeX,
    X, Wifi, WifiOff, Shield,
} from 'lucide-react';
import { voiceCallAPI } from '../../api/apiService';

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

// Lazy-load Twilio Voice SDK
let _Device = null;
async function loadTwilioSDK() {
    if (_Device) return _Device;
    try {
        const mod = await import('@twilio/voice-sdk');
        _Device = mod.Device;
        return _Device;
    } catch (e) {
        console.warn('[VoiceCall] @twilio/voice-sdk not available:', e);
        return null;
    }
}

// Call states
const CS = {
    IDLE: 'idle', INIT: 'init', READY: 'ready',
    CALLING: 'calling', RINGING: 'ringing', INCOMING: 'incoming',
    ACTIVE: 'active', ENDING: 'ending', ERROR: 'error',
};

function fmtDur(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function safeMsg(err) {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    return err.message || err.description || String(err.code || 'Connection error');
}

/* ── Simple ringtone via Web Audio ─────────────────────────────────────── */
function useRingtone() {
    const ctxRef = useRef(null);
    const ivRef = useRef(null);
    const play = useCallback(() => {
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            if (!ctxRef.current || ctxRef.current.state === 'closed') ctxRef.current = new Ctx();
            const ctx = ctxRef.current;
            const beep = () => {
                try {
                    const o = ctx.createOscillator(), g = ctx.createGain();
                    o.connect(g); g.connect(ctx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(480, ctx.currentTime);
                    o.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
                    g.gain.setValueAtTime(0.18, ctx.currentTime);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
                    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.65);
                } catch (_) { }
            };
            beep();
            ivRef.current = setInterval(beep, 2600);
        } catch (_) { }
    }, []);
    const stop = useCallback(() => {
        clearInterval(ivRef.current);
        try { ctxRef.current?.close(); } catch (_) { }
        ctxRef.current = null;
    }, []);
    useEffect(() => () => stop(), [stop]);
    return { play, stop };
}

/* ── Tiny sub-components ───────────────────────────────────────────────── */

const PulseRing = memo(({ color, count = 2 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
                style={{ background: color }}
            />
        ))}
    </>
));

const SoundBars = memo(({ color = '#10b981' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 14 }}>
        {[3, 5, 9, 4, 11, 3, 7].map((h, i) => (
            <motion.div
                key={i}
                animate={{ scaleY: [0.15, 1, 0.25, 0.9, 0.15] }}
                transition={{ duration: 0.6 + i * 0.05, repeat: Infinity, ease: 'easeInOut', delay: i * 0.035 }}
                style={{ width: 2, height: h, background: color, borderRadius: 1, transformOrigin: 'bottom' }}
            />
        ))}
    </div>
));

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const VoiceCall = ({ sessionToken, userType, otherParticipant, isDarkMode = false }) => {
    const dk = isDarkMode;

    // Refs
    const deviceRef = useRef(null);
    const callRef = useRef(null);
    const timerRef = useRef(null);
    const initRef = useRef(false);
    const alive = useRef(true);

    // State
    const [cs, setCs] = useState(CS.IDLE);
    const [open, setOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [spkOff, setSpkOff] = useState(false);
    const [dur, setDur] = useState(0);
    const [callee, setCallee] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [incoming, setIncoming] = useState(null);

    const ring = useRingtone();

    const name = callee?.callee_name ?? otherParticipant?.name ?? otherParticipant?.full_name ?? (userType === 'user' ? 'Lawyer' : 'Client');
    const initials = (name || '??').split(' ').map(w => w?.[0] || '').join('').toUpperCase().slice(0, 2);
    const isActive = cs === CS.ACTIVE;
    const isInc = cs === CS.INCOMING;
    const isCalling = cs === CS.CALLING || cs === CS.RINGING;
    const busy = isActive || isInc || isCalling;

    useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

    // Duration timer
    useEffect(() => {
        if (isActive) {
            setDur(0);
            timerRef.current = setInterval(() => setDur(d => d + 1), 1000);
        } else clearInterval(timerRef.current);
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    // Vibrate on incoming
    useEffect(() => {
        let id;
        if (isInc && navigator.vibrate) id = setInterval(() => navigator.vibrate([350, 150, 350]), 1100);
        return () => { clearInterval(id); navigator.vibrate?.(0); };
    }, [isInc]);

    // Ringtone
    useEffect(() => { if (isInc) ring.play(); else ring.stop(); }, [isInc, ring]);

    /* ── Init Twilio ───────────────────────────────────────────────────────── */
    const initDevice = useCallback(async () => {
        if (initRef.current || !sessionToken) return;
        initRef.current = true;
        if (alive.current) setCs(CS.INIT);

        try {
            const Device = await loadTwilioSDK();
            if (!Device) { if (alive.current) { setErrMsg('Voice SDK unavailable'); setCs(CS.ERROR); } return; }

            let tok, ci;
            try {
                [tok, ci] = await Promise.all([
                    voiceCallAPI.getToken(sessionToken),
                    voiceCallAPI.getCalleeInfo(sessionToken),
                ]);
            } catch (e) {
                if (alive.current) { setErrMsg('Could not connect to voice service'); setCs(CS.ERROR); }
                return;
            }
            if (!alive.current) return;
            if (!tok?.token) { setErrMsg('No voice token'); setCs(CS.ERROR); return; }
            setCallee(ci);

            const dev = new Device(tok.token, { logLevel: 'error', codecPreferences: ['opus', 'pcmu'], allowIncomingWhileBusy: false });
            dev.on('registered', () => { if (alive.current) setCs(CS.READY); });
            dev.on('error', e => { if (alive.current) { setErrMsg(safeMsg(e)); setCs(CS.ERROR); } });
            dev.on('incoming', call => {
                if (!alive.current) return;
                setIncoming(call); setCs(CS.INCOMING); setOpen(true);
                call.on('disconnect', () => { if (alive.current) { setCs(CS.READY); setIncoming(null); } });
                call.on('cancel', () => { if (alive.current) { setCs(CS.READY); setIncoming(null); setOpen(false); } });
            });
            dev.on('tokenWillExpire', async () => {
                try { const f = await voiceCallAPI.getToken(sessionToken); if (f?.token) dev.updateToken(f.token); } catch (_) { }
            });
            await dev.register();
            deviceRef.current = dev;
        } catch (err) {
            console.error('[Voice] init error:', err);
            if (alive.current) { setErrMsg(safeMsg(err)); setCs(CS.ERROR); }
        }
    }, [sessionToken]);

    useEffect(() => {
        initDevice();
        return () => {
            clearInterval(timerRef.current); ring.stop();
            try { callRef.current?.disconnect(); } catch (_) { }
            try { deviceRef.current?.destroy(); } catch (_) { }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Call actions ───────────────────────────────────────────────────────── */
    const startCall = useCallback(() => {
        if (!deviceRef.current || !callee) { setErrMsg('Voice not ready'); return; }
        setErrMsg(''); setCs(CS.CALLING); setOpen(true);
        (async () => {
            try {
                const c = await deviceRef.current.connect({ params: { To: callee.callee_identity } });
                callRef.current = c;
                c.on('ringing', () => { if (alive.current) setCs(CS.RINGING); });
                c.on('accept', () => { if (alive.current) setCs(CS.ACTIVE); });
                c.on('disconnect', () => { if (alive.current) { setCs(CS.READY); callRef.current = null; } });
                c.on('cancel', () => { if (alive.current) { setCs(CS.READY); callRef.current = null; } });
                c.on('error', e => { if (alive.current) { setErrMsg(safeMsg(e)); setCs(CS.ERROR); callRef.current = null; } });
            } catch (e) { if (alive.current) { setErrMsg(safeMsg(e)); setCs(CS.ERROR); } }
        })();
    }, [callee]);

    const accept = useCallback(() => {
        if (!incoming) return;
        try {
            incoming.accept(); callRef.current = incoming; setCs(CS.ACTIVE);
            incoming.on('disconnect', () => { if (alive.current) { setCs(CS.READY); callRef.current = null; setIncoming(null); } });
        } catch (e) { setErrMsg(safeMsg(e)); setCs(CS.ERROR); }
    }, [incoming]);

    const decline = useCallback(() => {
        try { incoming?.reject(); } catch (_) { }
        setIncoming(null); setCs(CS.READY); setOpen(false);
    }, [incoming]);

    const endCall = useCallback(() => {
        setCs(CS.ENDING);
        try { callRef.current?.disconnect(); } catch (_) { }
        callRef.current = null;
        try { incoming?.reject(); } catch (_) { }
        setTimeout(() => { if (alive.current) { setCs(CS.READY); setMuted(false); setSpkOff(false); setOpen(false); } }, 400);
    }, [incoming]);

    const toggleMute = useCallback(() => {
        if (!callRef.current) return;
        const n = !muted; try { callRef.current.mute(n); } catch (_) { } setMuted(n);
    }, [muted]);

    const retry = useCallback(() => {
        setCs(CS.IDLE); setErrMsg(''); initRef.current = false; initDevice();
    }, [initDevice]);

    /* ── Derived ───────────────────────────────────────────────────────────── */
    const statusLabel = {
        [CS.IDLE]: 'Available', [CS.INIT]: 'Connecting…', [CS.READY]: 'Ready to Call',
        [CS.CALLING]: 'Calling…', [CS.RINGING]: 'Ringing…', [CS.INCOMING]: 'Incoming Call',
        [CS.ACTIVE]: fmtDur(dur), [CS.ENDING]: 'Ending…', [CS.ERROR]: 'Unavailable',
    }[cs] || '';

    const stColor = {
        [CS.IDLE]: '#94a3b8', [CS.INIT]: '#f59e0b', [CS.READY]: '#10b981',
        [CS.CALLING]: '#818cf8', [CS.RINGING]: '#818cf8', [CS.INCOMING]: '#34d399',
        [CS.ACTIVE]: '#34d399', [CS.ENDING]: '#f87171', [CS.ERROR]: '#f87171',
    }[cs] || '#94a3b8';

    const avatarBg = isActive ? 'linear-gradient(135deg,#6366f1,#7c3aed)'
        : isInc ? 'linear-gradient(135deg,#10b981,#059669)'
            : isCalling ? 'linear-gradient(135deg,#6366f1,#818cf8)'
                : dk ? '#1e2035' : '#e2e8f0';
    const avatarColor = (isActive || isInc || isCalling) ? '#fff' : dk ? '#94a3b8' : '#64748b';

    /* ═════════════════════════════════════════════════════════════════════════
       RENDER
       ═════════════════════════════════════════════════════════════════════════ */

    // ── CALL BUTTON (in header bar) ──────────────────────────────────────────
    const triggerBtn = (
        <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
                if (cs === CS.READY && deviceRef.current && callee) startCall();
                else setOpen(true);
            }}
            title="Voice Call"
            style={{
                position: 'relative',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 5, height: 32, minWidth: 32,
                padding: '0 10px',
                borderRadius: 16, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 11, color: '#fff',
                background: isActive ? 'linear-gradient(135deg,#10b981,#059669)'
                    : isInc ? 'linear-gradient(135deg,#34d399,#10b981)'
                        : isCalling ? 'linear-gradient(135deg,#818cf8,#6366f1)'
                            : 'linear-gradient(135deg,#6366f1,#7c3aed)',
                boxShadow: (isActive || isInc) ? '0 2px 10px rgba(16,185,129,0.45)' : '0 2px 10px rgba(99,102,241,0.4)',
                flexShrink: 0, overflow: 'hidden',
            }}
        >
            {/* pulse ring on incoming/active */}
            {(isInc || isActive) && (
                <motion.span
                    animate={{ scale: [1, 2], opacity: [0.45, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: isInc ? 'rgba(52,211,153,0.5)' : 'rgba(16,185,129,0.4)' }}
                />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                {isActive ? <Phone size={13} /> : isInc ? (
                    <motion.span animate={{ y: [-1, 1, -1] }} transition={{ duration: 0.45, repeat: Infinity }}><PhoneIncoming size={13} /></motion.span>
                ) : isCalling ? (
                    <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.7, repeat: Infinity }}><PhoneCall size={13} /></motion.span>
                ) : <Phone size={13} />}
            </span>
            <span style={{ position: 'relative', zIndex: 1 }}>
                {isActive ? fmtDur(dur) : isInc ? 'Answer' : isCalling ? 'Calling' : 'Call'}
            </span>
            {isActive && <span style={{ position: 'relative', zIndex: 1, width: 5, height: 5, borderRadius: 3, background: '#fff', animation: 'pulse 1.5s infinite' }} />}
        </motion.button>
    );

    // ── CALL PANEL (portal to body) ──────────────────────────────────────────
    const panel = (
        <AnimatePresence>
            {open && createPortal(
                <motion.div
                    key="vc-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={e => { if (e.target === e.currentTarget && !busy) setOpen(false); }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                    }}
                >
                    <motion.div
                        key="vc-card"
                        initial={{ y: 40, opacity: 0, scale: 0.94 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 280,
                            borderRadius: 24,
                            overflow: 'hidden',
                            border: dk ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
                            background: dk ? '#12141f' : '#fff',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                        }}
                    >
                        {/* subtle top glow */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: 100, pointerEvents: 'none',
                            background: isActive
                                ? 'radial-gradient(ellipse at 50% -20%,rgba(16,185,129,0.22) 0%,transparent 70%)'
                                : isInc
                                    ? 'radial-gradient(ellipse at 50% -20%,rgba(52,211,153,0.22) 0%,transparent 70%)'
                                    : 'radial-gradient(ellipse at 50% -20%,rgba(99,102,241,0.18) 0%,transparent 70%)',
                        }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px 24px' }}>

                            {/* Close (only when idle) */}
                            {!busy && (
                                <button
                                    onClick={() => setOpen(false)}
                                    style={{
                                        position: 'absolute', top: 14, right: 14,
                                        width: 28, height: 28, borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: dk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                        border: 'none', cursor: 'pointer',
                                        color: dk ? '#64748b' : '#94a3b8',
                                    }}
                                ><X size={13} /></button>
                            )}

                            {/* Top label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16, opacity: 0.55 }}>
                                <Shield size={8} style={{ color: '#6366f1' }} />
                                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6366f1' }}>Encrypted Voice</span>
                            </div>

                            {/* Avatar */}
                            <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 12 }}>
                                {(isActive || isInc || isCalling) && <PulseRing color={isInc ? 'rgba(52,211,153,0.35)' : 'rgba(99,102,241,0.3)'} />}
                                <div style={{
                                    position: 'relative', zIndex: 1, width: 72, height: 72, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: avatarBg, color: avatarColor,
                                    fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
                                    boxShadow: (isActive || isInc || isCalling)
                                        ? '0 6px 24px rgba(99,102,241,0.35)'
                                        : dk ? '0 4px 12px rgba(0,0,0,0.35)' : '0 4px 12px rgba(0,0,0,0.06)',
                                }}>
                                    {initials}
                                </div>
                            </div>

                            {/* Name */}
                            <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', color: dk ? '#f1f5f9' : '#1e293b', marginBottom: 2, textAlign: 'center' }}>
                                {name}
                            </h3>
                            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: dk ? '#475569' : '#94a3b8', marginBottom: 10 }}>
                                {callee?.callee_role === 'lawyer' ? '⚖️ Advocate' : '👤 Client'}
                            </p>

                            {/* Status */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 18, marginBottom: 14 }}>
                                {isActive && <SoundBars color="#34d399" />}
                                <span style={{ fontSize: 12, fontWeight: 700, color: stColor, fontVariantNumeric: 'tabular-nums' }}>
                                    {statusLabel}
                                </span>
                                {isActive && <SoundBars color="#34d399" />}
                                {isCalling && (
                                    <span style={{ display: 'flex', gap: 3, marginLeft: 2 }}>
                                        {[0, 1, 2].map(i => (
                                            <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.22 }}
                                                style={{ width: 4, height: 4, borderRadius: 2, background: '#818cf8' }} />
                                        ))}
                                    </span>
                                )}
                            </div>

                            {/* Error */}
                            {errMsg && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '6px 12px', borderRadius: 10, width: '100%', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 500, marginBottom: 10,
                                    background: dk ? 'rgba(239,68,68,0.08)' : '#fef2f2', color: dk ? '#f87171' : '#dc2626',
                                }}>
                                    <WifiOff size={10} />
                                    <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{errMsg}</span>
                                </div>
                            )}

                            {/* Init spinner */}
                            {cs === CS.INIT && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '5px 12px', borderRadius: 8, marginBottom: 8,
                                    fontSize: 10, fontWeight: 500, color: dk ? '#94a3b8' : '#64748b',
                                    background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                }}>
                                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                        <Wifi size={10} />
                                    </motion.span>
                                    Initializing…
                                </div>
                            )}

                            {/* ──── INCOMING ───────────────────────────────────────── */}
                            {isInc && (
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginTop: 4 }}>
                                    {/* Decline */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                                            onClick={decline}
                                            style={{
                                                width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                                boxShadow: '0 4px 16px rgba(239,68,68,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                            <PhoneMissed size={20} color="#fff" />
                                        </motion.button>
                                        <span style={{ fontSize: 9, fontWeight: 600, color: dk ? '#94a3b8' : '#64748b' }}>Decline</span>
                                    </div>
                                    {/* Accept */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                                            onClick={accept}
                                            style={{
                                                width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                background: 'linear-gradient(135deg,#10b981,#059669)',
                                                boxShadow: '0 4px 16px rgba(16,185,129,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                            <motion.span animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                                <PhoneIncoming size={20} color="#fff" />
                                            </motion.span>
                                        </motion.button>
                                        <span style={{ fontSize: 9, fontWeight: 600, color: dk ? '#94a3b8' : '#64748b' }}>Answer</span>
                                    </div>
                                </div>
                            )}

                            {/* ──── ACTIVE / CALLING controls ──────────────────────── */}
                            {(isActive || isCalling) && (
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, width: '100%', justifyContent: 'center', marginTop: 2 }}>
                                    {/* Mute */}
                                    <Ctrls icon={muted ? MicOff : Mic} label={muted ? 'Unmute' : 'Mute'}
                                        active={muted} activeColor="#ef4444"
                                        disabled={!isActive} dk={dk} onClick={toggleMute} />
                                    {/* End */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
                                            onClick={endCall}
                                            style={{
                                                width: 54, height: 54, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                                boxShadow: '0 5px 22px rgba(239,68,68,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                            <PhoneOff size={22} color="#fff" />
                                        </motion.button>
                                        <span style={{ fontSize: 8, fontWeight: 600, color: '#ef4444' }}>End</span>
                                    </div>
                                    {/* Speaker */}
                                    <Ctrls icon={spkOff ? VolumeX : Volume2} label={spkOff ? 'Off' : 'Speaker'}
                                        active={spkOff} activeColor="#f59e0b"
                                        dk={dk} onClick={() => setSpkOff(s => !s)} />
                                </div>
                            )}

                            {/* ──── READY ────────────────────────────────────────── */}
                            {cs === CS.READY && (
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={startCall}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: 8, width: '100%', padding: '12px 0', borderRadius: 14,
                                            fontWeight: 700, fontSize: 13, color: '#fff', border: 'none', cursor: 'pointer',
                                            background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                                            boxShadow: '0 3px 18px rgba(99,102,241,0.45)',
                                        }}>
                                        <PhoneCall size={16} />
                                        Start Call
                                    </motion.button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#10b981' }}>
                                        <Wifi size={9} /> Connected
                                    </div>
                                </div>
                            )}

                            {/* ──── ERROR ────────────────────────────────────────── */}
                            {cs === CS.ERROR && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    onClick={retry}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 6, width: '100%', padding: '10px 0', borderRadius: 12,
                                        fontWeight: 700, fontSize: 11, color: '#fff', border: 'none', cursor: 'pointer',
                                        background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                                        boxShadow: '0 3px 14px rgba(99,102,241,0.35)',
                                    }}>
                                    <Wifi size={12} /> Retry
                                </motion.button>
                            )}

                            {/* Footer */}
                            <p style={{ fontSize: 7, fontWeight: 500, color: dk ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.35)', marginTop: 10, textAlign: 'center' }}>
                                End-to-end encrypted · MeraVakil Chambers
                            </p>
                        </div>
                    </motion.div>
                </motion.div>,
                document.body
            )}
        </AnimatePresence>
    );

    return <>{triggerBtn}{panel}</>;
};

/* ── Small Control Button Sub-component ────────────────────────────────── */
function Ctrls({ icon: Icon, label, active, activeColor, disabled, dk, onClick }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.button whileHover={!disabled ? { scale: 1.06 } : {}} whileTap={!disabled ? { scale: 0.92 } : {}}
                onClick={onClick} disabled={disabled}
                style={{
                    width: 42, height: 42, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${active ? (activeColor + '44') : dk ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
                    background: active ? (activeColor + '14') : dk ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    color: active ? activeColor : dk ? '#cbd5e1' : '#475569',
                    cursor: disabled ? 'default' : 'pointer',
                    opacity: disabled ? 0.35 : 1,
                }}>
                <Icon size={17} />
            </motion.button>
            <span style={{ fontSize: 8, fontWeight: 600, color: dk ? '#64748b' : '#94a3b8' }}>{label}</span>
        </div>
    );
}

export default VoiceCall;
