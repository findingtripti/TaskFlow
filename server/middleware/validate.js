// ============================================================
// server/middleware/validate.js
// Input validation middleware using express-validator
// ============================================================

const { validationResult } = require('express-validator');

// Runs after express-validator checks and returns errors if any
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // Return the first error message
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { handleValidationErrors };
