import { Seat } from './index';

export enum BookingStatus {
  BOOKING = 'Booking',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

export interface BookingWithStatus {
  id: string;
  movieId: number;
  showTimeId: number;
  seats: Seat[];
  customerName: string;
  email: string;
  phone?: string;
  totalAmount: number;
  bookingDate: string;
  status: BookingStatus;
  movieTitle?: string;
  showTimeInfo?: string;
}
