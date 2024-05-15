import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { createAccount, resetStatus } from '../../../../features/accounts/accountsSlice';
import { Button, TextField } from '@mui/material';

const CreateAccount = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [amount, setAmount] = useState('');
    const { status, error } = useSelector((state: RootState) => state.accounts);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            dispatch(createAccount({ userId, amount }));
        }
        if (status === 'succeeded') {
            navigate(-1);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Create Account for ID: {userId}</h1>
                <TextField
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter initial amount"
                    required
                />
                <Button type="submit">Create Account</Button>
                {status === 'loading' && <p>Creating account...</p>}
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default CreateAccount;
