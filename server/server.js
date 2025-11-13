import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import databaseConnect from "./config/database.js";
import { sessionConfig } from "./config/session.js";
import "./config/passport.js";

import authRoute from "./routes/authRoutes.js";
import providerRoute from "./routes/providerRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// CORS configuration
const allowedOrigins = [
  "https://samu-logistics-app.web.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Passport setup
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/entry", providerRoute);

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
