import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setPromoCode, setLoading, setError } from '../slice/promoCodeSlice';

interface PromoCodeRequest {
  usageDate: string;
}

export const validatePromoCode = createAsyncThunk(
  'promoCode/validate',
  async ({ code, usageDate }: { code: string; usageDate: string }, { dispatch }) => {
    const URL = `${import.meta.env.VITE_PROMOCODE_API_URL}${code}`;
    console.log(URL);
    try {
      dispatch(setLoading(true));
      const response = await axios.post<{
        id: number;
        name: string;
        description: string;
        title: string;
        discount: number;
        promoType: string;
      }>(URL, { usageDate });
      
      dispatch(setPromoCode(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate promo code';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
