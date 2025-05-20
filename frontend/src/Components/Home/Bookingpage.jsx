/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import carImage from '../Images/book.png'; // Corrected the import path for the image

function BookingPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [pricePerDay, setPricePerDay] = useState(0);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropOffLocation, setDropOffLocation] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Vehicle types and their prices
  const vehicleOptions = [
    { type: 'Car', price: 50 },
    { type: 'Van', price: 80 },
    { type: 'Bus', price: 120 },
    { type: 'Bike', price: 30 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle vehicle type change
  const handleVehicleTypeChange = (event) => {
    const selectedType = event.target.value;
    setVehicleType(selectedType);

    // Find the price for the selected vehicle type
    const selectedVehicle = vehicleOptions.find((vehicle) => vehicle.type === selectedType);
    setPricePerDay(selectedVehicle ? selectedVehicle.price : 0);
  };

  // Calculate total price based on renting days
  const calculateTotalPrice = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const rentingDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Include the start day
      if (rentingDays > 0) {
        setTotalPrice(rentingDays * pricePerDay);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [fromDate, toDate, pricePerDay]);

  // Handle booking receipt generation
  const handleBooking = () => {
    if (!pickupLocation || !dropOffLocation || !vehicleType || !fromDate || !toDate) {
      alert('Please fill in all fields before booking.');
      return;
    }

    const receiptContent = `
      Booking Receipt
      -----------------
      Pickup Location: ${pickupLocation}
      Drop off Location: ${dropOffLocation}
      Vehicle Type: ${vehicleType}
      Price Per Day: $${pricePerDay}
      Booking Dates: ${fromDate} to ${toDate}
      Total Price: $${totalPrice}
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'BookingReceipt.txt';
    link.click();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        margin: 0,
        overflow: 'hidden',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 1.5s ease-out',
        background: '#F5F5F5',
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: '20px', md: '60px 100px' },
          background: '#fff',
          minHeight: '80vh',
        }}
      >
        {/* Left Side: Booking Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#FFB400',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            color: '#fff',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Book Now
          </Typography>
          <TextField
            label="Pickup Location"
            fullWidth
            margin="normal"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          />
          <TextField
            label="Drop off Location"
            fullWidth
            margin="normal"
            value={dropOffLocation}
            onChange={(e) => setDropOffLocation(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          />
          <TextField
            label="Vehicle Type"
            select
            fullWidth
            value={vehicleType}
            onChange={handleVehicleTypeChange}
            margin="normal"
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          >
            {vehicleOptions.map((vehicle) => (
              <MenuItem key={vehicle.type} value={vehicle.type}>
                {vehicle.type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Price Per Day"
            value={`$${pricePerDay}`}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <TextField
              label="From"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              sx={{ backgroundColor: '#fff', borderRadius: '5px', marginRight: '10px' }}
            />
            <TextField
              label="To"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
            />
          </Box>
          <TextField
            label="Total Price"
            value={`$${totalPrice}`}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#28a745',
              color: '#fff',
              marginTop: '20px',
              padding: '10px',
              borderRadius: '5px',
              '&:hover': { backgroundColor: '#218838' },
            }}
            onClick={() => {
              handleBooking();
              alert('Your booking is successfully completed!');
            }}
          >
            Book Now
          </Button>
        </Box>

        {/* Right Side: Image */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img
            src={carImage}
            alt="Luxury Car"
            style={{
              width: '100%',
              maxWidth: '600px',
              objectFit: 'contain',
              borderRadius: '15px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BookingPage;