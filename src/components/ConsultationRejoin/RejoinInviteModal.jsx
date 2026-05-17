import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Video, X, Lock } from 'lucide-react';

const RejoinInviteModal = ({
  open,
  invite,
  isDarkMode = false,
  onDismiss,
  onAccept,
  accepting = false,
}) => {
  if (!invite) return null;

  const name = invite.participantName || 'Your consultation partner';
  const isRequest = invite.type === 'request';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rejoin-invite-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onDismiss}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative w-full max-w-md overflow-hidden rounded-[28px] border shadow-2xl ${
              isDarkMode
                ? 'border-white/10 bg-[#12141f] text-white shadow-black/50'
                : 'border-slate-200/80 bg-white text-slate-900 shadow-slate-300/40'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <button
              type="button"
              onClick={onDismiss}
              className={`absolute right-4 top-4 rounded-full p-2 transition-colors ${
                isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>

            <motion.div
              className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />

            <motion.div
              className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
              animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.4)', '0 0 0 14px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Video size={28} className="text-white" />
            </motion.div>

            <motion.p
              className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Priority secure alert
            </motion.p>

            <div className="px-6 pb-6 pt-2 text-center">
              <h2
                id="rejoin-invite-title"
                className={`text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              >
                {isRequest ? `${name} wants to rejoin` : `${name} is in the chamber`}
              </h2>
              <p className={`mt-2 text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isRequest
                  ? 'Grant access to resume your encrypted consultation without returning to the waiting lobby.'
                  : 'Your partner is waiting in the live session. Enter directly to continue.'}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onAccept}
                  disabled={accepting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-[11px] font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:brightness-105 disabled:opacity-70"
                >
                  <Lock size={14} />
                  {accepting ? 'Opening chamber…' : 'Enter Secure Chamber'}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                    isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Not now
                </button>
              </div>

              <p className={`mt-4 flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Shield size={10} className="text-emerald-500" />
                End-to-end encrypted session
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RejoinInviteModal;
