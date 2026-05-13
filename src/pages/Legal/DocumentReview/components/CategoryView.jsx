import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { getTemplatesByCategory } from '../data/templates';
import { resolveIcon } from '../utils/iconMap';
import TemplateCard from './TemplateCard';
import EmptyState from './shared/EmptyState';

/**
 * Drill-in view for a single category — shows header + responsive grid of its templates.
 */
const CategoryView = ({ categoryId, onBack, onSelectTemplate, isDarkMode }) => {
  const category = getCategoryById(categoryId);
  const templates = getTemplatesByCategory(categoryId);
  const Icon = category ? resolveIcon(category.icon) : null;

  if (!category) return null;

  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto pt-4 pb-12">
      <button
        type="button"
        onClick={onBack}
        className={`mb-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
          ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <ArrowLeft size={12} />
        Back to All Categories
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8
          ${isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-100 shadow-md'}`}
      >
        <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${category.gradient} opacity-15 blur-3xl pointer-events-none`} />

        <div className="relative flex items-start gap-4">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.gradient} shadow-xl shadow-blue-600/10`}>
            {Icon ? <Icon size={26} className="text-white" /> : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              Category
            </div>
            <h1 className={`mt-1 text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {category.name}
            </h1>
            <p className={`mt-2 text-xs sm:text-sm max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              {category.description}
            </p>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
              ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
              {templates.length} {templates.length === 1 ? 'template available' : 'templates available'}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {templates.map((tpl, idx) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            variant="default"
            onSelect={onSelectTemplate}
            isDarkMode={isDarkMode}
            index={idx}
          />
        ))}
      </div>

      {templates.length === 0 && (
        <EmptyState
          title="No templates yet in this category"
          description="More templates are on the way. Please check back soon!"
          isDarkMode={isDarkMode}
        />
      )}
    </section>
  );
};

export default CategoryView;
