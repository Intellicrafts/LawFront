import axios from 'axios';
import config from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const walletService = {
    // Get wallet balance
    getBalance: async (userId) => {
        try {
            const url = `${config.WALLET_API_URL}${config.WALLET.GET_BALANCE(userId)}`;
            const response = await axios.get(url, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get transaction history with pagination
    getTransactions: async (userId, page = 1, limit = 10) => {
        try {
            const skip = (page - 1) * limit;
            const url = `${config.WALLET_API_URL}${config.WALLET.BASE}/${userId}/transactions`;
            const response = await axios.get(url, {
                params: { skip, limit },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Recharge wallet
    recharge: async (userId, amount) => {
        try {
            const url = `${config.WALLET_API_URL}${config.WALLET.RECHARGE}`;
            const response = await axios.post(url, {
                user_id: userId,
                amount: parseFloat(amount),
                description: "Wallet Recharge"
            }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Withdraw funds
    withdraw: async (userId, amount) => {
        try {
            const url = `${config.WALLET_API_URL}${config.WALLET.BASE}/withdraw`;
            const response = await axios.post(url, {
                user_id: userId,
                amount: parseFloat(amount),
                description: "Wallet Withdrawal"
            }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default walletService;
