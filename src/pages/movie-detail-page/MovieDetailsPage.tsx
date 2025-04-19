import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Rating, 
  Grid, 
  Divider,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import MovieTrailer from '../../components/MovieTrailer';
import CommentsSection from '../../components/CommentsSection';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RootStore from '../../stores/RootStore';
import { Comment } from '../../types';
import './MovieDetailsPage.scss';

const MovieDetailsPage: React.FC = observer(() => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { movieStore } = RootStore;
  const { selectedMovie, selectMovieById, addComment } = movieStore;
  const numericMovieId = movieId ? parseInt(movieId, 10) : 0;

  useEffect(() => {
    if (numericMovieId) {
      selectMovieById(numericMovieId);
    }
  }, [numericMovieId, selectMovieById]);

  const handleAddComment = (comment: Comment) => {
    addComment(comment);
  };

  const handleBookTicket = () => {
    navigate(`/booking/${numericMovieId}`);
  };

  if (!selectedMovie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const formattedReleaseDate = new Date(selectedMovie.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="movie-details-page">
      {/* Movie Header */}
      <Box className="movie-header">
        <Container>
          <Grid container spacing={4}>
            <Grid size={{ xs:12, md:4, lg:3 }}>
              <img 
                src={selectedMovie.posterUrl} 
                alt={selectedMovie.title} 
                className="movie-poster"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = '/placeholder-movie.jpg';
                }}
              />
            </Grid>
            <Grid size={{ xs:12, md:8, lg:9 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {selectedMovie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={selectedMovie.rating / 2} 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedMovie.rating.toFixed(1)}/10
                </Typography>
              </Box>
              
              <Box className="movie-info" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">
                    {formatRuntime(selectedMovie.duration)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">
                    {formattedReleaseDate}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {selectedMovie.genre.map((genre, index) => (
                  <Chip 
                    key={index} 
                    label={genre} 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedMovie.description}
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleBookTicket}
              >
                Book Tickets
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container>
        <Divider sx={{ my: 4 }} />
        
        {/* Movie Trailer */}
        <MovieTrailer 
          title={selectedMovie.title} 
          trailerUrl={selectedMovie.trailerUrl} 
        />
        
        {/* Comments Section */}
        <CommentsSection 
          movieId={selectedMovie.id}
          comments={selectedMovie.comments}
          onAddComment={handleAddComment}
        />
      </Container>
    </div>
  );
});

export default MovieDetailsPage;
