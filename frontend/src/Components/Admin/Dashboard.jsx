import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUsers, faCalendarCheck, faDollarSign } from '@fortawesome/free-solid-svg-icons';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleCount: 0,
      userCount: 0,
      bookingCount: 0,
      salesCount: 0,
    };
  }

  componentDidMount() {
    this.fetchVehicleCount();
    this.fetchUserCount();
    this.fetchBookingCount();
    this.fetchSalesCount();

    // Simulate real-time updates (example, every 10 seconds)
    this.interval = setInterval(() => {
      this.fetchVehicleCount();
      this.fetchUserCount();
      this.fetchBookingCount();
      this.fetchSalesCount();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clear interval on component unmount
  }

  // Fetch the vehicle count from the server
  fetchVehicleCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/vehicles'); // Ensure this points to your vehicles endpoint
      this.setState({ vehicleCount: response.data.length });
    } catch (error) {
      console.error("Error fetching vehicle count:", error);
    }
  };

  // Fetch the user count from the server
  fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users'); // Ensure this points to your users endpoint
      this.setState({ userCount: response.data.length });
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  // Fetch the booking count from the server
  fetchBookingCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/vehiclebookings'); // Ensure this points to your bookings endpoint
      this.setState({ bookingCount: response.data.length });
    } catch (error) {
      console.error("Error fetching booking count:", error);
    }
  };

  // Fetch the sales count from the server
  fetchSalesCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/sales'); // Ensure this points to your sales endpoint
      this.setState({ salesCount: response.data.length });
    } catch (error) {
      console.error("Error fetching sales count:", error);
    }
  };

  render() {
    const { vehicleCount, userCount, bookingCount, salesCount } = this.state;

    return (
      <Box
        sx={{
          padding: 4,
          minHeight: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#333', textShadow: '1px 1px 3px rgba(255, 255, 255, 0.7)' }}>Admin Dashboard</Typography>
        <Grid container spacing={3}>

          {/* Vehicles */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'rgba(187, 222, 251, 0.55)', // Transparent gradient-like background
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)', // Softer shadow
                borderRadius: 3,
                transition: 'transform 0.3s ease-in-out', // Hover effect
                backdropFilter: 'blur(10px)', // Blur effect for transparency
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faCar} size="3x" color="#1976d2" />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: '#0d47a1', // Slightly darker blue for contrast
                    letterSpacing: '0.05em',
                  }}
                >
                  Vehicles
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    fontSize: '3rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {vehicleCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0d47a1',
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                  }}
                >
                  Total number of vehicles
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Users */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'rgba(187, 222, 251, 0.5)', // Transparent blue background
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)', // Softer blue shadow
                borderRadius: 3,
                transition: 'transform 0.3s ease-in-out', // Hover effect
                backdropFilter: 'blur(10px)', // Blur effect for the background
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faUsers} size="3x" color="#1976d2" />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: '#0d47a1', // Darker blue for contrast
                    letterSpacing: '0.05em',
                  }}
                >
                  Users
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    fontSize: '3rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {userCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0d47a1',
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                  }}
                >
                  Total number of users
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Bookings */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'rgba(255, 224, 178, 0.5)', // Transparent gradient-like background
                boxShadow: '0 8px 20px rgba(230, 74, 25, 0.5)', // Softer orange shadow
                borderRadius: 3,
                transition: 'transform 0.3s ease-in-out', // Hover effect
                backdropFilter: 'blur(10px)', // Blur effect for transparency
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} size="3x" color="#e64a19" />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: '#bf360c', // Darker orange for contrast
                    letterSpacing: '0.05em',
                  }}
                >
                  Bookings
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#e64a19',
                    fontSize: '3rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {bookingCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#bf360c',
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                  }}
                >
                  Total number of bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'rgba(237, 231, 246, 0.5)', // Transparent gradient-like background
                boxShadow: '0 8px 20px rgba(106, 27, 154, 0.5)', // Softer purple shadow
                borderRadius: 3,
                transition: 'transform 0.3s ease-in-out', // Hover effect
                backdropFilter: 'blur(10px)', // Blur effect for transparency
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faDollarSign} size="3x" color="#6a1b9a" />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: '#6a1b9a', // Dark purple for title
                    letterSpacing: '0.05em',
                  }}
                >
                  Sales
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#4a148c', // Darker purple for number
                    fontSize: '3rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {salesCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6a1b9a',
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                  }}
                >
                  Total sales received
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    );
  }
}