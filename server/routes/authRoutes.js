import express from "express";
import passport from "passport";
import {
  requireAuth,
  redirectIfAuthenticated,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/google", redirectIfAuthenticated, (req, res, next) => {
  console.log("Initiating Google OAuth flow");
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google OAuth callback received");
    console.log("Query params:", req.query);
    console.log("Session ID:", req.sessionID);
    next();
  },
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Passport authentication error:", err);
        const clientUrl = process.env.CLIENT_URL;
        return res.redirect(
          `${clientUrl}/auth?error=auth_failed&message=${encodeURIComponent(
            "Authentication error occurred"
          )}`
        );
      }

      if (!user) {
        // User was denied access due to email restriction
        console.log("Access denied:", info);
        const clientUrl = process.env.CLIENT_URL;
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
          const clientUrl = process.env.CLIENT_URL;
          return res.redirect(
            `${clientUrl}/auth?error=login_failed&message=${encodeURIComponent(
              "Failed to complete login"
            )}`
          );
        }

        console.log("OAuth success, user:", user.email);
        console.log("User profile image:", user.profileImage);
        console.log("Session after auth:", req.sessionID);

        const clientUrl = process.env.CLIENT_URL;
        req.session.authSuccess = true;

        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
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
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Check authentication status
router.get("/status", (req, res) => {
  console.log("Auth status check:", {
    isAuthenticated: req.isAuthenticated(),
    sessionID: req.sessionID,
    userEmail: req.user?.email,
    userProfileImage: req.user?.profileImage,
    cookies: req.headers.cookie,
    origin: req.headers.origin,
  });

  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
        role: req.user.role,
        lastLogin: req.user.lastLogin,
      },
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null,
    });
  }
});

export default router;
