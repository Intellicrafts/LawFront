import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, ArrowRight, ChevronUp, RefreshCw, X } from 'lucide-react';
import useAIAssistant from '../hooks/useAIAssistant';
import DocumentPreview from './DocumentPreview';

/**
 * Conversational AI Assistant flow.
 *
 * Backend integration TODO: the data is sourced from `hooks/useAIAssistant`, which
 * itself wraps `api/documentApi.js`. Swap the stub there with real HTTP calls.
 */
const AIAssistantFlow = ({
  template,
  values,
  onValuesChange,
  onComplete,
  onSwitchMode,
  isDarkMode,
}) => {
  const [input, setInput] = useState('');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, isTyping, isComplete, progress, send, error } = useAIAssistant(template, {
    onVariablesUpdate: (extracted) => onValuesChange && onValuesChange(extracted),
    onComplete: (final) => onComplete && onComplete(final),
  });

  // Auto-scroll messages.
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!input.trim() && !isComplete) return;
    send(input);
    setInput('');
    // refocus on desktop only
    if (typeof window !== 'undefined' && window.innerWidth >= 640) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/30">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              AI Assistant
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              Talking about {template.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSwitchMode && onSwitchMode('form')}
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all
            ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <RefreshCw size={11} /> Switch to Form
        </button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
          <span className={isDarkMode ? 'text-gray-500' : 'text-slate-400'}>{progress}% complete</span>
          <span className={isDarkMode ? 'text-gray-500' : 'text-slate-400'}>{template.variables?.length || 0} questions</span>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid lg:grid-cols-[1fr_minmax(0,1fr)] gap-4 lg:gap-5 h-[calc(100vh-240px)] min-h-[460px]">
        {/* Chat */}
        <div className={`relative rounded-3xl border flex flex-col overflow-hidden h-full
          ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-200/70 shadow-md'}`}
        >
          {/* Messages */}
          <div
            ref={messagesRef}
            className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-50/60'}`}
          >
            <div className="text-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}
              >
                <Sparkles size={10} className="text-blue-500" /> Conversation Started
              </span>
            </div>

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-sm
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                      : isDarkMode
                        ? 'bg-[#1A1A1A] text-gray-200 border border-white/5 rounded-tl-sm'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                    }
                    ${msg.isError ? 'ring-1 ring-red-500/40' : ''}`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div
                  className={`px-4 py-3 rounded-2xl rounded-tl-sm border
                    ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.span
                        key={i}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay }}
                        className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-slate-400'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 rounded-2xl p-4 text-center border
                  ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}
              >
                <div className="text-[10px] font-black uppercase tracking-widest mb-1">All Set</div>
                <p className="text-[12px]">Your document is ready for preview and download.</p>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={submit}
            className={`p-3 sm:p-4 border-t ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-100'}`}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isComplete ? 'You can review the preview now →' : 'Type your answer…'}
                disabled={isTyping || isComplete}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all
                  ${isDarkMode
                    ? 'bg-[#1A1A1A] text-white placeholder-gray-600 focus:bg-[#202020]'
                    : 'bg-slate-50 text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-200 focus:bg-white focus:shadow-sm'
                  }
                  ${(isTyping || isComplete) ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              {isComplete ? (
                <button
                  type="button"
                  onClick={() => onComplete && onComplete(values)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  Preview <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            {error ? (
              <p className="mt-2 text-[10px] font-bold text-red-500">{error}</p>
            ) : null}
          </form>
        </div>

        {/* Preview (desktop) */}
        <div className="hidden lg:block h-full">
          <DocumentPreview template={template} values={values} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Mobile switch-mode */}
      <div className="mt-3 sm:hidden">
        <button
          type="button"
          onClick={() => onSwitchMode && onSwitchMode('form')}
          className={`w-full px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5
            ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          <RefreshCw size={11} /> Switch to Form
        </button>
      </div>

      {/* Mobile preview toggle (floating) */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          type="button"
          onClick={() => setShowPreviewMobile(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center gap-2"
        >
          Preview Doc <ChevronUp size={13} />
        </button>
      </div>

      {/* Mobile preview bottom-sheet */}
      <AnimatePresence>
        {showPreviewMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-end"
            onClick={(e) => e.target === e.currentTarget && setShowPreviewMobile(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => info.offset.y > 120 && setShowPreviewMobile(false)}
              className={`w-full h-[88vh] rounded-t-3xl overflow-hidden border-t ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Live Preview
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreviewMobile(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-[calc(88vh-52px)]">
                <DocumentPreview template={template} values={values} isDarkMode={isDarkMode} compact />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantFlow;
