import { useParams } from 'react-router-dom';
import GoBackRoute from '../../../../components/utils/GoBackRoute';

const AdminTransactionAction = () => {
    const { accountId } = useParams();

    return (
        <div>
         <GoBackRoute/>
            <h1>Transaction Action</h1>
            <h2>accountId {accountId}</h2>
        </div>
    );
};

export default AdminTransactionAction;
