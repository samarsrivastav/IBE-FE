import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import "./index.css";
import * as Sentry from "@sentry/react";
import DynamicTitle from "./Component/DynamicChanges/DynamicTitle.tsx";

Sentry.init({
  dsn: "https://e873f7483fd284536a56c3a3cd8e5d0d@o4508978343641088.ingest.us.sentry.io/4508978356617216"
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Provider store={store}>
      <DynamicTitle /> 
        <App />
      </Provider>   
  </StrictMode>
);