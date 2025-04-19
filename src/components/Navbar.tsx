import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  TextField, 
  InputAdornment,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, 
  AccountCircle, 
  Menu as MenuIcon 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMobileMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 0, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
            mr: 2
          }}
        >
          MovieTickets
        </Typography>
        
        {!isMobile && (
          <>            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/movies">
              Movies
            </Button>
            <Button color="inherit" component={RouterLink} to="/coming-soon">
              Coming Soon
            </Button>
            <Button color="inherit" component={RouterLink} to="/map">
              Find Us
            </Button>
          </>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <form onSubmit={handleSearch} className="search-form">
          <TextField
            size="small"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              bgcolor: 'background.paper',
              borderRadius: 1
            }}
          />
        </form>
        
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          <AccountCircle />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/bookings'); }}>
              My Bookings
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>
              Admin Dashboard
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
      
      {isMobile && mobileMenuOpen && (
        <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 1 }}>
          <MenuItem component={RouterLink} to="/" onClick={handleMobileMenuToggle}>
            Home
          </MenuItem>
          <MenuItem component={RouterLink} to="/movies" onClick={handleMobileMenuToggle}>
            Movies
          </MenuItem>
          <MenuItem component={RouterLink} to="/coming-soon" onClick={handleMobileMenuToggle}>
            Coming Soon
          </MenuItem>
          <Box sx={{ p: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
