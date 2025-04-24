// 1. First, update your AuthProvider configuration in index.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import "./index.css";
import * as Sentry from "@sentry/react";
import DynamicTitle from "./Component/DynamicChanges/DynamicTitle.tsx";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";


const cognitoAuthConfig = {
  authority: `${import.meta.env.VITE_COGNITO_AUTHORITY}`,
  client_id: `${import.meta.env.VITE_COGNITO_CLIENT_ID}`,
  redirect_uri: `${import.meta.env.VITE_COGNITO_REDIRECT_URI}`,
  post_logout_redirect_uri: `${import.meta.env.VITE_COGNITO_POST_LOGOUT_REDIRECT_URI}`,
  response_type: "code",
  scope: "phone openid email",
  // Add these settings to ensure persistence:
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  // Use localStorage instead of sessionStorage to persist across browser sessions
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

Sentry.init({
  dsn: `${import.meta.env.VITE_COGNOTO_DSN}`
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <DynamicTitle /> 
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </Provider>   
  </StrictMode>
);