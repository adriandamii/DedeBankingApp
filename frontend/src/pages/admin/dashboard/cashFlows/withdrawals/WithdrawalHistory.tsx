import React, { useEffect } from 'react'
import GoBackRoute from '../../../../../components/utils/GoBackRoute'
import CashFlow from '../../../../../components/cashFlow/CashFlow';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { fetchWithdrawals, resetStatus } from '../../../../../features/cashFlows/cashFlowsSlice';

const WithdrawalHistory = () => {
  const { uniqueAccountNumber } = useParams();
   const dispatch = useDispatch<AppDispatch>();
   const { cashFlows, status, error } = useSelector(
       (state: RootState) => state.cashFlows
   );

useEffect(() => {
    if (uniqueAccountNumber) {
        dispatch(fetchWithdrawals(uniqueAccountNumber));
    }
    dispatch(resetStatus());
    return () => {
        dispatch(resetStatus());
    };
   }, [dispatch, uniqueAccountNumber]);
  return (
    <div>
      <h1>Withdrawal history</h1>
      <GoBackRoute/>
           {status === 'loading' && <p>Loading...</p>}
           {status === 'failed' && <p>{error}</p>}
           {status === 'succeeded' && (
               <ul>
                   {cashFlows.map((cashFlow) => (
                       <React.Fragment key={cashFlow.cashFlowId}>
                           <CashFlow
                               key={cashFlow.cashFlowId}
                               cashFlowId={cashFlow.cashFlowId}
                               cashFlowAmount={cashFlow.cashFlowAmount}
                               cashFlowType={cashFlow.cashFlowType}
                               uniqueAccountNumber={cashFlow.uniqueAccountNumber}
                           />
                           <hr></hr>
                       </React.Fragment>
                   ))}
               </ul>
           )}
    </div>
  )
}

export default WithdrawalHistory
