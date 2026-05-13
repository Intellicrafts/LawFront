import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Compact, responsive progress stepper used at the top of the generation journey.
 * `steps` is an array of { id, label, icon }
 */
const Stepper = ({ steps, currentIndex, isDarkMode }) => {
  return (
    <div className="w-full">
      {/* Desktop / md+ — full pills with labels */}
      <div className="hidden md:flex items-center justify-center gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <motion.div
                initial={false}
                animate={{ scale: isActive ? 1.03 : 1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all
                  ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isDone
                        ? isDarkMode
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : isDarkMode
                          ? 'bg-white/5 border-white/5 text-gray-500'
                          : 'bg-white border-slate-200 text-slate-400'
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black
                    ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : isDone
                          ? 'bg-emerald-500 text-white'
                          : isDarkMode
                            ? 'bg-white/10 text-gray-400'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  {isDone ? <Check size={9} /> : idx + 1}
                </span>
                {Icon ? <Icon size={11} /> : null}
                <span>{step.label}</span>
              </motion.div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 rounded-full transition-colors ${
                    idx < currentIndex
                      ? 'bg-emerald-500/60'
                      : isDarkMode
                        ? 'bg-white/10'
                        : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile — compact dots + label of active step */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-2 px-1">
          {steps.map((step, idx) => {
            const isActive = idx === currentIndex;
            const isDone = idx < currentIndex;
            return (
              <div key={step.id} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/30'
                        : isDone
                          ? 'bg-emerald-500 text-white'
                          : isDarkMode
                            ? 'bg-white/5 text-gray-500 border border-white/5'
                            : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                >
                  {isDone ? <Check size={11} /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full ${
                      idx < currentIndex
                        ? 'bg-emerald-500/60'
                        : isDarkMode
                          ? 'bg-white/10'
                          : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-center">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDarkMode ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            Step {currentIndex + 1} of {steps.length} — {steps[currentIndex]?.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
