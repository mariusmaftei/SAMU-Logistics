import { createSessionStore } from "./database.js";

const isProduction = process.env.NODE_ENV === "production";

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key-for-the-application",
  resave: false,
  saveUninitialized: false,
  store: isProduction ? createSessionStore() : undefined,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none", // Use "none" for cross-origin requests to work in Chrome/Firefox
    // Firefox ETP compatibility: ensure cookie is properly partitioned
    partitioned: false, // Disable partitioning for better compatibility
  },
  name: "samu-logistics.sid", // Changed to avoid conflicts
  proxy: isProduction,
  // Firefox-specific session options
  rolling: true, // Extend session on activity
  unset: "destroy", // Destroy session on logout
};
