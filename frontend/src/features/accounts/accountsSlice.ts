import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Account } from '../../interfaces/accountInterface';

interface AccountsState {
    accounts: Account[];
    account: Account | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AccountsState = {
    accounts: [],
    account: null,
    status: 'idle',
    error: null,
};

interface FetchAccountsError {
    errorMessage: string;
}

export const fetchAccountsByUserId = createAsyncThunk<
    Account[],
    string,
    { rejectValue: FetchAccountsError }
>('accounts/fetchAccountsByUserId', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/user/accounts/${userId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to fetch accounts';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data.message || errorMessage;
        }
        return rejectWithValue({ errorMessage });
    }
});

export const fetchAccountDetails = createAsyncThunk<
    Account,
    string,
    { rejectValue: FetchAccountsError }
>(
    'accounts/fetchAccountDetails',
    async ( accountId , { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/user/account/${accountId}`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
         } catch (error) {
            let errorMessage = 'Failed to fetch account details';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data.message || errorMessage;
            }
            return rejectWithValue({ errorMessage });
        }
    }
);

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountsByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchAccountsByUserId.fulfilled,
                (state, action: PayloadAction<Account[]>) => {
                    state.status = 'succeeded';
                    state.accounts = action.payload;
                }
            )
            .addCase(fetchAccountsByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(fetchAccountDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchAccountDetails.fulfilled,
                (state, action: PayloadAction<Account>) => {
                    state.status = 'succeeded';
                    state.account = action.payload;
                }
            )
            .addCase(fetchAccountDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});

export default accountsSlice.reducer;
