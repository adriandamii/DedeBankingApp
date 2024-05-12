import { useNavigate, useParams } from 'react-router-dom';
import GoBackRoute from '../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

const AdminTransaction = () => {
    const { uniqueAccountNumber } = useParams();
    const navigate = useNavigate();
    const handleRouteTransactionAction = () => {
        navigate(`/admin/account/${uniqueAccountNumber}/transaction/action`);
    };
    const handleRouteTransactionHistory = () => {
        navigate(`/admin/account/${uniqueAccountNumber}/transaction/history`);
    };
    return (
        <div>
            <GoBackRoute />
            <h1>Transaction admin page</h1>
            <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>
            <Button onClick={handleRouteTransactionAction}>
                Make a transaction
            </Button>
            <Button onClick={handleRouteTransactionHistory}>
                Transaction history
            </Button>
        </div>
    );
};

export default AdminTransaction;
