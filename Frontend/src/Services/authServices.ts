// src/Services/authService.ts
import { User } from "oidc-client-ts";

// Helper functions for authentication
export const authService = {
  // Check if tokens are valid and user is authenticated
  isAuthenticated: () => {
    const userKeys = Object.keys(localStorage).filter(key => key.startsWith('oidc.'));
    console.log('isAuthenticated check:', { 
      userKeys,
      hasUser: userKeys.length > 0
    });
    return userKeys.length > 0;
  },
  
  // Get access token
  getAccessToken: () => {
    const userKeys = Object.keys(localStorage).filter(key => key.startsWith('oidc.'));
    console.log('getAccessToken check:', { 
      userKeys,
      hasUser: userKeys.length > 0
    });
    
    if (userKeys.length === 0) return null;
    
    // Get the most recent user data
    const userStr = localStorage.getItem(userKeys[0]);
    if (!userStr) return null;
    
    const user: User = JSON.parse(userStr);
    return user.access_token;
  },
  
  // Get user info from token
  getUserInfo: () => {
    const userKeys = Object.keys(localStorage).filter(key => key.startsWith('oidc.'));
    console.log('getUserInfo check:', { 
      userKeys,
      hasUser: userKeys.length > 0
    });
    
    if (userKeys.length === 0) return null;
    
    // Get the most recent user data
    const userStr = localStorage.getItem(userKeys[0]);
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  },

  refreshToken: async () => {
    try {
      const userKeys = Object.keys(localStorage).filter(key => key.startsWith('oidc.'));
      console.log('refreshToken check:', { 
        userKeys,
        hasUser: userKeys.length > 0,
        localStorageKeys: Object.keys(localStorage)
      });
      
      if (userKeys.length === 0) {
        console.log('No user found in localStorage');
        return null;
      }
      
      // Get the most recent user data
      const userStr = localStorage.getItem(userKeys[0]);
      if (!userStr) return null;
      
      const user: User = JSON.parse(userStr);
      const now = Math.floor(Date.now() / 1000);
      
      console.log('Token refresh check:', {
        currentTime: new Date(now * 1000).toLocaleString(),
        tokenExpiry: user.expires_at ? new Date(user.expires_at * 1000).toLocaleString() : 'No expiry set',
        refreshToken: user.refresh_token ? 'Present' : 'Missing',
        userData: {
          access_token: user.access_token ? 'Present' : 'Missing',
          id_token: user.id_token ? 'Present' : 'Missing',
          expires_at: user.expires_at
        }
      });
      
      // If token is expired or will expire in the next 5 minutes
      if (user.expires_at && user.expires_at <= now + 300) {
        console.log('Token needs refresh, attempting to refresh...');
        
        if (!user.refresh_token) {
          console.error('No refresh token available');
          return null;
        }

        // Use the refresh token to get a new access token
        const response = await fetch('https://ap-south-1ighz9oobg.auth.ap-south-1.amazoncognito.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: '3f2gia86f7p8shj66jfok9p3co',
            refresh_token: user.refresh_token,
          }).toString(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Token refresh failed:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          return null;
        }

        const data = await response.json();
        console.log('Token refresh successful:', {
          newExpiry: new Date((now + data.expires_in) * 1000).toLocaleString(),
          tokenType: data.token_type,
          scope: data.scope
        });
        
        // Update the user object with new tokens
        const updatedUser = {
          ...user,
          access_token: data.access_token,
          id_token: data.id_token,
          expires_at: now + data.expires_in,
        };

        // Save the updated user with the same key
        localStorage.setItem(userKeys[0], JSON.stringify(updatedUser));
        return updatedUser.id_token;
      }

      console.log('Token still valid, no refresh needed');
      return user.id_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  // Add this method to check token validity before making API calls
  getValidToken: async () => {
    console.log('Getting valid token...');
    const token = await authService.refreshToken();
    if (!token) {
      console.log('No valid token available, clearing user data');
      // Clear all oidc related data
      Object.keys(localStorage)
        .filter(key => key.startsWith('oidc.'))
        .forEach(key => localStorage.removeItem(key));
      return null;
    }
    console.log('Valid token obtained');
    return token;
  }
};

export default authService;