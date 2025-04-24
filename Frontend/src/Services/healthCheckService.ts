import { store } from '../Redux/store';
import { fetchHealth } from '../Redux/thunk/healthThunk';

let healthCheckInterval: NodeJS.Timeout | null = null;
const HEALTH_CHECK_INTERVAL = 60000; // Check every 60 seconds

// Function to check if health status is UP using the Redux store
const isHealthy = (): boolean => {
  const state = store.getState();
  return state.health.isHealthy;
};

// Start periodic health checks
export const startHealthCheck = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Perform an initial health check if not already done
  const state = store.getState();
  if (state.health.lastChecked === null) {
    store.dispatch(fetchHealth());
  }
  
  // Set up recurring health checks
  healthCheckInterval = setInterval(() => {
    console.log('Performing periodic health check');
    store.dispatch(fetchHealth());
    
    // If service is unhealthy, redirect to service unavailable page
    if (!isHealthy() && window.location.pathname !== '/service-unavailable') {
      console.error('Health check failed, redirecting to service unavailable page');
      window.location.href = '/#/service-unavailable';
    }
  }, HEALTH_CHECK_INTERVAL);
};

// Stop health checks
export const stopHealthCheck = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
};

// Check current health status
export const checkCurrentHealth = (): boolean => {
  return isHealthy();
}; 