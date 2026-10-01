// ============================================================
// server/routes/taskRoutes.js
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

// All task routes require authentication
router.use(protect);

// Task validation rules
const taskRules = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),
  body('priority').optional().isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
];

const statusRules = [
  body('status').isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
];

// Stats route (must come before /:id)
router.get('/stats', getTaskStats);

// CRUD routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskRules, handleValidationErrors, createTask);
router.put('/:id', taskRules, handleValidationErrors, updateTask);
router.patch('/:id/status', statusRules, handleValidationErrors, updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
