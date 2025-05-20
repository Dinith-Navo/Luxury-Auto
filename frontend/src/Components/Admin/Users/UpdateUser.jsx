import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/users";

function UpdateUser() {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState({
    userName: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    type: 'user' // Default to 'user'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(''); // Phone validation error state
  const [nameError, setNameError] = useState(''); // Name validation error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        console.log('Fetched User:', response.data); // Check the data
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate name (only letters and spaces allowed)
    if (name === 'name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setNameError('Name must contain only letters and spaces.');
      } else {
        setNameError(''); // Clear error if valid
      }
    }

    // Validate phone number (only digits allowed, and exactly 10 digits)
    if (name === 'phone') {
      if (!/^\d{0,10}$/.test(value)) {
        setPhoneError('Phone number must contain only digits and be up to 10 digits long.');
      } else if (value.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits long.');
      } else {
        setPhoneError(''); // Clear error if valid
      }
    }

    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async () => {
    if (phoneError || nameError) {
      alert('Please correct the errors before submitting.');
      return;
    }
    try {
      console.log('Update Payload:', user); // Check the payload
      await axios.put(`${URL}/${id}`, user);
      alert('User updated successfully');
      navigate('/user-list/user-management'); // Redirect to the user management page
    } catch (error) {
      console.error("Error updating user:", error);
      alert('Error updating user');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update User</Typography>
      <TextField
        label="Username"
        name="userName"
        value={user.userName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        name="name"
        value={user.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!nameError} // Display error state if there's a name validation error
        helperText={nameError} // Show error message below the input
      />
      <TextField
        label="Email"
        name="email"
        value={user.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={user.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={user.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!phoneError} // Display error state if there's a phone validation error
        helperText={phoneError} // Show error message below the input
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>User Type</InputLabel>
        <Select
          name="type"
          value={user.type}
          onChange={handleChange}
          label="User Type"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="Owner">Owner</MenuItem>
          <MenuItem value="Customer">Customer</MenuItem>

        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
        disabled={!!phoneError || !!nameError} // Disable button if there's a validation error
      >
        Update
      </Button>
    </Box>
  );
}

export default UpdateUser;
