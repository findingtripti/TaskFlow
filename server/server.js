// ============================================================
// server/server.js
// Entry point – loads environment, connects to DB, starts server
// ============================================================

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║          TaskFlow Server Running           ║
╠════════════════════════════════════════════╣
║  Environment : ${(process.env.NODE_ENV || 'development').padEnd(27)}║
║  Port        : ${String(PORT).padEnd(27)}║
║  API URL     : http://localhost:${PORT}/api     ║
║  Frontend    : http://localhost:${PORT}         ║
╚════════════════════════════════════════════╝
    `);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  process.exit(1);
});
