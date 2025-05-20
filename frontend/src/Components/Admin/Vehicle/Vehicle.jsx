import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicles";

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!vehicle) return <Typography>No vehicle found.</Typography>;

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h4" gutterBottom>Vehicle Details</Typography>
      <TextField label="Image URL" value={vehicle.image} fullWidth margin="normal" disabled />
      <TextField label="Name" value={vehicle.name} fullWidth margin="normal" disabled />
      <TextField label="Type" value={vehicle.type} fullWidth margin="normal" disabled />
      <TextField label="Fuel" value={vehicle.fuel} fullWidth margin="normal" disabled />
      <TextField label="Seats" value={vehicle.seats} fullWidth margin="normal" disabled />
      <TextField label="Transmission" value={vehicle.transmission} fullWidth margin="normal" disabled />
      <TextField label="Price" value={vehicle.price} fullWidth margin="normal" disabled />
      <TextField label="Status" value={vehicle.status} fullWidth margin="normal" disabled />
    </Box>
  );
}

export default VehicleDetails;
