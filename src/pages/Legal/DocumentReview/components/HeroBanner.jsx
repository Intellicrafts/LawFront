import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Zap, Shield, Globe, ChevronDown } from 'lucide-react';
import PremiumBadge from './shared/PremiumBadge';

/**
 * Premium hero with title, tagline, search bar and quick-stats.
 */
const HeroBanner = ({
  search,
  setSearch,
  totalTemplates,
  onJumpToTemplates,
  onJumpToMyDocs,
  isDarkMode,
}) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background ornaments */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-72 bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 blur-3xl rounded-full" />
        <div className="absolute -top-10 right-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-4"
        >
          <PremiumBadge icon="sparkles" label="AI-Powered • Premium" variant="gradient" size="md" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
        >
          Generate{' '}
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Legal Documents
          </span>
          <br className="hidden sm:block" /> in Minutes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className={`mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}
        >
          Pick from <span className="font-bold text-blue-500">{totalTemplates}+ professionally drafted templates</span> compliant with Indian law. Answer a few questions with our AI assistant or fill a quick form. Download a beautifully formatted PDF — ready to print, sign, and use.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className={`relative mt-7 max-w-2xl mx-auto rounded-2xl border shadow-xl transition-all
            ${isDarkMode ? 'bg-[#141414] border-white/5 shadow-black/40' : 'bg-white border-slate-200/70 shadow-blue-900/5'}`}
        >
          <Search
            size={16}
            className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search: rent agreement, NDA, affidavit…"
            className={`w-full pl-12 pr-32 sm:pr-40 py-4 rounded-2xl text-xs sm:text-sm font-medium bg-transparent outline-none
              ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-slate-800 placeholder-slate-400'}`}
          />
          <button
            type="button"
            onClick={onJumpToTemplates}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all shadow-md shadow-blue-600/30 active:scale-95"
          >
            Browse All
          </button>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {[
            { icon: FileText, label: `${totalTemplates}+ Templates`, color: 'text-blue-500' },
            { icon: Zap, label: 'AI Assisted', color: 'text-purple-500' },
            { icon: Shield, label: 'India Compliant', color: 'text-emerald-500' },
            { icon: Globe, label: 'Premium PDF', color: 'text-orange-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-widest
                ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
            >
              <stat.icon size={11} className={stat.color} />
              {stat.label}
            </div>
          ))}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest"
        >
          <button
            type="button"
            onClick={onJumpToTemplates}
            className={`flex items-center gap-1.5 transition-all ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Explore Templates
            <ChevronDown size={11} className="rotate-[-90deg]" />
          </button>
          <span className={isDarkMode ? 'text-gray-700' : 'text-slate-300'}>•</span>
          <button
            type="button"
            onClick={onJumpToMyDocs}
            className={`flex items-center gap-1.5 transition-all ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Documents
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
