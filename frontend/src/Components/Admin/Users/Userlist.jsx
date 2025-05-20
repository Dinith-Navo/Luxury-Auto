import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { AuthContext } from '../../Auth/AuthContext'; // Import your AuthContext

const drawerWidth = 210;
const sidebarBackground = 'path_to_image'; // Replace with actual image URL or import statement

function Userlist() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext); // Access logout function from AuthContext
    const [fadeIn, setFadeIn] = useState(false);

    const [currentTab, setCurrentTab] = useState('');
    const [showSupplierListButton, setShowSupplierListButton] = useState(false);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admindashboard' },
        { text: 'Admin Management', icon: <PeopleIcon />, path: '/user-list/user-management' },
        { text: 'Owners Management', icon: <DashboardIcon />, path: '/user-list/owner-management' },
        { text: 'Customers Management', icon: <EngineeringIcon />, path: '/user-list/customer-management' },
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

    const handleSupplierListButtonClick = () => {
        navigate('/admindashboard/supplier-list-details'); // Navigate to the Supplier List page
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            {/* Sidebar */}
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
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1976d2',
                    padding: '10px 20px',
                    color: 'white',
                    height: '70px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{currentTab}</Typography>
                    <div>
                        {showSupplierListButton && (
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                sx={{
                                    marginLeft: 2, 
                                    backgroundColor: '#ff9800',
                                    '&:hover': { backgroundColor: '#e68900' },
                                }}
                                onClick={handleSupplierListButtonClick}
                            >
                                View Supplier List
                            </Button>
                        )}
                        <Button 
                            variant="outlined" 
                            onClick={handleLogout} 
                            sx={{
                                marginLeft: 2, 
                                color: 'white', 
                                borderColor: 'white',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </Box>

                {/* Page Content */}
                <Box sx={{
                    flexGrow: 1,
                    padding: '20px',
                    backgroundColor: '#f4f6f8',
                    borderRadius: '10px',
                    margin: '10px',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                }}>
                    <Outlet /> {/* Render nested routes */}
                </Box>
            </Box>
        </Box>
    );
}

export default Userlist;
