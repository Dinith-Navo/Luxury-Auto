import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingDetails } = location.state || {}; 

  if (!bookingDetails) {
    return <Typography variant="h6">No booking details available.</Typography>;
  }

  const { bookingId, customerId, vehicleId, pickUpLocation, status, dateFrom, dateTo } = bookingDetails;

  return (
    <div>
      <Header />

      <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
        <Grid container spacing={3}>
          {/* Booking Information Section */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Booking Confirmation
            </Typography>

            <Card>
              <CardContent>
                <Typography variant="h6">
                  Booking ID: <strong>{bookingId}</strong>
                </Typography>
                <Typography variant="h6">
                  Customer ID: <strong>{customerId}</strong>
                </Typography>
                <Typography variant="h6">
                  Vehicle ID: <strong>{vehicleId}</strong>
                </Typography>
                <Typography variant="h6">
                  Pick-up Location: <strong>{pickUpLocation}</strong>
                </Typography>
                <Typography variant="h6">
                  Status: <strong>{status}</strong>
                </Typography>
                <Typography variant="h6">
                  Date From: <strong>{dateFrom}</strong>
                </Typography>
                <Typography variant="h6">
                  Date To: <strong>{dateTo}</strong>
                </Typography>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
