import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../services/walletService';

// Async Thunks
// Note: New backend uses Auth token, no userId needed in the call itself
export const fetchWalletBalance = createAsyncThunk(
    'wallet/fetchBalance',
    async (_, { rejectWithValue }) => {
        try {
            return await walletService.getBalance();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const data = await walletService.getTransactions(null, page, limit);
            return { data, page };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

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
        currentPage: 1
    },
    reducers: {
        resetWalletState: (state) => {
            state.transactions = [];
            state.balance = { earned_balance: 0, promotional_balance: 0, total_balance: 0 };
            state.currentPage = 1;
            state.hasMoreLocal = true;
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
            if (page === 1) {
                state.transactions = txns;
            } else {
                state.transactions = [...state.transactions, ...txns];
            }
            state.currentPage = page;
            state.hasMoreLocal = data?.has_more ?? txns.length > 0;
        });
        builder.addCase(fetchTransactions.rejected, (state, action) => {
            state.transactionLoading = false;
            state.transactionError = action.payload;
        });
    }
});

export const { resetWalletState } = walletSlice.actions;
export default walletSlice.reducer;
