// ============================================================
// server/routes/authRoutes.js
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

// Register validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Login validation rules
const loginRules = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post('/register', registerRules, handleValidationErrors, register);
router.post('/login', loginRules, handleValidationErrors, login);

// Protected routes (require JWT)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
