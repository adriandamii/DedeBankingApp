import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import {useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../app/store';
import { fetchAccountDetails } from '../../../../features/accounts/accountsSlice';
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
    }, [dispatch, accountId]);
    
    const navigate = useNavigate();
    const handleRouteWithdrawal = () => {
        navigate(`/admin/account/${account?.uniqueAccountNumber}/withdrawal`);
    };
    const handleRouteDeposit = () => {
        navigate(`/admin/account/${account?.uniqueAccountNumber}/deposit`);
    };
    const handleRouteTransaction = () => {
        navigate(`/admin/account/${account?.uniqueAccountNumber}/transaction`);
    };

    return (
        <div>
            <h1>Account Details</h1>
            <GoBackRoute/>
            <Button onClick={handleRouteTransaction} color="error">
                Transaction
            </Button>
            <Button onClick={handleRouteWithdrawal} color="success">
                Withdrawal
            </Button>
            <Button onClick={handleRouteDeposit} color="secondary">
                Deposit
            </Button>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && account && (
                <div>
                    <p>Account ID: {account.accountId}</p>
                    <p>Balance: {account.amount}</p>
                    <p>Unique Account Number: {account.uniqueAccountNumber}</p>

                </div>
            )}
        </div>
    );
};

export default AccountDetails;
