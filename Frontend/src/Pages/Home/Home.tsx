import HomePage from "../../Component/HomePage/HomePage";
import "./Home.scss";
import { useEffect } from "react";
import useAnalytics from "../../Hooks/useAnalytics";
import useHomePageTracking from "../../Hooks/useHomePageTracking";

export const Home = () => {
  const analytics = useAnalytics();
  // Use the specialized home page tracking hook with time tracking enabled
  const { trackHomeInteraction } = useHomePageTracking({ 
    trackTimeSpent: true,
    trackReferrer: true 
  });

  useEffect(() => {
    // Specific tracking for home page (/) visits
    analytics.logEvent('Navigation', 'HomePageVisit', 'Root path (/) visited');
    
    // Track initial load time
    const loadTime = performance.now();
    trackHomeInteraction('PageLoadTime', `Load time: ${Math.round(loadTime)}ms`, Math.round(loadTime));
  }, [analytics, trackHomeInteraction]);

  return (
    <div className="home-container">
      <HomePage />
    </div>
  );
};
