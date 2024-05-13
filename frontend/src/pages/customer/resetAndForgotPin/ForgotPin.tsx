import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../app/store';
import { forgotPin } from '../../../features/users/usersSlice';

const ForgotPin = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.users);

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(forgotPin(email));
    };

    return (
        <div>
            <h1>Forgot Pin</h1>
            <GoBackRoute />
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit" disabled={status === 'loading'}>
                    Reset PIN
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {status === 'succeeded' && <p style={{ color: 'red' }}>Successfull</p>}

        </div>
    );
};

export default ForgotPin;
