// ============================================================
// server/middleware/admin.js
// Role-based authorization middleware
// Must be used AFTER protect middleware
// ============================================================

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = { authorize };
