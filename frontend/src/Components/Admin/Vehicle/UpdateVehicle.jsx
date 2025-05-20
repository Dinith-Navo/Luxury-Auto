import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicles";

function UpdateVehicle() {
  const { VID } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${URL}/${VID}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [VID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${VID}`, vehicle);
      alert('Vehicle updated successfully');
      navigate('/admindashboard/vehicle-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Vehicle</Typography>
      <TextField label="Image URL" name="image" value={vehicle.image} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Name" name="name" value={vehicle.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Type" name="type" value={vehicle.type} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Fuel" name="fuel" value={vehicle.fuel} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Seats" name="seats" type="number" value={vehicle.seats} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Transmission" name="transmission" value={vehicle.transmission} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Price" name="price" type="number" value={vehicle.price} onChange={handleChange} fullWidth margin="normal" />
      
      <TextField label="Status" name="status" select value={vehicle.status} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="available">Available</MenuItem>
        <MenuItem value="unavailable">Unavailable</MenuItem>
      </TextField>
      
      <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ marginTop: 2 }}>Update Vehicle</Button>
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
    </Box>
  );
}

export default UpdateVehicle;
