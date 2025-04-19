import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Seat, ShowTime } from '../types';
import './SeatSelection.scss';

interface SeatSelectionProps {
  theaterLayout: Seat[][];
  selectedSeats: Seat[];
  showTimes: ShowTime[];
  selectedShowTime: ShowTime | null;
  totalPrice: number;
  onSeatToggle: (seatId: string) => void;
  onShowTimeSelect: (showTime: ShowTime) => void;
  onProceedToCheckout: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = observer(({
  theaterLayout,
  selectedSeats,
  showTimes,
  selectedShowTime,
  totalPrice,
  onSeatToggle,
  onShowTimeSelect,
  onProceedToCheckout
}) => {
  return (
    <Paper elevation={3} className="seat-selection">
      <Typography variant="h5" component="h2" gutterBottom>
        Select Seats
      </Typography>
      
      {/* Show Times Selection */}
      <Box className="show-times">
        <Typography variant="subtitle1" gutterBottom>
          Select Show Time:
        </Typography>
        <Box className="time-buttons">
          {showTimes.map((showTime) => (
            <Button
              key={showTime.id}
              variant={selectedShowTime?.id === showTime.id ? "contained" : "outlined"}
              onClick={() => onShowTimeSelect(showTime)}
              className="time-button"
            >
              {showTime.date.substring(5)} | {showTime.time}
            </Button>
          ))}
        </Box>
      </Box>
      
      {/* Seat Map */}
      {selectedShowTime && (
        <>
          <Box className="screen-container">
            <Box className="screen">
              <Typography variant="subtitle2" align="center">
                SCREEN
              </Typography>
            </Box>
          </Box>
          
          <Box className="seat-map">
            {theaterLayout.map((row, rowIndex) => (
              <Box key={rowIndex} className="seat-row">
                <Typography variant="body2" className="row-label">
                  {row[0]?.row}
                </Typography>
                <Box className="seats">
                  {row.map((seat) => (
                    <Box
                      key={seat.id}
                      className={`seat ${seat.isBooked ? 'booked' : ''} ${seat.isSelected ? 'selected' : ''}`}
                      onClick={() => !seat.isBooked && onSeatToggle(seat.id)}
                    >
                      <Typography variant="caption">{seat.number}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          
          <Box className="seat-legend">
            <Box className="legend-item">
              <Box className="seat available"></Box>
              <Typography variant="body2">Available</Typography>
            </Box>
            <Box className="legend-item">
              <Box className="seat selected"></Box>
              <Typography variant="body2">Selected</Typography>
            </Box>
            <Box className="legend-item">
              <Box className="seat booked"></Box>
              <Typography variant="body2">Booked</Typography>
            </Box>
          </Box>
          
          {/* Selected Seats Summary */}
          <Box className="selection-summary">
            <Grid container spacing={2}>
              <Grid size={{ xs:12, sm:6 }}>
                <Typography variant="subtitle1">
                  Selected Seats ({selectedSeats.length}):
                </Typography>
                <Typography variant="body1">
                  {selectedSeats.length > 0 
                    ? selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')
                    : 'No seats selected'}
                </Typography>
              </Grid>
              <Grid size={{ xs:12, sm:6 }}>
                <Typography variant="subtitle1">
                  Total Price:
                </Typography>
                <Typography variant="h6" color="primary">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={selectedSeats.length === 0}
              onClick={onProceedToCheckout}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
      
      {!selectedShowTime && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Please select a show time to view seat availability.
        </Typography>
      )}
    </Paper>
  );
});

export default SeatSelection;
