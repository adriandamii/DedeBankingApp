import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
const GoBackRoute = () => {
    const navigate = useNavigate();
    const handleRouteBack = () => {
        navigate(-1);
    };
    return (
        <>
            <Button onClick={handleRouteBack}><ArrowBackIosNewRoundedIcon/></Button>
        </>
    );
};

export default GoBackRoute;
