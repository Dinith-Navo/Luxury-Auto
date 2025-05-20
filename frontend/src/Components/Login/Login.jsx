import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Box, Button, Container, Grid, TextField, Typography, Paper, Divider } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import log from "../Images/newCar.png"; // Updated the image path

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [user, setUser] = useState({
        name: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/auth/login", {
                name: user.name,
                password: user.password,
            });

            if (response.status === 200) {
                const { token, user: loggedInUser } = response.data;
                login(token, loggedInUser);

                if (loggedInUser.type === "admin") {
                    alert("Admin Login Successful");
                    navigate("/admindashboard/dashboard");
                } else {
                    alert("User Login Successful");
                    navigate("/userprofile");
                }
            } else {
                alert("Login Error: " + response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert("User not found");
            } else if (err.response && err.response.status === 400) {
                alert("Invalid credentials");
            } else {
                alert("Error: " + err.message);
            }
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden', maxWidth: 900 }}>
                    <Grid container>
                        {/* Left Side Image */}
                        <Grid item xs={12} sm={6} sx={{ background: 'linear-gradient(to bottom right, #FFA500, #FF4500)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', padding: 4 }}>
                            <img src={log} alt="Welcome Banner" style={{ maxWidth: '80%', marginBottom: '20px' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Welcome to Luxury Autos</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>Don't have an account?</Typography>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/signup')}
                                sx={{ borderColor: '#fff', color: '#fff', textTransform: 'none', borderRadius: 2 }}
                            >
                                Sign Up
                            </Button>
                        </Grid>

                        {/* Right Side Form */}
                        <Grid item xs={12} sm={6} sx={{ padding: 4 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                                Sign In
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Name"
                                    variant="outlined"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <PersonIcon sx={{ color: '#0072FF', mr: 1 }} />,
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Password"
                                    type="password"
                                    variant="outlined"
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <LockIcon sx={{ color: '#0072FF', mr: 1 }} />,
                                    }}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ background: 'linear-gradient(to right, #00C6FF, #0072FF)', color: '#fff', py: 1.5, borderRadius: 2, boxShadow: 'none', textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Sign In
                                </Button>
                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="body2" sx={{ color: '#888' }}>or</Typography>
                                </Divider>
                                <Button
                                    variant="text"
                                    fullWidth
                                    sx={{ color: '#0072FF', textTransform: 'none', fontWeight: 'bold' }}
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
}

export default Login;