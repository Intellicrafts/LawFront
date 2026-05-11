// LawFront Frontend Configuration
// Environment variables are injected by Create React App at build time.
// .env          → local development (npm start)
// .env.production → production build (npm run build)
// See .env.example for all available variables.

/**
 * API origin resolution order (highest priority wins):
 *   1. Explicit env var (REACT_APP_API_URL in .env / .env.production) — RESPECT IT.
 *      This lets devs point localhost:3000 at staging/prod when needed.
 *   2. Known production host mapping (dev.merabakil.com → staging API).
 *   3. Sensible same-host fallback for localhost (http://<host>:8000).
 *
 * Previously this function forced localhost:8000 for any localhost hostname BEFORE
 * checking the env var, which silently broke "local frontend → staging backend"
 * setups and made login appear broken even when the .env was correct.
 */
function normalizeOrigin(value) {
    if (!value) return null;
    return String(value).trim().replace(/\/$/, '');
}

function inferApiOrigin() {
    const envOrigin = normalizeOrigin(process.env.REACT_APP_API_URL);
    if (envOrigin) {
        return envOrigin;
    }
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'dev.merabakil.com') {
            return 'https://chambersapi.logicera.in';
        }
        if (host === 'localhost' || host === '127.0.0.1') {
            return `http://${host}:8000`;
        }
    }
    return 'http://127.0.0.1:8000';
}

function inferWalletOrigin() {
    const envWallet = normalizeOrigin(process.env.REACT_APP_WALLET_API_URL);
    if (envWallet) {
        return envWallet;
    }
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'dev.merabakil.com') {
            return 'https://chambersapi.logicera.in';
        }
    }
    return inferApiOrigin();
}

/** Google OAuth Web client ID (same client can list localhost + staging origins in GCP). */
export function getGoogleClientId() {
    return process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
}

const config = {
    // Laravel Backend API origin (apiService appends /api)
    API_BASE_URL: inferApiOrigin(),

    // Wallet origin
    KUBERDHAN_API_URL: inferWalletOrigin(),

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
