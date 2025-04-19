import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import MovieCard from '../../components/MovieCard';
import RotatingBanner from '../../components/RotatingBanner';
import RootStore from '../../stores/RootStore';
import './HomePage.scss';

const HomePage: React.FC = observer(() => {
  const { movieStore } = RootStore;
  const { movies, loading, error, fetchMovies } = movieStore;

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading && movies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && movies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Sort movies randomly for the "Now Showing" section
  const nowShowingMovies = [...movies].sort(() => Math.random() - 0.5);

  return (
    <div className="home-page">
      {/* Rotating Banner */}
      <RotatingBanner />

      <Container sx={{ py: 4 }}>
        {/* Now Showing Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
          Now Showing
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {nowShowingMovies.map((movie) => (
            <Box key={movie.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%', lg: '22%' } }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  );
});

export default HomePage;
