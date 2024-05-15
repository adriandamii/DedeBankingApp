import { useNavigate, useParams } from 'react-router-dom';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { Button } from '@mui/material';

const Deposit = () => {
    const { uniqueAccountNumber } = useParams();

    <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>;
    const navigate = useNavigate();
    const handleRouteDepositAction = () => {
        navigate(`/account/${uniqueAccountNumber}/deposit/action`);
    };
    const handleRouteDepositHistory = () => {
        navigate(`/account/${uniqueAccountNumber}/Deposit/history`);
    };
    return (
        <div>
            <h1>Deposit page</h1>
            <GoBackRoute />
            <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>
            <Button onClick={handleRouteDepositAction}>Make a deposit</Button>

            <Button onClick={handleRouteDepositHistory}>Deposit history</Button>
        </div>
    );
};

export default Deposit;
