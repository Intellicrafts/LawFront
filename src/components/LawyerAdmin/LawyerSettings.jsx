
import React, { useState } from 'react';
import {
    Settings, Lock, Bell, Shield, Eye, Save, Trash2,
    Smartphone, Monitor, Globe, User, Check, AlertCircle,
    CreditCard, Key, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", darkMode, hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -1, shadow: '0 8px 12px -3px rgb(0 0 0 / 0.1)' } : {}}
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
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[type]}`}>
            {text}
        </span>
    );
};

const LawyerSettings = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('security');

    const settingsTabs = [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'account', label: 'Account', icon: User },
        { id: 'billing', label: 'Payments', icon: CreditCard },
    ];

    return (
        <div className="p-4 sm:p-5 space-y-5 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <PremiumBadge text="System Preferences" type="secondary" />
                        <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Configuration Console</span>
                    </div>
                    <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        System <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Settings</span>
                    </h1>
                </div>

                <button className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all ${darkMode ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-105'}`}>
                    <Save size={14} /> Synchronize
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation */}
                <div className="lg:col-span-1">
                    <GlassCard darkMode={darkMode} className="p-2 space-y-1">
                        {settingsTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === tab.id
                                    ? (darkMode ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-900 text-white shadow-lg')
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </GlassCard>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-5">
                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <GlassCard darkMode={darkMode} className="p-5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                        <Key size={18} />
                                    </div>
                                    <div>
                                        <h3 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Access Control</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Manage your credentials</p>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
                                        <input
                                            type="password"
                                            className={`w-full h-10 px-4 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-white/30' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                                            <input
                                                type="password"
                                                className={`w-full h-10 px-4 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-white/30' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                                                    }`}
                                                placeholder="Min 8 chars"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repeat Password</label>
                                            <input
                                                type="password"
                                                className={`w-full h-10 px-4 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-white/30' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                                                    }`}
                                                placeholder="Verify match"
                                            />
                                        </div>
                                    </div>
                                    <button className="h-9 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest mt-2 hover:scale-[1.02] transition-all">
                                        Update Passcode
                                    </button>
                                </div>
                            </GlassCard>

                            <GlassCard darkMode={darkMode} className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                            <Smartphone size={18} />
                                        </div>
                                        <div>
                                            <h3 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Two-Factor Guard</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secondary verification layer</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <GlassCard darkMode={darkMode} className="p-5">
                                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Dispatch Protocol</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Appointment Alerts', sub: 'Instant push notifications for new consultations', icon: Globe },
                                        { title: 'Case Updates', sub: 'Daily briefing on active litigation progress', icon: Monitor },
                                        { title: 'Client Direct', sub: 'Receive messages from client portal directly', icon: MessageSquare }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                                    <item.icon size={16} />
                                                </div>
                                                <div>
                                                    <p className={`text-[12px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.sub}</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                    {activeTab === 'account' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <GlassCard darkMode={darkMode} className="p-5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h3 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Account Information</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Manage your identity</p>
                                    </div>
                                </div>
                                <div className="space-y-3 max-w-md">
                                    {[
                                        { label: 'Display Name', value: 'Your name from profile', icon: User },
                                        { label: 'Email Address', value: 'Registered email', icon: Globe },
                                        { label: 'Phone Number', value: 'Contact on record', icon: Smartphone },
                                    ].map((field, i) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50 border-slate-100'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <field.icon size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{field.label}</p>
                                                    <p className={`text-[12px] font-bold ${darkMode ? 'text-slate-300 italic' : 'text-slate-600 italic'}`}>{field.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <p className={`text-[10px] font-bold mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                        → Edit these details in your Academic Profile tab
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <GlassCard darkMode={darkMode} className="p-5">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <h3 className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Payment & Wallet</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Earnings and withdrawal management</p>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl border mb-4 ${darkMode ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'
                                    }`}>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Wallet Balance</p>
                                    <p className={`text-2xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Available in Dashboard</p>
                                    <p className={`text-[10px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        View real-time balance and withdraw from the Dashboard tab
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/3 border-white/8' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                    <p className={`text-[11px] font-black mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Transaction History</p>
                                    <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Full ledger of all credit and debit transactions is available on the Dashboard.
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LawyerSettings;
