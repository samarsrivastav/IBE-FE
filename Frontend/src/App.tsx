import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import { Home } from "./Pages/Home/Home";
import { Checkout } from "./Pages/Checkout/Checkout";
import { Footer } from "./Component/Footer/Footer";
import { Navbar } from "./Component/Navbar/Navbar";
import { useState, useEffect } from "react";
import DynamicBackground from "./Component/DynamicChanges/DynamicBackground";
import { GoogleTranslateProvider } from "./Component/Translation/GoogleTranslateProvider";
import RoomResults from "./Pages/Properties/RoomResults";
import BookingSummaryPage from "./Pages/BookingSummaryPage/BookingSummaryPage";
import UnsupportedScreenWidth from "./Component/UnsupportedScreenWidth/UnsupportedScreenWidth";
import PageNotFound from "./Component/PageNotFound/PageNotFound";
import MyBookings from "./Pages/MyBookings/MyBookings";
import { initGA, trackPageView } from "./utils/analytics";
import ServiceUnavailable from "./Component/ServiceUnavailable/ServiceUnavailable";
import HealthCheckWrapper from "./Component/HealthCheckWrapper/HealthCheckWrapper";
import { startHealthCheck, stopHealthCheck } from "./Services/healthCheckService";

function AppContent() {
  const [language, setLanguage] = useState<string>("en");
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    trackPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth < 352) {
    return <UnsupportedScreenWidth />;
  }

  // Service unavailable page doesn't need health check wrapper or navbar/footer
  if (location.pathname === '/service-unavailable') {
    return <ServiceUnavailable />;
  }

  return (
    <HealthCheckWrapper>
      <div className="app-container">
        <Navbar language={language} setLanguage={setLanguage} />
        {location.pathname === '/' && <DynamicBackground />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/property" element={<RoomResults />} />
            <Route path="/confirmation-page/:bookingId" element={<BookingSummaryPage/>}/>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/service-unavailable" element={<ServiceUnavailable />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HealthCheckWrapper>
  );
}

function App() {
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    // Initialize Google Analytics with your tracking ID
    initGA(import.meta.env.VITE_GA_TRACKING_ID);
    
    // Start periodic health checks
    startHealthCheck();
    
    // Cleanup on component unmount
    return () => {
      stopHealthCheck();
    };
  }, []);

  return (
    <GoogleTranslateProvider language={language} setLanguage={setLanguage}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </GoogleTranslateProvider>
  );
}

export default App;