import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces/userInterface';
import { checkAuthStatus } from './authService';
import axios from 'axios';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface AuthPayload {
    isLoggedIn: boolean;
    user?: User;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    status: 'idle',
    token: '',
    error: null,
};
interface UserLogin {
    email: string;
    pinNumber: string;
}
interface LoginError {
    errorMessage: string;
}

export const loginUser = createAsyncThunk<
    User,
    UserLogin,
    { rejectValue: LoginError }
>('auth/loginUser', async ({ email, pinNumber }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/user/login-customer',
            {
                email,
                pinNumber,
            },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
                error.response.data.message || 'Failed to fetch accounts';
            return rejectWithValue({ errorMessage });
        }
        return rejectWithValue({
            errorMessage: 'Failed to fetch accounts',
        });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                checkAuthStatus.fulfilled,
                (state, action: PayloadAction<AuthPayload>) => {
                    state.isLoggedIn = action.payload.isLoggedIn;
                    state.user = action.payload.user || null;
                    state.status = 'succeeded';
                }
            )
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.status = 'failed';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});

export default authSlice.reducer;
