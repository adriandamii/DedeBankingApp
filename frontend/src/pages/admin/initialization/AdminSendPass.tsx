import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const AdminSendPass: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/send-login-password'
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
            <h2>Send login password</h2>
            <span>
                Did you receive the login password? Check the email and go to{' '}
                <Link to={`/admin/login`}>Login admin page</Link>
                <br />
                Go back to create admin{' '}
                <Link to={`/admin/create`}>Create admin</Link>
            </span>
            <br /> <br />
            <form onSubmit={handleSubmit}>
                <Button variant="outlined" type="submit">
                    Send login password
                </Button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
