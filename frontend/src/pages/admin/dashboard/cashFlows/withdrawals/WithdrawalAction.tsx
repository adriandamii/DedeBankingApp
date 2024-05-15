import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../../app/store';
import { makeWithdrawal, resetStatus } from '../../../../../features/cashFlows/cashFlowsSlice';
import { Button, TextField } from '@mui/material';

const WithdrawalAction = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector(
        (state: RootState) => state.cashFlows
    );
    const [amount, setAmount] = useState('');
    const [type] = useState('withdrawal');

    useEffect(() => {
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);
    const handleWithdrawal = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (uniqueAccountNumber) {
            dispatch(
                makeWithdrawal({
                    uniqueAccountNumber: uniqueAccountNumber,
                    cashFlowAmount: parseFloat(amount),
                    cashFlowType: type,
                })
            );
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleWithdrawal} className='form-container'>
            <h1>Withdrawal Action</h1>
            <GoBackRoute />
                <TextField
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                />
                <Button type="submit">Withdraw</Button>
            {status === 'loading' && <p>Processing...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && <p>Successfully withdrawal</p>}
            </form>

        </div>
    );
};

export default WithdrawalAction;
