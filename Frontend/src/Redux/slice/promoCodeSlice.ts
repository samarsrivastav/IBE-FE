import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PromoCode {
  id: number;
  name: string;
  description: string;
  title: string;
  discount: number;
  promoType: string;
}

interface PromoCodeState {
  promoCode: PromoCode | null;
  loading: boolean;
  error: string | null;
}

const initialState: PromoCodeState = {
  promoCode: null,
  loading: false,
  error: null,
};

const promoCodeSlice = createSlice({
  name: 'promoCode',
  initialState,
  reducers: {
    setPromoCode: (state, action: PayloadAction<PromoCode>) => {
      console.log(action.payload);
      state.promoCode = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.promoCode = null;
    },
    clearPromoCode: (state) => {
      state.promoCode = null;
      state.error = null;
    },
  },
});

export const { setPromoCode, setLoading, setError, clearPromoCode } = promoCodeSlice.actions;
export default promoCodeSlice.reducer;
