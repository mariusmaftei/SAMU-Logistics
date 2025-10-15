import User from "../models/User.js";

// @desc    Get current user profile
// @route   GET /auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage, // Make sure this is included
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Logout user
// @route   POST /auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({
          success: false,
          error: "Error during logout",
        });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({
            success: false,
            error: "Error destroying session",
          });
        }

        // Clear the session cookie explicitly for Firefox compatibility
        const isFirefox =
          req.headers["user-agent"] &&
          req.headers["user-agent"].includes("Firefox");

        res.clearCookie("samu-logistics.sid", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none", // Consistent with session config
          partitioned: false,
          // Firefox ETP specific settings
          ...(isFirefox && {
            priority: "high",
          }),
        });

        // Firefox ETP compatibility: add additional headers for logout
        if (isFirefox) {
          res.header("Cache-Control", "no-cache, no-store, must-revalidate");
          res.header("Pragma", "no-cache");
          res.header("Expires", "0");
        }

        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      });
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Check authentication status
// @route   GET /auth/status
// @access  Public
export const getAuthStatus = (req, res) => {
  try {
    console.log("Auth status check:", {
      isAuthenticated: req.isAuthenticated(),
      sessionID: req.sessionID,
      userEmail: req.user?.email,
      userProfileImage: req.user?.profileImage,
      cookies: req.headers.cookie,
      origin: req.headers.origin,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer,
      sessionCookie: req.session.cookie,
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
  } catch (error) {
    console.error("Error checking auth status:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const users = await User.find().select("-googleId");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update user role (admin only)
// @route   PUT /auth/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-googleId");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
