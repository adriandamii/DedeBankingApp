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

interface CreateAccount {
    userId: string;
    amount: string;
}
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

export const fetchAccountDetails = createAsyncThunk<
    Account,
    string,
    { rejectValue: FetchAccountsError }
>('accounts/fetchAccountDetails', async (accountId, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/user/account/${accountId}`,
            {
                withCredentials: true,
            }
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

export const createAccount = createAsyncThunk<
    Account,
    CreateAccount,
    { rejectValue: FetchAccountsError }
>('accounts/createAccount', async ({ amount, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/account/create-account/${userId}`,
            {
                amount,
            },
            {
                withCredentials: true,
            }
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

export const deleteAccount = createAsyncThunk<
    Account,
    string,
    { rejectValue: FetchAccountsError }
>('acounts/deleteAccount', async (accountId: string, { rejectWithValue }) => {
    try {
        const response = await axios.delete(
            `http://localhost:5000/admin/delete/account/${accountId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errors = error.response.data.errors;
            if (errors && errors.length > 0) {
                return rejectWithValue({ errorMessage: errors.join(', ') });
            }
        }
        return rejectWithValue({
            errorMessage: 'Failed to delete account',
        });
    }
});

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },
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
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createAccount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(deleteAccount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.status = 'succeeded';
                state.account = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});
export const { resetStatus } = accountsSlice.actions;

export default accountsSlice.reducer;
