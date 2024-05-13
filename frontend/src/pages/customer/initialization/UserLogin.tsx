import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { loginUser } from '../../../features/auth/authSlice';
import { Button, TextField} from '@mui/material';
import { Link } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [pinNumber, setPinNumber] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = () => {
        dispatch(
            loginUser({
                email,
                pinNumber,
            })
        );
    };

    return (
        <div>
            <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="filled-basic" label="Email" variant="filled"
            />
            <TextField
                type="password"
                value={pinNumber}
                onChange={(e) => setPinNumber(e.target.value)}
                id="filled-basic" label="PIN" variant="filled"

            />
            <Button onClick={handleLogin}>Login</Button>
            <Button><Link to='/forgot-pin'>Forgot Pin</Link></Button>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
        </div>
    );
};

export default UserLogin;
