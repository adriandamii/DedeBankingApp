// src/components/User.tsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';

interface CashFlowProps {
    cashFlowId: number | undefined;
    cashFlowType: string;
    cashFlowAmount: number;
}

const CashFlow: React.FC<CashFlowProps> = ({
    cashFlowId,
    cashFlowType,
    cashFlowAmount,
}) => {
    return (
        <>
            <tr
                style={{
                    backgroundColor:
                        cashFlowType === 'deposit'
                            ? '#edf9e8'
                            : cashFlowType === 'withdrawal'
                            ? '#f4dfde'
                            : 'none',
                }}
            >
                {' '}
                <td>{cashFlowId}</td>
                <td>{cashFlowType}</td>
                <td>{cashFlowAmount}</td>
            </tr>
        </>
    );
};

export default CashFlow;
