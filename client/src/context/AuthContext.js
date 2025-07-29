"use client";

import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/auth-service";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    console.log("AuthProvider - Component mounted, checking auth status");
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log("AuthProvider - Checking authentication status...");

      const response = await AuthService.checkAuthStatus();
      console.log("AuthProvider - Auth status response:", response);

      if (response.isAuthenticated && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        console.log("AuthProvider - User authenticated:", response.user.name);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("AuthProvider - User not authenticated");
      }
    } catch (error) {
      console.error("AuthProvider - Auth check failed:", error);
      // Only set to false if it's actually an auth error, not a network error
      if (error.response && error.response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
      }
      // For other errors (like 404), don't change auth state
    } finally {
      setLoading(false);
      console.log("AuthProvider - Auth check completed");
    }
  };

  const login = async () => {
    try {
      console.log("AuthProvider - Initiating Google login...");
      await AuthService.initiateGoogleLogin();
      // The actual login happens via redirect, so we don't need to do anything here
    } catch (error) {
      console.error("AuthProvider - Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("AuthProvider - Logging out...");
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log("AuthProvider - User logged out successfully");
    } catch (error) {
      console.error("AuthProvider - Logout failed:", error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    console.log("AuthProvider - Updating user data:", userData);
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  console.log("AuthProvider - Current state:", {
    isAuthenticated,
    loading,
    userEmail: user?.email,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
