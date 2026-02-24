import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Clock, Send, Paperclip, Smile, X, Image as ImageIcon,
    File, Download, Check, CheckCheck, Wifi, WifiOff,
    Phone, MoreVertical, AlertTriangle, ArrowDown, Loader,
    ChevronLeft, MessageCircle, Lock, Mic, Square, Trash2
} from 'lucide-react';
import { deriveKey, encryptText, decryptText } from '../../utils/e2ee';

const CustomAudioPlayer = ({ src, isDarkMode, isOwnMessage }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const audioRef = React.useRef(null);

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

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play(); setIsPlaying(true); }
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
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
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
    const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
    const QUICK_EMOJIS = ['👍', '❤️', '😂', '😯', '🙏', '👎'];

    const handleAddReaction = (msgId, emoji, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setReactions(prev => {
            const msgReactions = prev[msgId] || [];
            if (msgReactions.includes(emoji)) {
                return { ...prev, [msgId]: msgReactions.filter(r => r !== emoji) };
            }
            return { ...prev, [msgId]: [...msgReactions, emoji] };
        });
        setActiveReactionMessageId(null);
    };

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordIntervalRef = useRef(null);
    const autoSendRef = useRef(false);

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
        scrollToBottom('instant');
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

    // Scroll observer for "scroll to bottom" button
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
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
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioPreviewUrl(url);
                // Fix: explicit window.File to prevent 'ucide-react' File component name collision
                const file = new window.File([blob], `voice_note_${new Date().getTime()}.webm`, { type: 'audio/webm' });
                setSelectedFile(file);
                stream.getTracks().forEach(track => track.stop());

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

    const handleEmojiClick = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isRecording) {
                autoSendRef.current = true;
                stopRecording();
            } else {
                handleSend();
            }
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
        <div className={`h-screen flex flex-col font-sans selection:bg-slate-500/30 overflow-hidden ${isDarkMode ? 'bg-dark-bg text-slate-200' : 'bg-[#f4f7fb] text-slate-800'}`}>
            {/* Background Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* ============ HEADER ============ */}
            <div className={`sticky top-0 z-40 backdrop-blur-2xl border-b shadow-sm ${isDarkMode ? 'bg-dark-bg/70 border-white/5' : 'bg-white/70 border-slate-200/60'}`}>
                <div className="max-w-[98%] lg:max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between py-3">

                        {/* Left: Participant Info */}
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Back button (mobile) */}
                            <button
                                onClick={() => setShowEndModal(true)}
                                className={`p-2 rounded-xl transition-all sm:hidden ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${isDarkMode
                                    ? 'bg-gradient-to-br from-slate-500/20 to-slate-400/20 text-slate-400 border border-slate-500/20'
                                    : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border border-slate-200/50'
                                    }`}>
                                    {otherInitials}
                                </div>
                                {/* Online dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-500 border-2 border-white dark:border-[#080808]" />
                            </div>

                            {/* Name & Status */}
                            <div className="min-w-0">
                                <h3 className={`text-[13px] font-bold tracking-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    {otherName}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                                    <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDarkMode ? 'text-slate-400/70' : 'text-slate-600/70'}`}>
                                        Online • In Session
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
                className="flex-1 overflow-y-auto relative scrollbar-hide pb-4 z-10"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="max-w-[95%] lg:max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-4">

                    {/* Messages */}
                    {decryptedMessages.map((msg, index) => {
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

                                {/* System message */}
                                {isSystem ? (
                                    <div className="flex justify-center py-2">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-medium max-w-[80%] text-center ${isDarkMode ? 'bg-white/[0.03] text-slate-500 border border-white/5' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ) : (
                                    /* Regular message */
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} py-1`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%]`}>

                                            {/* Avatar (other user only) */}
                                            {!isOwnMessage && (
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mt-auto shadow-sm ${isDarkMode
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                    }`}>
                                                    {otherInitials}
                                                </div>
                                            )}

                                            {/* Message bubble */}
                                            {(() => {
                                                const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(ext => msg.file_name?.toLowerCase().endsWith(ext)) || msg.file_type?.startsWith('image/');
                                                const isOnlyAttachment = msg.message_type === 'file' && (!msg.content || msg.content.startsWith('Sent a file:') || msg.content.includes('.webm') || msg.content.trim() === '');
                                                return (
                                                    <div className={`group relative ${isOnlyAttachment && isImage ? 'p-0' : isOnlyAttachment ? 'p-0.5' : 'px-4 py-2.5 shadow-md'} ${isOwnMessage
                                                        ? (isOnlyAttachment && isImage ? '' : isOnlyAttachment ? 'bg-gradient-to-r from-[#ff007f] to-[#ff4d4d]' : 'bg-gradient-to-r from-[#ff007f] to-[#ff4d4d] text-white rounded-[2rem] rounded-br-[6px] shadow-pink-500/20')
                                                        : (isOnlyAttachment && isImage ? '' : isOnlyAttachment ? isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white' : isDarkMode
                                                            ? 'bg-[#2a2a2a] text-slate-200 rounded-[2rem] rounded-bl-[6px] shadow-black/20'
                                                            : 'bg-white text-slate-800 shadow-slate-200/50 rounded-[2rem] rounded-bl-[6px]')
                                                        } ${isOnlyAttachment && !isImage ? 'rounded-full' : ''}`}>
                                                        {/* File/Audio attachment */}
                                                        {msg.message_type === 'file' && msg.file_name && (
                                                            ['.webm', '.mp3', '.m4a', '.wav', '.ogg'].some(ext => msg.file_name.toLowerCase().endsWith(ext)) || msg.file_type?.startsWith('audio/') ? (
                                                                <div className={`mt-0.5 px-3 py-1.5 ${(!isOnlyAttachment) ? (isOwnMessage ? 'bg-white/20 rounded-full' : isDarkMode ? 'bg-white/5 rounded-full' : 'bg-slate-100 rounded-full') : ''}`}>
                                                                    <CustomAudioPlayer src={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`} isDarkMode={isDarkMode} isOwnMessage={isOwnMessage} />
                                                                </div>
                                                            ) : isImage ? (
                                                                <div className={`relative overflow-hidden group/img ${isOwnMessage ? 'rounded-[2rem] rounded-br-[6px]' : 'rounded-[2rem] rounded-bl-[6px]'} bg-slate-100 dark:bg-slate-800`}>
                                                                    <img src={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`} alt="attachment" className="max-w-[220px] max-h-[220px] w-auto h-auto object-cover" />
                                                                    <a href={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`} target="_blank" rel="noreferrer" download={msg.file_name} className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Download className="text-white w-8 h-8" />
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <div className={`flex items-center gap-2.5 rounded-[1.5rem] px-4 py-2.5 shadow-sm ${(!isOnlyAttachment) ? (isOwnMessage ? 'bg-white/20' : isDarkMode ? 'bg-white/5' : 'bg-slate-100') : ''}`}>
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'}`}>
                                                                        <File size={14} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 pr-2">
                                                                        <div className={`text-[12px] font-semibold truncate ${isOwnMessage ? 'text-white' : isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                                            {msg.file_name}
                                                                        </div>
                                                                        <div className={`text-[9px] uppercase tracking-widest mt-0.5 ${isOwnMessage ? 'text-white/80' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                            FILE
                                                                        </div>
                                                                    </div>
                                                                    <a
                                                                        href={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${isOwnMessage ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-600 dark:hover:bg-white/10'}`}
                                                                        download={msg.file_name}
                                                                    >
                                                                        <Download size={14} />
                                                                    </a>
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

                                                            {/* Reaction Button Hover */}
                                                            <button
                                                                onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                                                                className={`absolute ${isOwnMessage ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-sm border z-10 ${isDarkMode ? 'bg-[#2a2a2a]/80 border-white/10 hover:bg-[#333]' : 'bg-white/80 border-slate-200 hover:bg-slate-50'}`}
                                                            >
                                                                <Smile size={16} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
                                                            </button>

                                                            {/* Reaction Picker */}
                                                            <AnimatePresence>
                                                                {activeReactionMessageId === msg.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                        className={`absolute bottom-[110%] mb-1 ${isOwnMessage ? 'right-0' : 'left-0'} z-50 flex gap-1 p-1.5 rounded-full shadow-2xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-slate-200'}`}
                                                                    >
                                                                        {QUICK_EMOJIS.map(emoji => (
                                                                            <button
                                                                                key={emoji}
                                                                                onClick={(e) => handleAddReaction(msg.id, emoji, e)}
                                                                                className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-slate-500/20 hover:scale-110 active:scale-95 transition-all"
                                                                            >
                                                                                {emoji}
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>

                                                            {/* Active Reactions */}
                                                            {(reactions[msg.id] && reactions[msg.id].length > 0) && (
                                                                <div className={`absolute ${isOnlyAttachment ? 'bottom-0' : '-bottom-6'} ${isOwnMessage ? 'right-4' : 'left-4'} flex -space-x-1 p-0.5 rounded-full shadow-sm border backdrop-blur-xl z-20 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-slate-200'}`}>
                                                                    {reactions[msg.id].map(emoji => (
                                                                        <div key={emoji} onClick={(e) => handleAddReaction(msg.id, emoji, e)} className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full bg-slate-500/10 cursor-pointer hover:bg-slate-500/30 transition-colors">
                                                                            {emoji}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {!isOnlyAttachment && (
                                                                <>
                                                                    <span className={`text-[10px] font-semibold tracking-wide ${isOwnMessage ? 'text-white/70' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                        {formatMessageTime(msg.created_at)}
                                                                    </span>
                                                                    {isOwnMessage && (
                                                                        msg.is_read
                                                                            ? <CheckCheck size={14} className="text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.5)]" />
                                                                            : (msg.id ? <CheckCheck size={14} className="text-white/60" /> : <Check size={12} className="text-white/40" />)
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Own Avatar */}
                                            {isOwnMessage && (
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mt-auto shadow-sm shadow-pink-500/20 text-white bg-gradient-to-br from-[#ff007f] to-[#ff4d4d]`}>
                                                    {userType === 'user' ? 'U' : 'L'}
                                                </div>
                                            )}

                                        </div>
                                    </motion.div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                    {showScrollBtn && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => scrollToBottom()}
                            className={`fixed bottom-24 right-4 sm:right-8 p-3 rounded-full shadow-lg transition-all z-30 ${isDarkMode
                                ? 'bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm border border-white/10'
                                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-xl'
                                }`}
                        >
                            <ArrowDown size={16} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ============ INPUT AREA ============ */}
            <div className="sticky bottom-0 z-30 pb-4 pt-1 bg-transparent">
                <div className="max-w-3xl mx-auto px-2 sm:px-4">

                    {/* Selected file preview */}
                    <AnimatePresence>
                        {selectedFile && !audioPreviewUrl && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-3"
                            >
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl w-max max-w-sm ${isDarkMode ? 'bg-dark-bg-secondary border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
                                    {selectedFile.type.startsWith('image/') ? (
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10">
                                            <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-500/10' : 'bg-slate-50'}`}>
                                            <File size={16} className="text-slate-500" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className={`text-[12px] font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                            {selectedFile.name}
                                        </div>
                                        <div className={`text-[10px] font-semibold mt-0.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {(selectedFile.size / 1024).toFixed(1)} KB
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                                        <X size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {audioPreviewUrl && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-3"
                            >
                                <div className={`flex items-center gap-3 px-3 py-2 rounded-[1.2rem] w-max max-w-sm ${isDarkMode ? 'bg-[#2a2a2a] shadow-sm' : 'bg-slate-100 shadow-sm'}`}>
                                    <CustomAudioPlayer src={audioPreviewUrl} isDarkMode={isDarkMode} isOwnMessage={false} />
                                    <button onClick={() => { setAudioPreviewUrl(null); setSelectedFile(null); }} className="p-1.5 rounded-full hover:bg-rose-500/10 transition-colors">
                                        <Trash2 size={16} className="text-rose-500" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {isRecording && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, y: 10 }}
                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: 10 }}
                                className="mb-3"
                            >
                                <div className={`flex items-center justify-between px-4 py-2 rounded-[1.5rem] ${isDarkMode ? 'bg-[#1e1e1e] shadow-lg border border-white/5' : 'bg-white shadow-lg border border-slate-100'}`}>
                                    <button onClick={() => { stopRecording(); setAudioPreviewUrl(null); setSelectedFile(null); }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors flex items-center gap-2">
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="flex items-center gap-2.5 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                        <span className={`text-[13px] font-mono tracking-wide ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                                            00:{String(recordingTime).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <button onClick={() => { autoSendRef.current = true; stopRecording(); }} className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white rounded-full shadow-md hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all">
                                        <Send size={14} className="translate-x-[1px]" fill="currentColor" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input row */}
                    <div className={`flex items-end gap-1 p-1 rounded-[1.5rem] transition-all duration-300 ${isDarkMode
                        ? 'bg-[#1e1e24] shadow-lg'
                        : 'bg-[#f0f2f5] shadow-sm'}`}>

                        {/* Attach button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAttachMenu(!showAttachMenu)}
                                className={`p-2.5 rounded-full transition-all flex-shrink-0 ${isDarkMode
                                    ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                                    : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Paperclip size={18} />
                            </button>

                            {/* Attach menu */}
                            <AnimatePresence>
                                {showAttachMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute bottom-14 left-0 p-2 rounded-2xl border shadow-xl z-50 min-w-[160px] ${isDarkMode
                                            ? 'bg-dark-bg-secondary border-white/10'
                                            : 'bg-white border-slate-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => {
                                                fileInputRef.current?.click();
                                            }}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all ${isDarkMode
                                                ? 'hover:bg-white/5 text-slate-300'
                                                : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            <File size={16} className="text-slate-500" />
                                            Document
                                        </button>
                                        <button
                                            onClick={() => {
                                                fileInputRef.current?.click();
                                            }}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all ${isDarkMode
                                                ? 'hover:bg-white/5 text-slate-300'
                                                : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            <ImageIcon size={16} className="text-emerald-500" />
                                            Photo / Image
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                            />
                        </div>

                        {/* Emoji button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2.5 rounded-full transition-all hidden sm:flex flex-shrink-0 ${isDarkMode
                                    ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                                    : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'}`}
                            >
                                <Smile size={18} />
                            </button>

                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute bottom-14 left-0 p-3 rounded-2xl border shadow-2xl z-50 w-64 ${isDarkMode ? 'bg-dark-bg-secondary border-white/10' : 'bg-white border-slate-200'}`}
                                    >
                                        <div className="grid grid-cols-4 gap-2">
                                            {emojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => { handleEmojiClick(emoji); setShowEmojiPicker(false); }}
                                                    className="w-10 h-10 flex items-center justify-center text-xl rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Text input */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Message securely..."
                                className={`w-full px-2 py-3 bg-transparent !border-none text-[15px] leading-tight font-normal resize-none scrollbar-hide !focus:ring-0 !focus:outline-none max-h-32 ${isDarkMode
                                    ? 'text-slate-200 placeholder-slate-500'
                                    : 'text-slate-800 placeholder-slate-500'
                                    }`}
                                style={{ minHeight: '44px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                }}
                            />
                        </div>

                        {/* Mic or Send button */}
                        {(!newMessage.trim() && !selectedFile) ? (
                            <button
                                onClick={startRecording}
                                disabled={isRecording}
                                className={`p-2.5 rounded-full transition-all flex-shrink-0 mr-1 mb-0.5 ${isRecording ? 'opacity-50' : isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
                            >
                                <Mic size={20} />
                            </button>
                        ) : (
                            <button
                                id="hidden_send_btn"
                                onClick={handleSend}
                                disabled={sending}
                                className={`p-2.5 mr-1 mb-0.5 rounded-full transition-all flex-shrink-0 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 active:scale-95`}
                            >
                                {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} fill="currentColor" className="ml-0.5" />}
                            </button>
                        )}
                    </div>

                    {/* Security footer */}
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                        <Lock size={8} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />
                        <span className={`text-[8px] font-semibold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                            End-to-end encrypted
                        </span>
                    </div>
                </div>
            </div>

            {/* ============ END SESSION MODAL ============ */}
            <AnimatePresence>
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
                                ? 'bg-dark-bg-secondary border-white/10'
                                : 'bg-white border-slate-200 shadow-2xl'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                    <Phone size={24} className="text-rose-500 rotate-[135deg]" />
                                </div>
                                <h3 className={`text-base font-bold tracking-tight mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    End Consultation?
                                </h3>
                                <p className={`text-xs font-medium mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    This will end the session for both participants. Chat history will be saved.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowEndModal(false)}
                                        className={`flex-1 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode
                                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                    >
                                        Continue
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowEndModal(false);
                                            onEndSession();
                                        }}
                                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] transition-all"
                                    >
                                        End Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default ConsultationChat;
