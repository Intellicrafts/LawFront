import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2, Clock, FolderOpen, Sparkles } from 'lucide-react';
import EmptyState from './shared/EmptyState';

const STORAGE_KEY = 'mb_my_documents';

export const saveGeneratedDocument = (entry) => {
  if (typeof window === 'undefined') return;
  try {
    const list = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    const next = [
      { ...entry, id: `doc-${Date.now()}`, savedAt: Date.now() },
      ...list,
    ].slice(0, 50); // cap to last 50
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors — best-effort save
  }
};

const loadDocuments = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const removeDocument = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const list = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.filter((d) => d.id !== id)));
  } catch {
    // ignore
  }
};

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const downloadFromDataUri = (dataUri, filename) => {
  if (!dataUri) return;
  const a = document.createElement('a');
  a.href = dataUri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const MyDocumentsView = ({ onBrowse, isDarkMode, refreshKey = 0 }) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    setDocs(loadDocuments());
  }, [refreshKey]);

  const handleDelete = useCallback((id) => {
    removeDocument(id);
    setDocs(loadDocuments());
  }, []);

  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto mt-12 pb-16">
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/20">
            <FolderOpen size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              My Documents
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              {docs.length === 0 ? 'No documents yet' : `${docs.length} document${docs.length === 1 ? '' : 's'} saved locally`}
            </p>
          </div>
        </div>
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't generated any documents yet"
          description="Generate your first premium legal document and it will appear here for easy re-download anytime."
          action={
            <button
              type="button"
              onClick={onBrowse}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 inline-flex items-center gap-1.5"
            >
              <Sparkles size={12} /> Browse Templates
            </button>
          }
          isDarkMode={isDarkMode}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {docs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                className={`group rounded-2xl border p-4 transition-all
                  ${isDarkMode
                    ? 'bg-[#141414] border-white/5 hover:border-blue-500/30'
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shrink-0`}
                  >
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {doc.templateName}
                    </h3>
                    <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                      {doc.filename}
                    </p>
                    <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      <Clock size={9} /> {formatTime(doc.savedAt)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadFromDataUri(doc.dataUri, doc.filename)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95"
                  >
                    <Download size={11} /> Download
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className={`px-2 py-2 rounded-lg border transition-all
                      ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                    aria-label="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default MyDocumentsView;
