import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddFundsModal = ({ isOpen, onClose, onConfirm, isDark, loading }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount && parseFloat(amount) > 0) {
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
                            <CreditCard size={20} strokeWidth={1.5} className="-rotate-3" />
                        </div>
                        <h3 className={`text-xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Add <span className="font-semibold">Funds</span>
                        </h3>
                        <p className={`text-[11px] mt-1 mb-1 tracking-wide ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                            Top up your wallet securely.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative group">
                                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-light ${isDark ? 'text-white/30' : 'text-slate-400'}`}>₹</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className={`w-full pl-8 pr-4 py-3 rounded-xl text-xl font-light tracking-tight outline-none transition-all ${isDark ? 'bg-white/5 text-white placeholder-white/20 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50' : 'bg-slate-50 text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] focus:border-emerald-500 border border-transparent'}`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[500, 1000, 2000].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val.toString())}
                                    className={`py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 transform active:scale-95 ${amount === val.toString()
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : isDark ? 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>

                        <div className={`p-3 rounded-xl flex items-start gap-2 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                            <ShieldCheck size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className={`text-[10px] leading-snug tracking-wide ${isDark ? 'text-emerald-200/70' : 'text-emerald-700'}`}>
                                256-bit secure. Instant credit.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 mt-2 ${loading || !amount
                                    ? isDark ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_15px_rgb(16,185,129,0.3)] hover:shadow-[0_4px_15px_rgb(16,185,129,0.5)] active:scale-95 hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddFundsModal;
