import { useNavigate, useParams } from 'react-router-dom';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

const Transaction = () => {
    const { uniqueAccountNumber } = useParams();
    const navigate = useNavigate();
    const handleRouteTransactionAction = () => {
        navigate(`/account/${uniqueAccountNumber}/transaction/action`);
    };
    const handleRouteTransactionHistory = () => {
        navigate(`/account/${uniqueAccountNumber}/transaction/history`);
    };
    return (
        <div>
            <h1>Transaction page</h1>
            <GoBackRoute />
            <h2>You are on {uniqueAccountNumber}</h2>
            <Button onClick={handleRouteTransactionAction}>
                Make a transaction
            </Button>
            <Button onClick={handleRouteTransactionHistory}>
                Transaction history
            </Button>
        </div>
    );
};

export default Transaction;
