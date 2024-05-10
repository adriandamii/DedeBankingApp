import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../interfaces/userInterface';

interface UsersState {
    users: User[];
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    user: null,
    status: 'idle',
    error: null,
};

interface FetchUsersError {
    errorMessage: string;
}

export const fetchUsers = createAsyncThunk<
    User[],
    undefined,
    { rejectValue: FetchUsersError }
>('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/admin/users-list',
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to fetch users';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data.message || errorMessage;
        }
        return rejectWithValue({ errorMessage });
    }
});

export const fetchUserDetails = createAsyncThunk<
    User,
    string,
    { rejectValue: FetchUsersError }
>('users/fetchUserDetails', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/user/${userId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to fetch user details';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data.message || errorMessage;
        }
        return rejectWithValue({ errorMessage });
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchUsers.fulfilled,
                (state, action: PayloadAction<User[]>) => {
                    state.status = 'succeeded';
                    state.users = action.payload;
                }
            )
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchUserDetails.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.status = 'succeeded';
                    state.user = action.payload;
                }
            )
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
    },
});

export default usersSlice.reducer;
