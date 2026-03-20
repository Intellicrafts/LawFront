import axios from 'axios';
import config from '../config';

/**
 * Dedicated Axios client for Kuberdhan Wallet Microservice.
 * Attaches the same Laravel Bearer token for auth validation.
 */
const walletClient = axios.create({
    baseURL: `${config.KUBERDHAN_API_URL}${config.WALLET.BASE}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach auth token from localStorage on every request
walletClient.interceptors.request.use((reqConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
});

const walletService = {
    /**
     * Create a wallet for a user. Idempotent — returns existing wallet if already created.
     * Should be called after login/registration.
     * @param {string|number} userId - Laravel user ID
     * @param {string} userType - 'CUSTOMER' or 'LAWYER'
     */
    createWallet: async (userId, userType = 'CUSTOMER') => {
        try {
            const response = await walletClient.post('', {
                user_id: String(userId),
                user_type: userType,
                currency: 'INR',
            });
            return response.data;
        } catch (error) {
            console.error('Error creating wallet:', error);
            // Don't throw — wallet creation is a background operation
            return null;
        }
    },

    /**
     * Get wallet balance for the authenticated user.
     * @param {string|number} userId - Laravel user ID
     */
    getBalance: async (userId) => {
        try {
            const response = await walletClient.get(`${userId}`);
            const data = response.data;
            return {
                id: data.id,
                user_id: data.user_id,
                total_balance: parseFloat(data.total_balance || 0),
                earned_balance: parseFloat(data.earned_balance || 0),
                promotional_balance: parseFloat(data.promotional_balance || 0),
                currency: data.currency || 'INR',
            };
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get transaction history for the authenticated user.
     * @param {string|number} userId - Laravel user ID
     */
    getTransactions: async (userId) => {
        try {
            if (!userId) return { transactions: [], total: 0 };
            const response = await walletClient.get(`${userId}/transactions`);
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Recharge wallet (add funds to earned balance).
     * In production, this will integrate with Razorpay payment flow.
     * For now, simulates a successful payment.
     * @param {string|number} userId - Laravel user ID
     * @param {number} amount - Amount in INR
     */
    recharge: async (userId, amount) => {
        try {
            const response = await walletClient.post('recharge', {
                user_id: String(userId),
                amount: parseFloat(amount),
                description: 'Wallet Recharge',
            });
            return response.data;
        } catch (error) {
            console.error('Error recharging wallet:', error);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Withdraw funds from wallet.
     * @param {Object} data - { user_id, amount, description }
     */
    withdraw: async (data) => {
        try {
            const response = await walletClient.post('withdraw', {
                user_id: String(data.user_id),
                amount: parseFloat(data.amount),
                description: data.description || 'Wallet Withdrawal',
            });
            return response.data;
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Process a service payment with commission split.
     * Debits the payer (earned-first), credits the receiver and platform.
     * @param {string|number} payerUserId - Customer's user ID
     * @param {string|number} receiverUserId - Lawyer's user ID
     * @param {number} amount - Total service fee
     * @param {number} commissionAmount - Platform commission
     * @param {string} category - Transaction category (e.g., 'APPOINTMENT_BOOKING_CHARGE')
     * @param {string} description - Human-readable description
     */
    processPayment: async (payerUserId, receiverUserId, amount, commissionAmount, category, description) => {
        try {
            const response = await walletClient.post('/pay', {
                payer_user_id: String(payerUserId),
                receiver_user_id: String(receiverUserId),
                amount: parseFloat(amount),
                commission_amount: parseFloat(commissionAmount),
                category: category,
                description: description,
            });
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error.response?.data || error.message;
        }
    },
};

export default walletService;
