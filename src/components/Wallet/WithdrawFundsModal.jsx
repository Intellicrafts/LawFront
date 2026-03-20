import React, { useState } from 'react';
import { X, Landmark, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WithdrawFundsModal = ({ isOpen, onClose, onConfirm, isDark, loading, maxWithdrawable, useHighContrastWithdraw = false }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (amount && val > 0 && val <= maxWithdrawable) {
            onConfirm(amount);
            setAmount('');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`relative w-full max-w-[320px] p-6 rounded-[1.5rem] shadow-2xl ${isDark ? 'bg-[#111] border border-white/10 shadow-emerald-900/20' : 'bg-white shadow-slate-200/50'}`}
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>

                    <div className="text-center mb-6">
                        <div className={`w-12 h-12 rounded-[1.2rem] mx-auto mb-3 flex items-center justify-center rotate-3 ${isDark ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400' : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600'}`}>
                            <Landmark size={20} strokeWidth={1.5} className="-rotate-3" />
                        </div>
                        <h3 className={`text-xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Withdraw <span className="font-semibold">Funds</span>
                        </h3>
                        <p className={`text-[11px] mt-1 mb-1 tracking-wide ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                            Transfer money securely to your bank.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100'}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Withdrawable Balance</p>
                            <p className={`text-xl font-light tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <span className="font-semibold text-emerald-500 mr-1">₹</span>
                                {parseFloat(maxWithdrawable).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div>
                            <div className="relative group">
                                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-light ${isDark ? 'text-white/30' : 'text-slate-400'}`}>₹</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    max={maxWithdrawable}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className={`w-full pl-8 pr-4 py-3 rounded-xl text-xl font-light tracking-tight outline-none transition-all ${isDark ? 'bg-white/5 text-white placeholder-white/20 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50' : 'bg-slate-50 text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] focus:border-emerald-500 border border-transparent'}`}
                                    required
                                />
                            </div>
                            {parseFloat(amount) > maxWithdrawable && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="text-[10px] text-red-400 mt-1.5 font-medium px-2"
                                >
                                    Amount exceeds withdrawable balance.
                                </motion.p>
                            )}
                        </div>

                        <div className={`p-3 rounded-xl flex items-start gap-2 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                            <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className={`text-[10px] leading-snug tracking-wide ${isDark ? 'text-amber-200/70' : 'text-amber-700'}`}>
                                Only "Earned" balance follows for withdrawal. Promotional credits cannot be withdrawn. Processing takes 24-48 hrs.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) > maxWithdrawable}
                            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 mt-2 ${loading || !amount || parseFloat(amount) > maxWithdrawable
                                    ? isDark ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#0f2922] hover:bg-[#1a3a32] text-white shadow-[0_4px_15px_rgb(15,41,34,0.3)] hover:shadow-[0_4px_15px_rgb(15,41,34,0.5)] active:scale-95 hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Request Withdrawal'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WithdrawFundsModal;
