import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@mui/material';

const Navbar: React.FC = () => {
    const { isLoggedIn, user } = useAuth();

    return (
        <nav>
            {isLoggedIn && <p>You are logged in as {user?.userRole}</p>}
            <Button>
                <Link to="/admin/dashboard">Dasbhoard</Link>
            </Button>
        </nav>
    );
};

export default Navbar;
