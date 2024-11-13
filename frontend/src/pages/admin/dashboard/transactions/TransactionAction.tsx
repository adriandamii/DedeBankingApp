import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { AppDispatch, RootState } from '../../../../app/store';
import {
    createTransaction,
    resetStatus,
} from '../../../../features/transactions/transactionsSlice';
import { Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';

const TransactionAction: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector(
        (state: RootState) => state.transactions
    );
    const { uniqueAccountNumber } = useParams();

    const [receiverAccount, setReceiverAccount] = useState('');
    const [amount, setAmount] = useState('');
    useEffect(() => {
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);
    const handleTransaction = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(
            createTransaction({
                senderAccountNumber: uniqueAccountNumber!,
                receiverAccountNumber: receiverAccount,
                transactionAmount: parseFloat(amount)
            })
        );
    };
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleTransaction}>
                <h1>Transaction Action</h1>
                <GoBackRoute />
                <TextField
                    type="text"
                    value={uniqueAccountNumber}
                    id="filled-basic"
                    label="Sending account"
                    variant="filled"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    type="number"
                    value={receiverAccount}
                    onChange={(e) => setReceiverAccount(e.target.value)}
                    id="filled-basic"
                    label="Receiver account"
                    variant="filled"
                    required
                />
                <TextField
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    id="filled-basic"
                    label="Transaction amount"
                    variant="filled"                    
                    required
                />
                <Button type="submit">Make Transaction</Button>
                {status === 'loading' && <p>Processing...</p>}
                {status === 'failed' && <p>{error}</p>}
                {status === 'succeeded' && <p>Transaction successful!</p>}
            </form>
        </div>
    );
};

export default TransactionAction;
