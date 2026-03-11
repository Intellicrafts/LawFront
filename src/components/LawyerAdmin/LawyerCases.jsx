
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Eye, Edit3, Briefcase, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, Clock, Gavel, Scale, FileText,
  Target, Award, TrendingUp, Flame, Sparkles, Building2, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { casesAPI } from '../../api/apiService';
import { useTheme } from '../../context/ThemeContext';

// --- Premium UI Components ---

const COLORS = {
  primary: '#1E293B',
  secondary: '#334155',
  warning: '#B45309',
  danger: '#991B1B',
  info: '#3B82F6',
};

const GlassCard = ({ children, className = "", darkMode, hover = true, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -2, shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } : {}}
    className={`
      relative overflow-hidden rounded-[20px] border transition-all duration-300
      ${darkMode
        ? 'bg-neutral-900/60 border-white/5 backdrop-blur-xl'
        : 'bg-white/80 border-slate-200/50 backdrop-blur-lg shadow-sm'
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

const LawyerCases = ({ darkMode }) => {
  const { isDark } = useTheme();
  const activeDarkMode = darkMode !== undefined ? darkMode : isDark;

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await casesAPI.getCases();
      // Ensure we have an array, fallback to something if API is down
      setCases(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = (c.title || c.case_name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.case_number || c.id)?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, filterStatus]);

  const getStatusType = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'primary';
      case 'pending': return 'warning';
      case 'closed': return 'info';
      case 'archived': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <PremiumBadge text="Judicial Oversight" type="secondary" />
            <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Litigations</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${activeDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Legal <span className={activeDarkMode ? 'text-slate-400' : 'text-slate-500'}>Portfolio</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center h-8 px-3 gap-2 rounded-xl border transition-all ${activeDarkMode ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-white border-slate-200 focus-within:border-slate-900'}`}>
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-40 sm:w-64"
            />
          </div>
          <button className={`h-8 w-8 flex items-center justify-center rounded-xl shadow-lg transition-all ${activeDarkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-105'}`}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Litigations', value: cases.length, icon: Scale, color: 'text-blue-500', bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', border: darkMode ? 'border-blue-500/20' : 'border-blue-100' },
          { label: 'Active Hearings', value: cases.filter(c => c.status === 'active').length, icon: Gavel, color: 'text-amber-500', bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', border: darkMode ? 'border-amber-500/20' : 'border-amber-100' },
          { label: 'Urgent Filings', value: '03', icon: Flame, color: 'text-red-500', bg: darkMode ? 'bg-red-500/10' : 'bg-red-50', border: darkMode ? 'border-red-500/20' : 'border-red-100' },
          { label: 'Win Ratio', value: '94%', icon: Target, color: 'text-emerald-500', bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', border: darkMode ? 'border-emerald-500/20' : 'border-emerald-100' }
        ].map((stat, i) => (
          <GlassCard key={i} darkMode={activeDarkMode} className="p-3" hover={false}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${stat.bg} ${stat.border}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`text-lg font-black ${activeDarkMode ? 'text-white' : 'text-slate-900'}`}
                >{stat.value}</motion.p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-xl border bg-slate-100/50 dark:bg-white/5 dark:border-white/5">
        {[
          { id: 'all', label: 'All Cases' },
          { id: 'active', label: 'Active' },
          { id: 'pending', label: 'Pending' },
          { id: 'closed', label: 'Closed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterStatus === tab.id
              ? (activeDarkMode ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-900 text-white shadow-md')
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Table - Compact Premium Look */}
      <GlassCard darkMode={activeDarkMode} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${activeDarkMode ? 'border-white/5 bg-white/2' : 'border-slate-100 bg-slate-50/50'}`}>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Case Identifier</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Client Info</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Next Action</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c, idx) => (
                  <tr key={c.id || idx} className={`group transition-colors ${activeDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${activeDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className={`text-[13px] font-black ${activeDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.case_number || c.case_name || 'CIV-2024-X'}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{c.case_type || 'Corporate Dispute'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className={`text-[12px] font-bold ${activeDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{c.client_name || 'Private Client'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'active' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' :
                            c.status === 'pending' ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]' :
                              c.status === 'closed' ? 'bg-blue-400' : 'bg-slate-400'
                          }`} />
                        <PremiumBadge text={c.status || 'Active'} type={getStatusType(c.status)} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-amber-500" />
                        <div>
                          <p className={`text-[11px] font-bold ${activeDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Hearing Day</p>
                          <p className="text-[10px] text-slate-500 uppercase">Feb 24, 2024</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className={`p-2 rounded-xl transition-all ${activeDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                          <Eye size={16} />
                        </button>
                        <button className={`p-2 rounded-xl transition-all ${activeDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                          <Edit3 size={16} />
                        </button>
                        <button className={`p-2 rounded-xl transition-all ${activeDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Briefcase size={32} className="text-slate-200 mb-2" />
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">No Cases in Current Filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default LawyerCases;