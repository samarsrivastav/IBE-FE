import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Home } from "./Pages/Home/Home";
import { Checkout } from "./Pages/Checkout/Checkout";
import { Footer } from "./Component/Footer/Footer";
import { Navbar } from "./Component/Navbar/Navbar";
import { useState } from "react";
import DynamicBackground from "./Component/DynamicChanges/DynamicBackground";
import { GoogleTranslateProvider } from "./Component/Translation/GoogleTranslateProvider";

function App() {
  const [language, setLanguage] = useState<string>("en");
  
  return (
    <GoogleTranslateProvider language={language} setLanguage={setLanguage}>
      <HashRouter>
        <div className="app-container">
          <Navbar language={language} setLanguage={setLanguage} />
          <DynamicBackground />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </GoogleTranslateProvider>
  );
}

export default App;