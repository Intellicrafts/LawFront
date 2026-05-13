import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ClipboardEdit, RefreshCw, ChevronUp, X, AlertCircle } from 'lucide-react';
import DocumentPreview from './DocumentPreview';
import { validateField } from '../utils/validators';

const groupVariables = (variables) => {
  const map = new Map();
  variables.forEach((v) => {
    const g = v.group || 'Details';
    if (!map.has(g)) map.set(g, []);
    map.get(g).push(v);
  });
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
};

const FieldInput = ({ variable, value, onChange, error, isDarkMode }) => {
  const base = `w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all
    ${isDarkMode
      ? 'bg-[#1A1A1A] text-white placeholder-gray-600 focus:bg-[#202020]'
      : 'bg-slate-50 text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-300 focus:bg-white focus:shadow-sm'
    }
    ${error ? '!ring-2 !ring-red-500/40 !border-red-400' : ''}`;

  if (variable.type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={variable.placeholder || ''}
        rows={4}
        className={`${base} resize-y min-h-[88px]`}
      />
    );
  }
  if (variable.type === 'select') {
    return (
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${base} cursor-pointer`}>
        <option value="">Select…</option>
        {(variable.options || []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (variable.type === 'date') {
    return <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} className={base} />;
  }
  if (variable.type === 'number') {
    return (
      <input
        type="number"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={variable.placeholder || ''}
        className={base}
      />
    );
  }
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={variable.placeholder || ''}
      className={base}
    />
  );
};

/**
 * Multi-step wizard form, one page per group. Includes inline validation,
 * sticky step controls, and live preview on the right (desktop) or via a
 * floating button (mobile).
 */
const CustomFormFlow = ({
  template,
  values,
  onValuesChange,
  onComplete,
  onSwitchMode,
  isDarkMode,
}) => {
  const groups = useMemo(() => groupVariables(template.variables || []), [template]);
  const [stepIdx, setStepIdx] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const total = groups.length;
  const currentGroup = groups[stepIdx];

  const updateField = (key, newValue) => {
    onValuesChange({ [key]: newValue });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateGroup = () => {
    if (!currentGroup) return true;
    const newErrors = {};
    currentGroup.items.forEach((v) => {
      const err = validateField(v, values[v.key]);
      if (err) newErrors[v.key] = err;
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateGroup()) return;
    if (stepIdx < total - 1) {
      setStepIdx((s) => s + 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete && onComplete(values);
    }
  };

  const goPrev = () => {
    if (stepIdx > 0) setStepIdx((s) => s - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/30">
            <ClipboardEdit size={18} className="text-white" />
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Custom Form
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              {template.name}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSwitchMode && onSwitchMode('ai')}
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all
            ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <RefreshCw size={11} /> Switch to AI
        </button>
      </div>

      {/* Step progress */}
      <div className="mb-4">
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${((stepIdx + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
          <span className={isDarkMode ? 'text-gray-400' : 'text-slate-500'}>
            Step {stepIdx + 1} of {total} — {currentGroup?.name}
          </span>
          <span className={isDarkMode ? 'text-gray-500' : 'text-slate-400'}>
            {currentGroup?.items.length} {currentGroup?.items.length === 1 ? 'field' : 'fields'}
          </span>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid lg:grid-cols-[1fr_minmax(0,1fr)] gap-4 lg:gap-5 lg:min-h-[560px]">
        {/* Form */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 flex flex-col
            ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-200/70 shadow-md'}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${stepIdx}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <div className="mb-5">
                <span
                  className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                    ${isDarkMode ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}
                >
                  Group {stepIdx + 1}
                </span>
                <h3 className={`mt-2 text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {currentGroup?.name}
                </h3>
              </div>

              <div className="space-y-4">
                {currentGroup?.items.map((variable) => {
                  const err = errors[variable.key];
                  return (
                    <div key={variable.key}>
                      <label
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}
                      >
                        {variable.label}
                        {variable.required ? <span className="text-red-500">*</span> : null}
                      </label>
                      <FieldInput
                        variable={variable}
                        value={values[variable.key]}
                        onChange={(v) => updateField(variable.key, v)}
                        error={err}
                        isDarkMode={isDarkMode}
                      />
                      {err ? (
                        <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-500">
                          <AlertCircle size={10} /> {err}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Step controls */}
          <div className="mt-6 pt-4 border-t flex items-center justify-between gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={goPrev}
              disabled={stepIdx === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <ArrowLeft size={11} /> Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all active:scale-95"
            >
              {stepIdx === total - 1 ? (
                <>
                  Preview & Download <Check size={11} />
                </>
              ) : (
                <>
                  Next Step <ArrowRight size={11} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview (desktop) */}
        <div className="hidden lg:block lg:min-h-[560px]">
          <DocumentPreview template={template} values={values} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Mobile switch-mode */}
      <div className="mt-3 sm:hidden">
        <button
          type="button"
          onClick={() => onSwitchMode && onSwitchMode('ai')}
          className={`w-full px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5
            ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          <RefreshCw size={11} /> Switch to AI Assistant
        </button>
      </div>

      {/* Mobile preview button */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          type="button"
          onClick={() => setShowPreviewMobile(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30 active:scale-95 flex items-center gap-2"
        >
          Preview <ChevronUp size={13} />
        </button>
      </div>

      <AnimatePresence>
        {showPreviewMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-end"
            onClick={(e) => e.target === e.currentTarget && setShowPreviewMobile(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => info.offset.y > 120 && setShowPreviewMobile(false)}
              className={`w-full h-[88vh] rounded-t-3xl overflow-hidden border-t ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Live Preview
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreviewMobile(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-[calc(88vh-52px)]">
                <DocumentPreview template={template} values={values} isDarkMode={isDarkMode} compact />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomFormFlow;
