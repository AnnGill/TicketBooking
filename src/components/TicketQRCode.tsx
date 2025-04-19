import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Paper, 
  Box, 
  Typography, 
  Divider,
  useTheme
} from '@mui/material';
import { BookingWithStatus } from '../types/booking';
import './TicketQRCode.scss';

interface TicketQRCodeProps {
  booking: BookingWithStatus;
}

const TicketQRCode: React.FC<TicketQRCodeProps> = ({ booking }) => {
  const theme = useTheme();
  
  // In a real app, this would be a link to verify the ticket
  // For this mock implementation, we'll use the homepage URL
  const qrValue = window.location.origin || 'https://example.com';
  
  return (
    <Paper elevation={3} className="ticket-qr-container">
      <Box className="ticket-header" sx={{ bgcolor: theme.palette.primary.main }}>
        <Typography variant="h6" color="white">
          Movie Ticket
        </Typography>
      </Box>
      
      <Box className="ticket-content">
        <Box className="ticket-info">
          <Typography variant="h6" gutterBottom>
            {booking.movieTitle}
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Date & Time:</strong> {booking.showTimeInfo}
          </Typography>
          
          <Typography variant="body2">
            <strong>Seats:</strong> {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
          </Typography>
          
          <Typography variant="body2">
            <strong>Customer:</strong> {booking.customerName}
          </Typography>
          
          <Typography variant="body2">
            <strong>Booking ID:</strong> {booking.id.substring(0, 8)}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            Scan the QR code at the entrance
          </Typography>
        </Box>
          <Box className="qr-code-container">
          <QRCodeSVG 
            value={qrValue}
            size={120}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Ticket #{booking.id.substring(0, 6)}
          </Typography>
        </Box>
      </Box>
      
      <Box className="ticket-footer">
        <Typography variant="body2" color="text.secondary">
          Thank you for booking with us!
        </Typography>
      </Box>
    </Paper>
  );
};

export default TicketQRCode;
