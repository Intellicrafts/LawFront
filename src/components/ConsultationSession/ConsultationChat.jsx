import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Clock, Send, Paperclip, Smile, X, Image as ImageIcon,
    File, Download, Check, CheckCheck, Wifi, WifiOff,
    Phone, MoreVertical, AlertTriangle, ArrowDown, Loader,
    ChevronLeft, MessageCircle, Lock
} from 'lucide-react';

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

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

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
    }, [messages.length, scrollToBottom]);

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

            await onSendMessage(content || (selectedFile ? selectedFile.name : ''), selectedFile);
            setNewMessage('');
            setSelectedFile(null);
            inputRef.current?.focus();
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
        <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#080808]' : 'bg-slate-50/50'}`}>

            {/* ============ HEADER ============ */}
            <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#080808]/90 border-white/5' : 'bg-white/90 border-slate-200/60'}`}>
                <div className="max-w-4xl mx-auto px-3 sm:px-4">
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
                                    ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/20'
                                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border border-blue-200/50'
                                    }`}>
                                    {otherInitials}
                                </div>
                                {/* Online dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-[#080808]" />
                            </div>

                            {/* Name & Status */}
                            <div className="min-w-0">
                                <h3 className={`text-[13px] font-bold tracking-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    {otherName}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>
                                        Online • In Session
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Timer & Actions */}
                        <div className="flex items-center gap-2">
                            {/* Connection Status */}
                            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${connectionStatus === 'connected'
                                ? isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
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
                        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
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
                className="flex-1 overflow-y-auto relative"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-1">

                    {/* Security Notice at top */}
                    <div className="flex justify-center mb-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-slate-100 shadow-sm'}`}>
                            <Lock size={10} className={isDarkMode ? 'text-amber-400/60' : 'text-amber-500/60'} />
                            <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Messages are encrypted & stored securely
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    {messages.map((msg, index) => {
                        const isOwnMessage = (userType === 'user' && msg.sender_type === 'user') ||
                            (userType === 'lawyer' && msg.sender_type === 'lawyer');
                        const isSystem = msg.sender_type === 'system' || msg.message_type === 'system';
                        const showDateSep = index === 0 ||
                            getMessageDate(msg.created_at) !== getMessageDate(messages[index - 1]?.created_at);

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
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} py-0.5`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>

                                            {/* Avatar (other user only) */}
                                            {!isOwnMessage && (
                                                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold mb-1 ${isDarkMode
                                                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20'
                                                    : 'bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-200/50'
                                                    }`}>
                                                    {otherInitials}
                                                </div>
                                            )}

                                            {/* Message bubble */}
                                            <div className={`group relative rounded-2xl px-4 py-2.5 ${isOwnMessage
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                                                : isDarkMode
                                                    ? 'bg-[#1a1a1a] text-slate-200 border border-white/5 rounded-bl-md'
                                                    : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-md'
                                                }`}>
                                                {/* File attachment */}
                                                {msg.message_type === 'file' && msg.file_name && (
                                                    <div className={`flex items-center gap-2 mb-2 p-2 rounded-xl ${isOwnMessage ? 'bg-white/10' : isDarkMode ? 'bg-white/5' : 'bg-slate-50'
                                                        }`}>
                                                        <File size={14} className={isOwnMessage ? 'text-white/60' : 'text-blue-500'} />
                                                        <span className={`text-[10px] font-medium truncate flex-1 ${isOwnMessage ? 'text-white/80' : ''}`}>
                                                            {msg.file_name}
                                                        </span>
                                                        <a
                                                            href={msg.file_url || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${msg.file_path}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-md transition-colors"
                                                            download={msg.file_name}
                                                        >
                                                            <Download size={12} className={isOwnMessage ? 'text-white/60' : 'text-blue-500'} />
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Text content */}
                                                {msg.content && msg.message_type !== 'file' && (
                                                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                    </p>
                                                )}
                                                {msg.content && msg.message_type === 'file' && !msg.content.startsWith('Sent a file:') && (
                                                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                    </p>
                                                )}

                                                {/* Time & read status */}
                                                <div className={`flex items-center gap-1.5 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                                    <span className={`text-[9px] font-medium ${isOwnMessage ? 'text-white/50' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                                        }`}>
                                                        {formatMessageTime(msg.created_at)}
                                                    </span>
                                                    {isOwnMessage && (
                                                        msg.is_read
                                                            ? <CheckCheck size={10} className="text-white/50" />
                                                            : <Check size={10} className="text-white/30" />
                                                    )}
                                                </div>
                                            </div>
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
            <div className={`sticky bottom-0 z-30 border-t ${isDarkMode ? 'bg-[#0c0c0c]/95 border-white/5' : 'bg-white/95 border-slate-200/60'} backdrop-blur-xl`}>
                <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">

                    {/* Selected file preview */}
                    <AnimatePresence>
                        {selectedFile && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-2"
                            >
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                                    <File size={14} className="text-blue-500 flex-shrink-0" />
                                    <span className={`text-[11px] font-medium truncate flex-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {selectedFile.name}
                                    </span>
                                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </span>
                                    <button onClick={() => setSelectedFile(null)} className="p-1 hover:opacity-70">
                                        <X size={12} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input row */}
                    <div className="flex items-end gap-2">
                        {/* Attach button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAttachMenu(!showAttachMenu)}
                                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${isDarkMode
                                    ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                                    }`}
                            >
                                <Paperclip size={16} />
                            </button>

                            {/* Attach menu */}
                            <AnimatePresence>
                                {showAttachMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute bottom-12 left-0 p-2 rounded-2xl border shadow-xl z-50 min-w-[160px] ${isDarkMode
                                            ? 'bg-[#1a1a1a] border-white/10'
                                            : 'bg-white border-slate-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => {
                                                fileInputRef.current?.click();
                                            }}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all ${isDarkMode
                                                ? 'hover:bg-white/5 text-slate-300'
                                                : 'hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <File size={14} className="text-blue-500" />
                                            Document
                                        </button>
                                        <button
                                            onClick={() => {
                                                fileInputRef.current?.click();
                                            }}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all ${isDarkMode
                                                ? 'hover:bg-white/5 text-slate-300'
                                                : 'hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <ImageIcon size={14} className="text-emerald-500" />
                                            Image
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

                        {/* Text input */}
                        <div className={`flex-1 relative rounded-2xl border transition-all ${isDarkMode
                            ? 'bg-white/[0.03] border-white/5 focus-within:border-blue-500/30 focus-within:bg-white/[0.05]'
                            : 'bg-slate-50 border-slate-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-sm'
                            }`}>
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Type your message..."
                                className={`w-full px-4 py-3 bg-transparent border-none text-[13px] font-medium resize-none focus:ring-0 focus:outline-none max-h-32 ${isDarkMode
                                    ? 'text-slate-100 placeholder-slate-600'
                                    : 'text-slate-800 placeholder-slate-400'
                                    }`}
                                style={{ minHeight: '44px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                }}
                            />
                        </div>

                        {/* Send button */}
                        <button
                            onClick={handleSend}
                            disabled={(!newMessage.trim() && !selectedFile) || sending}
                            className={`p-3 rounded-xl transition-all flex-shrink-0 ${(!newMessage.trim() && !selectedFile) || sending
                                ? isDarkMode ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95'
                                }`}
                        >
                            {sending ? (
                                <Loader size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
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
                                ? 'bg-[#151515] border-white/10'
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
        </div>
    );
};

export default ConsultationChat;
