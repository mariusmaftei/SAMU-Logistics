import { createSessionStore } from "./database.js";

const isProduction = process.env.NODE_ENV === "production";

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key-for-the-application",
  resave: false,
  saveUninitialized: false,
  store: isProduction ? createSessionStore() : undefined,
  cookie: {
    secure: isProduction, // In production, must be true for sameSite: "none"
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    // Use "lax" in development (works with secure: false on localhost)
    // Use "none" in production (requires secure: true for cross-origin)
    sameSite: isProduction ? "none" : "lax",
    // Firefox ETP compatibility: ensure cookie is properly partitioned
    partitioned: false, // Disable partitioning for better compatibility
  },
  name: "samu-logistics.sid", // Changed to avoid conflicts
  proxy: isProduction,
  // Firefox-specific session options
  rolling: true, // Extend session on activity
  unset: "destroy", // Destroy session on logout
};
