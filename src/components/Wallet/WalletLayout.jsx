import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletBalance, fetchTransactions, rechargeWallet, withdrawFunds } from '../../redux/walletSlice';
import { useTheme } from '../../context/ThemeContext';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import AddFundsModal from './AddFundsModal';
import WithdrawFundsModal from './WithdrawFundsModal';
import { useToast } from '../../context/ToastContext';
import { RefreshCw } from 'lucide-react';

const WalletLayout = () => {
    const dispatch = useDispatch();
    const { isDark } = useTheme();
    const { balance, transactions, loading, transactionLoading, hasMoreLocal, currentPage } = useSelector((state) => state.wallet);
    const { showSuccess, showError } = useToast();

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setUserId(user.id);
        }
    }, []);

    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const loadInitialData = async () => {
             if (userId) {
                 await dispatch(fetchWalletBalance());
                 await dispatch(fetchTransactions({ page: 1, limit: 10 }));
             }
        };

        if (userId) {
            loadInitialData();
            // Auto refresh every 30 seconds
            const interval = setInterval(() => {
                if (isMounted && userId) {
                    dispatch(fetchWalletBalance());
                    dispatch(fetchTransactions({ page: 1, limit: 10 }));
                }
            }, 30000);
            return () => {
                isMounted = false;
                clearInterval(interval);
            };
        }
    }, [dispatch, userId]);

    const handleRefresh = async () => {
        if (userId) {
            await dispatch(fetchWalletBalance());
            await dispatch(fetchTransactions({ page: 1, limit: 10 }));
            showSuccess('Wallet refreshed');
        }
    };

    const handleLoadMore = () => {
        dispatch(fetchTransactions({ page: currentPage + 1, limit: 10 }));
    };

    const handleAddFunds = async (amount) => {
        try {
            await dispatch(rechargeWallet({ userId, amount })).unwrap();
            setIsAddFundsOpen(false);
            showSuccess('Funds added successfully!');
        } catch (error) {
            console.error('Failed to add funds:', error);
            showError('Failed to add funds');
        }
    };

    const handleWithdraw = async (amount) => {
        try {
            await dispatch(withdrawFunds({ userId, amount })).unwrap();
            setIsWithdrawOpen(false);
            showSuccess('Withdrawal request submitted!');
        } catch (error) {
            console.error('Failed to withdraw:', error);
            
            let errMsg = 'Withdrawal failed';
            if (error?.detail) {
                if (typeof error.detail === 'string') {
                    errMsg = error.detail;
                } else if (Array.isArray(error.detail) && error.detail.length > 0) {
                    errMsg = error.detail[0].msg || 'Validation error';
                }
            } else if (error?.message) {
                errMsg = error.message;
            }
            
            showError(errMsg);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-100/50'}`} />
                <div className={`absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] ${isDark ? 'bg-blue-900/10' : 'bg-teal-50/50'}`} />
            </div>

            <div className="relative p-4 sm:p-6 pt-20 sm:pt-24 max-w-xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                        <h1 className={`text-2xl sm:text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            My <span className="font-semibold">Wallet</span>
                        </h1>
                        <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                            Manage your credits and monitor your transactions seamlessly.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button 
                            onClick={handleRefresh} 
                            disabled={loading || transactionLoading}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                                (loading || transactionLoading) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : `hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${isDark ? 'hover:shadow-white/5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white' : 'hover:shadow-slate-200/50 bg-white border border-slate-200 text-slate-500 hover:text-slate-900'}`
                            }`}
                            title="Refresh Wallet"
                        >
                            <RefreshCw size={14} className={(loading || transactionLoading) ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <WalletBalance
                        balance={balance}
                        loading={loading}
                        onAddFunds={() => setIsAddFundsOpen(true)}
                        onWithdraw={() => setIsWithdrawOpen(true)}
                        isDark={isDark}
                    />

                    <TransactionHistory
                        transactions={transactions}
                        loading={transactionLoading}
                        hasMore={hasMoreLocal}
                        onLoadMore={handleLoadMore}
                        isDark={isDark}
                        currentPage={currentPage}
                    />
                </div>
            </div>

            <AddFundsModal
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
                onConfirm={handleAddFunds}
                isDark={isDark}
                loading={loading}
            />

            <WithdrawFundsModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                onConfirm={handleWithdraw}
                isDark={isDark}
                loading={loading}
                maxWithdrawable={balance.earned_balance}
            />
        </div>
    );
};

export default WalletLayout;
