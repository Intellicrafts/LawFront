import React, { useMemo, useState } from 'react';
import { Filter, FileStack, X } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { TEMPLATES, searchTemplates } from '../data/templates';
import TemplateCard from './TemplateCard';
import EmptyState from './shared/EmptyState';

/**
 * Full searchable / filterable list of templates. Used on the landing page
 * below trending + categories, and as the destination of "Browse All".
 */
const AllTemplatesView = ({ search, setSearch, onSelectTemplate, isDarkMode, idRef }) => {
  const [activeCategories, setActiveCategories] = useState([]); // multi-select
  const [sort, setSort] = useState('default');

  const toggleCategory = (id) =>
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const visible = useMemo(() => {
    let list = search && search.trim() ? searchTemplates(search) : TEMPLATES;
    if (activeCategories.length) {
      list = list.filter((t) => activeCategories.includes(t.category));
    }
    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'fastest') {
      list = [...list].sort((a, b) => {
        const parse = (t) => parseInt(String(t.estimatedTime).match(/\d+/)?.[0] || '999', 10);
        return parse(a) - parse(b);
      });
    }
    return list;
  }, [search, activeCategories, sort]);

  return (
    <section
      ref={idRef}
      id="all-templates"
      className="px-4 sm:px-6 max-w-7xl mx-auto mt-12 pb-16 scroll-mt-24"
    >
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <FileStack size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              All Templates
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              {visible.length} of {TEMPLATES.length} shown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest
              ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <Filter size={11} />
            Sort
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest cursor-pointer
              ${isDarkMode ? 'bg-[#141414] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            <option value="default">Recommended</option>
            <option value="name">A → Z</option>
            <option value="fastest">Fastest</option>
          </select>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hidden mb-5">
        <div className="flex gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveCategories([])}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
              ${
                activeCategories.length === 0
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isDarkMode
                    ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5
                  ${
                    active
                      ? `bg-gradient-to-r ${cat.gradient} border-transparent text-white shadow-md`
                      : isDarkMode
                        ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
              >
                {cat.name}
                {active ? <X size={9} /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {visible.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {visible.map((tpl, idx) => (
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
      ) : (
        <EmptyState
          title="No templates match your filters"
          description="Try clearing some filters or searching for a different keyword."
          action={
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategories([]);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all"
            >
              Clear Filters
            </button>
          }
          isDarkMode={isDarkMode}
        />
      )}
    </section>
  );
};

export default AllTemplatesView;
