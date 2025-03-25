/**
 * Gets the saved language preference from localStorage
 * @returns The saved language code or null if not found
 */
export const getSavedLanguage = (): string | null => {
    try {
      return localStorage.getItem('preferredLanguage');
    } catch (e) {
      console.error('Error getting saved language:', e);
      return null;
    }
  };
  
  /**
   * Saves the language preference to localStorage
   * @param language The language code to save
   */
  export const saveLanguagePreference = (language: string): void => {
    try {
      localStorage.setItem('preferredLanguage', language);
    } catch (e) {
      console.error('Error saving language preference:', e);
    }
  };
  
  /**
   * Gets the user's browser language
   * @returns The browser language code
   */
  export const getBrowserLanguage = (): string => {
    return (navigator.language || (navigator as any).userLanguage || 'en').split('-')[0];
  };
  
  /**
   * Programmatically changes the Google Translate language
   * @param langCode The language code to switch to
   */
  export const changeGoogleTranslateLanguage = (langCode: string): void => {
    // Check if Google Translate is initialized
    if (!(window as any).changeGoogleTranslateLanguage) {
      console.warn('Google Translate not initialized yet');
      return;
    }
    
    (window as any).changeGoogleTranslateLanguage(langCode);
  };