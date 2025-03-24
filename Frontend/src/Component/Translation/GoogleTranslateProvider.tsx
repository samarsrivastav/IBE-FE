import React, { useEffect } from "react";
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
  
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      localStorage.setItem("selectedLanguage", language);
    }
  }, []);

  const googleTranslateElementInit = () => {
    if (
      !window.google ||
      !window.google.translate ||
      document.getElementById("google_translate_element")?.childElementCount! > 0
    ) {
      return;
    }

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    const browserLang = (
      navigator.language ||
      (navigator as any).userLanguage ||
      "en"
    ).split("-")[0];

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,es,fr,de,hi,gu",
        autoDisplay: false,
        gaTrack: false,
      },
      "google_translate_element"
    );

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.dispatchEvent(new Event("change"));
      setTimeout(() => {
        let langToUse = localStorage.getItem("selectedLanguage") || language;

        if (langToUse === "en" && browserLang !== "en") {
          const options = Array.from(select.options);
          if (options.some(option => option.value === browserLang)) {
            langToUse = browserLang;
            setLanguage(browserLang);
            localStorage.setItem("selectedLanguage", browserLang);
          }
        }

        if (langToUse !== "en") {
          select.value = langToUse;
          select.dispatchEvent(new Event("change"));
        }
      }, 500);
    }
  };

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      setLanguage(langCode);
      localStorage.setItem("selectedLanguage", langCode);
    }
  };

  useEffect(() => {
    (window as any).changeGoogleTranslateLanguage = changeLanguage;

    document.cookie.split(";").forEach((c: string) => {
      if (c.trim().startsWith("googtrans=")) {
        document.cookie =
          c.trim().split("=")[0] +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    });

    const meta = document.createElement("meta");
    meta.name = "google";
    meta.content = "notranslate";
    document.head.appendChild(meta);

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
        style={{height:0 }}
      ></div>
      {children}
    </>
  );
};
