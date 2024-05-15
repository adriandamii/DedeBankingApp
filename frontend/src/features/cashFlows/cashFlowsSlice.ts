import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CashFlow } from '../../interfaces/cashFlowInterface';

interface WithdrawalData {
    uniqueAccountNumber: string;
    cashFlowAmount: number | undefined;
    cashFlowType: string;
}

interface CashFlowsState {
    cashFlows: CashFlow[];
    cashFlow: CashFlow | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CashFlowsState = {
    cashFlows: [],
    cashFlow: null,
    status: 'idle',
    error: null,
};

interface FetchCashFlowError {
    errorMessage: string;
}

export const fetchCashFlows = createAsyncThunk<
    CashFlow[],
    string,
    { rejectValue: FetchCashFlowError }
>('cashFlows/fetchCashFlows', async (uniqueAccountNumber, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/cash-flows/all-cash-flows/${uniqueAccountNumber}`,
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
            errorMessage: 'Failed',
        });
    }
});

export const fetchWithdrawals = createAsyncThunk<
    CashFlow[],
    string,
    { rejectValue: FetchCashFlowError }
>('cashFlows/fetchWithdrawals', async (uniqueAccountNumber, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/cash-flows/all-withdrawals/${uniqueAccountNumber}`,
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
            errorMessage: 'Failed',
        });
    }
});

export const fetchDeposits = createAsyncThunk<
    CashFlow[],
    string,
    { rejectValue: FetchCashFlowError }
>('cashFlows/fetchDeposits', async (uniqueAccountNumber, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/cash-flows/all-deposits/${uniqueAccountNumber}`,
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

export const makeWithdrawal = createAsyncThunk<
    CashFlow,
    WithdrawalData,
    { rejectValue: FetchCashFlowError }
>(
    'cashFlows/makeWithdrawal',
    async (
        { uniqueAccountNumber, cashFlowAmount, cashFlowType },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                'http://localhost:5000/cash-flows/withdrawal',
                {
                    uniqueAccountNumber,
                    cashFlowAmount,
                    cashFlowType,
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
                errorMessage: 'Failed',
            });
        }
    }
);

export const makeDeposit = createAsyncThunk<
    CashFlow,
    WithdrawalData,
    { rejectValue: FetchCashFlowError }
>(
    'cashFlows/makeDeposit',
    async (
        { uniqueAccountNumber, cashFlowAmount, cashFlowType },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                'http://localhost:5000/cash-flows/deposit',
                {
                    uniqueAccountNumber,
                    cashFlowAmount,
                    cashFlowType,
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
                errorMessage: 'Failed',
            });
        }
    }
);

const cashFlowSlice = createSlice({
    name: 'cashFlows',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },    extraReducers: (builder) => {
        builder
            .addCase(fetchCashFlows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchCashFlows.fulfilled,
                (state, action: PayloadAction<CashFlow[]>) => {
                    state.status = 'succeeded';
                    state.cashFlows = action.payload;
                }
            )
            .addCase(fetchCashFlows.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(fetchWithdrawals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchWithdrawals.fulfilled,
                (state, action: PayloadAction<CashFlow[]>) => {
                    state.status = 'succeeded';
                    state.cashFlows = action.payload;
                }
            )
            .addCase(fetchWithdrawals.rejected, (state, action: PayloadAction<FetchCashFlowError | undefined>) => {
                state.status = 'failed';
                state.error = action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(fetchDeposits.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchDeposits.fulfilled,
                (state, action: PayloadAction<CashFlow[]>) => {
                    state.status = 'succeeded';
                    state.cashFlows = action.payload;
                }
            )
            .addCase(fetchDeposits.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(makeWithdrawal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                makeWithdrawal.fulfilled,
                (state, action: PayloadAction<CashFlow>) => {
                    state.status = 'succeeded';
                    state.cashFlow = action.payload;
                }
            )
            .addCase(makeWithdrawal.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(makeDeposit.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                makeDeposit.fulfilled,
                (state, action: PayloadAction<CashFlow>) => {
                    state.status = 'succeeded';
                    state.cashFlow = action.payload;
                }
            )
            .addCase(makeDeposit.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});
export const { resetStatus } = cashFlowSlice.actions;

export default cashFlowSlice.reducer;
