import { getSavedLanguage, saveLanguagePreference, getBrowserLanguage, changeGoogleTranslateLanguage } from "./languageUtils"; 

describe('Language Utility Functions', () => {
  beforeEach(() => {
    // Clear the localStorage before each test
    localStorage.clear();
  });

  test('getSavedLanguage returns null when no language is saved', () => {
    // Initially, there is no language saved in localStorage
    const language = getSavedLanguage();
    expect(language).toBeNull();
  });

  test('getSavedLanguage returns the saved language when it exists', () => {
    // Save a language to localStorage
    localStorage.setItem('preferredLanguage', 'fr');
    
    const language = getSavedLanguage();
    expect(language).toBe('fr');
  });

  test('saveLanguagePreference saves the language correctly', () => {
    // Save a language
    saveLanguagePreference('es');
    
    // Retrieve the saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    expect(savedLanguage).toBe('es');
  });

  test('getBrowserLanguage returns the browser language code', () => {
    // Mocking navigator.language for different browsers
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
    });

    const browserLanguage = getBrowserLanguage();
    expect(browserLanguage).toBe('en');
  });
 
});
