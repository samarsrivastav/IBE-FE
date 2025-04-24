import { createSlice } from '@reduxjs/toolkit';
import { fetchHealth } from '../thunk/healthThunk';

interface HealthState {
  health: {
    status?: string;
    components?: Record<string, { status: string }>;
  } | null;
  loading: boolean;
  error: string | null;
  isHealthy: boolean;
  lastChecked: number | null;
}

const initialState: HealthState = {
  health: null,
  loading: false,
  error: null,
  isHealthy: true, // Assume healthy until proven otherwise
  lastChecked: null
};

// Helper function to determine if health status is UP
const determineHealthStatus = (health: any): boolean => {
  if (!health) return false;
  
  // Check main health status
  if (health.status !== 'UP') return false;
  
  // If there are component health statuses, check those too
  if (health.components) {
    return Object.values(health.components).every(
      (component: any) => component.status === 'UP'
    );
  }
  
  return true;
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload;
        state.isHealthy = determineHealthStatus(action.payload);
        state.lastChecked = Date.now();
        
        if (!state.isHealthy) {
          console.warn('Health status is not UP', action.payload);
        }
      })
      .addCase(fetchHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
        state.isHealthy = false;
        state.lastChecked = Date.now();
        console.error('Health check failed', action.error);
      });
  },
});

export default healthSlice.reducer;