import { useParams } from 'react-router-dom';
import GoBackRoute from '../../../../components/utils/GoBackRoute';

const AdminDepositAction = () => {
    const { accountId } = useParams();

    return (
        <div>
            <GoBackRoute />
            <h1>Withdrawal Action</h1>
            <h2>accountId {accountId}</h2>
        </div>
    );
};

export default AdminDepositAction;
