/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// Add banner and stat images
import banner1 from '../Images/banner1.png';
import banner2 from '../Images/banner2.png';
import banner3 from '../Images/banner3.png';

const bannerImages = [banner1, banner2, banner3];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />

      {/* Hero Slider */}
      <Box sx={{ width: '100%', height: '90vh', overflow: 'hidden', position: 'relative' }}>
        <img
          src={bannerImages[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 1s ease-in-out',
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
        }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Luxury Autos <span style={{ color: 'yellow' }}>SRI LANKA RENT A CAR</span>
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'purple',
              color: 'white',
              padding: '10px 30px',
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#9900cc' },
            }}
            onClick={() => navigate('/vehicles')}
          >
            Reserve your vehicle Now
          </Button>
        </Box>
      </Box>

      {/* Who We Are Section (Text Only) */}
      <Box
        sx={{
          padding: '60px 80px',
          background: '#f5f5f5',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '2.5rem', lineHeight: 1.2, mb: 3 }}>
          <span style={{ color: 'red' }}>Who</span> <span style={{ color: 'black' }}>We Are</span>
        </Typography>
        <Typography sx={{ color: '#333', fontSize: '1rem', lineHeight: 1.8 }}>
          <b>Luxury Autos</b> is a locally owned and operated car rental company in Sri Lanka that provides affordable options for all travelers.
          The Luxury Autos team has been welcoming visitors from all over the world since 2015. We understand what our clients expect and deliver because we know what it's like to be a consumer.
          <br /><br />
          Our new fleets of vehicles are maintained to the highest standard, ensuring cleanliness & reliability. We take safety very seriously, making it easier for you to relax and enjoy a family vacation.
          From a fleet of more than 500 vehicles, you can find the perfect match between budget and luxury from well-known brands.
          <br /><br />
          With offices conveniently located near Bandaranaike International Airport, we're able to meet and greet you with a smile and provide a two-way airport shuttle.
          You can also try our doorstep delivery service anywhere in the country for a nominal fee.
        </Typography>
      </Box>

  {/* Statistics Section */}
  <Box
        sx={{
          background: '#efebea',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '50px 20px',
        }}
      >
        {[
          { number: '5', label: 'AWARDS' },
          { number: '10', label: 'YEARS OF EXPERIENCED' },
          { number: '500', label: 'VEHICLES' },
          { number: '560', label: 'CHAUFFEURS' },
          { number: '45,000', label: 'HAPPY CUSTOMERS ANNUALLY' },
        ].map((item, index) => (
          <Box key={index} sx={{ textAlign: 'center', margin: '20px' }}>
            <Typography variant="h3" sx={{ color: '#012C52', fontWeight: 'bold' }}>{item.number}</Typography>
            <Typography sx={{ color: '#000', mt: 1 }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
      

      {/* What We Offer Section */}
      <Box
        sx={{
          padding: '60px 80px',
          background: '#f7f3f3',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '2.5rem', mb: 5 }}>
          <span style={{ color: 'red' }}>What</span> <span style={{ color: 'black' }}>We Offer</span>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {[
            {
              title: 'Rent A Car',
              description:
                'Luxury Auto A Car is an independent car rental company in Sri Lanka since 2004. We offer luxurious customer service for you at the most affordable rental car rates.',
              image: '../Images/rentacar.png', // Replace with actual image path
            },
            {
              title: 'Airport Transfer',
              description:
                'Luxury Auto A Car offers chauffeur-driven Airport Transfer and Hotel Transfer in Sri Lanka. We offer our service for Colombo International Airport & all hotels in Sri Lanka.',
              image: '../Images/transfer.png', // Replace with actual image path
            },
            {
              title: 'Wedding Rentals',
              description:
                'Your wedding day is the most memorable day which you’ll remember for the rest of your life. We try our very best to make it perfect with many items.',
              image: 'path/to/weddingRentalsImage.png', // Replace with actual image path
            },
          ].map((offer, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 calc(33.333% - 20px)',
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <img
                src={offer.image}
                alt={offer.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {offer.title}
                </Typography>
                <Typography sx={{ color: '#555', fontSize: '0.9rem', mb: 3 }}>
                  {offer.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#b71c1c' },
                  }}
                >
                  Explore More
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

    
      <Footer />
    </div>
  );
}

export default Home;
