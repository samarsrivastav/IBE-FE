// propertiesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchProperties } from '../thunk/propertiesThunk';
import { listProperties } from '../../types';

const initialState = {
  property: {} as listProperties ,
  loading: false,
  error: null as string | null, 
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

export const { } = propertiesSlice.actions;
export default propertiesSlice.reducer;
