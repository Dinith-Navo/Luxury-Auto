import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicles/"; // Ensure correct API endpoint

function AddVehicle({ onBack }) {
  const [vehicle, setVehicle] = useState({
    image: '',
    name: '',
    type: '',
    fuel: '',
    seats: '',
    transmission: '',
    price: '',
    status: 'available',
  });

  useEffect(() => {
    if (vehicle.name && vehicle.type && vehicle.fuel && vehicle.seats && vehicle.transmission && vehicle.price) {
      alert('Vehicle added successfully');
    }
  }, [vehicle]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (  !vehicle.name || !vehicle.type || !vehicle.fuel || !vehicle.seats || !vehicle.transmission || !vehicle.price ) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(vehicle.seats) || isNaN(vehicle.price)) {
      setError('Seats and Price must be numeric values.');
      return;
    }

    const payload = {
      ...vehicle,
      seats: Number(vehicle.seats), // Ensure seats is a number
      price: Number(vehicle.price), // Ensure price is a number
    };

    console.log('Payload:', payload); // Debugging payload

    try {
      const response = await axios.post(URL, payload);
      if (response.status === 201) {
        alert('Vehicle added successfully');
        navigate('/admindashboard/vehicle-management');
      }
    } catch (error) {
      console.error('Error:', error.response || error.message); // Debugging error
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Vehicle
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Image URL"
          name="image"
          value={vehicle.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          name="name"
          value={vehicle.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select name="type" value={vehicle.type} onChange={handleChange}>
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="Van">Van</MenuItem>
            <MenuItem value="Bus">Bus</MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Heavy Duty">Heavy Duty</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Fuel</InputLabel>
          <Select name="fuel" value={vehicle.fuel} onChange={handleChange}>
            <MenuItem value="Petrol">Petrol</MenuItem>
            <MenuItem value="Diesel">Diesel</MenuItem>
            <MenuItem value="Electric">Electric</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Seats"
          name="seats"
          type="number"
          value={vehicle.seats}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Transmission</InputLabel>
          <Select name="transmission" value={vehicle.transmission} onChange={handleChange}>
            <MenuItem value="Automatic">Automatic</MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
          </Select>
          
        </FormControl>
        <TextField
          label="Price"
          name="price"
          type="number"
          value={vehicle.price}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value) && Number(value) >= 0) {
              handleChange(e);
            }
          }}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select name="status" value={vehicle.status} onChange={handleChange}>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Add Vehicle
        </Button>
        <Button variant="outlined" color="secondary" sx={{ marginTop: 2, marginLeft: 2 }} onClick={onBack}>
          Back
        </Button>
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default AddVehicle;