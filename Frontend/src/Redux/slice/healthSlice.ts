import { createSlice } from '@reduxjs/toolkit';
import { fetchHealth } from '../thunk/healthThunk';

const initialState = {
  health: {} as any,
  loading: false,
  error: null as string | null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealth.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload;
      })
      .addCase(fetchHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

export default healthSlice.reducer;