import { useNavigate, useParams } from 'react-router-dom';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

const AdminDeposit = () => {
    const { uniqueAccountNumber } = useParams();

    <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>;
    const navigate = useNavigate();
    const handleRouteDepositAction = () => {
        navigate(`/admin/account/${uniqueAccountNumber}/deposit/action`);
    };
    const handleRouteDepositHistory = () => {
        navigate(`/admin/account/${uniqueAccountNumber}/Deposit/history`);
    };
    return (
        <div>
            <GoBackRoute />
            <h1>Admin Deposit page</h1>
            <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>
            <Button onClick={handleRouteDepositAction}>Make a deposit</Button>

            <Button onClick={handleRouteDepositHistory}>Deposit history</Button>
        </div>
    );
};

export default AdminDeposit;
