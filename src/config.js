// LawFront Frontend Configuration
// Environment variables are injected by Create React App at build time.
// .env          → local development (npm start)
// .env.production → production build (npm run build)
// See .env.example for all available variables.

const config = {
    // Laravel Backend API
    // Dev:  http://localhost:8000  (set REACT_APP_API_URL in .env)
    // Prod: https://chambersapi.logicera.in
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',

    // Kuberdhan Wallet Microservice
    // Dev:  http://localhost:8001  (set REACT_APP_WALLET_API_URL in .env)
    // Prod: set REACT_APP_WALLET_API_URL in GitHub secrets
    KUBERDHAN_API_URL: process.env.REACT_APP_WALLET_API_URL || 'http://localhost:8001',

    // Lawyer Verification Service (Satyapan)
    VERIFICATION_API_URL: process.env.REACT_APP_VERIFICATION_API_URL || 'https://wgywp2sazh56bc7zg7ydni2uv40xfzji.lambda-url.ap-south-1.on.aws',

    // Wallet Service Endpoints (Kuberdhan)
    WALLET: {
        BASE: '/api/v1/wallets/',
        CREATE: '/api/v1/wallets/',
        GET_BALANCE: (userId) => `/api/v1/wallets/${userId}`,
        RECHARGE: () => `/api/v1/wallets/recharge`,
        WITHDRAW: () => `/api/v1/wallets/withdraw`,
        PAY: '/api/v1/wallets/pay',
        TRANSACTIONS: (userId) => `/api/v1/wallets/${userId}/transactions`,
    },

    // Feature Flags
    FEATURES: {
        USE_MOCK_WALLET: false,
    }
};

// Log active URLs in development mode only
if (process.env.NODE_ENV === 'development') {
    console.info('[Config] API_BASE_URL      :', config.API_BASE_URL);
    console.info('[Config] KUBERDHAN_API_URL :', config.KUBERDHAN_API_URL);
}

export default config;
