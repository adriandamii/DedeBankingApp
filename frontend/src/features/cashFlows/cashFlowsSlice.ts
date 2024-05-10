import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CashFlow } from '../../interfaces/cashFlowInterface';

interface WithdrawalData {
    uniqueAccountNumber: string | undefined;
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

export const makeWithdrawal = createAsyncThunk<
CashFlow,
WithdrawalData,
{ rejectValue: FetchCashFlowError }
>(
    'cashFlows/makeWithdrawal',
    async ({ uniqueAccountNumber, cashFlowAmount, cashFlowType }, { rejectWithValue }) => {
        try {
            const response = await axios.put('http://localhost:5000/cash-flows/withdrawal', {
                uniqueAccountNumber,
                cashFlowAmount,
                cashFlowType
            }, {
                withCredentials: true
            });
            return response.data;
         } catch (error) {
            let errorMessage = 'Failed to proccess the withdrawal';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data.message || errorMessage;
            }
            return rejectWithValue({ errorMessage });
        }
    }
);

const cashFlowSlice = createSlice({
    name: 'cashFlows',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(makeWithdrawal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(makeWithdrawal.fulfilled, (state, action:PayloadAction<CashFlow>) => {
                state.status = 'succeeded';
                state.cashFlow = action.payload;
            })
            .addCase(makeWithdrawal.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            
            });
    }
});

export default cashFlowSlice.reducer;
