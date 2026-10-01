// ============================================================
// server/controllers/authController.js
// Handles: register, login, getMe
// ============================================================

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (excluded by default in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/auth/profile ─────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/auth/change-password ────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
