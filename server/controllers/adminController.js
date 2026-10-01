// ============================================================
// server/controllers/adminController.js
// Admin-only endpoints: user management, global statistics
// All routes require protect + authorize('admin') middleware
// ============================================================

const User = require('../models/User');
const Task = require('../models/Task');

// ── GET /api/admin/users ─────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/admin/stats ─────────────────────────────────────
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ priority: 'High' }),
    ]);

    // Top 5 most active users (by task count)
    const topUsers = await Task.aggregate([
      { $group: { _id: '$user', taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          taskCount: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
        },
      },
    ]);

    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        highPriorityTasks,
      },
      topUsers,
    });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/admin/users/:id/status ────────────────────────
const toggleUserStatus = async (req, res, next) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/admin/users/:id ───────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Also delete all tasks belonging to this user
    await Task.deleteMany({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and all their tasks deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getAdminStats, toggleUserStatus, deleteUser };
