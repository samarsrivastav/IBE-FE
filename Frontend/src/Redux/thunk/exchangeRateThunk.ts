import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExchangeRates = createAsyncThunk(
    "currency/fetchRates",
    async () => {
      const response = await axios.get("https://v6.exchangerate-api.com/v6/d8cb916f16ed05205f0de610/latest/USD");
      return response.data.conversion_rates;
    }
  );