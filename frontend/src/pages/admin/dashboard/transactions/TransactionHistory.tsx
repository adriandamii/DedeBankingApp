import React, { useEffect } from 'react';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import {
    fetchTransactions,
    resetStatus,
} from '../../../../features/transactions/transactionsSlice';
import Transaction from '../../../../components/transactions/Transaction';

const TransactionHistory = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { transactions, status, error } = useSelector(
        (state: RootState) => state.transactions
    );

    useEffect(() => {
        dispatch(fetchTransactions(uniqueAccountNumber!));
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch, uniqueAccountNumber]);

    return (
        <div className="container">
            <h1>Transaction History</h1>
            <GoBackRoute />
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && transactions.length > 0 && (
                <table className="transaction-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Amount</th>
                            <th>Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <Transaction
                                key={transaction.transactionId}
                                transactionId={index + 1}
                                senderAccountNumber={transaction.senderAccountNumber}
                                receiverAccountNumber={transaction.receiverAccountNumber}
                                transactionAmount={transaction.transactionAmount}
                                commission={transaction.commission}
                                uniqueAccountNumber={uniqueAccountNumber!}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {status === 'succeeded' && transactions.length === 0 && <p>No transactions found.</p>}
        </div>
    );
};

export default TransactionHistory;
