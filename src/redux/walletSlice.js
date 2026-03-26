import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../services/walletService';

// ── Helper: get userId from localStorage ──────────────────────────
const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user.id || user.user_id || null;
    } catch {
        return null;
    }
};

// ── Async Thunks ──────────────────────────────────────────────────

/**
 * Create a wallet for the authenticated user (idempotent).
 * Called after login/registration.
 */
export const createUserWallet = createAsyncThunk(
    'wallet/createWallet',
    async ({ userId, userType = 'CUSTOMER' }, { rejectWithValue }) => {
        try {
            return await walletService.createWallet(userId, userType);
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to create wallet');
        }
    }
);

/**
 * Fetch wallet balance for the authenticated user.
 */
export const fetchWalletBalance = createAsyncThunk(
    'wallet/fetchBalance',
    async (_, { rejectWithValue }) => {
        try {
            const userId = getUserId();
            if (!userId) return rejectWithValue('User not authenticated');
            return await walletService.getBalance(userId);
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to fetch balance');
        }
    }
);

/**
 * Fetch transaction history for the authenticated user.
 */
export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const userId = getUserId();
            if (!userId) return rejectWithValue('User not authenticated');
            const data = await walletService.getTransactions(userId);
            return { data, page };
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to fetch transactions');
        }
    }
);

/**
 * Recharge wallet (add funds).
 */
export const rechargeWallet = createAsyncThunk(
    'wallet/recharge',
    async ({ userId, amount }, { rejectWithValue, dispatch }) => {
        try {
            const result = await walletService.recharge(userId, amount);
            dispatch(fetchWalletBalance());
            dispatch(fetchTransactions({ page: 1, limit: 10 }));
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Withdraw funds from earned balance.
 */
export const withdrawFunds = createAsyncThunk(
    'wallet/withdraw',
    async ({ userId, amount }, { rejectWithValue, dispatch }) => {
        try {
            const result = await walletService.withdraw(userId, amount);
            dispatch(fetchWalletBalance());
            dispatch(fetchTransactions({ page: 1, limit: 10 }));
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Process a service payment with commission split.
 * Used during appointment booking to debit customer and credit lawyer + platform.
 */
export const processServicePayment = createAsyncThunk(
    'wallet/processPayment',
    async ({ payerUserId, receiverUserId, amount, commissionAmount, category, description }, { rejectWithValue, dispatch }) => {
        try {
            const result = await walletService.processPayment(
                payerUserId,
                receiverUserId,
                amount,
                commissionAmount,
                category,
                description
            );
            // Refresh balance and transactions after payment
            dispatch(fetchWalletBalance());
            dispatch(fetchTransactions({ page: 1, limit: 10 }));
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: {
            earned_balance: 0,
            promotional_balance: 0,
            total_balance: 0
        },
        transactions: [],
        loading: false,
        error: null,
        transactionLoading: false,
        transactionError: null,
        hasMoreLocal: true,
        currentPage: 1,
        paymentLoading: false,
        paymentError: null,
    },
    reducers: {
        resetWalletState: (state) => {
            state.transactions = [];
            state.balance = { earned_balance: 0, promotional_balance: 0, total_balance: 0 };
            state.currentPage = 1;
            state.hasMoreLocal = true;
            state.paymentError = null;
        }
    },
    extraReducers: (builder) => {
        // Balance
        builder.addCase(fetchWalletBalance.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchWalletBalance.fulfilled, (state, action) => {
            state.loading = false;
            state.balance = action.payload;
        });
        builder.addCase(fetchWalletBalance.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Transactions
        builder.addCase(fetchTransactions.pending, (state) => {
            state.transactionLoading = true;
            state.transactionError = null;
        });
        builder.addCase(fetchTransactions.fulfilled, (state, action) => {
            state.transactionLoading = false;
            const { data, page } = action.payload;
            // Handle both array response and wrapped { transactions: [] } response
            const txns = Array.isArray(data) ? data : (data?.transactions || []);
            
            // Backend doesn't support pagination yet so it always returns ALL transactions.
            // Always replace the local state, do not append.
            state.transactions = txns;
            state.currentPage = page;
            
            // Client-side pagination config (10 items per page)
            const limit = action.meta.arg.limit || 10;
            state.hasMoreLocal = txns.length > (page * limit);
        });
        builder.addCase(fetchTransactions.rejected, (state, action) => {
            state.transactionLoading = false;
            state.transactionError = action.payload;
        });

        // Service Payment
        builder.addCase(processServicePayment.pending, (state) => {
            state.paymentLoading = true;
            state.paymentError = null;
        });
        builder.addCase(processServicePayment.fulfilled, (state) => {
            state.paymentLoading = false;
        });
        builder.addCase(processServicePayment.rejected, (state, action) => {
            state.paymentLoading = false;
            state.paymentError = action.payload;
        });
    }
});

export const { resetWalletState } = walletSlice.actions;
export default walletSlice.reducer;
