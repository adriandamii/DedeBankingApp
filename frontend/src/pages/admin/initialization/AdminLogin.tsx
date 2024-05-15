import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';

export const AdminLogin: React.FC = () => {
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const Toast = () => toast.success('Login successfull!');

    const navigate = useNavigate();
    const {user} = useAuth();
    useEffect(() => {
        if (user?.userRole === 'customer' && location.pathname === '/admin/login') {
            navigate(`/users/${user?.userId}`);
        }
    }, [navigate, user]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/verify-login-password',
                {
                    loginPassword,
                },
                {
                    withCredentials: true,
                }
            );
            setMessage(response.data.message);
            Toast();
            navigate('/users')
         } catch (err) {
            if (axios.isAxiosError(err)) {
               if (err.response) {
                 console.error("Error data:", err.response.data);
                 setError(err.response.data.message || 'A server-side error occurred.');
               } else {
                 console.error("No response in error:", err);
                 setError('Network error or server is not responding.');
               }
             } else {
               console.error("Unexpected error:", err);
               setError('An unexpected error occurred.');
             }
             
          }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit} className='login-form'>
            <h2>Admin Login</h2>
            <span>
                Request for one{' '}
                <Link to={`/admin/send-login-password`}>here</Link>
            </span>
                <TextField
                    label="Login Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                />
                <Button variant="outlined" type="submit">
                    Login
                </Button>
            {message && <Alert severity="success"> <p>{message}</p></Alert>}
            {error && <Alert severity="error"> <p>{error}</p></Alert>}
            </form>
        </div>
    );
};
