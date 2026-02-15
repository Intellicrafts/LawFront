import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../services/walletService';

// Async Thunks
export const fetchWalletBalance = createAsyncThunk(
    'wallet/fetchBalance',
    async (userId, { rejectWithValue }) => {
        try {
            return await walletService.getBalance(userId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async ({ userId, page, limit }, { rejectWithValue }) => {
        try {
            const data = await walletService.getTransactions(userId, page, limit);
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
            dispatch(fetchWalletBalance(userId)); // Refresh balance
            dispatch(fetchTransactions({ userId, page: 1, limit: 10 })); // Refresh transactions
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
            dispatch(fetchWalletBalance(userId)); // Refresh balance
            dispatch(fetchTransactions({ userId, page: 1, limit: 10 })); // Refresh transactions
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
        hasMoreLocal: true, // For pagination
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
            if (page === 1) {
                state.transactions = data;
            } else {
                state.transactions = [...state.transactions, ...data];
            }
            state.currentPage = page;
            state.hasMoreLocal = data.length > 0;
        });
        builder.addCase(fetchTransactions.rejected, (state, action) => {
            state.transactionLoading = false;
            state.transactionError = action.payload;
        });
    }
});

export const { resetWalletState } = walletSlice.actions;
export default walletSlice.reducer;
