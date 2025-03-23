import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchPropertiesRate = createAsyncThunk(
    'propertiesRate/fetchPropertiesRate',
    async (propertyId: string) => {
      const baseURL = import.meta.env.VITE_PROPERTIESRATE_API_URL + propertyId;
      const response = await axios.get(baseURL);

      return response.data; 
    }
);