import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Info } from 'lucide-react';

const WalletBalance = ({ balance, onAddFunds, onWithdraw, isDark }) => {
    return (
        <div className={`rounded-xl p-6 ${isDark ? 'bg-[#1A1A1A] border-[#333]' : 'bg-white border-blue-100'} border shadow-sm`}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Balance</h2>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ₹{parseFloat(balance.total_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>INR</span>
                    </div>
                </div>
                <div className={`p-3 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} text-blue-500`}>
                    <Wallet size={24} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#262626]' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-green-500/10 text-green-500">
                            <TrendingUp size={14} />
                        </div>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Earned</span>
                        <div className="group relative ml-auto">
                            <Info size={12} className={`${isDark ? 'text-gray-600' : 'text-gray-400'} cursor-help`} />
                            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 text-[10px] bg-black/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Available for withdrawal.
                            </div>
                        </div>
                    </div>
                    <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-gray-900'}`}>
                        ₹{parseFloat(balance.earned_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#262626]' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-500">
                            <TrendingDown size={14} className="rotate-180" />
                        </div>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Promotional</span>
                        <div className="group relative ml-auto">
                            <Info size={12} className={`${isDark ? 'text-gray-600' : 'text-gray-400'} cursor-help`} />
                            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 text-[10px] bg-black/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Use for services only. Not withdrawable.
                            </div>
                        </div>
                    </div>
                    <p className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-gray-900'}`}>
                        ₹{parseFloat(balance.promotional_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onAddFunds}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <span>Add Funds</span>
                </button>
                <button
                    onClick={onWithdraw}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 ${isDark ? 'bg-[#262626] hover:bg-[#333] text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'} text-sm font-medium rounded-lg transition-colors`}
                >
                    <span>Withdraw</span>
                </button>
            </div>
        </div>
    );
};

export default WalletBalance;
