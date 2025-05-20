/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function AboutUs() {
  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {/* Main Header */}
        <Typography variant="h3" align="center" gutterBottom>
          About Luxury Autos
        </Typography>

        {/* Introduction Section */}
        <Typography variant="body1" paragraph align="center" sx={{ marginBottom: 4 }}>
          Welcome to Luxury Autos, your premier destination for high-end vehicle rentals. 
          Whether you're looking for a stylish ride for a special occasion or a luxury experience for your travels, 
          we offer a top-tier selection of premium vehicles designed to meet your needs.
        </Typography>

        {/* Our Mission Section */}
        <Typography variant="h4" gutterBottom align="center">
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph align="center">
          At Luxury Autos, our mission is to provide unparalleled vehicle rental services with a focus on excellence, 
          comfort, and sophistication. We are dedicated to offering our clients a seamless and luxurious driving experience.
        </Typography>

        {/* Core Values Section */}
        <Box sx={{ marginTop: 6, marginBottom: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Our Core Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Value 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Quality & Performance
                </Typography>
                <Typography variant="body2">
                  We offer only the finest luxury vehicles, ensuring our clients experience the perfect blend of performance, style, and comfort.
                </Typography>
              </Paper>
            </Grid>

            {/* Value 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Customer Satisfaction
                </Typography>
                <Typography variant="body2">
                  Our clients are our top priority. We strive to provide exceptional service, seamless booking experiences, and personalized support.
                </Typography>
              </Paper>
            </Grid>

            {/* Value 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Innovation & Excellence
                </Typography>
                <Typography variant="body2">
                  We stay ahead of the curve by integrating the latest technology and luxury features into our vehicle selection and services.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Why Choose Us Section */}
        <Box sx={{ marginTop: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Why Choose Luxury Autos?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Exclusive Fleet
              </Typography>
              <Typography variant="body1">
                From sports cars to executive sedans, our curated fleet features the latest and most prestigious vehicles from world-renowned brands.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Hassle-Free Experience
              </Typography>
              <Typography variant="body1">
                Our streamlined rental process ensures that you can get behind the wheel of your dream car with ease, convenience, and confidence.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}

export default AboutUs;