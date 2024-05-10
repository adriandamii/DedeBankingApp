import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleRedirect = (path: string) => {
        navigate(path);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleRedirect('/admin/users')}>
                Users
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleRedirect('/admin/management')}>
                Management
            </Button>
        </div>
    );
};

