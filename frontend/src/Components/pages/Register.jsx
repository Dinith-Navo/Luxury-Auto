/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'; // Import Footer component
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
    Divider,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Logo from '../Images/3.png';
import BackgroundImage from '../Images/l1.png'; // Import your background image

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthday: '',
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Clear error for the changed field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
    
        if (!user.userName) {
            isValid = false;
            formErrors.userName = 'Username is required.';
        }
    
        if (!user.name) {
            isValid = false;
            formErrors.name = 'Name is required.';
        }
    
        if (!user.email) {
            isValid = false;
            formErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            isValid = false;
            formErrors.email = 'Email is invalid.';
        }
    
        if (!user.phone) {
            isValid = false;
            formErrors.phone = 'Phone number is required.';
        } else if (!/^\d+$/.test(user.phone)) {
            isValid = false;
            formErrors.phone = 'Phone number is invalid.';
        }
    
        if (!user.password) {
            isValid = false;
            formErrors.password = 'Password is required.';
        } else if (user.password.length < 6) {
            isValid = false;
            formErrors.password = 'Password must be at least 6 characters.';
        }
    
        if (!user.confirmPassword) {
            isValid = false;
            formErrors.confirmPassword = 'Please confirm your password.';
        } else if (user.password !== user.confirmPassword) {
            isValid = false;
            formErrors.confirmPassword = 'Passwords do not match.';
        }
    
        if (!user.gender) {
            isValid = false;
            formErrors.gender = 'Please select your gender.';
        }
    
        if (!user.birthday) {
            isValid = false;
            formErrors.birthday = 'Birthday is required.';
        } else {
            const selectedDate = new Date(user.birthday);
            const today = new Date();
            // Reset the time part to compare only dates
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate > today) {
                isValid = false;
                formErrors.birthday = 'Birthday cannot be in the future.';
            }
        }
    
        if (!termsAccepted) {
            isValid = false;
            alert('Please accept the terms and conditions.');
        }
    
        setErrors(formErrors);
        return isValid;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        const userData = {
            userName: user.userName,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            gender: user.gender,
            birthday: user.birthday,
        };

        try {
            const response = await axios.post('http://localhost:4000/users/register', userData);
            if (response.data.message === 'User created successfully') {
                alert('Registration successful');
                navigate('/login');
            } else {
                alert('Registration failed');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar />
            <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 5 }}>
                <Paper elevation={6} sx={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, borderRadius: 2, maxWidth: 900 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8D9D9', borderRadius: 2 }}>
                            <img src={Logo} alt="Crystal Elegance" style={{ maxWidth: '100%', paddingRight: 30, height: '50vh', paddingBottom: 30 }} />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                REGISTER
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Username"
                                    variant="outlined"
                                    name="userName"
                                    value={user.userName}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <PersonIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.userName}
                                    helperText={errors.userName}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Name"
                                    variant="outlined"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <PersonIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Email"
                                    variant="outlined"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <EmailIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Phone"
                                    variant="outlined"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <PhoneIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
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
                                        startAdornment: <LockIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <LockIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 },
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                />
                                <FormControl fullWidth sx={{ marginBottom: 2 }} error={!!errors.gender}>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        name="gender"
                                        value={user.gender}
                                        onChange={handleInputChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.gender}</FormHelperText>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    placeholder="Birthday"
                                    type="date"
                                    variant="outlined"
                                    name="birthday"
                                    value={user.birthday}
                                    onChange={handleInputChange}
                                    sx={{ marginBottom: 2 }}
                                    error={!!errors.birthday}
                                    helperText={errors.birthday}
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />}
                                    label="Accept Terms and Conditions"
                                    sx={{ marginBottom: 2 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#F8B9B7',
                                        color: '#fff',
                                        paddingY: 1.5,
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Create Account
                                </Button>
                                <Divider sx={{ marginY: 2 }}>
                                    <Typography variant="body2">Or sign up with</Typography>
                                </Divider>
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
