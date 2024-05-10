import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchUsers } from '../../../../features/users/usersSlice';
import User from '../../../../components/user/User';
import { Button } from '@mui/material';

const UsersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, status, error } = useSelector(
        (state: RootState) => state.users
    );

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div>
            <Button>Create user</Button>
            <h1>Users</h1>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && (
                <ul>
                    {users.map((user) => (
                        <React.Fragment key={user.userId}>
                            <User
                                key={user.userId}
                                userId={user.userId}
                                firstName={user.firstName}
                                lastName={user.lastName}
                                email={user.email}
                            />
                            <hr></hr>
                        </React.Fragment>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsersList;
