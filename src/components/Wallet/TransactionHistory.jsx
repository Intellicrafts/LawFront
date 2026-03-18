import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, RefreshCw, ChevronDown, Zap } from 'lucide-react';
import { format } from 'date-fns';

const TransactionHistory = ({ transactions, loading, hasMore, onLoadMore, isDark }) => {
    const [filter, setFilter] = useState('ALL');

    const filters = ['ALL', 'CREDIT', 'DEBIT'];

    const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#111]/80 border-[#2A2A2A] backdrop-blur-xl' : 'bg-white/80 border-gray-100 backdrop-blur-xl shadow-sm'}`}>
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-[#2A2A2A] bg-white/3' : 'border-gray-100 bg-gray-50/50'}`}>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <Zap size={12} className="text-blue-500" />
                    </div>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Transaction History
                    </h3>
                </div>
                {/* Filter Tabs */}
                <div className={`flex items-center gap-1 p-0.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${filter === f
                                ? 'bg-blue-600 text-white shadow-sm'
                                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {loading && filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <RefreshCw size={20} className="animate-spin text-blue-500" />
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading transactions...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className={`p-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <Clock size={24} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
                        </div>
                        <div className="text-center">
                            <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No transactions yet</p>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Your activity will appear here</p>
                        </div>
                    </div>
                ) : (
                    filtered.map((txn) => (
                        <div key={txn.id}
                            className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${isDark ? 'hover:bg-white/3' : 'hover:bg-gray-50/70'}`}>
                            {/* Icon */}
                            <div className={`flex-shrink-0 p-2 rounded-xl ${txn.type === 'CREDIT'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-red-500/10 text-red-500'}`}>
                                {txn.type === 'CREDIT'
                                    ? <ArrowDownLeft size={14} strokeWidth={2.5} />
                                    : <ArrowUpRight size={14} strokeWidth={2.5} />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                    {txn.description || (txn.category || '').replace(/_/g, ' ')}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {format(new Date(txn.created_at), 'dd MMM yyyy, HH:mm')}
                                    </span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${getStatusStyle(txn.status)}`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="text-right flex-shrink-0">
                                <p className={`text-sm font-black ${txn.type === 'CREDIT' ? 'text-emerald-500' : 'text-red-400'}`}>
                                    {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                                </p>
                                <span className={`text-[9px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {txn.balance_type}
                                </span>
                            </div>
                        </div>
                    ))
                )}

                {/* Load more */}
                {hasMore && !loading && (
                    <button
                        onClick={onLoadMore}
                        className={`w-full flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${isDark
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-white/3'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/50'}`}
                    >
                        <ChevronDown size={13} />
                        Load More
                    </button>
                )}
                {loading && filtered.length > 0 && (
                    <div className="py-3 text-center">
                        <RefreshCw size={14} className={`animate-spin inline-block ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
