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
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                            <CreditCard size={24} />
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add Funds</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Securely add money to your wallet
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount (e.g. 500)"
                                    className={`w-full pl-7 pr-4 py-2.5 rounded-lg border ${isDark ? 'bg-[#111] border-[#333] text-white focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
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
                                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${amount === val.toString()
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : isDark ? 'border-[#333] text-gray-400 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>

                        <div className={`p-3 rounded-lg flex items-start gap-2 ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                            <ShieldCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <p className={`text-[11px] ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                Your payment is secured with 256-bit encryption. Funds are instantly credited to your Earned Balance.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${loading || !amount
                                    ? isDark ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Proceed to Pay'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddFundsModal;
