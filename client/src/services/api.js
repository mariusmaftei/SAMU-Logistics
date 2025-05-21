import axios from "axios";

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging or authentication
api.interceptors.request.use(
  (config) => {
    // You could add auth tokens here in the future
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("API No Response:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
