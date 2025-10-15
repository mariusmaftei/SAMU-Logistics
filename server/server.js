import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import databaseConnect from "./config/database.js";
import { sessionConfig } from "./config/session.js";
import "./config/passport.js";

import authRoute from "./routes/authRoutes.js";
import entryRoute from "./routes/entry.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// CORS configuration - Fixed to work with credentials and Firefox
const allowedOrigins = [
  "https://samu-logistics-app.web.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // This is crucial for cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
      "User-Agent", // Firefox ETP compatibility
      "Cache-Control",
      "Pragma",
    ],
    exposedHeaders: [
      "Set-Cookie", // Expose Set-Cookie header for cross-origin requests
      "Cache-Control", // Firefox ETP compatibility
      "Pragma",
      "Expires",
    ],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    preflightContinue: false, // Firefox compatibility
    // Firefox ETP specific options
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Passport setup
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Additional middleware for cross-origin cookie handling and Firefox ETP compatibility
app.use((req, res, next) => {
  // Ensure cookies are properly handled for cross-origin requests
  if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  // Firefox Enhanced Tracking Protection compatibility headers
  res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");

  // Content Security Policy to prevent tracking protection issues
  res.header(
    "Content-Security-Policy",
    "default-src 'self' https://samu-logistics-app.web.app https://samu-logistics-server.qcpobm.easypanel.host https://accounts.google.com; " +
      "script-src 'self' 'unsafe-inline' https://accounts.google.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://samu-logistics-server.qcpobm.easypanel.host https://accounts.google.com; " +
      "frame-src https://accounts.google.com;"
  );

  next();
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user ? { id: req.user._id, name: req.user.name } : null,
    sessionID: req.sessionID,
  });
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "SAMU-Logistics API",
    message: "The SAMU-Logistics backend service is up and running.",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    user: req.user
      ? {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        }
      : null,
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
  });
});

// Routes
app.use("/auth", authRoute);
app.use("/api/entry", entryRoute); // Fixed: Added /api prefix

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Launch server
const server = () => {
  try {
    databaseConnect();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

server();
