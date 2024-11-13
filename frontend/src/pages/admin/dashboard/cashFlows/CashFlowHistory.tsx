import React, { useEffect } from 'react';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import {
    fetchCashFlows,
    resetStatus,
} from '../../../../features/cashFlows/cashFlowsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import CashFlow from '../../../../components/cashFlow/CashFlow';
import { useParams } from 'react-router-dom';

const CashFlowHistory = () => {
    const { uniqueAccountNumber } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { cashFlows, status, error } = useSelector(
        (state: RootState) => state.cashFlows
    );

    useEffect(() => {
        if (uniqueAccountNumber !== undefined) {
            dispatch(fetchCashFlows(uniqueAccountNumber));
        }
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch, uniqueAccountNumber]);

    return (
        <div className="container">
            <h1>Cash Flows History</h1>
            <GoBackRoute />
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && (
                <table
                    className="transaction-table"
                    style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cashFlows.map((cashFlow, index) => (
                            <React.Fragment key={cashFlow.cashFlowId}>
                                <CashFlow
                                    key={cashFlow.cashFlowId}
                                    cashFlowId={index + 1}
                                    cashFlowAmount={cashFlow.cashFlowAmount}
                                    cashFlowType={cashFlow.cashFlowType}
                                />
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
            {status === 'succeeded' && cashFlows.length === 0 && (
                <p>No cash flow found.</p>
            )}
        </div>
    );
};

export default CashFlowHistory;
