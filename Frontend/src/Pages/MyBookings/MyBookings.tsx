// src/Pages/MyBookings/MyBookings.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { fetchMyBookings } from '../../Redux/thunk/bookingThunk';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  CardMedia
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import styles from './MyBookings.module.scss';

const MyBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedBookings, setExpandedBookings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleExpandClick = (bookingId: string) => {
    setExpandedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => dispatch(fetchMyBookings())}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              No Bookings Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't made any bookings yet. Start exploring our properties!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontFamily: "'Lato', sans-serif",
          fontWeight: 700,
          color: '#26266D',
          textTransform: 'uppercase',
          letterSpacing: '2%'
        }}
      >
        My Bookings
      </Typography>
      
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.confirmationId}>
            <Card className={styles.bookingCard}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom
                        sx={{
                          fontFamily: "'Lato', sans-serif",
                          fontWeight: 700,
                          color: '#26266D'
                        }}
                      >
                        {booking.bookingDetails.confirmationDetails.roomName}
                      </Typography>
                      <Chip
                        label={
                          !booking.active ? 'Cancelled' :
                          new Date(booking.bookingDetails.confirmationDetails.endDate) < new Date() ? 'Completed' :
                          'Active'
                        }
                        color={
                          !booking.active ? 'error' :
                          new Date(booking.bookingDetails.confirmationDetails.endDate) < new Date() ? 'default' :
                          'success'
                        }
                        size="small"
                        sx={{ 
                          mb: 1,
                          fontFamily: "'Lato', sans-serif",
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                          Check-in
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                          {format(new Date(booking.bookingDetails.confirmationDetails.startDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                          Check-out
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                          {format(new Date(booking.bookingDetails.confirmationDetails.endDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                          Guests
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                          {booking.bookingDetails.confirmationDetails.adultCount} Adults
                          {booking.bookingDetails.confirmationDetails.childCount > 0 && 
                            `, ${booking.bookingDetails.confirmationDetails.childCount} Children`}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                          Total Cost
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#26266D' }}>
                          ${booking.bookingDetails.confirmationDetails.totalCost.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                      {booking.active && (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => navigate(`/confirmation-page/${booking.confirmationId}`)}
                          sx={{
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: 700,
                            textTransform: 'none',
                            backgroundColor: '#26266D',
                            '&:hover': {
                              backgroundColor: '#1A1A47'
                            }
                          }}
                        >
                          View Confirmation
                        </Button>
                      )}
                      <Box sx={{ mt: booking.active ? 2 : 0 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={() => handleExpandClick(booking.confirmationId)}
                          endIcon={expandedBookings[booking.confirmationId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: 700,
                            textTransform: 'none',
                            borderColor: '#26266D',
                            '&:hover': {
                              borderColor: '#1A1A47'
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Collapse in={expandedBookings[booking.confirmationId]}>
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={booking.bookingDetails.imageUrl}
                          alt={booking.bookingDetails.confirmationDetails.roomName}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#26266D' }}>
                          Booking Details
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Confirmation Number
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            {booking.confirmationId}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Room Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            {booking.bookingDetails.confirmationDetails.roomName}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Number of Rooms
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            {booking.bookingDetails.confirmationDetails.roomCount}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#26266D' }}>
                          Price Breakdown
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Nightly Rate
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            ${booking.bookingDetails.confirmationDetails.nightlyRate.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Subtotal
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            ${booking.bookingDetails.confirmationDetails.subTotal.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            Taxes
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            ${booking.bookingDetails.confirmationDetails.taxes.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                            VAT
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}>
                            ${booking.bookingDetails.confirmationDetails.vat.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif" }}>
                    Booked on: {format(new Date(), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyBookings;