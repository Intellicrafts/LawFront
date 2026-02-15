import React, { useState } from 'react';
import { X, Landmark, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WithdrawFundsModal = ({ isOpen, onClose, onConfirm, isDark, loading, maxWithdrawable }) => {
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
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl ${isDark ? 'bg-[#1A1A1A] border border-[#333]' : 'bg-white'}`}
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-1 rounded-lg ${isDark ? 'hover:bg-[#333] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-6">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-500' : 'bg-purple-50 text-purple-600'}`}>
                            <Landmark size={24} />
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Withdraw Funds</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Transfer money to your bank account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-[#262626]' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Withdrawable Balance</p>
                            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                ₹{parseFloat(maxWithdrawable).toLocaleString('en-IN')}
                            </p>
                        </div>

                        <div>
                            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                                Amount (INR)
                            </label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>₹</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    max={maxWithdrawable}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className={`w-full pl-7 pr-4 py-2.5 rounded-lg border ${isDark ? 'bg-[#111] border-[#333] text-white focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                                    required
                                />
                            </div>
                            {parseFloat(amount) > maxWithdrawable && (
                                <p className="text-xs text-red-500 mt-1">Amount exceeds withdrawable balance.</p>
                            )}
                        </div>

                        <div className={`p-3 rounded-lg flex items-start gap-2 ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                            <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className={`text-[11px] ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                                Only "Earned" balance follows for withdrawal. Promotional credits cannot be withdrawn. Processing may take 24-48 hours.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) > maxWithdrawable}
                            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${loading || !amount || parseFloat(amount) > maxWithdrawable
                                    ? isDark ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25'
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
