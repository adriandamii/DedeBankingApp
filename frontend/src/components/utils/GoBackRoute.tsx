import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GoBackRoute = () => {
    const navigate = useNavigate();
    const handleRouteBack = () => {
        navigate(-1);
    };
    return (
        <>
            <Button onClick={handleRouteBack}>Go Back</Button>
        </>
    );
};

export default GoBackRoute;
