import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch } from '../../Redux/store';

interface HealthCheckWrapperProps {
  children: React.ReactNode;
}

const HealthCheckWrapper: React.FC<HealthCheckWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isHealthy, loading, error, lastChecked } = useSelector((state: RootState) => state.health);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const hasCheckedHealth = useRef<boolean>(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to clear any existing timers
  const clearRedirectTimer = () => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }
  };

  // Check health status only once on mount
  useEffect(() => {
    if (!hasCheckedHealth.current && !lastChecked) {
      dispatch(fetchHealth());
      hasCheckedHealth.current = true;
    }

    // Cleanup timers on unmount
    return () => {
      clearRedirectTimer();
    };
  }, [dispatch, lastChecked]);

  // Determine if redirection is needed based on health status
  useEffect(() => {
    // Skip if still loading or if we haven't checked health yet
    if (loading || !hasCheckedHealth.current) {
      return;
    }

    // Clear any existing redirection timer
    clearRedirectTimer();
    
    // Check health status from Redux store
    if (!isHealthy || error) {
      console.error('Health check failed:', error || 'Service is down');
      
      // Set a timer before redirecting to avoid immediate redirect on transient issues
      redirectTimer.current = setTimeout(() => {
        setShouldRedirect(true);
      }, 1000); // Wait 1 second before redirecting
    }
  }, [isHealthy, loading, error]);

  // If health check fails, redirect to service unavailable page
  if (shouldRedirect) {
    return <Navigate to="/service-unavailable" replace />;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default HealthCheckWrapper; 