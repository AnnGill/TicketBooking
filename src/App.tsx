import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/home-page/HomePage';
import './App.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#ff8f00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/movie/:movieId" element={<MovieDetailsPage />} /> */}
          {/* <Route path="/booking/:movieId" element={<BookingPage />} /> */}
          {/* <Route path="/map" element={<MapPage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } /> */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
      <footer className="footer">
          <p>© {new Date().getFullYear()} Movie Ticket Booking. All rights reserved.</p>
      </footer>
    </ThemeProvider>
  )
}

export default App;
