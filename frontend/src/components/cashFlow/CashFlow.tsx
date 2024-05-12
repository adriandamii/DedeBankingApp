// src/components/User.tsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';

interface CashFlowProps {
    cashFlowId: number | undefined;
    uniqueAccountNumber: number;
    cashFlowType: string;
    cashFlowAmount: number;
}

const CashFlow: React.FC<CashFlowProps> = ({ cashFlowId, uniqueAccountNumber, cashFlowType, cashFlowAmount }) => {
   //const navigate = useNavigate();
    const handleClick = () => {
        //navigate(`/users/${userId}`); 
    };

    return (
        <div className="user-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <p> {cashFlowId} {uniqueAccountNumber} {cashFlowType} {cashFlowAmount}</p>
        </div>
    );
};

export default CashFlow;
