import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import RootStore from '../stores/RootStore';
import { ShowTime } from '../types';

const BookingAvailabilityManager: React.FC = observer(() => {
  const { bookingStore } = RootStore;
  const [showTimes, setShowTimes] = useState<ShowTime[]>(bookingStore.getAllShowTimes());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShowTime, setSelectedShowTime] = useState<ShowTime | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  const handleOpenDialog = (showTime: ShowTime) => {
    setSelectedShowTime(showTime);
    setStartDate(showTime.bookingStartDate ? dayjs(showTime.bookingStartDate) : null);
    setEndDate(showTime.bookingEndDate ? dayjs(showTime.bookingEndDate) : null);
    setIsEnabled(showTime.isBookingEnabled);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedShowTime(null);
  };

  const handleSaveChanges = () => {
    if (selectedShowTime) {
      const success = bookingStore.updateShowTimeBookingAvailability(
        selectedShowTime.id,
        startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate ? endDate.format('YYYY-MM-DD') : null,
        isEnabled
      );
      
      if (success) {
        // Update the local state to reflect changes
        setShowTimes(bookingStore.getAllShowTimes());
        handleCloseDialog();
      }
    }
  };

  const getStatusColor = (showTime: ShowTime) => {
    if (!showTime.isBookingEnabled) {
      return 'error';
    }
    
    const currentDate = new Date();
    const startDate = showTime.bookingStartDate ? new Date(showTime.bookingStartDate) : null;
    const endDate = showTime.bookingEndDate ? new Date(showTime.bookingEndDate) : null;
    
    if (startDate && currentDate < startDate) {
      return 'warning'; // Not yet available
    }
    
    if (endDate && currentDate > endDate) {
      return 'error'; // Expired
    }
    
    return 'success'; // Available now
  };

  const getStatusText = (showTime: ShowTime) => {
    if (!showTime.isBookingEnabled) {
      return 'Disabled';
    }
    
    const currentDate = new Date();
    const startDate = showTime.bookingStartDate ? new Date(showTime.bookingStartDate) : null;
    const endDate = showTime.bookingEndDate ? new Date(showTime.bookingEndDate) : null;
    
    if (startDate && currentDate < startDate) {
      return 'Not yet available';
    }
    
    if (endDate && currentDate > endDate) {
      return 'Booking closed';
    }
    
    return 'Available now';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manage Booking Availability
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie ID</TableCell>
              <TableCell>Show Date</TableCell>
              <TableCell>Show Time</TableCell>
              <TableCell>Booking Window</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showTimes.map((showTime) => (
              <TableRow key={showTime.id}>
                <TableCell>{showTime.movieId}</TableCell>
                <TableCell>{showTime.date}</TableCell>
                <TableCell>{showTime.time}</TableCell>
                <TableCell>
                  {showTime.bookingStartDate && showTime.bookingEndDate ? (
                    `${showTime.bookingStartDate} to ${showTime.bookingEndDate}`
                  ) : (
                    'Not set'
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(showTime)} 
                    color={getStatusColor(showTime) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(showTime)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Edit Booking Availability
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2, minWidth: '300px' }}>
              {selectedShowTime && (
                <>
                  <Typography variant="body2" gutterBottom>
                    <strong>Movie ID:</strong> {selectedShowTime.movieId}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Show Date & Time:</strong> {selectedShowTime.date} at {selectedShowTime.time}
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <DatePicker
                      label="Booking Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                    
                    <DatePicker
                      label="Booking End Date"
                      value={endDate}
                      onChange={setEndDate}
                      slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isEnabled}
                          onChange={(e) => setIsEnabled(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Enable Booking"
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
});

export default BookingAvailabilityManager;
