# TaskFlow – Quick Setup Guide

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18+) – https://nodejs.org/
2. **MongoDB** (v6+) – https://www.mongodb.com/try/download/community  
   _Or use MongoDB Atlas (free cloud tier) – https://cloud.mongodb.com/_
3. **npm** (comes with Node.js)

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 3. Start MongoDB

**Local:**
```bash
mongod
```

**Or** use your MongoDB Atlas connection string in `MONGODB_URI`.

---

## 4. Seed Demo Data (Optional)

Creates admin + demo user accounts with 10 sample tasks:

```bash
npm run seed
```

Demo credentials created:
- **Admin:** admin@taskflow.com / admin123  
- **User:** user@taskflow.com / user123

---

## 5. Run the Application

**Development** (auto-restarts on changes):
```bash
npm run dev
```

**Production:**
```bash
npm start
```

---

## 6. Open in Browser

- **App:** http://localhost:5000
- **Login:** http://localhost:5000/pages/login.html
- **API Health:** http://localhost:5000/api/health

---

## File Structure Overview

```
TaskFlow/
├── server/                 ← Backend (Node.js / Express)
│   ├── config/db.js        ← MongoDB connection
│   ├── controllers/        ← Business logic
│   ├── middleware/         ← auth, admin, error handler
│   ├── models/             ← Mongoose schemas
│   ├── routes/             ← API route definitions
│   ├── utils/              ← JWT helper, seed script
│   ├── app.js              ← Express app config
│   └── server.js           ← Entry point
├── client/                 ← Frontend (HTML/CSS/JS)
│   ├── css/style.css       ← Custom styles
│   ├── js/                 ← Vanilla JS modules
│   └── pages/              ← HTML pages
├── .env.example            ← Environment variable template
├── package.json
└── README.md
```

---

## API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register |
| POST | /api/auth/login | ✗ | Login |
| GET | /api/auth/me | ✓ | Get profile |
| GET | /api/tasks | ✓ | List tasks |
| POST | /api/tasks | ✓ | Create task |
| PUT | /api/tasks/:id | ✓ | Update task |
| PATCH | /api/tasks/:id/status | ✓ | Update status |
| DELETE | /api/tasks/:id | ✓ | Delete task |
| GET | /api/tasks/stats | ✓ | Dashboard stats |
| GET | /api/admin/users | Admin | List users |
| GET | /api/admin/stats | Admin | Platform stats |
