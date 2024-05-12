import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces/userInterface';
import { checkAuthStatus } from './authService';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface AuthPayload {
  isLoggedIn: boolean;
  user?: User;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  status: 'idle',
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.user || null;
        state.status = 'succeeded';
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.status = 'failed';
      });
  },
});

export default authSlice.reducer;
