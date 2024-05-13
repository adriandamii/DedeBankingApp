import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../../app/store';
import { makeWithdrawal } from '../../../../../features/cashFlows/cashFlowsSlice';

const AdminWithdrawalAction = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector(
        (state: RootState) => state.cashFlows
    );
    const [amount, setAmount] = useState('');
    const [type] = useState('withdrawal');
    console.log('check the params', uniqueAccountNumber);
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
    console.log('uniqueAccountNumber', uniqueAccountNumber);
    console.log('cashFlowAmount', amount);
    console.log('cashFlowType', type);

    return (
        <div>
            <h1>Withdrawal Action</h1>
            <GoBackRoute />
            <h2>Account ID: {uniqueAccountNumber}</h2>
            <form onSubmit={handleWithdrawal}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                />
                <button type="submit">Withdraw</button>
            </form>
            {status === 'loading' && <p>Processing...</p>}
            {status === 'failed' && <p>{error}</p>}
        </div>
    );
};

export default AdminWithdrawalAction;
