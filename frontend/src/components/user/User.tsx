// src/components/User.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProps {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
}

const User: React.FC<UserProps> = ({ userId, firstName, lastName, email }) => {
   const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/users/${userId}`); 
    };

    return (
        <div className="user-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <p>Name: {firstName} {lastName}</p>
            <p>Email: {email}</p>
        </div>
    );
};

export default User;
