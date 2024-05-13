// src/components/User.tsx
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
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
    const fullName = firstName + lastName;
    return (
        <ListItem onClick={handleClick} style={{ cursor: 'pointer' }}>
            <ListItemAvatar>
                <AccountCircleRoundedIcon />
            </ListItemAvatar>
            <ListItemText primary={fullName} secondary={email} />
        </ListItem>
    );
};

export default User;
