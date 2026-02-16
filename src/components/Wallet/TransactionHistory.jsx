import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const TransactionHistory = ({ transactions, loading, hasMore, onLoadMore, isDark, currentPage }) => {
    // const [filter, setFilter] = useState('ALL'); // Removed unused state

    const getIcon = (type, category) => {
        if (type === 'CREDIT') {
            return <div className="p-2 rounded-full bg-green-500/10 text-green-500"><ArrowDownLeft size={16} /></div>;
        }
        return <div className="p-2 rounded-full bg-red-500/10 text-red-500"><ArrowUpRight size={16} /></div>;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return 'text-green-500 bg-green-500/10';
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10';
            case 'FAILED': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className={`rounded-xl ${isDark ? 'bg-[#1A1A1A] border-[#333]' : 'bg-white border-blue-100'} border shadow-sm flex flex-col h-[500px]`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Transaction History</h3>
                <div className="flex items-center gap-2">
                    <button className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#262626] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <Filter size={14} />
                    </button>
                    <button className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#262626] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <Search size={14} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading && transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <RefreshCw size={24} className="animate-spin mb-2" />
                        <span className="text-xs">Loading history...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Clock size={24} className="mb-2 opacity-50" />
                        <span className="text-xs">No transactions found</span>
                    </div>
                ) : (
                    transactions.map((txn) => (
                        <div key={txn.id} className={`p-3 rounded-lg flex items-center justify-between group ${isDark ? 'hover:bg-[#262626]' : 'hover:bg-gray-50'} transition-colors`}>
                            <div className="flex items-center gap-3">
                                {getIcon(txn.type, txn.category)}
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                        {txn.description || txn.category.replace(/_/g, ' ')}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {format(new Date(txn.created_at), 'dd MMM yyyy, HH:mm')}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getStatusColor(txn.status)}`}>
                                            {txn.status}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                            {txn.balance_type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-medium ${txn.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                                    {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                {hasMore && !loading && (
                    <button
                        onClick={onLoadMore}
                        className={`w-full py-2 text-xs font-medium text-center ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                    >
                        Load More
                    </button>
                )}
                {loading && transactions.length > 0 && (
                    <div className="py-2 text-center">
                        <RefreshCw size={16} className={`animate-spin inline-block ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
