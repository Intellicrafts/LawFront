import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, RefreshCw, ChevronDown, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const TransactionHistory = ({ transactions, loading, hasMore, onLoadMore, isDark, currentPage = 1 }) => {
    const [filter, setFilter] = useState('ALL');

    const filters = ['ALL', 'CREDIT', 'DEBIT'];

    // Client-side pagination limit (10 items per page)
    const displayLimit = currentPage * 10;
    
    // First filter by type
    const typedTransactions = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);
    
    // Then limit exactly to visible amount
    const filtered = typedTransactions.slice(0, displayLimit);
    
    // Check if there are more matching transactions to load
    const actualHasMore = typedTransactions.length > displayLimit;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SUCCESS': return 'text-emerald-500';
            case 'PENDING': return 'text-amber-500';
            case 'FAILED': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className={`rounded-[1.5rem] overflow-hidden transition-all duration-500 ${isDark ? 'bg-white/[0.02] border border-white/5 shadow-xl shadow-black/50' : 'bg-white border border-slate-100 shadow-lg shadow-slate-200/50'}`}>
            {/* Header */}
            <div className={`px-5 py-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center justify-between ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100 shadow-inner'}`}>
                        <Zap size={14} className={isDark ? 'text-white/80' : 'text-slate-700'} />
                    </div>
                    <h3 className={`text-xs font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Transaction History
                    </h3>
                </div>
                {/* Segmented Control Filter Tabs */}
                <div className={`flex items-center gap-1 p-1 rounded-xl self-start sm:self-auto ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                            }}
                            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${filter === f
                                ? isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                                : isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-transparent p-2 sm:p-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {loading && filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <RefreshCw size={20} className={`animate-spin ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                        <span className={`text-[11px] font-semibold tracking-wide ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Loading ledger...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className={`p-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <Clock size={24} className={isDark ? 'text-white/20' : 'text-slate-300'} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-slate-600'}`}>No transactions yet</p>
                            <p className={`text-[10px] mt-1 tracking-wide ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Your financial activity will appear here.</p>
                        </div>
                    </div>
                ) : (
                    filtered.map((txn) => (
                        <div key={txn.id}
                            className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'}`}>
                            {/* Icon Focus */}
                            <div className={`flex-shrink-0 p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${txn.type === 'CREDIT'
                                ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                {txn.type === 'CREDIT'
                                    ? <ArrowDownLeft size={14} strokeWidth={2.5} />
                                    : <ArrowUpRight size={14} strokeWidth={2.5} />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate tracking-tight ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                                    {txn.description || (txn.category || '').replace(/_/g, ' ')}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={`text-[10px] font-medium tracking-wide ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                        {format(new Date(txn.created_at.includes('T') ? (txn.created_at.endsWith('Z') ? txn.created_at : txn.created_at + 'Z') : (txn.created_at.replace(' ', 'T') + 'Z')), 'dd MMM yyyy, hh:mm a')}
                                    </span>
                                    <span className={`text-[9px] uppercase font-bold tracking-widest flex items-center gap-1 ${getStatusStyle(txn.status)}`}>
                                        {txn.status === 'SUCCESS' && <CheckCircle size={8} />}
                                        {txn.status === 'PENDING' && <Clock size={8} />}
                                        {txn.status === 'FAILED' && <AlertCircle size={8} />}
                                        {txn.status}
                                    </span>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="text-right flex-shrink-0">
                                <p className={`text-sm sm:text-base font-light tracking-tight ${txn.type === 'CREDIT' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-white/80' : 'text-slate-700')}`}>
                                    {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <span className={`text-[8px] font-bold uppercase tracking-[0.1em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                    {txn.balance_type.replace('_BALANCE', '')}
                                </span>
                            </div>
                        </div>
                    ))
                )}

                {/* Load more */}
                {actualHasMore && !loading && (
                    <div className="pt-3 pb-1 px-3">
                        <button
                            onClick={onLoadMore}
                            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isDark
                                ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`}
                        >
                            <ChevronDown size={12} />
                            Load Older Transactions
                        </button>
                    </div>
                )}
                {loading && filtered.length > 0 && (
                    <div className="py-4 text-center">
                        <RefreshCw size={14} className={`animate-spin inline-block ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
