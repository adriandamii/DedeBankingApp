import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AccountProps {
    userId: number;
    accountId: number | undefined;
    uniqueAccountNumber: number;
    amount: number;
}

const Account: React.FC<AccountProps> = ({ userId, accountId, uniqueAccountNumber, amount }) => {
   const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/users/${userId}/accounts/${accountId}`); 
    };

    return (
        <div className="user-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <p>accountId: {accountId}</p>
            <p>uniqueAccountNumber: {uniqueAccountNumber}</p>
            <p>amount {amount}</p>
        </div>
    );
};

export default Account;
