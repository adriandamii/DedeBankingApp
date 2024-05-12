import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../interfaces/userInterface';

interface UsersState {
    users: User[];
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface UserDataCreate {
    email: string;
    firstName: string;
    lastName: string;
    identityId: string;
}

interface UserEditData {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
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
        if (axios.isAxiosError(error) && error.response) {
            const errors = error.response.data.errors;
            if (errors && errors.length > 0) {
                return rejectWithValue({ errorMessage: errors.join(', ') });
            }
        }
        return rejectWithValue({
            errorMessage: 'Failed to fetch users',
        });
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
        if (axios.isAxiosError(error) && error.response) {
            const errors = error.response.data.errors;
            if (errors && errors.length > 0) {
                return rejectWithValue({ errorMessage: errors.join(', ') });
            }
        }
        return rejectWithValue({
            errorMessage: 'Failed to feth user details',
        });
    }
});

export const createUser = createAsyncThunk<
    User,
    UserDataCreate,
    { rejectValue: FetchUsersError }
>('users/createUser', async (userData: UserDataCreate, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/admin/create-user',
            userData,
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
            }
        }
        return rejectWithValue({
            errorMessage: 'Failed to create user',
        });
    }
});

export const editUser = createAsyncThunk<
    User,
    UserEditData,
    { rejectValue: FetchUsersError }
>('users/editUser', async (userData: UserEditData, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/admin/user-edit/${userData.userId}`,
            userData,
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
            errorMessage: 'Failed to edit user',
        });
    }
});

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/admin/delete/${userId}`,
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
                errorMessage: 'Failed to delete user',
            });
        }
    }
);

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
            })
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                createUser.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.status = 'succeeded';
                    state.user = action.payload;
                }
            )
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(editUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.user = null; 
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default usersSlice.reducer;
