import axios from 'axios';
import config from '../config';

const walletService = {
    // Get wallet balance for a specific user from Kuberdhan microservice
    getBalance: async (userId) => {
        try {
            const response = await axios.get(`${config.KUBERDHAN_API_URL}${config.WALLET.GET_BALANCE(userId)}`);
            
            // Map the data to the expected format
            const data = response.data.data || response.data;
            return {
                total_balance: (data.total_balance ?? data.balance ?? 0),
                earned_balance: (data.earned_balance ?? 0),
                promotional_balance: (data.promotional_balance ?? 0),
                currency: data.currency || 'INR'
            };
        } catch (error) {
            console.error('Error fetching from Kuberdhan:', error);
            throw error.response?.data || error.message;
        }
    },

    // Get transaction history with pagination
    getTransactions: async (userId, page = 1, limit = 10) => {
        try {
            if (!userId) return { transactions: [] };
            const response = await axios.get(`${config.KUBERDHAN_API_URL}${config.WALLET.TRANSACTIONS(userId)}`, {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Recharge wallet
    recharge: async (userId, amount) => {
        try {
            const response = await axios.post(`${config.KUBERDHAN_API_URL}${config.WALLET.RECHARGE(userId)}`, {
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
            const response = await axios.post(`${config.KUBERDHAN_API_URL}${config.WALLET.WITHDRAW(userId)}`, {
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
