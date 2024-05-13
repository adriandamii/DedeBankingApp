import { useParams } from 'react-router-dom';
import GoBackRoute from '../../../../../components/utils/GoBackRoute'
import { AppDispatch, RootState } from '../../../../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { fetchDeposits } from '../../../../../features/cashFlows/cashFlowsSlice';
import CashFlow from '../../../../../components/cashFlow/CashFlow';

const AdminDepositHistory = () => {
  const { uniqueAccountNumber } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { cashFlows, status, error } = useSelector(
      (state: RootState) => state.cashFlows
  );
  console.log(uniqueAccountNumber);
  useEffect(() => {
       if (uniqueAccountNumber) {
           dispatch(fetchDeposits(uniqueAccountNumber));
       }
  }, [dispatch, uniqueAccountNumber]);
  return (
    <div>
      <h1>Admin deposit history</h1>
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

export default AdminDepositHistory
