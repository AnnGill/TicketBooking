// Movie related types
export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: string;
  duration: number; // in minutes
  genre: string[];
  rating: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  movieId: number;
  userName: string;
  text: string;
  rating: number;
  date: string;
}

// Booking related types
export interface Seat {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
  isSelected: boolean;
  price: number;
}

export interface ShowTime {
  id: number;
  movieId: number;
  time: string;
  date: string;
  bookingStartDate?: string; // Date when booking becomes available
  bookingEndDate?: string;   // Date when booking closes
  isBookingEnabled: boolean; // Flag to enable/disable booking
}

export interface Booking {
  id: string;
  movieId: number;
  showTimeId: number;
  seats: Seat[];
  customerName: string;
  email: string;
  totalAmount: number;
  bookingDate: string;
}
