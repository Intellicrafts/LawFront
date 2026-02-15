
import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Search, Plus, Download, Eye, Share2, MoreHorizontal, Filter,
  FolderOpen, Clock, CheckCircle2, AlertCircle, HardDrive, Shield,
  Files, LayoutGrid, List, Trash2, Edit, ExternalLink, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { documentsAPI } from '../../api/apiService';

// --- Premium UI Components ---

const GlassCard = ({ children, className = "", darkMode, hover = true, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -2, shadow: '0 15px 30px -5px rgb(0 0 0 / 0.1)' } : {}}
    className={`
      relative overflow-hidden rounded-[24px] border transition-all duration-300
      ${darkMode
        ? 'bg-neutral-900/60 border-white/5 backdrop-blur-xl'
        : 'bg-white/80 border-slate-200/50 backdrop-blur-lg'
      }
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const PremiumBadge = ({ text, type = 'primary' }) => {
  const styles = {
    primary: 'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20',
    secondary: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[type]}`}>
      {text}
    </span>
  );
};

// --- Main Component ---

const LawyerDocuments = ({ darkMode }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Integration with documentsAPI.getDraftingRequests() or similar
      const data = await documentsAPI.getDraftingRequests?.() || [];
      setDocuments(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = (doc.title || doc.document_name || 'Document')?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [documents, searchQuery]);

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <PremiumBadge text="Digital Archive" type="secondary" />
            <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Records</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Document <span className="text-slate-900">Repository</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-white/5 ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Query archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-40 sm:w-64"
            />
          </div>
          <button className={`h-8 w-8 flex items-center justify-center rounded-xl shadow-lg transition-all ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-105'}`}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Storage', value: '42.8 GB', icon: HardDrive, color: darkMode ? 'text-white' : 'text-slate-900' },
          { label: 'Records', value: documents.length || 154, icon: Files, color: 'text-blue-500' },
          { label: 'Secure Shares', value: '24 Active', icon: Shield, color: 'text-slate-500' },
          { label: 'Drafts', value: '08 Docs', icon: Edit, color: 'text-amber-600' }
        ].map((stat, i) => (
          <GlassCard key={i} darkMode={darkMode} className="p-3" hover={false}>
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 ${stat.color}`}>
                <stat.icon size={14} />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-0.5">{stat.label}</p>
                <p className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-1 p-1 rounded-2xl border bg-slate-100/50 dark:bg-white/5 dark:border-white/5">
          {['all', 'drafts', 'finalized', 'evidence'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type
                ? (darkMode ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-900 text-white shadow-md')
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-500' : 'text-slate-400'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-500' : 'text-slate-400'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Records Flow */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`h-36 rounded-[24px] animate-pulse ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
            ))
          ) : filteredDocs.length > 0 ? (
            filteredDocs.map((doc, idx) => (
              <GlassCard key={doc.id || idx} darkMode={darkMode}>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                        <Download size={12} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 mb-3">
                    <h3 className={`text-[12px] font-black leading-tight line-clamp-2 mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {doc.document_name || doc.title || 'Legal Document ' + (idx + 1)}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-70">Case: #881-CIVIL</p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                      <Clock size={10} /> 2 days ago
                    </div>
                    <PremiumBadge text="Secured" type="primary" />
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-100 dark:bg-white/5`}>
                <FolderOpen size={28} className="text-slate-300" />
              </div>
              <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>No Records</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Upload files to initialize repository</p>
            </div>
          )}
        </div>
      ) : (
        <GlassCard darkMode={darkMode} className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/5 bg-white/2' : 'border-slate-100 bg-slate-50/50'}`}>
                <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-500">File Reference</th>
                <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-500">Classification</th>
                <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-500">Size / Type</th>
                <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {(filteredDocs.length > 0 ? filteredDocs : [1, 2, 3]).map((doc, idx) => (
                <tr key={doc.id || idx} className={`group transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className={darkMode ? 'text-slate-400' : 'text-slate-600'} />
                      <div>
                        <p className={`text-[11px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{doc.document_name || 'Legal_Draft_v1.pdf'}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Updated: Feb 12</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <PremiumBadge text="Drafting" type="secondary" />
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-[10px] font-bold text-slate-500">2.4 MB • PDF</p>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}>
                        <Download size={14} />
                      </button>
                      <button className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}>
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};

export default LawyerDocuments;