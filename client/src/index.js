import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/styles/global.css";
import { FormEntriesProvider } from "./context/FormEntriesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FormEntriesProvider>
 
      <App />
 
    </FormEntriesProvider>
  </React.StrictMode>
);
