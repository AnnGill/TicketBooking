import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Rating, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import './MovieCard.scss';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card className="movie-card">
      <CardMedia
        component="img"
        height="300"
        image={movie.posterUrl}
        alt={movie.title}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/placeholder-movie.jpg'; // Fallback image
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={movie.rating / 2} // Convert 10-scale to 5-scale
            precision={0.5} 
            readOnly 
            size="small" 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {movie.rating.toFixed(1)}/10
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {movie.genre.slice(0, 2).map((genre, index) => (
            <Chip key={index} label={genre} size="small" />
          ))}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {movie.description.length > 120 
            ? `${movie.description.substring(0, 120)}...` 
            : movie.description}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
