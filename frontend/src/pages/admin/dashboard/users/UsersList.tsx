import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchUsers, resetStatus } from '../../../../features/users/usersSlice';
import User from '../../../../components/user/User';
import { Button, List, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';

const UsersList: React.FC = () => {
    const {user} = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleRouteCreateUser = () => {
        navigate('/admin/create-user');
    };
    const handleRouteSearchUser = () => {
        navigate('/search');
    };
    useEffect(() => {
        if (user?.userRole === 'customer' && location.pathname === '/users') {
            navigate(`/users/${user?.userId}`);
        }
    }, [navigate, user]);
    const { users, status, error, page, limit, totalPages } = useSelector(
        (state: RootState) => state.users
    );

    useEffect(() => {
        dispatch(fetchUsers({ page, limit }));
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch, page, limit]);

    const handlePageChange = (_event: unknown, newPage: number) => {
        dispatch(fetchUsers({ page: newPage, limit }));
    };

    return (
        <>
            <div className="container">
                <Button onClick={handleRouteCreateUser}>Create user</Button>
                <Button onClick={handleRouteSearchUser}>Search user</Button>

                <h1>Users</h1>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>{error}</p>}
                {status === 'succeeded' && (
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {users?.map((user) => (
                            <React.Fragment key={user.userId}>
                                {user && user?.userRole !== 'admin' && (
                                    <User
                                        key={user.userId}
                                        userId={user.userId}
                                        firstName={user.firstName}
                                        lastName={user.lastName}
                                        email={user.email}
                                        isActive= {user.isActive}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                )}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                />
            </div>
        </>
    );
};

export default UsersList;
