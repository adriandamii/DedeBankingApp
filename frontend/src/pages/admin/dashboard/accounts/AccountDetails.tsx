import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../app/store';
import { fetchAccountDetails, resetStatus } from '../../../../features/accounts/accountsSlice';
import GoBackRoute from '../../../../components/utils/GoBackRoute';

const AccountDetails = () => {
    const { accountId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const account = useSelector((state: RootState) => state.accounts.account);
    const status = useSelector((state: RootState) => state.accounts.status);
    const error = useSelector((state: RootState) => state.accounts.error);
   
    useEffect(() => {
        if (accountId) {
            dispatch(fetchAccountDetails(accountId));
        }
        dispatch(resetStatus());
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch, accountId]);

    const navigate = useNavigate();
    const handleRouteWithdrawal = () => {
        navigate(`/account/${account?.uniqueAccountNumber}/withdrawal`);
    };
    const handleRouteDeposit = () => {
        navigate(`/account/${account?.uniqueAccountNumber}/deposit`);
    };
    const handleRouteTransaction = () => {
        navigate(`/account/${account?.uniqueAccountNumber}/transaction`);
    };
    const handleRouteCashFlowHistory = () => {
        navigate(
            `/account/${account?.uniqueAccountNumber}/cashflow-history`
        );
    };

    return (
        <>
            <h1>Account Details</h1>
            <GoBackRoute />
            <Button onClick={handleRouteTransaction} color="error">
                Transaction
            </Button>
            <Button onClick={handleRouteWithdrawal} color="success">
                Withdrawal
            </Button>
            <Button onClick={handleRouteDeposit} color="secondary">
                Deposit
            </Button>
            
            <Button onClick={handleRouteCashFlowHistory} color="secondary">
                Withdrawal/Deposit History
            </Button>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && account && (
                <div>
                    <p>Account ID: {account.accountId}</p>
                    <p>Balance: {account.amount}</p>
                    <p>Unique Account Number: {account.uniqueAccountNumber}</p>
                </div>
            )}
        </>
    );
};

export default AccountDetails;
