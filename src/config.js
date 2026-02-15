// LawFront Frontend Configuration

const config = {
    // Backend API Base URL
    // Default to localhost for development as requested
    // Backend API Base URL
    // Default to localhost for development as requested
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',

    // Wallet Microservice URL (Python FastAPI)
    WALLET_API_URL: process.env.REACT_APP_WALLET_API_URL || 'http://localhost:8000',

    // Wallet Service Endpoints (Kuberdhan)
    WALLET: {
        BASE: '/api/v1/wallets',
        GET_BALANCE: (userId) => `/api/v1/wallets/${userId}`,
        RECHARGE: '/api/v1/wallets/recharge',
        PAY: '/api/v1/wallets/pay',
        TRANSACTIONS: (userId) => `/api/v1/wallets/${userId}/transactions`
    },

    // Feature Flags
    FEATURES: {
        USE_MOCK_WALLET: false, // Set to true if backend is unavailable
    }
};

export default config;
