import React, { useEffect } from 'react';
import { 
  Container, 
  Typography,
  Divider
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import RotatingBanner from './banner/RotatingBanner';
import './HomePage.scss';

const HomePage = observer(() => {
  // const { movieStore } = RootStore;
  // const { movies, isLoading, error, fetchMovies } = movieStore;

  const onLoadMoviews = async () => {
    // await fetchMovies();
  }

  useEffect(() => {
    onLoadMoviews()
  }, []);

  // if (isLoading && movies.length === 0) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (error && movies.length === 0) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
  //       <Typography color="error">{error}</Typography>
  //     </Box>
  //   );
  // }

  // Sort movies randomly for the "Now Showing" section
  // const nowShowingMovies = [...movies].sort(() => Math.random() - 0.5);

  return (
    <div className="home-page-layout">
      <main className="home-page-left-side-bar"></main>
      <main className="home-page-main-content">
        {/* Rotating Banner */}
        <RotatingBanner />
        <Container sx={{ py: 4 }}>
          {/* Now Showing Section */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Popular Movies
          </Typography>
          <Divider sx={{ mb: 4 }} />
          {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {nowShowingMovies.map((movie) => (
              <Box key={movie.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%', lg: '22%' } }}>
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box> */}
        </Container>
      </main>
      <main className="home-page-right-side-bar"></main>
    </div>
  );
});

export default HomePage;
