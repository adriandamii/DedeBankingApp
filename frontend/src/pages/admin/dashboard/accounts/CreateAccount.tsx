import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../app/store';
import { createAccount } from '../../../../features/accounts/accountsSlice';

const CreateAccount = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [amount, setAmount] = useState('');
    const { status, error } = useSelector((state:RootState) => state.accounts);
const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (userId) {
         dispatch(createAccount({ userId, amount }));
      }
      if (status === "succeeded") {
         navigate(-1)
      }
    };

    return (
        <div>
            <h1>Create Account for User ID: {userId}</h1>
            <GoBackRoute />
            <form onSubmit={handleSubmit}>
                <label>
                    Initial Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Enter initial amount"
                        required
                    />
                </label>
                <button type="submit">Create Account</button>
            </form>
            {status === 'loading' && <p>Creating account...</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default CreateAccount;
