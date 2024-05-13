import React, { useEffect } from 'react';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../../../features/transactions/transactionsSlice';
import Transaction from '../../../../components/transactions/Transaction';

const AdminTransactionHistory = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { transactions, status, error } = useSelector(
        (state: RootState) => state.transactions
    );

    useEffect(() => {
        if (uniqueAccountNumber !== undefined) {
            dispatch(fetchTransactions(uniqueAccountNumber));
        }
    }, [dispatch, uniqueAccountNumber]);

    return (
        <div>
            <h1>Admin transaction history</h1>
            <GoBackRoute />
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && (
                <ul>
                    {transactions.map((transaction) => (
                        <React.Fragment key={transaction.transactionId}>
                            <Transaction
                                key={transaction.transactionId}
                                transactionId={transaction.transactionId}
                                transactionAmount={
                                    transaction.transactionAmount
                                }
                                senderAccountNumber={
                                    transaction.senderAccountNumber
                                }
                                receiverAccountNumber={
                                    transaction.receiverAccountNumber
                                }
                            />
                            <hr></hr>
                        </React.Fragment>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminTransactionHistory;
