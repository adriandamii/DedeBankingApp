import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from "../../../../components/utils/GoBackRoute";
import { AppDispatch, RootState } from '../../../../app/store';
import { editUser } from '../../../../features/users/usersSlice';

const EditUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.users);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (userId) {
       dispatch(editUser({ userId, firstName, lastName, email }));
    }
  };

  return (
    <div>
      <h1>Edit User</h1>
      <GoBackRoute />
      <form onSubmit={handleSubmit}>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">Update User</button>
      </form>
      {status === 'loading' && <p>Updating...</p>}
      {status === 'failed' && <p>{error}</p>}
    </div>
  );
};

export default EditUser;
