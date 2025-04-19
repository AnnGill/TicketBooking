import { makeAutoObservable } from 'mobx';
import { Seat, ShowTime } from '../types';
import { BookingStatus, BookingWithStatus } from '../types/booking';

class BookingStore {
  selectedSeats: Seat[] = [];
  selectedShowTime: ShowTime | null = null;
  bookings: BookingWithStatus[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Define a layout for the theater seats (10 rows x 12 seats)
  theaterLayout: Seat[][] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeTheaterLayout();
    this.initializeSampleBookings(); // Add some sample bookings for testing
  }

  // Initialize theater layout
  initializeTheaterLayout() {
    const rows = 10;
    const seatsPerRow = 12;
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (let i = 0; i < rows; i++) {
      const rowSeats: Seat[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        rowSeats.push({
          id: `${rowLabels[i]}${j + 1}`,
          row: rowLabels[i],
          number: j + 1,
          isBooked: Math.random() < 0.3,
          isSelected: false,
          price: i < 3 ? 15 : (i < 7 ? 12 : 10)
        });
      }
      this.theaterLayout.push(rowSeats);
    }
  }

  // Add sample bookings for testing
  initializeSampleBookings() {
    // Today's bookings
    const today = new Date();
    
    // Sample booking 1 - Pending
    this.bookings.push({
      id: '1001',
      movieId: 1,
      showTimeId: 1,
      seats: [
        { id: 'A1', row: 'A', number: 1, isBooked: true, isSelected: false, price: 15 },
        { id: 'A2', row: 'A', number: 2, isBooked: true, isSelected: false, price: 15 }
      ],
      customerName: 'John Doe',
      email: 'john@example.com',
      totalAmount: 30,
      bookingDate: today.toISOString(),
      status: BookingStatus.BOOKING,
      movieTitle: 'Avengers: Endgame',
      showTimeInfo: '2025-04-15 at 10:00 AM'
    });
    
    // Sample booking 2 - Confirmed
    this.bookings.push({
      id: '1002',
      movieId: 2,
      showTimeId: 2,
      seats: [
        { id: 'B3', row: 'B', number: 3, isBooked: true, isSelected: false, price: 15 },
        { id: 'B4', row: 'B', number: 4, isBooked: true, isSelected: false, price: 15 }
      ],
      customerName: 'Jane Smith',
      email: 'jane@example.com',
      totalAmount: 30,
      bookingDate: today.toISOString(),
      status: BookingStatus.CONFIRMED,
      movieTitle: 'The Shawshank Redemption',
      showTimeInfo: '2025-04-15 at 1:30 PM'
    });
    
    // Sample booking 3 - Cancelled
    this.bookings.push({
      id: '1003',
      movieId: 3,
      showTimeId: 3,
      seats: [
        { id: 'C5', row: 'C', number: 5, isBooked: false, isSelected: false, price: 12 }
      ],
      customerName: 'Bob Johnson',
      email: 'bob@example.com',
      totalAmount: 12,
      bookingDate: today.toISOString(),
      status: BookingStatus.CANCELLED,
      movieTitle: 'Inception',
      showTimeInfo: '2025-04-15 at 4:45 PM'
    });
    
    // Last month's bookings
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Sample booking 4 - Last month, Confirmed
    this.bookings.push({
      id: '1004',
      movieId: 1,
      showTimeId: 4,
      seats: [
        { id: 'D6', row: 'D', number: 6, isBooked: true, isSelected: false, price: 12 },
        { id: 'D7', row: 'D', number: 7, isBooked: true, isSelected: false, price: 12 }
      ],
      customerName: 'Sarah Wilson',
      email: 'sarah@example.com',
      totalAmount: 24,
      bookingDate: lastMonth.toISOString(),
      status: BookingStatus.CONFIRMED,
      movieTitle: 'Avengers: Endgame',
      showTimeInfo: '2025-03-15 at 8:00 PM'
    });
  }
  // Get available show times for the selected movie
  getShowTimes(movieId: number): ShowTime[] {
    // In a real app, this would come from the API
    // Mock data for demo purposes
    return [
      { 
        id: 1, 
        movieId, 
        time: '10:00 AM', 
        date: '2025-04-15', 
        bookingStartDate: '2025-04-01',
        bookingEndDate: '2025-04-15',
        isBookingEnabled: true
      },
      { 
        id: 2, 
        movieId, 
        time: '1:30 PM', 
        date: '2025-04-15', 
        bookingStartDate: '2025-04-01',
        bookingEndDate: '2025-04-15',
        isBookingEnabled: true
      },
      { 
        id: 3, 
        movieId, 
        time: '4:45 PM', 
        date: '2025-04-15', 
        bookingStartDate: '2025-04-01',
        bookingEndDate: '2025-04-15',
        isBookingEnabled: true
      },
      { 
        id: 4, 
        movieId, 
        time: '8:00 PM', 
        date: '2025-04-15', 
        bookingStartDate: '2025-04-01',
        bookingEndDate: '2025-04-15',
        isBookingEnabled: false
      },
      { 
        id: 5, 
        movieId, 
        time: '10:30 PM', 
        date: '2025-04-15', 
        bookingStartDate: '2025-04-01',
        bookingEndDate: '2025-04-15',
        isBookingEnabled: true
      },
    ];
  }

