import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
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
            navigate('/admin/dashboard')
         } catch (err) {
            console.log(err);
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
        <div>
            <h2>Admin Login</h2>
            <span>
                Forgot password?<br/> Request for one{' '}
                <Link to={`/admin/send-login-password`}>here</Link>
            </span>
            <br /> <br />
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Login Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                />
                <br /> <br />
                <Button variant="outlined" type="submit">
                    Login
                </Button>
            </form>
            <Alert severity="success">{message && <p>{message}</p>}.</Alert>
            <Alert severity="error">{error && <p>{error}</p>}</Alert>
        </div>
    );
};
