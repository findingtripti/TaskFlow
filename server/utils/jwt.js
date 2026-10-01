// ============================================================
// server/utils/jwt.js
// JWT token generation utility
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for the given user id.
 * @param {string} id  - MongoDB user _id
 * @returns {string} JWT token string
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { generateToken };
