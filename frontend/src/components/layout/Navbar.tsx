import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@mui/material';

const Navbar: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    console.log(isLoggedIn);
    return (
        <nav>
            {isLoggedIn && <p>Hello {user?.userRole}</p>}
            <Button>
                <Link to="/admin/dashboard">Dasbhoard</Link>
            </Button>
        </nav>
    );
};

export default Navbar;