  // Select show time
  selectShowTime(showTime: ShowTime) {
    this.selectedShowTime = showTime;
    // Reset seat selection when show time changes
    this.clearSeatSelection();
    // In a real app, we would fetch seat availability for this show time
  }

  // Toggle seat selection
  toggleSeatSelection(seatId: string) {
    this.theaterLayout = this.theaterLayout.map(row => 
      row.map(seat => {
        if (seat.id === seatId && !seat.isBooked) {
          // Toggle selection
          const isSelected = !seat.isSelected;
          
          // Update selected seats array
          if (isSelected) {
            this.selectedSeats.push({...seat, isSelected});
          } else {
            this.selectedSeats = this.selectedSeats.filter(s => s.id !== seatId);
          }
          
          return {...seat, isSelected};
        }
        return seat;
      })
    );
  }

  // Clear seat selection
  clearSeatSelection() {
    this.selectedSeats = [];
    this.theaterLayout = this.theaterLayout.map(row => 
      row.map(seat => ({...seat, isSelected: false}))
    );
  }

  // Calculate total price
  get totalPrice() {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }  // Complete booking
  completeBooking(customerName: string, email: string, phone?: string) {
    if (!this.selectedShowTime || this.selectedSeats.length === 0) {
      this.error = 'Please select show time and seats';
      return false;
    }

    this.loading = true;
    
    try {
      // In a real app, this would be an API call to create a booking
      const newBooking: BookingWithStatus = {
        id: Date.now().toString(),
        movieId: this.selectedShowTime.movieId,
        showTimeId: this.selectedShowTime.id,
        seats: [...this.selectedSeats],
        customerName,
        email,
        phone,
        totalAmount: this.totalPrice,
        bookingDate: new Date().toISOString(),
        status: BookingStatus.BOOKING // Initial status is "Booking"
      };
      
      // Add booking to the list
      this.bookings.push(newBooking);
      
      // Mark the selected seats as booked
      this.theaterLayout = this.theaterLayout.map(row => 
        row.map(seat => {
          if (this.selectedSeats.some(s => s.id === seat.id)) {
            return {...seat, isBooked: true, isSelected: false};
          }
          return seat;
        })
      );
      
      // Clear selection
      this.selectedSeats = [];
      this.error = null;
      
      // Import is not needed here because this is used by RootStore
      // and AlertStore is accessible via RootStore
      import('./RootStore').then(({ default: RootStore }) => {
        RootStore.alertStore.showSuccess(`Booking successful! Your tickets for ${this.selectedShowTime?.time} have been booked.`);
      });
      
      return true;
    } catch (error) {
      this.error = 'Failed to complete booking';
      console.error('Error completing booking:', error);
      
      // Show error alert
      import('./RootStore').then(({ default: RootStore }) => {
        RootStore.alertStore.showError('Failed to complete booking. Please try again.');
      });
      
      return false;
    } finally {
      this.loading = false;
    }
  }
    // Update booking status
  updateBookingStatus(bookingId: string, status: BookingStatus) {
    try {
      const booking = this.bookings.find(b => b.id === bookingId);
      if (!booking) {
        // Show error alert
        import('./RootStore').then(({ default: RootStore }) => {
          RootStore.alertStore.showError('Booking not found');
        });
        return false;
      }

      this.bookings = this.bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      );
      
      // Show success alert
      import('./RootStore').then(({ default: RootStore }) => {
        const statusText = status === BookingStatus.CONFIRMED ? 'confirmed' : 'cancelled';
        const customerName = booking.customerName;
        RootStore.alertStore.showSuccess(`Booking for ${customerName} has been ${statusText} successfully`);
      });
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      
      // Show error alert
      import('./RootStore').then(({ default: RootStore }) => {
        RootStore.alertStore.showError('Failed to update booking status');
      });
      
      return false;
    }
  }
  
  // Get all bookings for admin view with movie information
  getAllBookingsWithDetails() {
    return this.bookings.map(booking => {
      // In a real app, this would fetch actual movie titles and show times from the API
      // For this example, we'll add placeholders
      return {
        ...booking,
        movieTitle: `Movie #${booking.movieId}`,
        showTimeInfo: `Show #${booking.showTimeId}`
      };
    });
  }
  
  // Filter bookings by status
  getBookingsByStatus(status: BookingStatus | null) {
    if (status === null) {
      return this.getAllBookingsWithDetails();
    }
    return this.getAllBookingsWithDetails().filter(booking => booking.status === status);
  }
  
  // Get booking status counts
  getBookingStatusCounts(date?: Date) {
    const bookings = date ? this.getBookingsByMonthYear(date) : this.bookings;
    
    return {
      [BookingStatus.BOOKING]: bookings.filter(b => b.status === BookingStatus.BOOKING).length,
      [BookingStatus.CONFIRMED]: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
      [BookingStatus.CANCELLED]: bookings.filter(b => b.status === BookingStatus.CANCELLED).length
    };
  }
  
  // Filter bookings by month and year
  getBookingsByMonthYear(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    return this.bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
    });
  }
  
  // Filter bookings by status and date
  getFilteredBookings(status: BookingStatus | null, date: Date | null) {
    let filteredBookings = this.getAllBookingsWithDetails();
    
    // Apply status filter if provided
    if (status !== null) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    // Apply date filter if provided
    if (date !== null) {
      const year = date.getFullYear();
      const month = date.getMonth();
      
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
      });
    }
    
    return filteredBookings;
  }

  // Update show time booking availability
  updateShowTimeBookingAvailability(
    showTimeId: number,
    bookingStartDate: string | null,
    bookingEndDate: string | null,
    isBookingEnabled: boolean
  ) {
    try {
      // In a real app, this would be an API call
      // For now, we'll use our mock data and pretend it was updated
      
      // Get current show times (this returns a new array each time in our mock implementation)
      const allShowTimes = this.getShowTimes(1); // Using movieId 1 as an example
      
      // Find and update the specific show time
      const updatedShowTime = allShowTimes.find(st => st.id === showTimeId);
      
      if (!updatedShowTime) {
        import('./RootStore').then(({ default: RootStore }) => {
          RootStore.alertStore.showError('Show time not found');
        });
        return false;
      }
      
      // Update the properties
      if (bookingStartDate !== null) {
        updatedShowTime.bookingStartDate = bookingStartDate;
      }
      
      if (bookingEndDate !== null) {
        updatedShowTime.bookingEndDate = bookingEndDate;
      }
      
      updatedShowTime.isBookingEnabled = isBookingEnabled;
      
      // In a real app, we would save these changes to a backend
      // For now, we'll show a success message
      import('./RootStore').then(({ default: RootStore }) => {
        RootStore.alertStore.showSuccess('Booking availability updated successfully');
      });
      
      return true;
    } catch (error) {
      console.error('Error updating show time booking availability:', error);
      import('./RootStore').then(({ default: RootStore }) => {
        RootStore.alertStore.showError('Failed to update booking availability');
      });
      return false;
    }
  }
  
  // Check if booking is currently available for a show time
  isBookingAvailableForShowTime(showTime: ShowTime): boolean {
    if (!showTime.isBookingEnabled) {
      return false;
    }
    
    const currentDate = new Date();
    const startDate = showTime.bookingStartDate ? new Date(showTime.bookingStartDate) : null;
    const endDate = showTime.bookingEndDate ? new Date(showTime.bookingEndDate) : null;
    
    // Check if current date is within the booking window
    if (startDate && currentDate < startDate) {
      return false; // Too early, booking not started
    }
    
    if (endDate && currentDate > endDate) {
      return false; // Too late, booking ended
    }
    
    return true;
  }
  
  // Get all show times (for admin management)
  getAllShowTimes(): ShowTime[] {
    // In a real app, this would fetch all show times from an API
    // For simplicity, we'll get show times for a few movies
    const allShowTimes: ShowTime[] = [];
    
    for (let movieId = 1; movieId <= 3; movieId++) {
      const showTimes = this.getShowTimes(movieId);
      allShowTimes.push(...showTimes);
    }
    
    return allShowTimes;
  }

  // Get the ID of the most recently created booking
  getLatestBookingId(): string {
    if (this.bookings.length === 0) {
      return `TICKET-${Date.now()}`;
    }
    return this.bookings[this.bookings.length - 1].id;
  }
}

export default new BookingStore();

