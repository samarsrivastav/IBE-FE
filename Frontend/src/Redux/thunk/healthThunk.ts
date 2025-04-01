import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHealth = createAsyncThunk(
  'health/fetchHealth',
  async () => {
    const baseURL = import.meta.env.VITE_HEALTH_API_URL; 
    const response = await axios.get(baseURL);

    return response.data;
  }
);

