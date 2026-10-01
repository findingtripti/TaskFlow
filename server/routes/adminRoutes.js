// ============================================================
// server/routes/adminRoutes.js
// ============================================================

const express = require('express');
const router = express.Router();

const { getUsers, getAdminStats, toggleUserStatus, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/stats', getAdminStats);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
