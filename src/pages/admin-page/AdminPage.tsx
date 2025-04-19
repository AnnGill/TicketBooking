import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab,
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
  DialogContentText,
  DialogActions
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import RootStore from '../../stores/RootStore';
import { BookingStatus, BookingWithStatus } from '../../types/booking';
import BookingStatusChart from '../../components/BookingStatusChart';
import BookingFilter from '../../components/BookingFilter';
import BookingAvailabilityManager from '../../components/BookingAvailabilityManager';
import './AdminPage.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `booking-tab-${index}`,
    'aria-controls': `booking-tabpanel-${index}`,
  };
};

const getStatusChipColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.BOOKING:
      return 'primary';
    case BookingStatus.CONFIRMED:
      return 'success';
    case BookingStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

const AdminPage: React.FC = observer(() => {
  const { bookingStore } = RootStore;
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleActionClick = (booking: BookingWithStatus, action: 'confirm' | 'cancel') => {
    setSelectedBooking(booking);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmAction = () => {
    if (selectedBooking && actionType) {
      const newStatus = actionType === 'confirm' 
        ? BookingStatus.CONFIRMED 
        : BookingStatus.CANCELLED;
      
      bookingStore.updateBookingStatus(selectedBooking.id, newStatus);
      setDialogOpen(false);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };
  // Get bookings based on the selected tab and date filter
  const getFilteredBookings = () => {
    const dateObj = selectedDate ? selectedDate.toDate() : null;
    
    switch (tabValue) {
      case 0: // All
        return bookingStore.getFilteredBookings(null, dateObj);
      case 1: // Booking
        return bookingStore.getFilteredBookings(BookingStatus.BOOKING, dateObj);
      case 2: // Confirmed
        return bookingStore.getFilteredBookings(BookingStatus.CONFIRMED, dateObj);
      case 3: // Cancelled
        return bookingStore.getFilteredBookings(BookingStatus.CANCELLED, dateObj);
      default:
        return bookingStore.getFilteredBookings(null, dateObj);
    }
  };

  const bookings = getFilteredBookings();
  const bookingCounts = bookingStore.getBookingStatusCounts(selectedDate ? selectedDate.toDate() : undefined);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="admin-page">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Ticket Management Dashboard
          </Typography>
          
          {/* Date Filter */}
          <BookingFilter 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange} 
          />
            {/* Summary Chart */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <BookingStatusChart bookingCounts={bookingCounts} />
            </Box>
          </Box>
          
          {/* Booking Availability Manager */}
          <BookingAvailabilityManager />
          
          {/* Bookings Table */}
          <Paper elevation={3} sx={{ mt: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="booking status tabs"
              >
                <Tab label="All Bookings" {...a11yProps(0)} />
                <Tab label="Pending" {...a11yProps(1)} />
                <Tab label="Confirmed" {...a11yProps(2)} />
                <Tab label="Cancelled" {...a11yProps(3)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <BookingsTable 
                bookings={bookings} 
                onActionClick={handleActionClick} 
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <BookingsTable 
                bookings={bookings} 
                onActionClick={handleActionClick} 
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <BookingsTable 
                bookings={bookings} 
                onActionClick={handleActionClick} 
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <BookingsTable 
                bookings={bookings} 
                onActionClick={handleActionClick} 
              />
            </TabPanel>
          </Paper>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
        >
          <DialogTitle>
            {actionType === 'confirm' ? 'Confirm Booking' : 'Cancel Booking'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {actionType === 'confirm'
                ? 'Are you sure you want to confirm this booking?'
                : 'Are you sure you want to cancel this booking?'
              }
            </DialogContentText>
            {selectedBooking && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Booking ID:</strong> {selectedBooking.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Customer:</strong> {selectedBooking.customerName}
                </Typography>
                <Typography variant="body2">
                  <strong>Movie:</strong> {selectedBooking.movieTitle}
                </Typography>
                <Typography variant="body2">
                  <strong>Show Time:</strong> {selectedBooking.showTimeInfo}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> ${selectedBooking.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button 
              onClick={handleConfirmAction} 
              variant="contained" 
              color={actionType === 'confirm' ? 'success' : 'error'}
            >
              {actionType === 'confirm' ? 'Confirm' : 'Cancel Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
});

interface BookingsTableProps {
  bookings: BookingWithStatus[];
  onActionClick: (booking: BookingWithStatus, action: 'confirm' | 'cancel') => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, onActionClick }) => {
  if (bookings.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
        No bookings found.
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Movie</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id.substring(0, 8)}...</TableCell>
              <TableCell>{booking.customerName}</TableCell>
              <TableCell>{booking.movieTitle}</TableCell>
              <TableCell>{booking.showTimeInfo}</TableCell>
              <TableCell>
                {booking.seats.length} seats<br />
                <Typography variant="caption">
                  {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </Typography>
              </TableCell>
              <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Chip 
                  label={booking.status} 
                  color={getStatusChipColor(booking.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {booking.status === BookingStatus.BOOKING && (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => onActionClick(booking, 'confirm')}
                      sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onActionClick(booking, 'cancel')}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {booking.status === BookingStatus.CONFIRMED && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onActionClick(booking, 'cancel')}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminPage;
