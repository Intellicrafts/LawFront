import apiClient from '../api/apiService';
import config from '../config';

const walletService = {
    // Get wallet balance (authenticated user)
    getBalance: async () => {
        try {
            const response = await apiClient.get(config.WALLET.GET_BALANCE());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get transaction history with pagination
    getTransactions: async (userId, page = 1, limit = 10) => {
        try {
            const skip = (page - 1) * limit;
            const response = await apiClient.get(config.WALLET.TRANSACTIONS(), {
                params: { skip, limit, page },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Recharge wallet
    recharge: async (userId, amount) => {
        try {
            const response = await apiClient.post(config.WALLET.RECHARGE, {
                amount: parseFloat(amount),
                description: 'Wallet Recharge',
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Withdraw funds
    withdraw: async (userId, amount) => {
        try {
            const response = await apiClient.post(config.WALLET.WITHDRAW, {
                amount: parseFloat(amount),
                description: 'Wallet Withdrawal',
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default walletService;
