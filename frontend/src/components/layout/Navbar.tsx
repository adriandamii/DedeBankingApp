import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { AppDispatch } from '../../app/store';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user } = useAuth();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={"/users"}
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Dede Banking App
        </Typography>
        <Box display="flex" alignItems="center">
          {isLoggedIn ? (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                {`You are logged in as ${user?.userRole}`}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
