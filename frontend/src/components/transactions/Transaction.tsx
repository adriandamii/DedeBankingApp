import React from 'react';

interface TransactionProps {
    transactionId: number | undefined;
    senderAccountNumber: string;
    receiverAccountNumber: string;
    transactionAmount: number;
}

const Transaction: React.FC<TransactionProps> = ({ transactionId, senderAccountNumber, receiverAccountNumber, transactionAmount }) => {

    return (
        <div className="user-container" style={{ cursor: 'pointer' }}>
            <p> {transactionId} {senderAccountNumber} {receiverAccountNumber} {transactionAmount}</p>
        </div>
    );
};

export default Transaction;
