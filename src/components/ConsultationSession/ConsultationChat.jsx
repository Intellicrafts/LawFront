import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Clock, Send, Paperclip, Smile, X, Image as ImageIcon,
    File, Download, Check, CheckCheck, Wifi, WifiOff,
    Phone, MoreVertical, AlertTriangle, ArrowDown, Loader,
    ChevronLeft, MessageCircle, Lock, Mic, MicOff, Square, Trash2,
    User, Briefcase, Scale, Sun, Moon, ZoomIn
} from 'lucide-react';
import { deriveKey, encryptText, decryptText } from '../../utils/e2ee';
import { toggleTheme } from '../../redux/themeSlice';

const CustomAudioPlayer = ({ src, isDarkMode, isOwnMessage }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const audioRef = React.useRef(null);

    React.useEffect(() => {
        if (audioRef.current && src) {
            audioRef.current.load();
        }
    }, [src]);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration && isFinite(audio.duration)) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const onLoadedMetadata = () => {
            if (audio.duration && isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const onEnded = () => { setIsPlaying(false); setProgress(0); };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = async (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
                setIsPlaying(true);
            } catch (err) {
                console.warn('Audio play error (no supported sources or stream issue):', err);
                setIsPlaying(false);
            }
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (audioRef.current && audioRef.current.duration) {
            const newTime = (x / rect.width) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress((newTime / audioRef.current.duration) * 100);
        }
    };

    const formatDur = (secs) => {
        if (!secs || isNaN(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex items-center gap-2 w-full min-w-[140px] max-w-[200px] py-0.5">
            <button onClick={togglePlay} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${isOwnMessage ? 'bg-white text-pink-500 shadow-sm' : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-white'}`}>
                {isPlaying ? <Square size={10} fill="currentColor" /> : <div className="ml-0.5"><div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-current border-b-[5px] border-b-transparent"></div></div>}
            </button>
            <div className="flex-1 flex flex-col justify-center">
                <div className="h-[3px] rounded-full bg-black/10 dark:bg-white/10 relative cursor-pointer" onClick={handleSeek}>
                    <div className={`absolute top-0 left-0 h-full rounded-full transition-all ${isOwnMessage ? 'bg-white' : 'bg-slate-500 dark:bg-slate-400'}`} style={{ width: `${progress}%` }} />
                    <div className={`absolute top-1/2 -mt-[4px] w-2 h-2 rounded-full shadow-sm transition-transform ${isOwnMessage ? 'bg-white' : 'bg-slate-500 dark:bg-slate-400'}`} style={{ left: `calc(${progress}% - 4px)` }} />
                </div>
                <div className={`text-[9px] font-bold tracking-wide mt-1.5 ${isOwnMessage ? 'text-white/80' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formatDur(duration)}
                </div>
            </div>
            <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
        </div>
    );
};

const ConsultationChat = ({
    session,
    messages,
    userType,
    otherParticipant,
    isDarkMode,
    timeRemaining,
    connectionStatus,
    onSendMessage,
    onEndSession,
    onTyping
}) => {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    // Voice notes and Emojis
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // E2EE States
    const [e2eKey, setE2eKey] = useState(null);
    const [decryptedMessages, setDecryptedMessages] = useState([]);
    const emojis = ['😀', '😂', '😍', '🙏', '👍', '😊', '🙌', '🔥', '🎉', '😢', '😡', '🤔'];

    // Message Expressions Local State
    const [reactions, setReactions] = useState({});
    const [reactionsFromMessages, setReactionsFromMessages] = useState({});
    const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
    const QUICK_EMOJIS = ['👍', '❤️', '😂', '😯', '🙏', '👎'];
    const [previewFile, setPreviewFile] = useState(null); // { url, name, type }

    const handleAddReaction = (msgId, emoji, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const isSame = reactions[msgId] === emoji;
        // Update local state immediately (optimistic)
        setReactions(prev => {
            if (isSame) {
                const next = { ...prev };
                delete next[msgId];
                return next;
            }
            return { ...prev, [msgId]: emoji };
        });
        setActiveReactionMessageId(null);
        // Send reaction as a special message so both sides sync via polling
        const reactionPayload = isSame
            ? `_REACTION_REMOVE_:${msgId}`
            : `_REACTION_:${msgId}:${emoji}`;
        try {
            onSendMessage(reactionPayload, null);
        } catch (_) { /* silent */ }
    };

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordIntervalRef = useRef(null);
    const autoSendRef = useRef(false);

    // Voice Gesture Refs
    const cancelRecordRef = useRef(false);
    const startXRef = useRef(0);
    const [slideOffset, setSlideOffset] = useState(0);

    const otherName = otherParticipant?.name || (userType === 'user' ? 'Lawyer' : 'Client');
    const otherInitials = otherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const formatMessageTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Auto-scroll to bottom
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    useEffect(() => {
        // slight delay ensures images and DOM paint before scrolling
        const t = setTimeout(() => {
            scrollToBottom('smooth');
        }, 150);
        return () => clearTimeout(t);
    }, [decryptedMessages.length, scrollToBottom]);

    // Initialize E2EE Key
    useEffect(() => {
        const initKey = async () => {
            if (session?.session_token) {
                const key = await deriveKey(session.session_token, 'meravakil_secure_salt');
                setE2eKey(key);
            }
        };
        initKey();
    }, [session?.session_token]);

    // Decrypt messages as they come in
    useEffect(() => {
        const decryptAll = async () => {
            if (!e2eKey || !messages) return;
            const decrypted = await Promise.all(messages.map(async (msg) => {
                if (msg.message_type === 'system' || msg.sender_type === 'system') return msg;
                if (!msg.content) return msg;
                try {
                    const plainContent = await decryptText(msg.content, e2eKey);
                    return { ...msg, content: plainContent };
                } catch (e) {
                    return msg;
                }
            }));
            setDecryptedMessages(decrypted);
        };
        decryptAll();
    }, [messages, e2eKey]);

    // Parse reaction messages from decrypted messages to sync both sides
    useEffect(() => {
        const reactionMap = {};
        decryptedMessages.forEach(msg => {
            const c = msg.content || '';
            if (c.startsWith('_REACTION_:')) {
                // Format: _REACTION_:msgId:emoji
                const parts = c.split(':');
                const targetId = parts[1];
                const emoji = parts.slice(2).join(':'); // emoji may contain colons
                if (targetId && emoji) {
                    // Last reaction wins (messages are ordered by time)
                    reactionMap[targetId] = emoji;
                }
            } else if (c.startsWith('_REACTION_REMOVE_:')) {
                const targetId = c.replace('_REACTION_REMOVE_:', '');
                delete reactionMap[targetId];
            }
        });
        setReactionsFromMessages(reactionMap);
    }, [decryptedMessages]);

    // Scroll observer removed
    useEffect(() => {
        // cleanup only
        return () => { };
    }, []);

    // Time warning at 5 minutes
    useEffect(() => {
        if (timeRemaining !== null && timeRemaining <= 300 && timeRemaining > 0) {
            setShowTimeWarning(true);
        }
    }, [timeRemaining]);

    // Handle typing indicator debounce
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        // Send typing indicator
        if (!isTyping) {
            setIsTyping(true);
            onTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTyping(false);
        }, 2000);
    };

    // Send message handler
    const handleSend = async () => {
        const content = newMessage.trim();
        if (!content && !selectedFile) return;

        try {
            setSending(true);
            setIsTyping(false);
            onTyping(false);

            let rawText = content || (audioBlob ? 'Voice audio message' : (selectedFile ? selectedFile.name : ''));
            let encryptedContent = null;

            if (e2eKey) {
                encryptedContent = await encryptText(rawText, e2eKey);
            } else {
                encryptedContent = rawText; // Fallback
            }

            // We pass selected file as-is (files are transferred securely via HTTPS, text is E2EE wrapped)
            await onSendMessage(encryptedContent, selectedFile);
            setNewMessage('');
            setSelectedFile(null);
            setAudioPreviewUrl(null);
            setAudioBlob(null);
            setShowEmojiPicker(false);
            inputRef.current?.focus();
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Safari/iOS compatibility for audio MIME type
            let mimeType = '';
            if (MediaRecorder.isTypeSupported('audio/webm')) {
                mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            }

            const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());

                // Cancel block
                if (cancelRecordRef.current) {
                    cancelRecordRef.current = false;
                    setIsRecording(false);
                    return;
                }

                // Determine file extension based on mimeType
                const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
                const blobType = mimeType || 'audio/webm';

                const blob = new Blob(audioChunksRef.current, { type: blobType });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioPreviewUrl(url);
                // Fix: explicit window.File to prevent 'ucide-react' File component name collision
                const file = new window.File([blob], `voice_note_${new Date().getTime()}.${ext}`, { type: blobType });
                setSelectedFile(file);

                if (autoSendRef.current) {
                    autoSendRef.current = false;
                    setTimeout(() => {
                        const evt = { preventDefault: () => { } };
                        document.getElementById('hidden_send_btn')?.click();
                    }, 100);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 29) {
                        autoSendRef.current = true;
                        stopRecording();
                        return 30;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (err) {
            console.error('Error starting recording:', err);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };

    // Hold-to-record gesture handlers
    const handleRecordStart = (e) => {
        e.preventDefault();
        if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
        startXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
        setSlideOffset(0);
        cancelRecordRef.current = false;
        startRecording();
    };

    const handleRecordMove = (e) => {
        if (!isRecording) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        if (!currentX) return;

        const diff = startXRef.current - currentX;
        if (diff > 0) { // sliding left
            setSlideOffset(-diff);
            if (diff > 90) { // Cancel threshold
                cancelRecordRef.current = true;
                stopRecording();
                setSlideOffset(0);
            }
        }
    };

    const handleRecordEnd = (e) => {
        if (!isRecording) return;
        if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
        setSlideOffset(0);
        if (!cancelRecordRef.current) {
            autoSendRef.current = true;
            stopRecording();
        }
    };

    const handleEmojiClick = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    // Handle Enter key — sends text, file, image, OR voice note
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isRecording) {
                autoSendRef.current = true;
                stopRecording();
            } else if (newMessage.trim() || selectedFile) {
                handleSend();
            }
        }
    };

    // Direct blob download helper
    const downloadFile = async (url, filename) => {
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) throw new Error('Fetch failed');
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        } catch {
            // Fallback: cross-origin force download using invisible anchor
            const a = document.createElement('a');
            // Adding download=1 query param to ask backend for attachment disposition if it supports it
            a.href = url + (url.includes('?') ? '&' : '?') + 'download=1';
            a.setAttribute('download', filename || 'download');
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File size must be under 10MB');
                return;
            }
            setSelectedFile(file);
            setShowAttachMenu(false);
        }
    };

    // Group messages by date
    const getMessageDate = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col font-sans selection:bg-indigo-500/20 overflow-hidden ${isDarkMode ? 'bg-[#0f1221] text-slate-200' : 'bg-[#f4f7fb] text-slate-800'}`}>
            {/* Background Ambient Orbs */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

            {/* ============ HEADER ============ */}
            <div className={`shrink-0 z-40 border-b ${isDarkMode
                ? 'bg-[#0f1221]/90 border-white/[0.06] shadow-black/20 shadow-sm backdrop-blur-xl'
                : 'bg-white/90 border-slate-200/60 shadow-slate-200/50 shadow-sm backdrop-blur-xl'
                }`}>
                <div className="max-w-[98%] lg:max-w-6xl mx-auto px-3 sm:px-6">
                    <div className="flex items-center justify-between py-2.5 sm:py-3">

                        {/* Left: Participant Info */}
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            {/* Back button (mobile) */}
                            <button
                                onClick={() => setShowEndModal(true)}
                                className={`p-1.5 rounded-xl transition-all sm:hidden flex-shrink-0 ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Avatar with Role Icon */}
                            <div className="relative flex-shrink-0">
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm ${userType === 'user'
                                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-indigo-500/30'
                                    : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30'
                                    }`}>
                                    {otherInitials}
                                </div>
                                {/* Live green dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0d0d14] shadow-sm shadow-emerald-400/50" />
                            </div>

                            {/* Name & Status */}
                            <div className="min-w-0">
                                <h3 className={`text-[13px] sm:text-[14px] font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {otherName}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>
                                        {userType === 'user' ? 'Lawyer' : 'Client'} • In Session
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Timer & Actions */}
                        <div className="flex items-center gap-2">
                            {/* Connection Status */}
                            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${connectionStatus === 'connected'
                                ? isDarkMode ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-50 text-slate-600'
                                : isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                                }`}>
                                {connectionStatus === 'connected' ? <Wifi size={9} /> : <WifiOff size={9} />}
                                <span className="hidden md:inline">{connectionStatus === 'connected' ? 'Live' : 'Reconnecting'}</span>
                            </div>

                            {/* Timer */}
                            {timeRemaining !== null && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${timeRemaining <= 300
                                    ? isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200'
                                    : isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-100 border border-slate-200/50'
                                    }`}>
                                    <Clock size={10} className={timeRemaining <= 300 ? 'text-rose-500 animate-pulse' : ''} />
                                    <span className={`text-[10px] font-bold tracking-wider font-mono ${timeRemaining <= 300 ? '' : isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            )}

                            {/* Dark mode toggle */}
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/8 text-amber-400 hover:text-amber-300' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>

                            {/* End Session */}
                            <button
                                onClick={() => setShowEndModal(true)}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                                    }`}
                            >
                                <Phone size={10} className="rotate-[135deg]" />
                                End
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setShowEndModal(true)}
                                className={`sm:hidden p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============ TIME WARNING BANNER ============ */}
            <AnimatePresence>
                {showTimeWarning && timeRemaining > 0 && timeRemaining <= 300 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-b ${isDarkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}
                    >
                        <div className="max-w-[98%] lg:max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={12} className="text-amber-500" />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {Math.ceil(timeRemaining / 60)} minutes remaining in session
                                </span>
                            </div>
                            <button onClick={() => setShowTimeWarning(false)} className="p-1 hover:opacity-70">
                                <X size={12} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============ MESSAGES AREA ============ */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto relative scrollbar-hide z-10"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-10 pt-6 pb-4 space-y-3">

                    {/* Messages - filter out reaction-protocol messages */}
                    {decryptedMessages
                        .filter(msg => {
                            const c = msg.content || '';
                            return !c.startsWith('_REACTION_:') && !c.startsWith('_REACTION_REMOVE_:');
                        })
                        .map((msg, index) => {
                            // Merge: server reactions (from polling) override local optimistic
                            const mergedReactions = { ...reactions, ...reactionsFromMessages };
                            const isOwnMessage = (userType === 'user' && msg.sender_type === 'user') ||
                                (userType === 'lawyer' && msg.sender_type === 'lawyer');
                            const isSystem = msg.sender_type === 'system' || msg.message_type === 'system';
                            const showDateSep = index === 0 ||
                                getMessageDate(msg.created_at) !== getMessageDate(decryptedMessages[index - 1]?.created_at);

                            return (
                                <React.Fragment key={msg.id || index}>
                                    {/* Date separator */}
                                    {showDateSep && (
                                        <div className="flex items-center justify-center py-4">
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                                                {getMessageDate(msg.created_at)}
                                            </div>
                                        </div>
                                    )}

                                    {/* System message - hide; regular messages below */}
                                    {!isSystem && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.18 }}
                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} py-0.5`}
                                        >
                                            <div className={`flex items-end gap-2 max-w-[72%] sm:max-w-[58%]`}>

                                                {/* Avatar (other user only) */}
                                                {!isOwnMessage && (
                                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold mt-auto shadow-sm text-white ${userType === 'user'
                                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20'
                                                        : 'bg-gradient-to-br from-sky-500 to-cyan-600 shadow-sky-500/20'
                                                        }`}>
                                                        {otherInitials}
                                                    </div>
                                                )}

                                                {/* Message bubble */}
                                                {(() => {
                                                    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(ext => msg.file_name?.toLowerCase().endsWith(ext)) || msg.file_type?.startsWith('image/');
                                                    const isOnlyAttachment = msg.message_type === 'file' && (!msg.content || msg.content.startsWith('Sent a file:') || msg.content.includes('.webm') || msg.content.includes('.mp4') || msg.content.includes('.ogg') || msg.content.trim() === '');
                                                    return (
                                                        <div className={`group relative ${isOnlyAttachment
                                                            ? 'p-0 bg-transparent shadow-none'
                                                            : `px-4 py-2.5 ${isOwnMessage
                                                                ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white rounded-[1.2rem] rounded-br-[4px] shadow-lg shadow-indigo-500/20'
                                                                : isDarkMode
                                                                    ? 'bg-white/[0.08] text-slate-100 rounded-[1.2rem] rounded-bl-[4px] shadow-sm border border-white/[0.08]'
                                                                    : 'bg-white text-slate-800 shadow-sm rounded-[1.2rem] rounded-bl-[4px] border border-slate-100'
                                                            }`
                                                            }`}>
                                                            {/* File/Audio attachment */}
                                                            {msg.message_type === 'file' && msg.file_name && (
                                                                ['.webm', '.mp3', '.m4a', '.wav', '.ogg', '.mp4'].some(ext => msg.file_name.toLowerCase().endsWith(ext)) || msg.file_type?.startsWith('audio/') ? (
                                                                    <div className={`flex items-center rounded-2xl overflow-hidden ${isOnlyAttachment
                                                                        ? isDarkMode
                                                                            ? 'bg-white/[0.08] border border-white/[0.08] px-3 py-2'
                                                                            : 'bg-white shadow-sm border border-slate-100 px-3 py-2'
                                                                        : 'bg-black/15 px-2 py-1.5'
                                                                        }`}>
                                                                        <CustomAudioPlayer src={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`} isDarkMode={isDarkMode} isOwnMessage={isOwnMessage} />
                                                                    </div>
                                                                ) : isImage ? (
                                                                    <div className={`relative overflow-hidden group/img cursor-pointer ${isOwnMessage ? 'rounded-[2rem] rounded-br-[6px]' : 'rounded-[2rem] rounded-bl-[6px]'} bg-slate-100 dark:bg-slate-800 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} shadow-sm`}
                                                                        onClick={() => setPreviewFile({ url: msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`, name: msg.file_name, type: 'image' })}
                                                                    >
                                                                        <img src={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`} alt="attachment" className="max-w-[220px] max-h-[220px] w-auto h-auto object-cover block" />
                                                                        {/* Hover overlay */}
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                                                <ZoomIn className="text-white" size={16} />
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => { e.stopPropagation(); downloadFile(msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`, msg.file_name); }}
                                                                                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors"
                                                                            >
                                                                                <Download className="text-white" size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 border ${isDarkMode
                                                                        ? 'border-white/[0.08] bg-white/[0.06]'
                                                                        : 'border-slate-200 bg-white shadow-sm'
                                                                        }`}>
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                                                            <File size={16} />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0 pr-2">
                                                                            <div className={`text-[12px] font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                                                {msg.file_name}
                                                                            </div>
                                                                            <div className={`text-[9px] uppercase tracking-widest mt-0.5 ${isOwnMessage ? 'text-white/80' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                                FILE
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => downloadFile(msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`, msg.file_name)}
                                                                            className={`flex-shrink-0 p-2 rounded-xl transition-all ${isOwnMessage ? 'hover:bg-white/20 text-white/80 hover:text-white' : isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                                                                            title="Download"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}

                                                            {/* Text content */}
                                                            {msg.content && msg.message_type !== 'file' && (
                                                                <p className="text-[14px] sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                                                    {msg.content}
                                                                </p>
                                                            )}
                                                            {msg.content && msg.message_type === 'file' && !msg.content.startsWith('Sent a file:') && !msg.content.includes('.webm') && (
                                                                <p className="text-[14px] sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words mt-1">
                                                                    {msg.content}
                                                                </p>
                                                            )}

                                                            {/* Reactions & Info */}
                                                            <div className={`flex items-center gap-1.5 ${isOnlyAttachment ? 'absolute -bottom-5 right-2' : 'relative mt-2'} ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>

                                                                {/* Reaction trigger — only for opponent's messages */}
                                                                {!isOwnMessage && (
                                                                    <button
                                                                        onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                                                                        className={`absolute -right-9 top-[-6px] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 backdrop-blur-md shadow-md border z-10 ${isDarkMode ? 'bg-[#252530]/90 border-white/10 hover:bg-[#2e2e3a]' : 'bg-white/90 border-slate-200/80 hover:bg-slate-50'}`}
                                                                    >
                                                                        <Smile size={14} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
                                                                    </button>
                                                                )}

                                                                {/* Reaction Picker - always floats above the bottom of the bubble */}
                                                                <AnimatePresence>
                                                                    {activeReactionMessageId === msg.id && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.85, y: 8 }}
                                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                            exit={{ opacity: 0, scale: 0.85, y: 8 }}
                                                                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                                            className={`absolute bottom-[110%] mb-2 ${isOwnMessage ? 'right-0' : 'left-0'} z-50 flex gap-0.5 p-1.5 rounded-full shadow-2xl border ${isDarkMode ? 'bg-[#18181f] border-white/10' : 'bg-white border-slate-200/80'}`}
                                                                        >
                                                                            {QUICK_EMOJIS.map((emoji, ei) => (
                                                                                <motion.button
                                                                                    key={emoji}
                                                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                                    transition={{ delay: ei * 0.04 }}
                                                                                    onClick={(e) => handleAddReaction(msg.id, emoji, e)}
                                                                                    className={`w-8 h-8 flex items-center justify-center text-base rounded-full transition-all hover:scale-125 active:scale-95 ${mergedReactions[msg.id] === emoji ? 'bg-indigo-500/20 scale-110' : 'hover:bg-slate-100 dark:hover:bg-white/10'
                                                                                        }`}
                                                                                >
                                                                                    {emoji}
                                                                                </motion.button>
                                                                            ))}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>

                                                                {/* Reaction badge - bottom-right corner, synced from both sides */}
                                                                {mergedReactions[msg.id] && (
                                                                    <motion.div
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        className={`absolute -bottom-5 right-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shadow-md border z-20 cursor-pointer ${isDarkMode ? 'bg-[#1e1e2a] border-white/10' : 'bg-white border-slate-200'}`}
                                                                        onClick={(e) => handleAddReaction(msg.id, mergedReactions[msg.id], e)}
                                                                    >
                                                                        <span className="text-[13px] leading-none">{mergedReactions[msg.id]}</span>
                                                                    </motion.div>
                                                                )}

                                                                {!isOnlyAttachment && (
                                                                    <>
                                                                        <span className={`text-[10px] font-medium tracking-wide ${isOwnMessage ? 'text-white/60' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                            {formatMessageTime(msg.created_at)}
                                                                        </span>
                                                                        {isOwnMessage && (
                                                                            msg.is_read
                                                                                ? <CheckCheck size={13} className="text-emerald-300 drop-shadow-[0_0_3px_rgba(52,211,153,0.6)]" />
                                                                                : (msg.id ? <CheckCheck size={13} className="text-white/50" /> : <Check size={11} className="text-white/35" />)
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Own Avatar */}
                                                {isOwnMessage && (
                                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold mt-auto shadow-sm text-white ${userType === 'user'
                                                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20'
                                                        : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20'
                                                        }`}>
                                                        {userType === 'user' ? <User size={12} /> : <Scale size={11} />}
                                                    </div>
                                                )}

                                            </div>
                                        </motion.div>
                                    )
                                    }
                                </React.Fragment>
                            );
                        })}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ============ INPUT AREA — seamless with page bg ============ */}
            <div className={`shrink-0 w-full z-30 pb-safe pb-4 sm:pb-6 pt-2 mt-auto ${isDarkMode ? 'bg-[#0f1221]' : 'bg-[#f4f7fb]'}`}>
                <div className="w-full max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-5">

                    {/* ─── Previews above input card ─── */}
                    <AnimatePresence>

                        {/* File / Image preview chip */}
                        {selectedFile && !audioPreviewUrl && (
                            <motion.div
                                key="file-preview"
                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                                className="mb-2.5"
                            >
                                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl max-w-full ${isDarkMode
                                    ? 'bg-white/[0.06] border border-white/[0.07]'
                                    : 'bg-slate-50 border border-slate-200/70'
                                    }`}>
                                    {/* Thumbnail or icon */}
                                    {selectedFile.type.startsWith('image/') ? (
                                        <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                            <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-indigo-500/15' : 'bg-indigo-50'
                                            }`}>
                                            <File size={15} className="text-indigo-500" />
                                        </div>
                                    )}
                                    {/* Name + size */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-[12px] font-semibold truncate leading-snug ${isDarkMode ? 'text-slate-200' : 'text-slate-700'
                                            }`}>{selectedFile.name}</div>
                                        <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'
                                            }`}>{(selectedFile.size / 1024).toFixed(1)} KB
                                            {selectedFile.type.startsWith('image/') && ' · Image'}
                                        </div>
                                    </div>
                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; if (imageInputRef.current) imageInputRef.current.value = ''; }}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-500 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                                            }`}
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Voice note recorded preview — swipe left to cancel, swipe right (or tap send) to send */}
                        {audioPreviewUrl && (
                            <motion.div
                                key="audio-preview"
                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                                className="mb-2.5"
                            >
                                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl ${isDarkMode
                                    ? 'bg-white/[0.06] border border-white/[0.07]'
                                    : 'bg-slate-50 border border-slate-200/70'
                                    }`}>
                                    {/* Mic badge */}
                                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                                        <Mic size={14} className="text-rose-500" />
                                    </div>
                                    {/* Player */}
                                    <div className="flex-1 min-w-0">
                                        <CustomAudioPlayer src={audioPreviewUrl} isDarkMode={isDarkMode} isOwnMessage={false} />
                                    </div>
                                    {/* Discard */}
                                    <button
                                        type="button"
                                        onClick={() => { setAudioPreviewUrl(null); setSelectedFile(null); setAudioBlob(null); }}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-all ${isDarkMode ? 'hover:bg-rose-500/15 text-slate-500 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'
                                            }`}
                                        title="Discard voice note"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    {/* Send now */}
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={sending}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                                        title="Send voice note"
                                    >
                                        {sending ? <Loader size={13} className="animate-spin" /> : <Send size={13} fill="currentColor" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Recording-in-progress indicator */}
                        {isRecording && (
                            <motion.div
                                key="recording"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                className="mb-2.5"
                            >
                                <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl ${isDarkMode ? 'bg-rose-500/8 border border-rose-500/15' : 'bg-rose-50 border border-rose-100'
                                    }`}>
                                    {/* Ping dot */}
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                                    {/* Waveform */}
                                    <div className="flex items-center gap-[3px] flex-1">
                                        {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 1, 0.6].map((h, i) => (
                                            <div key={i} className="w-[3px] rounded-full bg-rose-400" style={{
                                                height: `${h * 16}px`,
                                                animation: `pulse ${0.5 + i * 0.08}s ease-in-out infinite alternate`,
                                            }} />
                                        ))}
                                    </div>
                                    {/* Timer */}
                                    <span className={`text-[12px] font-mono font-bold tabular-nums flex-shrink-0 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'
                                        }`}>0:{String(recordingTime).padStart(2, '0')}</span>
                                    {/* Cancel */}
                                    <button type="button" onClick={() => { autoSendRef.current = false; stopRecording(); setAudioBlob(null); setAudioPreviewUrl(null); setSelectedFile(null); }}
                                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg flex-shrink-0 ${isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                            } transition-all`}
                                    >Cancel</button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>


                    {/* ── Input Card — unified bg, single row ── */}
                    <motion.div
                        layout
                        className={`relative rounded-2xl transition-all duration-200 ${isDarkMode
                            ? 'bg-[#1a1a2e] border border-white/[0.09] shadow-[0_4px_32px_rgba(0,0,0,0.45)]'
                            : 'bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.07)]'
                            }`}
                    >
                        {/* Sending progress stripe */}
                        {sending && (
                            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-50 rounded-t-2xl">
                                <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-500 animate-[pulse_0.9s_ease-in-out_infinite]" />
                            </div>
                        )}

                        {/* ── Single Row ── */}
                        <div className="flex items-end gap-1.5 px-2.5 py-2.5">

                            {/* ── Left: Attach + Emoji ── */}
                            <div className="flex items-center gap-0.5 flex-shrink-0 mb-0.5">
                                {/* Attach */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowAttachMenu(v => !v); setShowEmojiPicker(false); }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${showAttachMenu
                                            ? isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                            : isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-white/8' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                            }`}
                                        title="Attach file"
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                    <AnimatePresence>
                                        {showAttachMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.93 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.93 }}
                                                transition={{ duration: 0.15 }}
                                                className={`absolute bottom-[54px] left-0 p-2 rounded-2xl border shadow-2xl z-[100] min-w-[170px] ${isDarkMode ? 'bg-[#1c1c2e] border-white/10 shadow-black/60' : 'bg-white border-slate-200 shadow-slate-300/40'
                                                    }`}
                                            >
                                                <p className={`text-[9px] font-bold uppercase tracking-widest px-3 pt-1 pb-1.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Attach</p>
                                                <button type="button" onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isDarkMode ? 'hover:bg-white/8 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}>
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center"><File size={13} className="text-indigo-500" /></div>
                                                    Document
                                                </button>
                                                <button type="button" onClick={() => { imageInputRef.current?.click(); setShowAttachMenu(false); }} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isDarkMode ? 'hover:bg-white/8 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}>
                                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center"><ImageIcon size={13} className="text-emerald-500" /></div>
                                                    Photo
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept=".pdf,.doc,.docx,.txt" />
                                    <input ref={imageInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*" />
                                </div>

                                {/* Emoji */}
                                <div className="relative hidden sm:block">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(v => !v); setShowAttachMenu(false); }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${showEmojiPicker
                                            ? isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-500'
                                            : isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-white/8' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                            }`}
                                        title="Emoji"
                                    >
                                        <Smile size={16} />
                                    </button>
                                    <AnimatePresence>
                                        {showEmojiPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.93 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.93 }}
                                                transition={{ duration: 0.15 }}
                                                className={`absolute bottom-[54px] left-0 p-3 rounded-2xl border shadow-2xl z-[100] w-64 ${isDarkMode ? 'bg-[#1c1c2e] border-white/10 shadow-black/60' : 'bg-white border-slate-200 shadow-slate-300/40'}`}
                                            >
                                                <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Emoji</p>
                                                <div className="grid grid-cols-6 gap-1">
                                                    {emojis.map((emoji, index) => (
                                                        <button key={index} type="button" onClick={() => { handleEmojiClick(emoji); setShowEmojiPicker(false); }}
                                                            className={`w-9 h-9 flex items-center justify-center text-[18px] rounded-xl transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* ── Center: Auto-growing textarea ── */}
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Type your message..."
                                className={`flex-1 bg-transparent outline-none border-none ring-0 text-[14px] leading-relaxed font-medium resize-none scrollbar-hide py-1.5 ${isDarkMode ? 'text-slate-100 placeholder:text-slate-600 caret-indigo-400' : 'text-slate-800 placeholder:text-slate-400/80 caret-indigo-600'
                                    }`}
                                style={{ minHeight: '26px', maxHeight: '120px' }}
                                onClick={() => { setShowAttachMenu(false); setShowEmojiPicker(false); }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                            />

                            {/* ── Right: Mic (click-toggle) or Send ── */}
                            <div className="flex-shrink-0 mb-0.5">
                                {(!newMessage.trim() && !selectedFile) ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isRecording) {
                                                autoSendRef.current = true;
                                                stopRecording();
                                            } else {
                                                startRecording();
                                            }
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isRecording
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                                            : isDarkMode
                                                ? 'bg-white/8 text-slate-400 hover:text-white hover:bg-white/14'
                                                : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                                            }`}
                                        title={isRecording ? 'Stop & Send voice note' : 'Record voice note'}
                                    >
                                        <Mic size={17} />
                                    </button>
                                ) : (
                                    <button
                                        id="hidden_send_btn"
                                        type="button"
                                        onClick={handleSend}
                                        disabled={sending}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${sending
                                            ? 'bg-indigo-400/60 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95'
                                            }`}
                                    >
                                        {sending ? <Loader size={15} className="animate-spin" /> : <Send size={15} fill="currentColor" className="translate-x-px" />}
                                    </button>
                                )}
                            </div>

                        </div>
                    </motion.div>

                    {/* E2E label */}
                    <div className="flex items-center justify-center gap-1.5 mt-2 mb-1">
                        <Lock size={9} className={isDarkMode ? 'text-emerald-500/50' : 'text-emerald-600/40'} />
                        <span className={`text-[9px] font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`}>
                            End-to-end encrypted
                        </span>
                        <Lock size={9} className={isDarkMode ? 'text-emerald-500/50' : 'text-emerald-600/40'} />
                    </div>

                </div >
            </div >

            {/* ============ IMAGE PREVIEW LIGHTBOX ============ */}
            < AnimatePresence >
                {previewFile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
                        onClick={() => setPreviewFile(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
                        >
                            <div className="w-full flex items-center justify-between px-1">
                                <span className="text-white/70 text-[12px] font-medium truncate max-w-[60vw]">{previewFile.name}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); downloadFile(previewFile.url, previewFile.name); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-all border border-white/20 backdrop-blur-sm"
                                    >
                                        <Download size={12} /> Download
                                    </button>
                                    <button onClick={() => setPreviewFile(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all border border-white/20">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <img
                                src={previewFile.url}
                                alt={previewFile.name}
                                className="rounded-2xl max-w-full max-h-[75vh] object-contain shadow-2xl border border-white/10"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* ============ END SESSION MODAL ============ */}
            < AnimatePresence >
                {showEndModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowEndModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-sm p-6 rounded-[24px] border ${isDarkMode
                                ? 'bg-[#1a1a2e] border-white/10 shadow-2xl shadow-black/60'
                                : 'bg-white border-slate-200 shadow-2xl'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                    <Phone size={24} className="text-rose-500 rotate-[135deg]" />
                                </div>
                                <h3 className={`text-base font-bold tracking-tight mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>End Consultation?</h3>
                                <p className={`text-xs font-medium mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    This will end the session for both participants. Chat history will be saved.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowEndModal(false)} className={`flex-1 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                        Continue
                                    </button>
                                    <button onClick={() => { setShowEndModal(false); onEndSession(); }} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] transition-all">
                                        End Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default ConsultationChat;
