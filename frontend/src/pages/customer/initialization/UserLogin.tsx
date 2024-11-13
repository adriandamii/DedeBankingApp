import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { loginUser } from '../../../features/auth/authSlice';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [pinNumber, setPinNumber] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector(
        (state: RootState) => state.auth
    );
    const {isLoggedIn, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (status === 'succeeded' && user?.userId && user?.userRole === 'customer') {
            navigate(`/users/${user.userId}`);
        }else if (status === 'succeeded' && user?.userId && user?.userRole === 'admin') {
            navigate(`/users`)
        }
    }, [user?.userId, status, navigate, dispatch, isLoggedIn, user, error]);

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(
            loginUser({
                email,
                pinNumber,
            })
        );
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <TextField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="filled-basic"
                    label="Email"
                    variant="filled"
                    //autoComplete="new-password"
                />
                <TextField
                    type="password"
                    value={pinNumber}
                    onChange={(e) => setPinNumber(e.target.value)}
                    id="filled-basic"
                    label="PIN"
                    variant="filled"
                    autoComplete="off"
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
                <Button variant="text">
                    <Link to="/forgot-pin">Forgot Pin</Link>
                </Button>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>{error}</p>}
                {status === 'succeeded' && <p>User logged in successfully!</p>}
            </form>
        </div>
    );
};

export default UserLogin;
