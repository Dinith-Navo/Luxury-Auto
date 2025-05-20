/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const showtimes = [
  {
    movieTitle: 'Planet of Apes',
    times: ['12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM']
  },
  {
    movieTitle: 'The Garfield Movie',
    times: ['01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM']
  },
  {
    movieTitle: 'Deadpool x Wolverine',
    times: ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM']
  },
  {
    movieTitle: 'The Garfield Movie',
    times: ['12:30 PM', '03:30 PM', '06:30 PM', '09:30 PM']
  },
];

function Show() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      <Header />
      <Box sx={{ padding: 4, backgroundColor: '#000000' }}>
        <Typography variant="h3" align="center" color="red" gutterBottom>
          Select Show Time
        </Typography>
        <Grid container spacing={4}>
          {showtimes.map((show, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, backgroundColor: '#222' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="white">
                    {show.movieTitle}
                  </Typography>
                  <Grid container spacing={1}>
                    {show.times.map((time, timeIndex) => (
                      <Grid item xs={12} key={timeIndex}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: '#F8B9B7',
                            color: "red",
                            paddingY: 1.5,
                            borderRadius: 2,
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s, color 0.3s',
                            '&:hover': {
                              backgroundColor: '#8B0000', // Dark red
                              color: 'black', // Black font
                            },
                          }}
                          onClick={() => navigate('/Buy')}
                        >
                          {time}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </div>
  );
}

export default Show;
