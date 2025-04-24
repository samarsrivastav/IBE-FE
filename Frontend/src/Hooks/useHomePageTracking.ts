import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAnalytics from './useAnalytics';

/**
 * Custom hook specifically for tracking home page visits
 * @param options Additional tracking options
 */
const useHomePageTracking = (options?: { 
  trackTimeSpent?: boolean; 
  trackReferrer?: boolean;
}) => {
  const location = useLocation();
  const analytics = useAnalytics();
  const isHomePage = location.pathname === '/';
  
  // Track when home page is visited
  useEffect(() => {
    if (isHomePage) {
      const timestamp = new Date().toISOString();
      const referrer = document.referrer || 'direct';
      
      analytics.logEvent(
        'HomePage', 
        'Visit', 
        `Home page visited at ${timestamp}`
      );
      
      // Track the referrer if enabled
      if (options?.trackReferrer) {
        analytics.logEvent('HomePage', 'Referrer', referrer);
      }
      
      // Set up time tracking if enabled
      if (options?.trackTimeSpent) {
        const startTime = Date.now();
        
        // Track time spent when leaving the page
        return () => {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          analytics.logEvent(
            'HomePage',
            'TimeSpent',
            `Time spent on home page: ${timeSpent} seconds`,
            timeSpent
          );
        };
      }
    }
  }, [isHomePage, analytics, options]);
  
  // Return useful tracking functions
  return {
    /**
     * Track a specific home page interaction
     */
    trackHomeInteraction: (action: string, label?: string, value?: number) => {
      if (isHomePage) {
        analytics.logEvent('HomePage', action, label, value);
      }
    }
  };
};

export default useHomePageTracking; 