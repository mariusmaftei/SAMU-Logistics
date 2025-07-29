import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/styles/global.css";
import { FormEntriesProvider } from "./context/FormEntriesContext";
import { AuthProvider } from "./context/AuthContext";
import { ZoomProvider } from "./context/ZoomContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ZoomProvider>
        <FormEntriesProvider>
          <App />
        </FormEntriesProvider>
      </ZoomProvider>
    </AuthProvider>
  </React.StrictMode>
);
