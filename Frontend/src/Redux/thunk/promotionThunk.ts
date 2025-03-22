import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchPromotionRate = createAsyncThunk(
    'promotion/fetchPromotion',
    async () => {
      const baseURL = import.meta.env.VITE_PROMOTION_API_URL  + '1';
      console.log("API URL:", import.meta.env.VITE_PROMOTION_API_URL + '1');

      const response = await axios.get(baseURL);

      return response.data; 
    }
);