import axios from "axios";

let DEV_API_URL = "http://localhost:8080";
// let DEV_API_URL = "https://samu-logistics-server.qcpobm.easypanel.host";

const api = axios.create({
  baseURL: DEV_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is crucial for sending cookies/session data
});

// Add request interceptor for debugging and Firefox ETP compatibility
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url
    );

    // Firefox Enhanced Tracking Protection compatibility
    const isFirefox = navigator.userAgent.includes("Firefox");
    if (isFirefox) {
      // Add Firefox-specific headers
      config.headers["Cache-Control"] = "no-cache";
      config.headers["Pragma"] = "no-cache";
      // Ensure credentials are properly handled
      config.withCredentials = true;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
