// ============================================================
// server/controllers/taskController.js
// Full CRUD + filtering, searching, sorting for tasks
// Users see ONLY their own tasks.
// ============================================================

const Task = require('../models/Task');

// ── GET /api/tasks ───────────────────────────────────────────
// Supports: ?status=, ?priority=, ?category=, ?search=, ?sort=, ?page=, ?limit=
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort, page = 1, limit = 20 } = req.query;

    // Base filter: only this user's tasks
    const filter = { user: req.user._id };

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    else if (sort === 'priority') {
      // High > Medium > Low using a manual sort workaround
      sortOption = { priority: -1 };
    } else if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/tasks/:id ───────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/tasks ──────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category || 'General',
      dueDate: dueDate || null,
      tags: tags || [],
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/tasks/:id ───────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, tags } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/tasks/:id/status ──────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${status}.`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/tasks/:id ────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/tasks/stats ─────────────────────────────────────
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, pending, inProgress, completed, highPriority, overdue] =
      await Promise.all([
        Task.countDocuments({ user: userId }),
        Task.countDocuments({ user: userId, status: 'Pending' }),
        Task.countDocuments({ user: userId, status: 'In Progress' }),
        Task.countDocuments({ user: userId, status: 'Completed' }),
        Task.countDocuments({ user: userId, priority: 'High' }),
        Task.countDocuments({
          user: userId,
          status: { $ne: 'Completed' },
          dueDate: { $lt: new Date() },
        }),
      ]);

    // Recent 5 tasks
    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming tasks (due in next 7 days, not completed)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingTasks = await Task.find({
      user: userId,
      status: { $ne: 'Completed' },
      dueDate: { $gte: new Date(), $lte: nextWeek },
    }).sort({ dueDate: 1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: { total, pending, inProgress, completed, highPriority, overdue },
      recentTasks,
      upcomingTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
};
