import api from "./api";

const AuthService = {
  /**
   * Check if user is authenticated
   * @returns {Promise<Object>} Authentication status and user data
   */
  checkAuthStatus: async () => {
    try {
      const response = await api.get("/auth/status");
      return response.data;
    } catch (error) {
      console.error("Error checking auth status:", error);
      throw error;
    }
  },

  /**
   * Initiate Google OAuth login
   * Redirects to Google OAuth endpoint
   */
  initiateGoogleLogin: async () => {
    try {
      // Get the base URL from the api instance
      const baseURL = api.defaults.baseURL;

      // Firefox Enhanced Tracking Protection compatibility
      const isFirefox = navigator.userAgent.includes("Firefox");
      if (isFirefox) {
        console.log("Firefox detected - using ETP-compatible login method");
        // For Firefox, we need to ensure the popup/redirect works properly
        // Clear any existing cookies that might interfere
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      }

      // Redirect to Google OAuth endpoint
      window.location.href = `${baseURL}/auth/google`;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    try {
      const response = await api.get("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData Updated profile data
   * @returns {Promise<Object>} Updated user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  /**
   * Update user last login
   * @returns {Promise<Object>} Response
   */
  updateLastLogin: async () => {
    try {
      const response = await api.put("/auth/last-login");
      return response.data;
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  },
};

export default AuthService;
