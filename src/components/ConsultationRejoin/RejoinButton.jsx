import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radio, Loader2, Shield } from 'lucide-react';
import { getRejoinTimeRemaining } from '../../utils/consultationRejoin';

const RejoinButton = ({
  appointment,
  onRejoin,
  loading = false,
  disabled = false,
  isDarkMode = false,
  compact = false,
  className = '',
}) => {
  const remaining = useMemo(
    () => getRejoinTimeRemaining(appointment),
    [appointment]
  );

  return (
    <motion.button
      type="button"
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      onClick={onRejoin}
      disabled={disabled || loading}
      className={`relative w-full overflow-hidden rounded-xl font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-55 ${
        compact ? 'h-9 text-[9px]' : 'h-11 text-[10px]'
      } ${
        isDarkMode
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25'
          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-600/20'
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2.5s_ease-in-out_infinite]" />
      <span className="pointer-events-none absolute -inset-1 rounded-xl bg-emerald-400/20 blur-md animate-pulse" />

      <span className="relative z-10 flex items-center justify-center gap-2 px-3">
        {loading ? (
          <>
            <Loader2 size={compact ? 12 : 14} className="animate-spin" />
            Reconnecting…
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Radio size={compact ? 12 : 14} strokeWidth={2.5} />
            Rejoin Live Chamber
            <Shield size={compact ? 11 : 12} className="opacity-80" />
          </>
        )}
      </span>

      {remaining && !loading && (
        <span
          className={`relative z-10 block pb-2 text-center text-[8px] font-bold normal-case tracking-normal opacity-90 ${
            isDarkMode ? 'text-slate-900/80' : 'text-white/90'
          }`}
        >
          Window closes in {remaining.minutes}m {remaining.seconds}s
        </span>
      )}
    </motion.button>
  );
};

export default RejoinButton;
