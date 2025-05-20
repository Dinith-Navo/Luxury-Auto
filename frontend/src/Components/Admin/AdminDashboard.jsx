import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { AuthContext } from '../Auth/AuthContext'; // Import your AuthContext
import EFpage from '../ExtraFeature/EFpage';

const drawerWidth = 210;
const sidebarBackground = 'path_to_image'; // Replace with actual image URL or import statement

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext); // Access logout function from AuthContext
  const [fadeIn, setFadeIn] = useState(false);
  const [showEFPage, setShowEFPage] = useState(false);
  const [currentTab, setCurrentTab] = useState('');
  const [showSupplierListButton, setShowSupplierListButton] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admindashboard/dashboard' },
    { text: 'Users Management', icon: <PeopleIcon />, path: '/user-list/user-management' },
    { text: 'Vehicle Management', icon: <DashboardIcon />, path: '/admindashboard/Vehicle-management' },
    { text: 'Booking Management', icon: <ConfirmationNumberIcon />, path: '/admindashboard/booking-management' },
    { text: 'Approve Rental', icon: <ConfirmationNumberIcon />, path: '/admindashboard/rental' },
    { text: 'Rental Management', icon: <ConfirmationNumberIcon />, path: '/admindashboard/rental-list' },

  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100); // Delay for initial fade-in effect
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setCurrentTab(currentItem.text);
      setShowSupplierListButton(currentItem.text === 'Supplier Management');
    }
  }, [location.pathname]);

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleView = () => {
    setShowEFPage((prev) => !prev);
  };

  const handleSupplierListButtonClick = () => {
    navigate('/admindashboard/supplier-list-details'); // Navigate to the Supplier List page
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${sidebarBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ marginBottom: 2 }} />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                padding: '12px 20px',
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" sx={{ m: 2, bgcolor:" #0062ff", color:" #000000" }} onClick={toggleView}>
          {showEFPage ? 'Show Dashboard' : 'Luxy Support'}
        </Button>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0, // No padding
          backgroundColor: '#f4f6f8',
          minHeight: '100vh',
          overflow: 'hidden', // Prevent scrolling
        }}
      >

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1976d2', padding: '10px 20px', color: 'white', height: '60px' }}>
          <Typography variant="h5">{currentTab}</Typography>
          <div>
            {showSupplierListButton && (
              <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }} onClick={handleSupplierListButtonClick}>
                View Supplier List
              </Button>
            )}
            <Button variant="outlined" onClick={handleLogout} sx={{ marginLeft: 2, color: 'white', borderColor: 'white' }}>
              Logout
            </Button>

          </div>
        </Box>

        {showEFPage ? <EFpage /> : <Outlet />}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
