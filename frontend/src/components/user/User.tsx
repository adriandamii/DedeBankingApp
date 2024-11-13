// src/components/User.tsx
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded';
interface UserProps {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    isActive: number;
}

const User: React.FC<UserProps> = ({ userId, firstName, lastName, email, isActive }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/users/${userId}`);
    };
    const fullName = firstName + " " + lastName;
    console.log(isActive);
    return (
        <ListItem onClick={handleClick} style={{ cursor: 'pointer' }}>
            <ListItemAvatar>
                {isActive === 1 ?
                <PersonRoundedIcon style={{fontSize: "40px"}}/> :
                <PersonOffRoundedIcon style={{fontSize: "40px"}}/>
                }
            </ListItemAvatar>
            <ListItemText primary={fullName} secondary={email} />
        </ListItem>
    );
};

export default User;
