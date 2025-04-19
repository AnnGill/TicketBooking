import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider 
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Directions as DirectionsIcon
} from '@mui/icons-material';
import './MapPage.scss';

const MapPage: React.FC = () => {
  // Theater location coordinates for Google Maps
  const theaterLocation = {
    lat: 40.712776,
    lng: -74.005974,
    name: 'CineMagic Theater'
  };

  // Function to open Google Maps with the location
  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${theaterLocation.lat},${theaterLocation.lng}&query_place_id=${encodeURIComponent(theaterLocation.name)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container className="map-page">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Us
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Paper elevation={3} className="map-container">
          <Box className="theater-info">
            <Typography variant="h5" gutterBottom>
              <LocationIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
              CineMagic Theater
            </Typography>
            <Typography variant="body1" gutterBottom>
              123 Movie Street, New York, NY 10001
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Phone:</strong> (123) 456-7890
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Hours:</strong> Open daily 10:00 AM - 11:00 PM
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Parking:</strong> Free parking available for ticket holders
            </Typography>

            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<DirectionsIcon />}
              onClick={openGoogleMaps}
              sx={{ mt: 2 }}
            >
              Get Directions on Google Maps
            </Button>
          </Box>

          <Box className="map-image-container">
            <img 
              src="/theater-map.jpg" 
              alt="CineMagic Theater Map" 
              className="theater-map-image"
              onError={(e) => {
                // Fallback to a placeholder if image is not found
                const target = e.target as HTMLImageElement;
                target.src = "https://maps.googleapis.com/maps/api/staticmap?center=40.712776,-74.005974&zoom=15&size=600x400&markers=color:red%7C40.712776,-74.005974&key=";
                target.alt = "Map location placeholder";
              }}
            />
            <Typography variant="caption" className="map-caption">
              Click the button above to get directions to our theater
            </Typography>
          </Box>
        </Paper>

        <Box className="additional-info" sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Getting Here
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>By Subway:</strong> Take the A, C, E lines to Canal Street station. We're a 5-minute walk from the station.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>By Bus:</strong> Routes M20, M55 stop directly in front of the theater.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>By Car:</strong> Free parking is available in our lot for ticket holders. Simply present your ticket stub for validation.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;
