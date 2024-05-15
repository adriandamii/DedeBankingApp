import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export const AdminCreate: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {user} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user?.userRole === 'customer' && location.pathname === '/admin/create') {
            navigate(`/users/${user?.userId}`);
        }
    }, [navigate, user]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/create-admin'
            );
            setMessage(response.data.message);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(
                        err.response.data.message ||
                            'A server-side error occurred.'
                    );
                } else {
                    setError('Network error or server is not responding.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div>
            <h2>Create Admin</h2>
            <span>
                Did you create the admin user? Go to{' '}
                <Link to={`/admin/send-login-password`}>Send login password</Link>{" "}page
            </span>
            <br />
            <form onSubmit={handleSubmit}>
                <Button variant="outlined" type="submit">
                    Create Admin
                </Button>
            </form>
            <Alert severity="success">{message && <p>{message}</p>}.</Alert>
            <Alert severity="error">{error && <p>{error}</p>}</Alert>
        </div>
    );
};
