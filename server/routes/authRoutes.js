import express from "express";
import passport from "passport";
import {
  requireAuth,
  redirectIfAuthenticated,
} from "../middleware/authMiddleware.js";
import { getAuthStatus } from "../controllers/authController.js";

const router = express.Router();

router.get("/google", redirectIfAuthenticated, (req, res, next) => {
  console.log("Initiating Google OAuth flow");
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Session ID before auth:", req.sessionID);

  // Ensure session is saved before redirect (Firefox compatibility)
  req.session.save((err) => {
    if (err) {
      console.error("Error saving session before OAuth:", err);
    }

    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  });
});

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google OAuth callback received");
    console.log("Query params:", req.query);
    console.log("Session ID:", req.sessionID);
    console.log("User-Agent:", req.headers["user-agent"]);
    console.log("Cookies:", req.headers.cookie);
    console.log("Origin:", req.headers.origin);
    next();
  },
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Passport authentication error:", err);
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        return res.redirect(
          `${clientUrl}/auth?error=auth_failed&message=${encodeURIComponent(
            "Authentication error occurred"
          )}`
        );
      }

      if (!user) {
        // User was denied access due to email restriction
        console.log("Access denied:", info);
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const message =
          info?.message ||
          "Access denied. You are not authorized to access this application.";
        const email = info?.email || "unknown";

        return res.redirect(
          `${clientUrl}/unauthorized?email=${encodeURIComponent(
            email
          )}&message=${encodeURIComponent(message)}`
        );
      }

      // Login the user
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error logging in user:", err);
          const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
          return res.redirect(
            `${clientUrl}/auth?error=login_failed&message=${encodeURIComponent(
              "Failed to complete login"
            )}`
          );
        }

        console.log("OAuth success, user:", user.email);
        console.log("User profile image:", user.profileImage);
        console.log("Session after auth:", req.sessionID);
        console.log("Session cookie:", req.session.cookie);

        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        req.session.authSuccess = true;

        // Firefox-specific: Ensure session is properly saved and cookie is set
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
          }

          // Additional Firefox compatibility: explicitly set cookie headers
          const isFirefox =
            req.headers["user-agent"] &&
            req.headers["user-agent"].includes("Firefox");

          res.cookie("samu-logistics.sid", req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none", // Consistent with session config
            maxAge: 24 * 60 * 60 * 1000,
            // Firefox ETP specific settings
            partitioned: false,
            // Add additional headers for Firefox
            ...(isFirefox && {
              // Firefox-specific cookie attributes
              priority: "high",
            }),
          });

          // Firefox ETP compatibility: add additional headers
          if (isFirefox) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");
          }

          console.log("Redirecting to:", `${clientUrl}/`);
          res.redirect(`${clientUrl}/`);
        });
      });
    })(req, res, next);
  }
);

// Logout user
router.get("/logout", requireAuth, (req, res) => {
  console.log("Logout requested for user:", req.user?.email);

  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error during logout" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error destroying session" });
      }

      console.log("User logged out successfully");

      // Clear the session cookie explicitly for Firefox compatibility
      res.clearCookie("samu-logistics.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", // Consistent with session config
      });

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Check authentication status
router.get("/status", getAuthStatus);

export default router;
