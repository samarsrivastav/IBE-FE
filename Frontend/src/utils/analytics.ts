import ReactGA from 'react-ga4';

/**
 * Initialize Google Analytics with your tracking ID
 * @param trackingId Your Google Analytics tracking ID
 */
export const initGA = (trackingId: string): void => {
  // Only initialize in production or if explicitly enabled
  if (import.meta.env.VITE_GA_TRACKING_ID || import.meta.env.VITE_ENABLE_GA === 'true') {
    ReactGA.initialize(trackingId);
    console.log('Google Analytics has been initialized');
  } else {
    console.log('Google Analytics not initialized in development mode');
  }
};

/**
 * Track a page view
 * @param path The path to track (defaults to current path)
 */
export const trackPageView = (path?: string): void => {
  const pagePath = path || window.location.pathname + window.location.search;
  ReactGA.send({ hitType: 'pageview', page: pagePath });
};

/**
 * Track an event
 * @param category Event category
 * @param action Event action
 * @param label Optional event label
 * @param value Optional event value
 */
export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
): void => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}; 