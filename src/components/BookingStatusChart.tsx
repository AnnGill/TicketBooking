import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { Typography, Box, Paper } from '@mui/material';
import { BookingStatus } from '../types/booking';

interface BookingStatusData {
  name: string;
  value: number;
  color: string;
}

interface BookingStatusChartProps {
  bookingCounts: {
    [BookingStatus.BOOKING]: number;
    [BookingStatus.CONFIRMED]: number;
    [BookingStatus.CANCELLED]: number;
  };
}

const COLORS = {
  [BookingStatus.BOOKING]: '#2196f3', // Blue
  [BookingStatus.CONFIRMED]: '#4caf50', // Green
  [BookingStatus.CANCELLED]: '#f44336', // Red
};

const BookingStatusChart: React.FC<BookingStatusChartProps> = ({ bookingCounts }) => {
  const chartData: BookingStatusData[] = [
    {
      name: 'Pending',
      value: bookingCounts[BookingStatus.BOOKING],
      color: COLORS[BookingStatus.BOOKING]
    },
    {
      name: 'Confirmed',
      value: bookingCounts[BookingStatus.CONFIRMED],
      color: COLORS[BookingStatus.CONFIRMED]
    },
    {
      name: 'Cancelled',
      value: bookingCounts[BookingStatus.CANCELLED],
      color: COLORS[BookingStatus.CANCELLED]
    }
  ].filter(item => item.value > 0); // Only show statuses with bookings

  const totalBookings = Object.values(bookingCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Booking Status Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Bookings: {totalBookings}
      </Typography>
      
      {totalBookings > 0 ? (
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 250 
        }}>
          <Typography variant="body1" color="text.secondary">
            No booking data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default BookingStatusChart;
