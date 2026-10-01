// ============================================================
// server/utils/seed.js
// Creates demo admin and user accounts with sample tasks.
// Run: node server/utils/seed.js
// ============================================================

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User     = require('../models/User');
const Task     = require('../models/Task');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';

const sampleTasks = [
  { title: 'Set up project repository', description: 'Initialize Git and create README', status: 'Completed', priority: 'High', category: 'Work', dueDate: new Date(Date.now() - 7 * 86400000) },
  { title: 'Design database schema', description: 'Define User and Task models in Mongoose', status: 'Completed', priority: 'High', category: 'Work' },
  { title: 'Build REST API endpoints', description: 'Create CRUD routes for tasks', status: 'In Progress', priority: 'High', category: 'Work', dueDate: new Date(Date.now() + 2 * 86400000) },
  { title: 'Implement JWT authentication', description: 'Login, register, and token verification', status: 'In Progress', priority: 'High', category: 'Work', dueDate: new Date(Date.now() + 1 * 86400000) },
  { title: 'Build dashboard UI', description: 'Create stats cards and task list', status: 'Pending', priority: 'Medium', category: 'Work', dueDate: new Date(Date.now() + 4 * 86400000) },
  { title: 'Write unit tests', description: 'Test API endpoints and auth flow', status: 'Pending', priority: 'Medium', category: 'Work', dueDate: new Date(Date.now() + 10 * 86400000) },
  { title: 'Buy groceries', description: 'Milk, eggs, bread, and fruit', status: 'Pending', priority: 'Low', category: 'Personal', dueDate: new Date(Date.now() + 1 * 86400000) },
  { title: 'Read Node.js docs', description: 'Study streams and events chapter', status: 'In Progress', priority: 'Medium', category: 'Learning' },
  { title: 'Exercise routine', description: 'Morning jog and stretching', status: 'Completed', priority: 'Medium', category: 'Health' },
  { title: 'Update portfolio website', description: 'Add TaskFlow project screenshots', status: 'Pending', priority: 'Low', category: 'Personal', dueDate: new Date(Date.now() + 14 * 86400000) },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB…');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data.');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin:', admin.email);

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'user@taskflow.com',
      password: 'user123',
      role: 'user',
    });
    console.log('Created user:', user.email);

    // Create tasks for demo user
    const tasks = sampleTasks.map((t) => ({ ...t, user: user._id }));
    await Task.insertMany(tasks);
    console.log(`Created ${tasks.length} sample tasks.`);

    console.log('\n✅ Seed complete!');
    console.log('   Admin: admin@taskflow.com / admin123');
    console.log('   User:  user@taskflow.com  / user123');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
