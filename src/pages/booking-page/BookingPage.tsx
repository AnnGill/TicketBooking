import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import SeatSelection from '../../components/SeatSelection';
import TicketQRCode from '../../components/TicketQRCode';
import RootStore from '../../stores/RootStore';
import { BookingStatus } from '../../types/booking';
import './BookingPage.scss';

// Create a styled Grid item component to fix TypeScript errors
const Item = styled(Grid)({});

const steps = ['Select Seats', 'Customer Information', 'Payment', 'Confirmation'];

const BookingPage: React.FC = observer(() => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { movieStore, bookingStore } = RootStore;
  const { selectMovieById, selectedMovie } = movieStore;
  
  const [activeStep, setActiveStep] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const numericMovieId = movieId ? parseInt(movieId, 10) : 0;

  useEffect(() => {
    if (numericMovieId) {
      selectMovieById(numericMovieId);
    }
  }, [numericMovieId, selectMovieById]);

  if (!selectedMovie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const showTimes = bookingStore.getShowTimes(selectedMovie.id);

  const handleSeatToggle = (seatId: string) => {
    bookingStore.toggleSeatSelection(seatId);
  };

  const handleShowTimeSelect = (showTime: any) => {
    bookingStore.selectShowTime(showTime);
  };

  const validateContactInfo = () => {
    let isValid = true;
    
    // Validate name
    if (!customerName.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate phone (optional but must be valid if provided)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone.trim() && !phoneRegex.test(phone.replace(/[- ]/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate seat selection
      if (bookingStore.selectedSeats.length === 0) {
        setBookingError('Please select at least one seat');
        return;
      }
      setBookingError(null);
    } else if (activeStep === 1) {
      // Validate contact information
      if (!validateContactInfo()) {
        return;
      }    } else if (activeStep === 2) {
      // Process payment (simulated)
      // In a real app, you would integrate with a payment gateway here
      const success = bookingStore.completeBooking(customerName, email);
      if (!success) {
        setBookingError('Failed to complete booking. Please try again.');
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SeatSelection 
            theaterLayout={bookingStore.theaterLayout}
            selectedSeats={bookingStore.selectedSeats}
            showTimes={showTimes}
            selectedShowTime={bookingStore.selectedShowTime}
            totalPrice={bookingStore.totalPrice}
            onSeatToggle={handleSeatToggle}
            onShowTimeSelect={handleShowTimeSelect}
            onProceedToCheckout={() => handleNext()}
          />
        );      case 1:
        return (
          <Paper elevation={3} className="contact-info-form">
            <Typography variant="h5" component="h2" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={3}>
              <Item size={{ xs: 12 }} >
                <TextField
                  required
                  label="Full Name"
                  fullWidth
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Item>
              <Item size={{ xs: 12 }}>
                <TextField
                  required
                  label="Email"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Item>
              <Item size={{ xs: 12 }}>                
                <TextField
                  label="Phone Number (optional)"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!phoneError}
                  helperText={phoneError}
                />
              </Item>
            </Grid>
          </Paper>
        );
      case 3:        return (
          <Paper elevation={3} className="confirmation">
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h5" gutterBottom>
                Booking Confirmed!
              </Typography>
              <Typography variant="body1">
                Thank you for your purchase, {customerName}! Your tickets have been booked successfully.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                A confirmation email has been sent to {email}.
              </Typography>
                {/* Ticket with QR Code */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <TicketQRCode 
                  booking={{
                    id: bookingStore.getLatestBookingId() || `TICKET-${Date.now()}`,
                    movieId: selectedMovie.id,
                    showTimeId: bookingStore.selectedShowTime?.id || 0,
                    seats: bookingStore.selectedSeats,                    customerName,
                    email,
                    totalAmount: bookingStore.totalPrice,
                    bookingDate: new Date().toISOString(),
                    status: BookingStatus.CONFIRMED,
                    movieTitle: selectedMovie.title,
                    showTimeInfo: `${bookingStore.selectedShowTime?.date} at ${bookingStore.selectedShowTime?.time}`
                  }} 
                />
              </Box>
              
              <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Booking Details:
                </Typography>
                <Typography variant="body1">
                  Movie: {selectedMovie.title}
                </Typography>
                <Typography variant="body1">
                  Date & Time: {bookingStore.selectedShowTime?.date} at {bookingStore.selectedShowTime?.time}
                </Typography>
                <Typography variant="body1">
                  Seats: {bookingStore.selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </Typography>
                <Typography variant="body1">
                  Total Amount: ${bookingStore.totalPrice.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                sx={{ mt: 4 }}
              >
                Return to Home
              </Button>
            </Box>
          </Paper>
        );case 2:
        return (
          <Paper elevation={3} className="payment-form">
            <Typography variant="h5" component="h2" gutterBottom>
              Payment Information
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo app. No actual payment will be processed.
            </Alert>            
            <Grid container spacing={3}>
              <Item size={{ xs: 12 }} >
                <TextField
                  required
                  label="Card Number"
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                />
              </Item>
              <Item size={{ xs: 12 }}>
                <TextField
                  required
                  label="Expiry Date"
                  fullWidth
                  placeholder="MM/YY"
                />
              </Item>
              <Item size={{ xs: 12 }}>
                <TextField
                  required
                  label="CVV"
                  fullWidth
                  placeholder="123"
                />
              </Item>
              <Item size={{ xs: 12 }}>
                <TextField
                  required
                  label="Cardholder Name"
                  fullWidth
                />
              </Item>
              <Item size={{ xs: 12 }}>
                <Alert severity="success">
                  Total Amount: ${bookingStore.totalPrice.toFixed(2)}
                </Alert>
              </Item>
            </Grid>
          </Paper>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container className="booking-page">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Tickets: {selectedMovie.title}
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {bookingError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {bookingError}
          </Alert>
        )}
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && activeStep < 3 && (
            <Button 
              onClick={handleBack} 
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          )}
          
          {activeStep < 3 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && 
                  (bookingStore.selectedSeats.length === 0 || !bookingStore.selectedShowTime)) ||
                activeStep === 3
              }
            >
              {activeStep === 2 ? 'Complete Payment' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
});

export default BookingPage;
