import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../app/store';
import { requestResetPin } from '../../../features/users/usersSlice';
import { Button, TextField } from '@mui/material';

export default function ResetPin() {
   const {token} = useParams();
   const [pinNumber, setPinNumber] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { status, error } = useSelector((state: RootState) => state.users);

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (token && pinNumber) {
            dispatch(requestResetPin({ token, pinNumber }));
        }
    };

    if (status === 'succeeded') {
        alert("succedeed");
        navigate('/login');
    }

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit} className='login-form'>
            <h1>Reset Your PIN</h1>
                <TextField
                    type="password"
                    value={pinNumber}
                    onChange={(e) => setPinNumber(e.target.value)}
                    placeholder="Enter your new PIN"
                    required
                />
                <Button type="submit" disabled={status === 'loading'}>Reset PIN</Button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
