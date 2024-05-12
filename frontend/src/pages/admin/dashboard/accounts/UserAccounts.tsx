import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountsByUserId } from '../../../../features/accounts/accountsSlice';
import { AppDispatch, RootState } from '../../../../app/store';
import Account from '../../../../components/account/Account';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

export const UserAccounts = () => {
    const { userId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const accounts = useSelector((state: RootState) => state.accounts.accounts);
    const status = useSelector((state: RootState) => state.accounts.status);
    const error = useSelector((state: RootState) => state.accounts.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchAccountsByUserId(userId));
        }
    }, [dispatch, userId]);
    const navigate = useNavigate();
    const handleRouteCreateAccount = () => {
        navigate(`/users/${userId}/accounts/create`);
    };

    return (
        <div>
            <h1>Accounts for User ID: {userId}</h1>
            <GoBackRoute />

            <Button onClick={handleRouteCreateAccount} color="error">
                Create Account
            </Button>
            {status === 'loading' && <p>Loading accounts...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && accounts.length > 0 && (
                <ul>
                    {accounts.map((account) => (
                        <React.Fragment key={account.accountId}>
                            <Account
                                key={account.accountId}
                                userId={account.userId}
                                accountId={account.accountId}
                                uniqueAccountNumber={
                                    account.uniqueAccountNumber
                                }
                                amount={account.amount}
                            />
                            <hr></hr>
                        </React.Fragment>
                    ))}
                </ul>
            )}
        </div>
    );
};
