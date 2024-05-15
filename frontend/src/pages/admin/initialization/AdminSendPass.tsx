import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';

export const AdminSendPass: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const Toast = () => toast.success('Email sent!');

    const navigate = useNavigate();
    const {user} = useAuth();
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
                'http://localhost:5000/admin/send-login-password'
            );
            setMessage(response.data.message);
            if (response.data.message) {
                Toast();
                navigate('/admin/login');
            }
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
        <div className='login-container'>
            <form onSubmit={handleSubmit} className='login-form'>
            <h2>Send login password</h2>
            <span>
                <Link to={`/admin/login`}>Login admin page</Link> {" "}
                <Link to={`/admin/create`}>Create admin</Link>
            </span>
                <Button variant="outlined" type="submit">
                    Send login password
                </Button>
            </form>
            {message && <Alert severity="success"> <p>{message}</p></Alert>}
            {error && <Alert severity="error"> <p>{error}</p></Alert>}
        </div>
    );
};
