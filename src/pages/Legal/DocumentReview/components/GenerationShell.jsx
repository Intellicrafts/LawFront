import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Sparkles, MessageSquare, Eye, Download, Loader } from 'lucide-react';
import Stepper from './shared/Stepper';
import ModeSelector from './ModeSelector';
import AIAssistantFlow from './AIAssistantFlow';
import CustomFormFlow from './CustomFormFlow';
import DocumentPreview from './DocumentPreview';
import { generatePdf } from '../utils/pdfGenerator';

const STEPS = [
  { id: 'mode', label: 'Choose Mode', icon: Sparkles },
  { id: 'collect', label: 'Provide Details', icon: MessageSquare },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'download', label: 'Download', icon: Download },
];

/**
 * Full-screen wrapper that hosts the generation journey: mode selection,
 * collection (AI or Form), preview and download.
 */
const GenerationShell = ({
  template,
  step,
  mode,
  values,
  onUpdateValues,
  onReplaceValues,
  onSetMode,
  onBackToMode,
  onGoPreview,
  onGoBackToCollect,
  onPdfGenerated,
  onExit,
  isDarkMode,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const stepIndex = step === 'mode' ? 0 : step === 'collect' ? 1 : step === 'preview' ? 2 : step === 'success' ? 3 : 0;

  const triggerGenerate = async () => {
    setIsGenerating(true);
    setGenError(null);
    try {
      const pdf = await generatePdf(template, values);
      onPdfGenerated(pdf);
    } catch (e) {
      console.error('PDF generation failed', e);
      setGenError(e?.message || 'Could not generate the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[75] overflow-y-auto ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]'}`}
    >
      {/* Sticky top bar */}
      <div
        className={`sticky top-0 z-30 px-4 sm:px-6 py-3 backdrop-blur-xl border-b
          ${isDarkMode ? 'bg-[#0A0A0A]/85 border-white/5' : 'bg-white/85 border-slate-200/60'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onExit}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              aria-label="Exit"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="min-w-0">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                Generating
              </p>
              <h1 className={`text-xs sm:text-sm font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {template.name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onExit}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
              ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <X size={12} /> Exit
          </button>
        </div>

        <div className="max-w-3xl mx-auto mt-3">
          <Stepper steps={STEPS} currentIndex={stepIndex} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Main step content */}
      <AnimatePresence mode="wait">
        {step === 'mode' && (
          <motion.div
            key="mode"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <ModeSelector template={template} onChoose={onSetMode} isDarkMode={isDarkMode} />
          </motion.div>
        )}

        {step === 'collect' && mode === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <AIAssistantFlow
              template={template}
              values={values}
              onValuesChange={onUpdateValues}
              onComplete={(finalValues) => {
                if (finalValues) onReplaceValues({ ...values, ...finalValues });
                onGoPreview();
              }}
              onSwitchMode={(m) => onSetMode(m)}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}

        {step === 'collect' && mode === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <CustomFormFlow
              template={template}
              values={values}
              onValuesChange={onUpdateValues}
              onComplete={onGoPreview}
              onSwitchMode={(m) => onSetMode(m)}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 py-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Final Preview
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  Review carefully before download
                </p>
              </div>
              <button
                type="button"
                onClick={onGoBackToCollect}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest
                  ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ArrowLeft size={11} /> Edit Details
              </button>
            </div>

            <div className="h-[calc(100vh-260px)] min-h-[420px]">
              <DocumentPreview template={template} values={values} isDarkMode={isDarkMode} />
            </div>

            {genError ? (
              <div className="mt-4 rounded-xl p-3 border bg-red-500/10 border-red-500/30 text-red-300 text-[10px] font-bold">
                {genError}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onGoBackToCollect}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                  ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={triggerGenerate}
                disabled={isGenerating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader size={13} className="animate-spin" /> Generating PDF…
                  </>
                ) : (
                  <>
                    Generate Premium PDF <Download size={13} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerationShell;
