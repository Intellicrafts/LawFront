import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { TRENDING_TEMPLATES, TRENDING_BADGES } from '../data/trending';
import TemplateCard from './TemplateCard';

/**
 * Trending strip. On mobile this is a snap-scrolling horizontal row; on desktop
 * it becomes a 4-column responsive grid.
 */
const TrendingSection = ({ onSelect, isDarkMode }) => {
  const scrollerRef = useRef(null);

  const scrollBy = (delta) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto mt-2">
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center
              bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-500/20`}
          >
            <Flame size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Trending Now
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              Most-used by Indian professionals
            </p>
          </div>
        </div>

        {/* Desktop scroll controls (only visible on md when row is overflowing). On lg+ we use a grid so they're hidden. */}
        <div className="hidden md:flex lg:hidden gap-1.5">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
              ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}
            aria-label="Scroll trending left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
              ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}
            aria-label="Scroll trending right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* lg+ : grid; below lg : horizontal scroll */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {TRENDING_TEMPLATES.slice(0, 4).map((tpl, idx) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            variant="default"
            badge={TRENDING_BADGES[tpl.id]}
            onSelect={onSelect}
            isDarkMode={isDarkMode}
            index={idx}
          />
        ))}
        {TRENDING_TEMPLATES.slice(4, 6).map((tpl, idx) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            variant="default"
            badge={TRENDING_BADGES[tpl.id]}
            onSelect={onSelect}
            isDarkMode={isDarkMode}
            index={idx}
          />
        ))}
        {TRENDING_TEMPLATES.slice(6, 8).map((tpl, idx) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            variant="default"
            badge={TRENDING_BADGES[tpl.id]}
            onSelect={onSelect}
            isDarkMode={isDarkMode}
            index={idx}
          />
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
        style={{ scrollPaddingLeft: '16px', scrollPaddingRight: '16px' }}
      >
        <div className="flex gap-3 pb-2">
          {TRENDING_TEMPLATES.map((tpl, idx) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              variant="horizontal"
              badge={TRENDING_BADGES[tpl.id]}
              onSelect={onSelect}
              isDarkMode={isDarkMode}
              index={idx}
            />
          ))}
          {/* end spacer */}
          <div className="shrink-0 w-2" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
