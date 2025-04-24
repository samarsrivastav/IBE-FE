import { trackEvent, trackPageView } from '../utils/analytics';

/**
 * Custom hook for Google Analytics tracking
 */
const useAnalytics = () => {
  /**
   * Track a page view
   * @param path The path to track
   */
  const logPageView = (path?: string) => {
    trackPageView(path);
  };

  /**
   * Track a user interaction event
   * @param category Event category (e.g., 'User', 'Navigation', 'Booking')
   * @param action Event action (e.g., 'Click', 'Submit', 'Search')
   * @param label Optional label for the event
   * @param value Optional numeric value for the event
   */
  const logEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
  ) => {
    trackEvent(category, action, label, value);
  };

  /**
   * Track a booking event
   * @param action The booking action (e.g., 'Started', 'Completed', 'Abandoned')
   * @param bookingId Optional booking ID
   * @param value Optional booking value
   */
  const logBookingEvent = (
    action: string,
    bookingId?: string,
    value?: number
  ) => {
    trackEvent('Booking', action, bookingId, value);
  };

  /**
   * Track a search event
   * @param searchTerm The search term
   * @param resultsCount Number of results
   */
  const logSearchEvent = (searchTerm: string, resultsCount?: number) => {
    trackEvent('Search', 'Performed', searchTerm, resultsCount);
  };

  return {
    logPageView,
    logEvent,
    logBookingEvent,
    logSearchEvent,
  };
};

export default useAnalytics; 