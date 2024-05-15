import { Button } from '@mui/material';
import GoBackRoute from '../../../../../components/utils/GoBackRoute';
import { useNavigate, useParams } from 'react-router-dom';

const Withdrawal = () => {
    const { uniqueAccountNumber } = useParams();

    const navigate = useNavigate();
    const handleRouteWithdrawalAction = () => {
        navigate(`/account/${uniqueAccountNumber}/withdrawal/action`);
    };
    const handleRouteWithdrawalHistory = () => {
        navigate(`/account/${uniqueAccountNumber}/withdrawal/history`);
    };
   
    return (
        <div>
            <h1>Withdrawal page</h1>
            <GoBackRoute />
            <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>
            <Button onClick={handleRouteWithdrawalAction}>
                Make a withdrawal
            </Button>
            <Button onClick={handleRouteWithdrawalHistory}>
                Withdrawal history
            </Button>
        </div>
    );
};

export default Withdrawal;
