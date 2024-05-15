import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { forgotPin } from '../../../features/users/usersSlice';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const ForgotPin = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.users);

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        dispatch(forgotPin(email));
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <TextField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="filled-basic"
                    label="Email"
                    variant="filled"
                    autoComplete="new-password"
                />
                <Button type="submit" disabled={status === 'loading'}>
                    Forgot PIN
                </Button>
                <Button>
                    <Link to="/login">Login Page</Link>
                </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {status === 'succeeded' && (
                <p style={{ color: 'red' }}>Successfull email sent</p>
            )}
            </form>
        </div>
    );
};

export default ForgotPin;
