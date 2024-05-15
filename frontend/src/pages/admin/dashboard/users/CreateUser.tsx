import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../app/store';
import { createUser, resetStatus } from '../../../../features/users/usersSlice';
import { Button, TextField } from '@mui/material';

const CreateUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.users);
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [identityId, setIdentityId] = useState('');

    useEffect(() => {
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(createUser({ email, lastName, firstName, identityId }));
    };

    return (
        <>
            <GoBackRoute />
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Create User</h1>
                    <TextField
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <TextField
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                    <TextField
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                    <TextField
                        type="text"
                        value={identityId}
                        onChange={(e) => setIdentityId(e.target.value)}
                        placeholder="Identity ID"
                        required
                    />
                    <Button type="submit">Register User</Button>
                    {status === 'loading' && <p>Registering...</p>}
                    {status === 'failed' && <p>{error}</p>}
                    {status === 'succeeded' && (
                        <p>User registered successfully!</p>
                    )}
                </form>
            </div>
        </>
    );
};

export default CreateUser;
