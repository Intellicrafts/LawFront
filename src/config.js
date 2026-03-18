// LawFront Frontend Configuration

const config = {
    // Backend API Base URL
    // Default to localhost for development as requested
    // Backend API Base URL
    // Default to localhost for development as requested
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',

    // Wallet Microservice URL (Python FastAPI)
    WALLET_API_URL: process.env.REACT_APP_WALLET_API_URL || 'http://localhost:8000',

    // Lawyer Verification Service (Satyapan)
    VERIFICATION_API_URL: process.env.REACT_APP_VERIFICATION_API_URL || 'https://wgywp2sazh56bc7zg7ydni2uv40xfzji.lambda-url.ap-south-1.on.aws',

    // Wallet Service Endpoints (now on main Laravel API)
    WALLET: {
        BASE: '/wallet',
        GET_BALANCE: () => `/wallet/balance`,
        RECHARGE: '/wallet/recharge',
        WITHDRAW: '/wallet/withdraw',
        PAY: '/wallet/pay',
        TRANSACTIONS: () => `/wallet/transactions`,
    },

    // Feature Flags
    FEATURES: {
        USE_MOCK_WALLET: false,
    }
};

export default config;
