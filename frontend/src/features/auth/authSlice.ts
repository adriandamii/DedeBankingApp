import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces/userInterface';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    token: string | null;
    userRole: string | null;
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
    userRole: null,
};
interface UserLogin {
    email: string;
    pinNumber: string;
}
interface LoginError {
    errorMessage: string;
}

export const checkAuthStatus = createAsyncThunk<
    AuthPayload,
    void,
    { rejectValue: LoginError }
>('auth/checkStatus', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5000/auth-check', {
            withCredentials: true,
        });
        if (response.data && response.data.isLoggedIn) {
            return response.data as AuthPayload;
        } else {
            return rejectWithValue({
                errorMessage: 'Not logged in'
            });
        } 
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

export const logoutUser = createAsyncThunk<
    User,
    undefined,
    { rejectValue: LoginError }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/user/logout',
            {},
            { withCredentials: true }
        );
        console.log(response);
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.status = 'loading';
                //toast.loading("loading checkAuthStatus")
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
                state.error = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload;  
                state.status = 'succeeded';
                toast.success('Login Successful ');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.status = 'idle';
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'idle';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});
export const { resetStatus } = authSlice.actions;

export default authSlice.reducer;
