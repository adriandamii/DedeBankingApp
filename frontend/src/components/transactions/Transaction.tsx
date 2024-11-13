import React from 'react';

interface TransactionProps {
    transactionId: number | undefined;
    senderAccountNumber: string;
    receiverAccountNumber: string;
    transactionAmount: number;
    commission: number;
    uniqueAccountNumber: string;
}

const Transaction: React.FC<TransactionProps> = ({
    transactionId,
    senderAccountNumber,
    receiverAccountNumber,
    transactionAmount,
    commission,
    uniqueAccountNumber
}) => {
    console.log(typeof(uniqueAccountNumber), typeof(senderAccountNumber))
    return (
        <tr
            style={{
                backgroundColor:
                Number(uniqueAccountNumber) !== Number(senderAccountNumber)
                        ? '#edf9e8' : Number(uniqueAccountNumber) === Number(senderAccountNumber)
                        ? '#f4dfde' : 'none',
            }}
        >
            <td>{transactionId}</td>
            <td>{senderAccountNumber}</td>
            <td>{receiverAccountNumber}</td>
            <td>{transactionAmount}</td>
            <td>{commission}</td>
        </tr>
    );
};

export default Transaction;
