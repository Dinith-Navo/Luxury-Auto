/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Typography, Box, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn } from '@mui/icons-material';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function ContactUs() {
  return (
    <div>
      <Header />
      
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>

        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {/* Contact Information Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Typography variant="body1" paragraph>
                Have questions about our luxury vehicles or services? Get in touch with us using the details below.
              </Typography>

              {/* Address Section */}
              <Typography variant="h6" gutterBottom>
                Our Address:
              </Typography>
              <Typography variant="body1" gutterBottom>
                Luxury Autos, 15 Marine Drive, Kollupitiya
              </Typography>

              {/* Phone Section */}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                Phone:
              </Typography>
              <Typography variant="body1" gutterBottom>
                (011) 789-4561
              </Typography>

              {/* Email Section */}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                Email:
              </Typography>
              <Typography variant="body1" gutterBottom>
                <a href="mailto:LuxuryAutos.lk@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  LuxuryAutos.lk@gmail.com
                </a>
              </Typography>

              {/* Business Hours Section */}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                Business Hours:
              </Typography>
              <Typography variant="body1">
                Monday - Friday: 9:00 AM - 8:00 PM
              </Typography>
              <Typography variant="body1">
                Saturday - Sunday: 10:00 AM - 6:00 PM
              </Typography>

              {/* Social Media Links Section */}
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Follow Us:
                </Typography>
                <Box>
                  <IconButton href="https://facebook.com" target="_blank" aria-label="Facebook">
                    <Facebook sx={{ fontSize: 40, color: '#3b5998' }} />
                  </IconButton>
                  <IconButton href="https://instagram.com" target="_blank" aria-label="Instagram">
                    <Instagram sx={{ fontSize: 40, color: '#E4405F' }} />
                  </IconButton>
                  <IconButton href="https://twitter.com" target="_blank" aria-label="Twitter">
                    <Twitter sx={{ fontSize: 40, color: '#00acee' }} />
                  </IconButton>
                  <IconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                    <LinkedIn sx={{ fontSize: 40, color: '#0072b1' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Google Maps Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
              <iframe
                title="Luxury Autos Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509497!2d144.95373531550425!3d-37.81627977975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5779c8e6dfc58b1!2sLuxury%20Autos!5e0!3m2!1sen!2sus!4v1638325441267!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
}

export default ContactUs;