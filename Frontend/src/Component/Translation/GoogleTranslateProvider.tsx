import React, { useEffect } from "react";

// Define interface for window with Google Translate properties
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (options: any, elementId: string) => any;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

interface GoogleTranslateProviderProps {
  children: React.ReactNode;
  language: string;
  setLanguage: (language: string) => void;
}

export const GoogleTranslateProvider: React.FC<GoogleTranslateProviderProps> = ({ 
  children, 
  language, 
  setLanguage
}) => {
  const googleTranslateElementInit = () => {
    if (
      !window.google ||
      !window.google.translate ||
      document.getElementById("google_translate_element")?.childElementCount! > 0
    ) {
      return;
    }
    
    // Clean previous translation cookies
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Get browser language
    const browserLang = (
      navigator.language ||
      (navigator as any).userLanguage ||
      "en"
    ).split("-")[0];
    
    console.log("Browser language detected:", browserLang);
    
    // Initialize translation element
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en", // Default page language
        includedLanguages: "en,es,fr,de,hi,gu", // Customize these languages as needed
        autoDisplay: false,
        gaTrack: false,
      },
      "google_translate_element"
    );
    
    // Set to browser language if available or use the current language
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.dispatchEvent(new Event("change"));
      setTimeout(() => {
        let langToUse = language;
        
        // If no language is explicitly set, try to use browser language
        if (language === "en" && browserLang !== "en") {
          const options = Array.from(select.options);
          const hasLanguage = options.some(option => option.value === browserLang);
          if (hasLanguage) {
            langToUse = browserLang;
            setLanguage(browserLang);
          }
        }
        
        if (langToUse && langToUse !== "en") {
          select.value = langToUse;
          select.dispatchEvent(new Event("change"));
        }
      }, 500);
    }
  };

  // Function to change language programmatically
  const changeLanguage = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      setLanguage(langCode);
    }
  };

  useEffect(() => {
    // Make changeLanguage available globally
    (window as any).changeGoogleTranslateLanguage = changeLanguage;
    
    // Clear existing translation cookies
    document.cookie.split(";").forEach((c: string) => {
      if (c.trim().startsWith("googtrans=")) {
        document.cookie =
          c.trim().split("=")[0] +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    });
    
    // Add meta tag to prevent Google's automatic translation
    const meta = document.createElement("meta");
    meta.name = "google";
    meta.content = "notranslate";
    document.head.appendChild(meta);
    
    // Dynamically add Google Translate script
    if (
      !document.querySelector(
        'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      )
    ) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
    
    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select && language !== "en") {
      select.value = language;
      select.dispatchEvent(new Event("change"));
    }
  }, [language]);

  return (
    <>
      <div 
        id="google_translate_element" 
        style={{ position: "absolute", top: "-1000px", visibility: "hidden" }}
      ></div>
      {children}
    </>
  );
};