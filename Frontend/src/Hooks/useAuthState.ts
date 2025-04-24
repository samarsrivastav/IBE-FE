// src/Hooks/useAuthState.ts

import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import authService from '../../src/Services/authServices';

export const useAuthState = () => {
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check auth context first
      if (auth.isAuthenticated && auth.user) {
        setIsAuthenticated(true);
        setUserProfile(auth.user.profile);
        setLoading(false);
        return;
      }
      
      // If auth context doesn't report as authenticated, check local storage
      const isAuthenticatedFromStorage = authService.isAuthenticated();
      setIsAuthenticated(isAuthenticatedFromStorage);
      
      if (isAuthenticatedFromStorage) {
        const profile = authService.getUserInfo();
        setUserProfile(profile);
        
        // Try silent sign-in if auth context is not authenticated
        if (!auth.isAuthenticated && !auth.isLoading) {
          auth.signinSilent().catch(error => {
            console.error("Silent sign-in failed:", error);
            setIsAuthenticated(false);
            setUserProfile(null);
          });
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [auth.isAuthenticated, auth.isLoading, auth.user]);

  const login = () => {
    auth.signinRedirect();
  };

  const logout = () => {
    auth.removeUser();
    
    // Redirect to Cognito logout
    const clientId = `${import.meta.env.VITE_COGNITO_CLIENT_ID}`;
    const logoutUri = encodeURIComponent(`${import.meta.env.VITE_COGNITO_REDIRECT_URI}`);
    const cognitoDomain = `${import.meta.env.VITE_COGNITO_DOMAIN}`;
    
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  return {
    isAuthenticated,
    userProfile,
    loading,
    login,
    logout,
    // Additional methods you might need
    getAccessToken: authService.getAccessToken,
  };
};

export default useAuthState;