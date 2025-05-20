import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext'; // Adjust the path as needed
import Footer from '../Footer/Footer';


function Navbar() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = authState;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', padding: '0 40px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left Section - Brand Logo */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFB400' }}>
            Luxury Autos
          </Typography>

          {/* Middle Section - Nav Links */}
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button component={Link} to="/" sx={{ color: '#161516', fontWeight: '500' }}>Home</Button>
            <Button component={Link} to="/Vehicles" sx={{ color: '#161516', fontWeight: '500' }}>Vehicle</Button>
            <Button component={Link} to="/About" sx={{ color: '#161516', fontWeight: '500' }}>About Us</Button>
            <Button component={Link} to="/Contact" sx={{ color: '#161516', fontWeight: '500' }}>Contact</Button>
          </Box>

          {/* Right Section - Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <>
                <Typography variant="body1" sx={{ color: '#161516', fontWeight: 500 }}>
                  Hello, {user.name}
                </Typography>
                <Button
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: '#FFB400',
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    padding: '6px 20px',
                    '&:hover': { backgroundColor: '#e5a200' }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: '#161516',
                    fontWeight: '500',
                    textTransform: 'none',
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  sx={{
                    backgroundColor: '#FFB400',
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    padding: '6px 20px',
                    '&:hover': { backgroundColor: '#e5a200' }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
