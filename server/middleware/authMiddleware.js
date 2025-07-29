export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // For API requests, return JSON error instead of redirecting
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      redirectTo: "/auth",
    });
  }

  // For non-API requests, redirect to auth
  res.redirect(`${process.env.CLIENT_URL}/auth`);
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  if (req.path.startsWith("/api/")) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  res.status(403).send("Admin access required");
};

export const optionalAuth = (req, res, next) => {
  next();
};

export const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(`${process.env.CLIENT_URL}/samu-logistics`);
  }
  next();
};
