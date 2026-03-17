
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Users, Search, Plus, Mail, Phone, MapPin, Star, Activity, MoreHorizontal,
  ChevronRight, ArrowUpRight, ShieldCheck, Crown, Briefcase, Clock,
  Trash2, Edit3, MessageSquare, Filter, Building2, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiServices } from '../../api/apiService';
import Avatar from '../common/Avatar';
import { useToast } from '../../context/ToastContext';

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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newClientData, setNewClientData] = useState({
    email: '',
    status: 'pending',
    priority: 'normal',
    notes: ''
  });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await apiServices.getClients?.() || { data: [] };
      // Handle standard Laravel pagination format robustly
      let clientData = [];
      if (Array.isArray(response)) {
        clientData = response;
      } else if (response && Array.isArray(response.data)) {
        // sometimes Laravel puts it in response.data.data
        if (response.data[0] === undefined && Array.isArray(response.data.data)) {
            clientData = response.data.data;
        } else {
            clientData = response.data;
        }
      } else if (response && response.data && Array.isArray(response.data.data)) {
        clientData = response.data.data;
      }
      setClients(clientData || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      if (!profile.id) throw new Error("Lawyer profile not found. Please log in again.");

      const payload = {
        ...newClientData,
        lawyer_id: profile.id
      };
      
      await apiServices.createClient(payload);
      showSuccess('Client added successfully!');
      setIsModalOpen(false);
      setNewClientData({ email: '', status: 'pending', priority: 'normal', notes: '' });
      fetchClients(); // Refresh list
    } catch (error) {
      console.error('Error creating client:', error);
      showError(error.response?.data?.message || 'Failed to add client. Check email address.');
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    return (clients || []).filter(c => {
      // Allow searching by client user name or email
      const clientName = c.user?.name || c.name || '';
      const clientEmail = c.user?.email || c.email || '';
      
      const matchesSearch = clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
        
      const isPremium = c.priority === 'high' || c.priority === 'urgent' || c.premium;
      const isActive = c.status === 'active' || c.active !== false;
      
      const matchesFilter = filterType === 'all' 
        ? true 
        : (filterType === 'premium' ? isPremium : isActive);
        
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchQuery, filterType]);

  const totalClients = filteredClients.length;
  // Count based on real priority enum
  const premiumClients = filteredClients.filter(c => c.priority === 'high' || c.priority === 'urgent' || c.premium).length;
  const activeClients = filteredClients.filter(c => c.status === 'active' || c.active !== false).length;

  return (
    <React.Fragment>
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
          <div className="relative group">
            <button 
              disabled
              onClick={() => {}}
              className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all opacity-50 cursor-not-allowed ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
              <UserPlus size={14} /> New
            </button>
            <div className={`absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl ${darkMode ? 'bg-neutral-800 text-white border border-white/10' : 'bg-white text-slate-900 border border-slate-200'}`}>
              Temporarily disabled by admin
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Clients', value: totalClients, icon: Users, color: darkMode ? 'text-white' : 'text-slate-900', bg: darkMode ? 'bg-white/5 border-white/8' : 'bg-slate-50 border-slate-100' },
          { label: 'VIP Clients', value: premiumClients, icon: Crown, color: 'text-amber-500', bg: darkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100' },
          { label: 'Active', value: activeClients, icon: Activity, color: 'text-emerald-500', bg: darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${s.bg}`}>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
              <s.icon size={14} className={s.color} />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
              <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
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
          filteredClients.map((client, idx) => {
            const isPremium = client.priority === 'high' || client.priority === 'urgent' || client.premium;
            const clientName = client.user?.name || client.name || 'Unknown Client';
            const clientEmail = client.user?.email || client.email || 'no-email@id.com';
            const clientPhone = client.user?.phone || client.phone || '+91 000-000-0000';
            const avatarUrl = client.user?.profile_image || client.user?.avatar || client.avatar;

            return (
            <GlassCard key={client.id || idx} darkMode={darkMode} className="group">
              {/* Card Banner with gradient tier */}
              <div className={`h-16 w-full relative rounded-t-[24px] overflow-hidden ${isPremium
                ? (darkMode ? 'bg-gradient-to-br from-amber-900/60 to-amber-700/40' : 'bg-gradient-to-br from-amber-50 to-amber-100')
                : (darkMode ? 'bg-gradient-to-br from-slate-800/60 to-slate-700/30' : 'bg-gradient-to-br from-slate-100 to-slate-200')
                }`}>
                {isPremium && (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className={`p-1 px-1.5 rounded-lg flex items-center gap-1 shadow-lg ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                      <Crown size={9} className="fill-current" />
                      <span className="text-[7px] font-black uppercase tracking-widest">{client.priority?.toUpperCase() || 'VIP'}</span>
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-5 left-4 border-2 border-white dark:border-neutral-900 rounded-[18px] overflow-hidden shadow-lg">
                  <Avatar name={clientName} src={avatarUrl} size={44} className="rounded-none bg-slate-200" />
                </div>
              </div>

              <div className="p-4 pt-6 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      <ShieldCheck size={9} /> Verified User
                    </div>
                    {client.status && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${client.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {client.status}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-[13px] font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{clientName}</h3>
                  <p className="text-[10px] text-slate-500 font-bold truncate mt-1 opacity-70">{client.company || client.service?.name || 'Private Individual'}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Mail size={12} className="opacity-50" />
                    <span className="truncate">{clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Phone size={12} className="opacity-50" />
                    <span>{clientPhone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-white/3 flex flex-col items-center justify-center">
                    <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Since</p>
                    <p className={`text-[10px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {client.onboarded_at ? new Date(client.onboarded_at).toLocaleDateString() : 'Pending'}
                    </p>
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
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full py-20 flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200 shadow-slate-100'}`}
            >
              <Users size={28} className="text-slate-400" />
            </motion.div>
            <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>No Clients Found</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Initialize CRM with 'New' action</p>
          </motion.div>
        )}
      </div>
    </div>

      {/* New Client Modal, rendered at the root level via Portal to cover headers */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`relative w-full max-w-md rounded-[24px] border shadow-2xl overflow-hidden ${darkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'}`}
              >
                <div className="p-6">
                  <h2 className={`text-xl font-black mb-1 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Add New Client</h2>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">Enter registered user email</p>
                  
                  <form onSubmit={handleCreateClient} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Client Email</label>
                      <input
                        required
                        type="email"
                        value={newClientData.email}
                        onChange={e => setNewClientData({...newClientData, email: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'}`}
                        placeholder="client@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Initial Status</label>
                        <select
                          value={newClientData.status}
                          onChange={e => setNewClientData({...newClientData, status: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Priority Level</label>
                        <select
                          value={newClientData.priority}
                          onChange={e => setNewClientData({...newClientData, priority: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Internal Notes (Optional)</label>
                      <textarea
                        value={newClientData.notes}
                        onChange={e => setNewClientData({...newClientData, notes: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none transition-all resize-none h-20 ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'}`}
                        placeholder="Case background or referral info..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className={`flex-1 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createLoading}
                        className={`flex-1 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all flex justify-center items-center ${darkMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} ${createLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {createLoading ? 'Starting...' : 'Add Client'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </React.Fragment>
  );
};

export default LawyerClients;