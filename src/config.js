// LawFront Frontend Configuration

const config = {
    // Backend API Base URL
    // Default to localhost for development as requested
    // Backend API Base URL
    // Default to localhost for development as requested
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',

    // Wallet Microservice URL (Kuberdhan)
    KUBERDHAN_API_URL: process.env.REACT_APP_KUBERDHAN_API_URL || 'http://localhost:8001',

    // Lawyer Verification Service (Satyapan)
    VERIFICATION_API_URL: process.env.REACT_APP_VERIFICATION_API_URL || 'https://wgywp2sazh56bc7zg7ydni2uv40xfzji.lambda-url.ap-south-1.on.aws',

    // Wallet Service Endpoints (now on main Laravel API)
    WALLET: {
        BASE: '/api/v1/wallets',
        CREATE: '/api/v1/wallets',
        GET_BALANCE: (userId) => `/api/v1/wallets/${userId}`,
        RECHARGE: (userId) => `/api/v1/wallets/${userId}/recharge`,
        WITHDRAW: (userId) => `/api/v1/wallets/${userId}/withdraw`,
        PAY: '/api/v1/wallets/pay',
        TRANSACTIONS: (userId) => `/api/v1/wallets/${userId}/transactions`,
    },

    // Feature Flags
    FEATURES: {
        USE_MOCK_WALLET: false,
    }
};

export default config;
