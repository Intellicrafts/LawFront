import React from 'react';
import { Wallet, TrendingUp, Gift, Plus, ArrowUpRight, Sparkles } from 'lucide-react';

const WalletBalance = ({ balance, onAddFunds, onWithdraw, isDark, loading }) => {
    const total = parseFloat(balance?.total_balance || 0);
    const earned = parseFloat(balance?.earned_balance || 0);
    const promo = parseFloat(balance?.promotional_balance || 0);

    const fmt = (val) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading) {
        return (
            <div className="space-y-4">
                <div className={`p-5 sm:p-6 rounded-[1.5rem] animate-pulse flex flex-col ${isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <div className={`w-24 h-3 rounded-full mb-3 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                            <div className={`w-36 h-8 rounded-lg ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                        </div>
                        <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className={`h-[84px] rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'}`} />
                        <div className={`h-[84px] rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'}`} />
                    </div>
                    <div className="flex gap-3">
                        <div className={`flex-1 h-[38px] rounded-xl ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                        <div className={`flex-1 h-[38px] rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Primary Balance Hero Card - Scaled Down */}
            <div className={`relative overflow-hidden rounded-[1.5rem] transition-shadow duration-500 hover:shadow-lg ${isDark ? 'shadow-emerald-900/10' : 'shadow-emerald-500/5'}`}>
                {/* Background base */}
                <div className={`absolute inset-0 ${isDark ? 'bg-[#0a1512]' : 'bg-[#0f2922]'}`} />
                
                {/* Animated organic gradients */}
                <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-emerald-600/40 blur-[80px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-teal-500/30 blur-[80px] rounded-full mix-blend-screen" />
                </div>
                
                {/* Subtile grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="relative p-5 sm:p-6 flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <Sparkles size={12} className="text-emerald-300/80" />
                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-100/70">Total Balance</span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                                    <span className="font-medium text-emerald-400/80">₹</span>{fmt(total)}
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">INR</span>
                            </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                            <Wallet size={18} className="text-emerald-100" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Sub-balances Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="group rounded-xl bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm border border-white/5 hover:border-white/10 p-3.5 transition-all duration-300">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <TrendingUp size={10} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-100/50">Earned</span>
                            </div>
                            <p className="text-lg sm:text-xl font-light text-white tracking-tight">₹{fmt(earned)}</p>
                            <p className="text-[8px] text-white/30 mt-0.5 uppercase tracking-wider">Withdrawable</p>
                        </div>
                        <div className="group rounded-xl bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm border border-white/5 hover:border-white/10 p-3.5 transition-all duration-300">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Gift size={10} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-100/50">Promo</span>
                            </div>
                            <p className="text-lg sm:text-xl font-light text-white tracking-tight">₹{fmt(promo)}</p>
                            <p className="text-[8px] text-white/30 mt-0.5 uppercase tracking-wider">Services only</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={onAddFunds}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white text-[#0f2922] text-[10px] font-bold uppercase tracking-[0.1em] shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:scale-[1.02] hover:shadow-[0_4px_15px_rgb(255,255,255,0.2)] transition-all duration-300 active:scale-95"
                        >
                            <Plus size={14} strokeWidth={2.5} />
                            Add Funds
                        </button>
                        <button
                            onClick={onWithdraw}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                        >
                            <ArrowUpRight size={14} strokeWidth={2} className="text-emerald-300" />
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;
