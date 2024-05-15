import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import {
    deleteUser,
    fetchUserDetails,
    resetStatus,
} from '../../../../features/users/usersSlice';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';
import { useAuth } from '../../../../hooks/useAuth';

export const UserDetails = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useAuth();
    const userRole = user?.userRole;
    const customer = useSelector((state: RootState) => state.users.user);

    const error = useSelector((state: RootState) => state.users.error);
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch, userId]);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/users/${userId}/accounts`);
    };
    const handleRouteEditUser = () => {
        navigate(`/users/${userId}/edit-user`);
    };

    const handleDeleteUser = () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId!))
                .unwrap()
                .then(() => {
                    alert('User deleted successfully');
                    navigate('/users');
                })
                .catch((error: string) => {
                    alert('Failed to delete user: ' + error);
                });
        }
    };

    return (
        <div>
            <h1>User Details</h1>
            <GoBackRoute />{' '}
            <span>
                <Button onClick={handleClick}>User Accounts</Button>
                {userRole === 'admin' && (
                    <>
                        <Button onClick={handleRouteEditUser}>Edit User</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteUser}
                        >
                            Delete User
                        </Button>
                    </>
                )}
            </span>
            {customer ? (
                <div>
                    <p>ID: {customer.userId}</p>
                    <p>
                        Name: {customer.firstName} {customer.lastName}
                    </p>
                    <p>Email: {customer.email}</p>
                </div>
            ) : (
                <p>{error || 'Loading...'}</p>
            )}
        </div>
    );
};
