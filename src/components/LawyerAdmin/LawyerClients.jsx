
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Plus, Mail, Phone, MapPin, Star, Activity, MoreHorizontal,
  ChevronRight, ArrowUpRight, ShieldCheck, Crown, Briefcase, Clock,
  Trash2, Edit3, MessageSquare, Filter, Building2, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiServices } from '../../api/apiService';
import Avatar from '../common/Avatar';

// --- Premium UI Components ---

const GlassCard = ({ children, className = "", darkMode, hover = true, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -3, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
    className={`
      relative overflow-hidden rounded-[24px] border transition-all duration-300
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

const LawyerClients = ({ darkMode }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, premium, regular

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // Integration with real API: apiServices.getClients()
      // For now, using the established pattern
      const data = await apiServices.getClients?.() || [];
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    return (clients || []).filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' ? true : (filterType === 'premium' ? c.premium : !c.premium);
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchQuery, filterType]);

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <PremiumBadge text="Client Base" type="secondary" />
            <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Directory Explorer</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Client <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Vault</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center h-8 px-3 gap-2 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-white border-slate-200 focus-within:border-slate-900'}`}>
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-40 sm:w-64"
            />
          </div>
          <button className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-[1.02]'}`}>
            <UserPlus size={14} /> New
          </button>
        </div>
      </div>

      {/* Tabs / Segmented Control */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-xl border bg-slate-100/50 dark:bg-white/5 dark:border-white/5">
        {[
          { id: 'all', label: 'All Profiles' },
          { id: 'premium', label: 'VIP' },
          { id: 'active', label: 'Engaged' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === tab.id
              ? (darkMode ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-900 text-white shadow-md')
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className={`h-56 rounded-[24px] animate-pulse ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client, idx) => (
            <GlassCard key={client.id || idx} darkMode={darkMode} className="group">
              {/* Card Header */}
              <div className={`h-16 w-full relative ${darkMode ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                {client.premium && (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className={`p-1 px-1.5 rounded-lg flex items-center gap-1 shadow-lg ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                      <Crown size={9} className="fill-current" />
                      <span className="text-[7px] font-black uppercase tracking-widest">VIP</span>
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-5 left-4 border-2 border-white dark:border-neutral-900 rounded-[18px] overflow-hidden shadow-lg">
                  <Avatar name={client.name} src={client.avatar} size={44} className="rounded-none bg-slate-200" />
                </div>
              </div>

              <div className="p-4 pt-6 space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                    <ShieldCheck size={9} /> Verified User
                  </div>
                  <h3 className={`text-[13px] font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{client.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold truncate mt-1 opacity-70">{client.company || 'Private Individual'}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Mail size={12} className="opacity-50" />
                    <span className="truncate">{client.email || 'no-email@id.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Phone size={12} className="opacity-50" />
                    <span>{client.phone || '+91 000-000-0000'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-white/3 flex flex-col items-center justify-center">
                    <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Cases</p>
                    <p className={`text-[12px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>04</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-white/3 flex flex-col items-center justify-center">
                    <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Trust</p>
                    <p className={`text-[12px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>98%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className={`flex-1 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-lg ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                    View Profile
                  </button>
                  <button className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${darkMode ? 'border-white/10 hover:bg-white/5 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}>
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Users size={28} className="text-slate-300" />
            </div>
            <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>No Clients Found</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Initialize CRM with 'New' action</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerClients;