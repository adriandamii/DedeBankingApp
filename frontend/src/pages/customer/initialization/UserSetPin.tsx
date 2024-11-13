import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { setUserPin } from '../../../features/users/usersSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';


const UserSetPin = () => {
  const [pinNumber, setPinNumber] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.users);
  const {token} = useParams();
const navigate = useNavigate();
  const handleSetPin = () => {
    if (token) {
      dispatch(setUserPin({ pinNumber, token }));
    } else {
      alert("no token provided");
    }
  };
  useEffect(() => {
   if (status === "succeeded") {
      navigate("/login");
   }
}, [status, navigate]);

  return (
    <div className='container'>

      <h1>Set Your Pin</h1>
      <TextField
        type="password"
        value={pinNumber}
        onChange={(e) => setPinNumber(e.target.value)}
        placeholder="Enter your pin"
      />
      <Button onClick={handleSetPin}>Set Pin</Button>
      {status === 'loading' && <p>Processing...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <p>Pin set successfully!</p>}
    </div>
  );
};

export default UserSetPin;
