import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import "./index.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://362abf2c25ab4849cb5b1b0391545db2@o4508975191162880.ingest.us.sentry.io/4508975198568448"
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
      <Provider store={store}>
        <App />
      </Provider>
    
  </StrictMode>
);