// ============================================================
// server/app.js
// Express application setup
// Middleware registration, route mounting, error handling
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security & Utility Middleware ────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' }));         // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));   // Parse URL-encoded bodies

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Serve Static Frontend Files ──────────────────────────────
app.use(express.static(path.join(__dirname, '../client')));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// ── API Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Catch-all: Serve Frontend SPA for Non-API Routes ────────
app.get('*', (req, res) => {
  // Only serve HTML for non-API requests
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/pages/404.html'));
  } else {
    res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
});

// ── Global Error Handler (must be last middleware) ───────────
app.use(errorHandler);

module.exports = app;
