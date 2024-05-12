import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../app/store';
import { createTransaction } from '../../../../features/transactions/transactionsSlice';

const AdminTransactionAction: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.transactions);
    const [senderAccount, setSenderAccount] = useState("");
    const [receiverAccount, setReceiverAccount] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransaction = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(createTransaction({
            senderAccountNumber: senderAccount,
            receiverAccountNumber: receiverAccount,
            transactionAmount: parseFloat(amount),
        }));
    };

    return (
        <div>
            <GoBackRoute />
            <h1>Transaction Action</h1>
            <h2>Account ID: {accountId}</h2>
            <form onSubmit={handleTransaction}>
            <input
                    type="text"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    placeholder="Sender Account Number"
                    required
                />
                <input
                    type="text"
                    value={receiverAccount}
                    onChange={(e) => setReceiverAccount(e.target.value)}
                    placeholder="Receiver Account Number"
                    required
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    required
                />
                <button type="submit">Make Transaction</button>
            </form>
            {status === 'loading' && <p>Processing...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && <p>Transaction successful!</p>}
        </div>
    );
};

export default AdminTransactionAction;
