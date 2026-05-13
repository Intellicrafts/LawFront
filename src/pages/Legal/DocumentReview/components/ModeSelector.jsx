import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ListChecks, ArrowRight, Sparkles, MessageSquare, ClipboardEdit, Zap, Shield } from 'lucide-react';
import PremiumBadge from './shared/PremiumBadge';

/**
 * Premium choice screen between AI Assistant and Custom Form.
 */
const ModeSelector = ({ onChoose, isDarkMode, template }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-3">
          <PremiumBadge icon="sparkles" label="Choose Your Style" variant="gradient" size="md" />
        </div>
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          How would you like to fill in <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">{template?.name}</span>?
        </h2>
        <p className={`mt-2 max-w-xl mx-auto text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          Pick the experience that suits you. You can switch anytime — your answers come along.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* AI Assistant Card */}
        <motion.button
          type="button"
          onClick={() => onChoose('ai')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -4 }}
          className={`group relative overflow-hidden text-left rounded-3xl border p-6 sm:p-8 transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-br from-[#141414] to-[#1A1A1A] border-white/5 hover:border-blue-500/40'
              : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200'
            }`}
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-600/30">
                <Bot size={24} className="text-white" />
              </div>
              <PremiumBadge label="Recommended" variant="blue" size="xs" />
            </div>

            <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              AI Assistant
            </h3>
            <p className={`mt-1 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Have a friendly chat with our legal AI. It will ask you one question at a time and gently guide you through every detail.
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                { icon: MessageSquare, text: 'Natural, conversational experience' },
                { icon: Zap, text: 'Smart context — handles edge cases for you' },
                { icon: Shield, text: 'No tax jargon, no confusion' },
              ].map((point, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 text-[12px] sm:text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                    <point.icon size={11} />
                  </span>
                  {point.text}
                </li>
              ))}
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-3 transition-all">
              Start Chat
              <ArrowRight size={13} />
            </div>
          </div>
        </motion.button>

        {/* Custom Form Card */}
        <motion.button
          type="button"
          onClick={() => onChoose('form')}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -4 }}
          className={`group relative overflow-hidden text-left rounded-3xl border p-6 sm:p-8 transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-br from-[#141414] to-[#1A1A1A] border-white/5 hover:border-emerald-500/40'
              : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-emerald-200'
            }`}
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-600/30">
                <ClipboardEdit size={24} className="text-white" />
              </div>
              <PremiumBadge label="Power User" variant="emerald" size="xs" />
            </div>

            <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Custom Form
            </h3>
            <p className={`mt-1 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              See and edit every field directly. Best when you know exactly what you need and prefer to fill things in your own order.
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                { icon: ListChecks, text: 'All fields visible — fastest for experienced users' },
                { icon: Sparkles, text: 'Live preview as you type' },
                { icon: Shield, text: 'Inline validation for PAN, Aadhaar, phone etc.' },
              ].map((point, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 text-[12px] sm:text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
                    <point.icon size={11} />
                  </span>
                  {point.text}
                </li>
              ))}
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-500 group-hover:gap-3 transition-all">
              Open Form
              <ArrowRight size={13} />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ModeSelector;
