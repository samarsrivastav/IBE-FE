// propertiesThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProperties = createAsyncThunk(
    'properties/fetchProperties',
    async () => {
      const baseURL = import.meta.env.VITE_PROPERTIES_API_URL + '1'; 
      console.log(baseURL);
      const response = await axios.get(baseURL);

      return response.data;
    }
  );