import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Check, Download, FileText, Share2, ArrowRight, FilePlus2 } from 'lucide-react';
import PremiumBadge from './shared/PremiumBadge';

const useViewport = () => {
  const [size, setSize] = useState({
    w: typeof window === 'undefined' ? 1024 : window.innerWidth,
    h: typeof window === 'undefined' ? 768 : window.innerHeight,
  });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
};

const DownloadSuccessModal = ({
  open,
  template,
  pdf,
  onClose,
  onDownload,
  onMyDocuments,
  onGenerateAnother,
  isDarkMode,
}) => {
  const { w, h } = useViewport();
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const tryShare = async () => {
    if (!pdf?.blob) return onDownload();
    try {
      const file = new File([pdf.blob], pdf.filename, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: template?.name });
      } else {
        onDownload();
      }
    } catch {
      // User cancelled or share failed — silently fall back.
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Confetti behind the modal */}
          <div className="absolute inset-0 pointer-events-none">
            <Confetti
              width={w}
              height={h}
              numberOfPieces={180}
              recycle={false}
              gravity={0.18}
              colors={['#3B82F6', '#6366F1', '#8B5CF6', '#10B981', '#F59E0B']}
            />
          </div>

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className={`relative w-full max-w-md rounded-3xl overflow-hidden border shadow-2xl
              ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-200/70'}`}
          >
            {/* Top accent */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-gradient-to-br from-emerald-500/30 to-blue-500/30 blur-3xl pointer-events-none" />

            <div className="relative p-7 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.05 }}
                className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/40"
              >
                <Check size={42} strokeWidth={3} className="text-white" />
              </motion.div>

              <div className="flex justify-center mb-2">
                <PremiumBadge icon="sparkles" label="Document Generated" variant="emerald" size="xs" />
              </div>
              <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Beautifully done!
              </h2>
              <p className={`mt-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Your <span className="font-bold">{template?.name}</span> is ready as a premium PDF, complete with cover page, watermark, page numbers and signature blocks.
              </p>

              {/* Filename card */}
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 flex items-center gap-3 text-left
                  ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center
                    ${isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-600'}`}
                >
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                    Filename
                  </p>
                  <p className={`text-[12px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {pdf?.filename || 'MeraBakil-document.pdf'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={onDownload}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95"
                >
                  <Download size={14} /> Download PDF
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {shareSupported && (
                    <button
                      type="button"
                      onClick={tryShare}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                        ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Share2 size={12} /> Share
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onMyDocuments}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                      ${shareSupported ? '' : 'col-span-2'}
                      ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FileText size={12} /> My Documents
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onGenerateAnother}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <FilePlus2 size={12} /> Generate Another <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadSuccessModal;
