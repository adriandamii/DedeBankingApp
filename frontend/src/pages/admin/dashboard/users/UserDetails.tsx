import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { fetchUserDetails } from '../../../../features/users/usersSlice';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

export const UserDetails = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.users.user);
    const error = useSelector((state: RootState) => state.users.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }
    }, [dispatch, userId]);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/users/${userId}/accounts`);
    };

    return (
        <div>
            <h1>User Details</h1>
            <GoBackRoute />{' '}
            <span>
                 <Button onClick={handleClick}>User Accounts</Button>
            </span>
            {user ? (
                <div>
                    <p>ID: {user.userId}</p>
                    <p>
                        Name: {user.firstName} {user.lastName}
                    </p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>{error || 'Loading...'}</p>
            )}
        </div>
    );
};
