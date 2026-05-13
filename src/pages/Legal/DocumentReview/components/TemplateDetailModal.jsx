import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  Clock,
  Shield,
  Globe,
  ListChecks,
  CheckCircle,
  Hash,
  FileText,
} from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { resolveIcon } from '../utils/iconMap';
import PremiumBadge from './shared/PremiumBadge';

/**
 * Template detail modal. On mobile it presents as a bottom-sheet, draggable
 * down to dismiss. On desktop it's a centered modal.
 */
const TemplateDetailModal = ({ open, template, onClose, onStart, isDarkMode }) => {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!template) return null;
  const category = getCategoryById(template.category);
  const Icon = resolveIcon(template.icon);
  const variableCount = template.variables?.length || 0;
  const groups = Array.from(new Set((template.variables || []).map((v) => v.group).filter(Boolean)));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            drag={typeof window !== 'undefined' && window.innerWidth < 640 ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className={`w-full sm:max-w-2xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden border
              ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-200/70'} shadow-2xl`}
          >
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <span className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-white/15' : 'bg-slate-300'}`} />
            </div>

            {/* Banner */}
            <div className={`relative px-5 sm:px-7 pt-5 sm:pt-7 pb-5 sm:pb-7 bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-indigo-600'}`}>
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/20 text-white hover:bg-black/30 transition-all"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-1 ring-white/30">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-white ring-1 ring-white/25">
                      {category?.name}
                    </span>
                    {template.premium ? <PremiumBadge label="Premium" variant="soft" size="xs" /> : null}
                  </div>
                  <h2 className="text-base sm:text-xl font-black tracking-tight text-white leading-snug">
                    {template.name}
                  </h2>
                  <p className="mt-1.5 text-[12px] sm:text-xs text-white/85 leading-relaxed line-clamp-3">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: Clock, label: 'Time', value: template.estimatedTime, color: 'text-blue-500' },
                  { icon: Hash, label: 'Fields', value: `${variableCount}`, color: 'text-purple-500' },
                  { icon: Globe, label: 'Jurisdiction', value: template.jurisdiction || 'India', color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 border text-center
                      ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <stat.icon size={12} className={`mx-auto mb-1 ${stat.color}`} />
                    <div className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-[11px] font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info groups required */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <ListChecks size={14} className="text-blue-500" />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    Information You'll Need
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groups.length ? (
                    groups.map((g) => (
                      <span
                        key={g}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border
                          ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                      Just a few basic details.
                    </span>
                  )}
                </div>
              </div>

              {/* What you get */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <FileText size={14} className="text-emerald-500" />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    What You'll Get
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Professionally drafted legal document, ready to print',
                    'Premium branded PDF with cover page, watermark and signature blocks',
                    'Saved locally in your "My Documents" library for easy re-download',
                    'Indian-law compliant clauses and language',
                  ].map((line, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-[11px] sm:text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}
                    >
                      <CheckCircle size={13} className="mt-0.5 text-emerald-500 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div
                className={`rounded-xl p-3 text-[10px] leading-relaxed border
                  ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}
              >
                <Shield size={11} className="inline mr-1 -mt-0.5" />
                This template is a customisable draft. We recommend a final review by a qualified advocate before signing or registering.
              </div>
            </div>

            {/* CTA bar */}
            <div className={`px-5 sm:px-7 py-4 border-t flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between
              ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-100'}`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                  ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={() => onStart(template)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95"
              >
                Start Generating
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateDetailModal;
