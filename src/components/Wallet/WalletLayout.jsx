import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletBalance, fetchTransactions, rechargeWallet, withdrawFunds } from '../../redux/walletSlice';
import { useTheme } from '../../context/ThemeContext';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import AddFundsModal from './AddFundsModal';
import WithdrawFundsModal from './WithdrawFundsModal';
import { useToast } from '../../context/ToastContext';

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
        dispatch(fetchWalletBalance());
        dispatch(fetchTransactions({ page: 1, limit: 10 }));
    }, [dispatch]);

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
            showError(error.detail || 'Withdrawal failed');
        }
    };

    return (
        <div className={`p-4 sm:p-6 pt-20 sm:pt-24 min-h-screen ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#0A0A0A] to-[#0A0A0A]' : 'bg-gradient-to-br from-emerald-50/40 via-gray-50 to-gray-100'}`}>
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>My Wallet</h1>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Manage your credits and transactions</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-black text-white shadow shadow-emerald-500/20 uppercase tracking-wider">
                        INR
                    </span>
                </div>

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
