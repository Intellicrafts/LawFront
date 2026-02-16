import axios from 'axios';
import config from '../config';

const verificationClient = axios.create({
    baseURL: config.VERIFICATION_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

export const verificationService = {
    /**
     * Verify a lawyer's enrollment number against the state bar council.
     * @param {string} enrollmentNumber - The Bar Council enrollment number (e.g., UP1234/2020)
     * @param {string} state - The state name (e.g., Uttar Pradesh, Delhi)
     * @returns {Promise<Object>} - The verification result data
     */
    verifyLawyer: async (enrollmentNumber, state) => {
        try {
            const response = await verificationClient.post('/api/v1/verify', {
                enrollment_number: enrollmentNumber,
                state: state
            });

            if (response.data && response.data.status === 'success') {
                // Handle nested structure: { status: 'success', data: { status: 'success', data: { ... } } }
                const serviceData = response.data.data;
                if (serviceData && serviceData.data) {
                    return serviceData.data;
                }
                return serviceData;
            } else {
                throw new Error(response.data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Lawyer verification error:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }
};
