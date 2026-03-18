import React from 'react';
import { Wallet, TrendingUp, Gift, Plus, ArrowUpRight, Sparkles } from 'lucide-react';

const WalletBalance = ({ balance, onAddFunds, onWithdraw, isDark, loading }) => {
    const total = parseFloat(balance?.total_balance || 0);
    const earned = parseFloat(balance?.earned_balance || 0);
    const promo = parseFloat(balance?.promotional_balance || 0);

    const fmt = (val) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {/* Skeleton Hero Card */}
                <div className={`relative h-48 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
                    <div className="p-6 sm:p-8">
                        <div className="w-24 h-3 rounded bg-white/20 mb-3" />
                        <div className="w-48 h-12 rounded bg-white/20" />
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="h-16 rounded-xl bg-white/10" />
                            <div className="h-16 rounded-xl bg-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Primary Balance Hero Card */}
            <div className="relative overflow-hidden rounded-2xl">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
                <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)' }} />
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full bg-white/5" />

                <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={12} className="text-emerald-200" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Total Balance</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                    ₹{fmt(total)}
                                </span>
                                <span className="text-sm font-bold text-white/50">INR</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <Wallet size={22} className="text-white" />
                        </div>
                    </div>

                    {/* Sub-balances */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <TrendingUp size={11} className="text-emerald-300" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Earned</span>
                            </div>
                            <p className="text-lg font-black text-white">₹{fmt(earned)}</p>
                            <p className="text-[9px] text-white/50 mt-0.5">Withdrawable</p>
                        </div>
                        <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Gift size={11} className="text-purple-300" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Promo</span>
                            </div>
                            <p className="text-lg font-black text-white">₹{fmt(promo)}</p>
                            <p className="text-[9px] text-white/50 mt-0.5">Services only</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onAddFunds}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-emerald-700 text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <Plus size={14} strokeWidth={3} />
                            Add Funds
                        </button>
                        <button
                            onClick={onWithdraw}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-black uppercase tracking-wider hover:bg-white/25 transition-all duration-200"
                        >
                            <ArrowUpRight size={14} strokeWidth={2.5} />
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;
