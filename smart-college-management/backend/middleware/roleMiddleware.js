const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized. Please login first.",
      });
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;