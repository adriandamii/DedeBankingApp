import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../interfaces/userInterface';

interface UsersState {
    users: User[];
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface SetUser {
    token: string;
    pinNumber: string;
}

interface UsersResponseList {
    data: User[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
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
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
};

interface UserError {
    errorMessage: string;
}

interface FetchUsersParams {
    page: number;
    limit: number;
}

export const fetchUsers = createAsyncThunk<
    UsersResponseList,
    FetchUsersParams,
    { rejectValue: UserError }
>(
    'users/fetchUsers',
    async (params: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/admin/users-list`,
                {
                    params: { page: params.page, limit: params.limit },
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
                errorMessage: 'Failed to fetch users',
            });
        }
    }
);

export const fetchUserDetails = createAsyncThunk<
    User,
    string,
    { rejectValue: UserError }
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
    { rejectValue: UserError }
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
    { rejectValue: UserError }
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

export const deleteUser = createAsyncThunk<
    User,
    string,
    { rejectValue: UserError }
>('users/deleteUser', async (userId: string, { rejectWithValue }) => {
    try {
        const response = await axios.delete(
            `http://localhost:5000/admin/delete/user/${userId}`,
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
});

export const setUserPin = createAsyncThunk<
    User,
    SetUser,
    { rejectValue: UserError }
>('users/setUserPin', async ({ pinNumber, token }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/user/set-pin/${token}`,
            { pinNumber }
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
            errorMessage: 'Failed to set user pin',
        });
    }
});

export const forgotPin = createAsyncThunk<
    User,
    string,
    { rejectValue: UserError }
>('users/forgotPin', async (email, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/user/forgot-pin',
            { email }
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
});

export const requestResetPin = createAsyncThunk<
    User,
    SetUser,
    { rejectValue: UserError }
>(
    'users/requestResetPin',
    async ({ token, pinNumber }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/user/reset-pin/${token}`,
                { pinNumber }
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
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.data;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
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
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(setUserPin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setUserPin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(setUserPin.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            })
            .addCase(forgotPin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(forgotPin.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(forgotPin.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload?.errorMessage || 'Unknown error occurred';
            });
        builder.addCase(requestResetPin.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(requestResetPin.fulfilled, (state) => {
            state.status = 'succeeded';
        });
        builder.addCase(requestResetPin.rejected, (state, action) => {
            state.status = 'failed';
            state.error =
                action.payload?.errorMessage || 'Unknown error occurred';
        });
    },
});

export default usersSlice.reducer;
