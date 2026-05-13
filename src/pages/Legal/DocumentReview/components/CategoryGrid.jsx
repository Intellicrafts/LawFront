import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { countByCategory } from '../data/templates';
import { resolveIcon } from '../utils/iconMap';

/**
 * Grid of category cards. Tapping a card drills into the CategoryView.
 */
const CategoryGrid = ({ onSelectCategory, isDarkMode }) => {
  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto mt-10">
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <LayoutGrid size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Browse by Category
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              {CATEGORIES.length} categories • thoughtfully organised
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat, idx) => {
          const Icon = resolveIcon(cat.icon);
          const count = countByCategory(cat.id);
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.32 }}
              whileHover={{ y: -3 }}
              className={`group relative overflow-hidden text-left rounded-3xl border p-4 sm:p-5 h-full transition-all duration-300
                ${isDarkMode
                  ? 'bg-[#141414] border-white/5 hover:border-blue-500/40 hover:bg-[#181818]'
                  : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200'
                }`}
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${cat.gradient} opacity-10 group-hover:opacity-20 transition-all blur-xl`} />
              <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.gradient} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className={`relative mt-4 text-[13px] sm:text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {cat.name}
              </h3>
              <p className={`relative mt-1 text-[10px] sm:text-[11px] font-medium line-clamp-1 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                {cat.tagline}
              </p>
              <div className="relative mt-3 flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  {count} {count === 1 ? 'template' : 'templates'}
                </span>
                <ArrowRight
                  size={14}
                  className={`transition-all group-hover:translate-x-1 ${isDarkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
