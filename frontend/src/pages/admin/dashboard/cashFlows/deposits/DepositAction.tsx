import { useParams } from 'react-router-dom';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { useEffect, useState } from 'react';
import { makeDeposit, resetStatus } from '../../../../../features/cashFlows/cashFlowsSlice';
import { Button, Input } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const DepositAction = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector(
        (state: RootState) => state.cashFlows
    );
    const [amount, setAmount] = useState('');
    const [type] = useState('deposit');

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
                makeDeposit({
                    uniqueAccountNumber: uniqueAccountNumber,
                    cashFlowAmount: parseFloat(amount),
                    cashFlowType: type,
                })
            );
        }
    };

    return (
        <div className='container'>
            <h1>Withdrawal Action</h1>
            <GoBackRoute />
            <h2>Account ID: {uniqueAccountNumber}</h2>
            <form onSubmit={handleWithdrawal}>
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                />
                <Button type="submit" endIcon={<SendIcon />}>
                    Deposit
                </Button>
            </form>
            {status === 'loading' && <p>Processing...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && <p>Successfully deposit </p>}
        </div>
    );
};

export default DepositAction;
