import React, { useEffect } from 'react'
import GoBackRoute from '../../../../../components/utils/GoBackRoute'
import CashFlow from '../../../../../components/cashFlow/CashFlow';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { fetchWithdrawals } from '../../../../../features/cashFlows/cashFlowsSlice';

const AdminWithdrawalHistory = () => {
  const { uniqueAccountNumber } = useParams();
   const dispatch = useDispatch<AppDispatch>();
   const { cashFlows, status, error } = useSelector(
       (state: RootState) => state.cashFlows
   );
   console.log(uniqueAccountNumber);
   useEffect(() => {
        if (uniqueAccountNumber) {
            dispatch(fetchWithdrawals(uniqueAccountNumber));
        }
   }, [dispatch, uniqueAccountNumber]);
  return (
    <div>
      <h1>Admin withdrawal history</h1>
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

export default AdminWithdrawalHistory
