# Movie Ticket Booking

A modern, feature-rich movie ticket booking application built with React, TypeScript, Material UI, SCSS, and MobX.

## Features

- **Movie Browsing**: Browse through current movies with details and ratings
- **Movie Trailers**: Watch trailers for movies
- **Comments & Reviews**: Read and add reviews for movies
- **Seat Selection**: Interactive seat selection with visual theater layout
- **Ticket Booking**: Complete booking process with customer information and payment

## Technology Stack

- **React**: Front-end library for building user interfaces
- **TypeScript**: Static typing for JavaScript
- **Material UI**: React component library implementing Google's Material Design
- **SCSS**: CSS preprocessor for advanced styling
- **MobX**: State management library
- **React Router**: For navigation and routing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

## Project Structure

```
src/
  ├── assets/         # Static assets like images
  ├── components/     # Reusable UI components
  ├── pages/          # Page components
  ├── services/       # API services
  ├── stores/         # MobX stores for state management
  ├── styles/         # Global styles and variables
  ├── types/          # TypeScript type definitions
  └── utils/          # Utility functions
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Serves the production build locally
- `npm run lint` - Runs ESLint to check for code quality issues

## Demo Usage

1. Browse movies on the home page
2. Click on a movie to view details, trailer, and reviews
3. Click "Book Tickets" to start the booking process
4. Select a show time and seats
5. Enter contact information
6. Complete the (simulated) payment process
7. View your booking confirmation

## Notes

This is a demonstration project. In a real-world scenario, you would:
- Connect to an actual API for movie data
- Implement user authentication
- Add a real payment gateway
- Store bookings in a database

## License

MIT
