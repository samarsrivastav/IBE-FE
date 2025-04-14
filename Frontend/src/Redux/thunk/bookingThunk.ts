// src/Redux/thunk/bookingThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../Services/authServices';
import axios from 'axios';

interface BookingDetails {
  imageUrl: string;
  billingInfo: {
    city: string | null;
    email: string;
    state: string | null;
    country: string | null;
    zipCode: string | null;
    lastName: string;
    firstName: string;
    phoneNumber: string;
    mailingAddress1: string | null;
    mailingAddress2: string | null;
  };
  paymentInfo: {
    cardNumber: string;
    expiryYear: number;
    expiryMonth: number;
  };
  currentIndex: number;
  travelerInfo: {
    email: string;
    lastName: string;
    firstName: string;
    phoneNumber: string;
  };
  specialOffers: boolean;
  termsAndPolicies: boolean;
  confirmationDetails: {
    vat: number;
    taxes: number;
    endDate: string;
    roomName: string;
    subTotal: number;
    roomCount: number;
    startDate: string;
    totalCost: number;
    adultCount: number;
    childCount: number;
    guestCount: number[];
    propertyId: number;
    roomTypeId: number;
    nightlyRate: number;
    promotionTitle: string | null;
    amountDueAtResort: number;
  };
}

interface Booking {
  confirmationId: string;
  bookingDetails: BookingDetails;
  active: boolean;
}

// Fetch all bookings for the current user
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = await authService.getValidToken();
      console.log('Token:', token);
      
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const baseURL = `${import.meta.env.VITE_MYBOOKING_API_URL}`;

      const response = await axios.get(baseURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          return rejectWithValue(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          return rejectWithValue('No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          return rejectWithValue(error.message);
        }
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch bookings');
    }
  }
);

export default {
  fetchMyBookings,
  // fetchBookingById
};

export type { Booking };