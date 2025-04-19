import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './MovieTrailer.scss';

interface MovieTrailerProps {
  title: string;
  trailerUrl: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({ title, trailerUrl }) => {
  // Extract YouTube video ID if the URL is from YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed URL
    }
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url; // Return original URL if not YouTube or cannot extract ID
  };

  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  return (
    <Paper elevation={3} className="movie-trailer">
      <Typography variant="h5" component="h2" className="trailer-title">
        {title} - Official Trailer
      </Typography>
      <Box className="trailer-container">
        <iframe
          src={embedUrl}
          title={`${title} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
    </Paper>
  );
};

export default MovieTrailer;
