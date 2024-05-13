import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersSlice from '../features/users/usersSlice';
import accountsSlice from '../features/accounts/accountsSlice';
import cashFlowsSlice from '../features/cashFlows/cashFlowsSlice';
import transactionsSlice from '../features/transactions/transactionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersSlice,
        accounts: accountsSlice,
        cashFlows: cashFlowsSlice,
        transactions: transactionsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
