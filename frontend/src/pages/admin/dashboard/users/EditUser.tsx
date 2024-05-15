import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { editUser, resetStatus } from '../../../../features/users/usersSlice';
import { Button, TextField } from '@mui/material';

const EditUser = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.users);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
      dispatch(resetStatus());
      return () => {
          dispatch(resetStatus());
      };
  }, [dispatch]);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (userId) {
            dispatch(editUser({ userId, firstName, lastName, email }));
        }
    };

    return (
        <>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                <h1>Edit User</h1>
                    <TextField
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <Button type="submit">Update User</Button>
                    {status === 'loading' && <p>Updating...</p>}
                    {status === 'failed' && <p>{error}</p>}
                    {status === "succeeded" && <p>User updated successfully</p>}

                </form>
            </div>
        </>
    );
};

export default EditUser;
