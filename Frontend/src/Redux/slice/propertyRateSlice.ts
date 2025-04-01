// propertiesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchPropertiesRate } from '../thunk/propertyRateThunk';

interface PropertyRate{
  date : string;
  value : number;
}

const initialState = {
  property: [] as PropertyRate[],
  loading: false,
  error: null as string | null,
};

const propertiesSlice = createSlice({
  name: 'propertiesRate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchPropertiesRate.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchPropertiesRate.fulfilled, (state, action) => {
       state.property = action.payload;
     })
     .addCase(fetchPropertiesRate.rejected, (state, action) => {
       state.error = action.error.message || 'An unknown error occurred';
     });  
  },
});

export default propertiesSlice.reducer;
export const {} = propertiesSlice.actions;