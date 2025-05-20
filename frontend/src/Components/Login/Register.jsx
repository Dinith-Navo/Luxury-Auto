import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Box, Button, Container, Grid, TextField, Typography, Paper, Checkbox, FormControlLabel } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};

        if (!user.userName.trim()) tempErrors.userName = "Username is required.";
        if (!user.name.trim()) {
            tempErrors.name = "Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(user.name)) {
            tempErrors.name = "Name can only contain letters and spaces.";
        }
        if (!user.email.trim()) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            tempErrors.email = "Email is not valid.";
        }
        if (!user.phone.trim()) {
            tempErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(user.phone)) {
            tempErrors.phone = "Phone number must be 10 digits.";
        }
        if (!user.password.trim()) {
            tempErrors.password = "Password is required.";
        } else if (user.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters.";
        }
        if (!user.confirmPassword.trim()) {
            tempErrors.confirmPassword = "Please confirm your password.";
        } else if (user.password !== user.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match.";
        }
        if (!termsAccepted) {
            tempErrors.termsAccepted = "You must accept the terms and conditions.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const userData = { ...user };
        delete userData.confirmPassword;

        try {
            const response = await axios.post("http://localhost:4000/users/register", userData);
            if (response.data.message === "User created successfully") {
                alert("Registration successful");
                navigate('/login');
            } else {
                alert("Registration failed");
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'rgb(246, 229, 229)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <Paper elevation={6} sx={{ width: '100%', maxWidth: '1200px', borderRadius: 2, overflow: 'hidden' }}>
                    <Grid container sx={{ height: '100%' }}>
                        {/* Left Section */}
                        <Grid item xs={12} sm={6} sx={{
                            background: 'linear-gradient(to bottom right, #FFA500, #FF4500)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            color: '#fff',
                            p: 4,
                            minHeight: { xs: 'auto', sm: '600px' }
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Welcome to Luxury Autos</Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>Already a user?</Typography>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#fff',
                                    borderColor: '#fff',
                                    textTransform: 'none',
                                    borderRadius: 10,
                                    px: 4
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Log In
                            </Button>
                        </Grid>

                        {/* Right Section */}
                        <Grid item xs={12} sm={6} sx={{ background: '#1f1f1f', p: 4 }}>
                            <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                Create an Account
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                {[ 
                                    { name: "userName", label: "Username", icon: <PersonIcon /> },
                                    { name: "name", label: "Name", icon: <PersonIcon /> },
                                    { name: "email", label: "Email", icon: <EmailIcon /> },
                                    { name: "phone", label: "Phone", icon: <PhoneIcon /> },
                                    { name: "password", label: "Password", type: "password", icon: <LockIcon /> },
                                    { name: "confirmPassword", label: "Confirm Password", type: "password", icon: <LockIcon /> }
                                ].map((field) => (
                                    <TextField
                                        key={field.name}
                                        fullWidth
                                        placeholder={field.label}
                                        variant="outlined"
                                        name={field.name}
                                        type={field.type || "text"}
                                        value={user[field.name]}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            startAdornment: <Box sx={{ color: 'rgb(231, 220, 216)', mr: 1 }}>{field.icon}</Box>,
                                            sx: { backgroundColor: ' #2c2c2c', borderRadius: 2, color: '#fff' }
                                        }}
                                        sx={{ mb: 2 }}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                    />
                                ))}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            sx={{
                                                color: 'white',
                                                '&.Mui-checked': { color: '#FF4500' },
                                                '& .MuiSvgIcon-root': { color: 'white' }
                                            }}
                                        />
                                    }
                                    label={<Typography variant="body2" color="white">Accept Terms and Conditions</Typography>}
                                    sx={{ mb: 1 }}
                                />
                                {errors.termsAccepted && (
                                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                        {errors.termsAccepted}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(to right, #FFA500, #FF4500)',
                                        color: '#fff',
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Create Account
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

export default Register;
