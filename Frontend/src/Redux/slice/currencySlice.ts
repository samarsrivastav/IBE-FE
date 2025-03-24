import { createSlice } from "@reduxjs/toolkit";
import { fetchExchangeRates } from "../thunk/exchangeRateThunk";

interface CurrencyState {
  currency: string;
  exchangeRates: Record<string, number>;
  loading: boolean;
}

const storedCurrency = localStorage.getItem("selectedCurrency") || "usd";

const initialState: CurrencyState = {
  currency: storedCurrency,
  exchangeRates: {},
  loading: false,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("selectedCurrency", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload;
        state.loading = false;
      });
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
