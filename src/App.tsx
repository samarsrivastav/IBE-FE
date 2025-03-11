import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IntlProvider } from "react-intl";
import "./App.scss";
import { Home } from "./Pages/Home/Home";
import { Checkout } from "./Pages/Checkout/Checkout";
import { Footer } from "./Component/Footer/Footer";
import { Navbar } from "./Component/Navbar/Navbar";
import { useState } from "react";
import {  messages } from "./Constant/language/i18n";
function App() {
  const [locale, setLocale] = useState<string>("en");
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
      <Navbar locale={locale} setLocale={setLocale} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
