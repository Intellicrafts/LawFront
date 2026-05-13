import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { resolveIcon } from '../utils/iconMap';
import PremiumBadge from './shared/PremiumBadge';

/**
 * Reusable template card.
 *
 * Props:
 *   template   — full template object
 *   variant    — 'default' | 'compact' | 'featured' | 'horizontal'
 *   onSelect   — (template) => void
 *   badge      — optional small headline (e.g. "Most Used")
 *   isDarkMode
 */
const TemplateCard = ({
  template,
  variant = 'default',
  onSelect,
  badge,
  isDarkMode,
  index = 0,
}) => {
  const category = getCategoryById(template.category);
  const Icon = resolveIcon(template.icon);

  // ----- Horizontal (trending row, mobile-first) -----
  if (variant === 'horizontal') {
    return (
      <motion.button
        type="button"
        onClick={() => onSelect && onSelect(template)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        whileHover={{ y: -3 }}
        className={`group relative shrink-0 snap-start w-64 sm:w-72 text-left rounded-3xl overflow-hidden border transition-all duration-300
          ${isDarkMode
            ? 'bg-[#141414] border-white/5 hover:border-blue-500/40'
            : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:border-blue-200'
          }`}
      >
        <div className={`relative h-24 bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'} p-4 flex items-start justify-between`}>
          <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-1 ring-white/25">
            <Icon size={20} className="text-white" />
          </div>
          {badge ? (
            <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-white ring-1 ring-white/25">
              {badge}
            </span>
          ) : template.premium ? (
            <PremiumBadge label="Premium" variant="soft" size="xs" />
          ) : null}
        </div>
        <div className="p-4 space-y-2">
          <h3 className={`text-[13px] font-black tracking-tight line-clamp-2 leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {template.name}
          </h3>
          <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {template.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              <Clock size={10} />
              {template.estimatedTime}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-2 transition-all">
              Start <ArrowRight size={11} />
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  // ----- Compact (used in dense lists) -----
  if (variant === 'compact') {
    return (
      <motion.button
        type="button"
        onClick={() => onSelect && onSelect(template)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.02 }}
        whileHover={{ y: -2 }}
        className={`group w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300
          ${isDarkMode
            ? 'bg-[#141414] border-white/5 hover:border-blue-500/40 hover:bg-[#1A1A1A]'
            : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200'
          }`}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'} shadow-md shrink-0`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-xs font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </h3>
            {template.premium ? <PremiumBadge label="Pro" variant="soft" size="xs" /> : null}
          </div>
          <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
            {template.description}
          </p>
        </div>
        <ArrowRight
          size={16}
          className={`shrink-0 transition-all group-hover:translate-x-1 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}
        />
      </motion.button>
    );
  }

  // ----- Featured (large showcase card) -----
  if (variant === 'featured') {
    return (
      <motion.button
        type="button"
        onClick={() => onSelect && onSelect(template)}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
        className={`group relative col-span-1 sm:col-span-2 text-left rounded-3xl overflow-hidden border transition-all duration-300
          ${isDarkMode
            ? 'bg-gradient-to-br from-[#141414] to-[#1A1A1A] border-white/5 hover:border-blue-500/40'
            : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200'
          }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'} opacity-10 pointer-events-none`} />
        <div className="relative p-6 sm:p-8 grid sm:grid-cols-[auto_1fr_auto] items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'} shadow-xl shadow-blue-600/20`}>
            <Icon size={26} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {badge ? (
                <PremiumBadge label={badge} variant="gradient" size="xs" />
              ) : null}
              {template.premium ? <PremiumBadge label="Premium" variant="purple" size="xs" /> : null}
            </div>
            <h3 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </h3>
            <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {template.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-3 transition-all">
            Generate <ArrowRight size={14} />
          </div>
        </div>
      </motion.button>
    );
  }

  // ----- Default (responsive grid card) -----
  return (
    <motion.button
      type="button"
      onClick={() => onSelect && onSelect(template)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      className={`group relative text-left rounded-3xl overflow-hidden border transition-all duration-300 h-full flex flex-col
        ${isDarkMode
          ? 'bg-[#141414] border-white/5 hover:border-blue-500/40 hover:bg-[#181818]'
          : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200'
        }`}
    >
      <div className={`relative h-20 bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'} px-4 pt-4 flex items-start justify-between`}>
        <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center ring-1 ring-white/25">
          <Icon size={18} className="text-white" />
        </div>
        {template.premium ? <PremiumBadge label="Pro" variant="soft" size="xs" /> : null}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            {category?.name || 'Document'}
          </span>
          <h3 className={`mt-1 text-[13px] font-black tracking-tight line-clamp-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {template.name}
          </h3>
          <p className={`mt-1.5 text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {template.description}
          </p>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            <Clock size={10} /> {template.estimatedTime}
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-2 transition-all">
            Generate <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default TemplateCard;
