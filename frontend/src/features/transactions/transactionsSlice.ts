import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Transaction {
    transactionId: number;
    senderAccountNumber: string;
    receiverAccountNumber: string;
    transactionAmount: number;
}

interface TransactionState {
    transactions: Transaction[];
    transaction: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    transaction: null,
    status: 'idle',
    error: null,
};

interface CreateTransactionData {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    transactionAmount: number;
}

interface FetchTransactionError {
    errorMessage: string;
}

export const fetchTransactions = createAsyncThunk<
    Transaction[],
    string,
    { rejectValue: FetchTransactionError }
>('transactions/fetchTransactions', async (uniqueAccountNumber, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/transaction/all-transactions/${uniqueAccountNumber}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errors = error.response.data.errors;
            if (errors && errors.length > 0) {
                return rejectWithValue({ errorMessage: errors.join(', ') });
            } else {
                const errorMessage = error.response.data.message;
                return rejectWithValue({ errorMessage });
            }
        }
        return rejectWithValue({
            errorMessage: 'Failed to create account',
        });
    }
});

export const createTransaction = createAsyncThunk<
    Transaction,
    CreateTransactionData,
    { rejectValue: FetchTransactionError }
>(
    'transactions/createTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/transaction/make-transaction',
                transactionData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errors = error.response.data.errors;
                if (errors && errors.length > 0) {
                    return rejectWithValue({ errorMessage: errors.join(', ') });
                } else {
                    const errorMessage = error.response.data.message;
                    return rejectWithValue({ errorMessage });
                }
            }
            return rejectWithValue({
                errorMessage: 'Failed to create account',
            });
        }
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },    extraReducers: (builder) => {
        builder
            .addCase(createTransaction.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                createTransaction.fulfilled,
                (state, action: PayloadAction<Transaction>) => {
                    state.status = 'succeeded';
                    state.transaction = action.payload;
                }
            )
            .addCase(createTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(fetchTransactions.pending, (state) => {
               state.status = 'loading';
           })
           .addCase(
            fetchTransactions.fulfilled,
               (state, action: PayloadAction<Transaction[]>) => {
                   state.status = 'succeeded';
                   state.transactions = action.payload;
               }
           )
           .addCase(fetchTransactions.rejected, (state, action) => {
               state.status = 'failed';
               state.error =
                   action.payload?.errorMessage || 'Unknown error occurred';
           });
    },
});
export const { resetStatus } = transactionsSlice.actions;

export default transactionsSlice.reducer;
