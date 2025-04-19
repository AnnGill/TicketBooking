import React from 'react';
import { 
  Box, 
  Paper,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import  { Dayjs } from 'dayjs';

interface BookingFilterProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

const BookingFilter: React.FC<BookingFilterProps> = ({ selectedDate, onDateChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter Bookings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Month and Year"
            value={selectedDate}
            onChange={onDateChange}
            views={['month', 'year']}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Box>
    </Paper>
  );
};

export default BookingFilter;
