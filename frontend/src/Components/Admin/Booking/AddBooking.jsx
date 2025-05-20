/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehiclebookings";

function AddBooking({ onBack }) {
  const [bookingId, setBookingId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [status, setStatus] = useState('Pending'); // Default to 'Pending'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(URL, { 
        bookingId,
        customerId,
        vehicleId,
        pickUpLocation,
        status,
        dateFrom,
        dateTo 
      });
      if (response.status === 201) {
        alert('Booking added successfully');
        navigate('/admindashboard/booking-management');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Booking
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Booking ID"
          variant="outlined"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Customer ID"
          variant="outlined"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Vehicle ID"
          variant="outlined"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Pick-up Location"
          variant="outlined"
          value={pickUpLocation}
          onChange={(e) => setPickUpLocation(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Status"
          variant="outlined"
          select
          SelectProps={{ native: true }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </TextField>
        <TextField
          label="Date From"
          variant="outlined"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Date To"
          variant="outlined"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Add Booking
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

export default AddBooking;
