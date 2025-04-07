import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExchangeRates = createAsyncThunk(
    "currency/fetchRates",
    async () => {
      const response = await axios.get(import.meta.env.VITE_EXCHANGE_RATE_API);
      return response.data.rates;
    }
  );