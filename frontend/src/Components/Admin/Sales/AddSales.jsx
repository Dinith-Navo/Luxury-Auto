/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddSales from "../path/to/AddSales";

const URL = "http://localhost:4000/sales"; // Ensure this matches your API endpoint

function AddSales({ onBack }) {
  const [vehicleId, setVehicleId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // Default to 'Pending'
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!vehicleId || !customerId || !rentalPeriod || !totalAmount) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(URL, { vehicleId, customerId, rentalPeriod, totalAmount, paymentStatus });
      if (response.status === 201) {
        // Notify user of successful addition
        alert('Sale added successfully');
        // Redirect to the Sales List page
        navigate('/sales-list');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Sale
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Vehicle ID"
          variant="outlined"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Customer ID"
          variant="outlined"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rental Period"
          variant="outlined"
          type="number"
          value={rentalPeriod}
          onChange={(e) => setRentalPeriod(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Amount"
          variant="outlined"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            label="Payment Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Sale
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2, marginLeft: 2 }}
          onClick={onBack}
        >
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

export default AddSales;