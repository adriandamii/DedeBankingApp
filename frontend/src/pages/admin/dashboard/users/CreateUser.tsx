import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../app/store';
import { createUser } from '../../../../features/users/usersSlice';

const CreateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.users);
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [identityId, setIdentityId] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(createUser({ email, lastName, firstName, identityId }));
  };

  return (
    <div>
      <GoBackRoute />
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={identityId} onChange={(e) => setIdentityId(e.target.value)} placeholder="Identity ID" required />
        <button type="submit">Register User</button>
      </form>
      {status === 'loading' && <p>Registering...</p>}
      {status === 'failed' && <p>{error}</p>}
      {status === 'succeeded' && <p>User registered successfully!</p>}
    </div>
  );
};

export default CreateUser;
