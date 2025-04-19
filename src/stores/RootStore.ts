import MovieStore from './MovieStore';
import BookingStore from './BookingStore';
import AlertStore from './AlertStore';

class RootStore {
  movieStore = MovieStore;
  bookingStore = BookingStore;
  alertStore = AlertStore;
}

export default new RootStore();
