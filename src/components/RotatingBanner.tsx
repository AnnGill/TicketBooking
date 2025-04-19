import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bannerImages } from '../data/bannerImages';
import './RotatingBanner.scss';

const RotatingBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  // Auto rotate through banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  const handleViewDetails = () => {
    // In a real app, this would navigate to the actual movie's page
    // For demo purposes, we'll just navigate to a dummy movie ID
    navigate(`/movie/${currentIndex + 1}`);
  };
  
  const handleBannerDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box className="rotating-banner">
      {bannerImages.map((image, index) => (
        <Box
          key={image.id}
          className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
          sx={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.3) 100%), url(${image.url})`,
          }}
        >
          <Box className="banner-content">
            <Typography variant="h2" className="banner-title">
              {image.title}
            </Typography>
            <Typography variant="h5" className="banner-subtitle" gutterBottom>
              {image.subtitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleViewDetails}
              sx={{ mt: 3 }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      ))}
      
      {/* Banner navigation dots */}
      <Box className="banner-dots">
        {bannerImages.map((_, index) => (
          <Box
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleBannerDotClick(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RotatingBanner;
