# TaskFlow – Full-Stack Task Management System

> **A production-style web application** featuring JWT authentication, role-based authorization (User / Admin), full CRUD task management, and a modern SaaS-style dashboard — built entirely with vanilla HTML/CSS/JS on the frontend and Node.js + Express + MongoDB on the backend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Objectives](#objectives)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [System Requirements](#system-requirements)
7. [Project Architecture](#project-architecture)
8. [Folder Structure](#folder-structure)
9. [Database Design](#database-design)
10. [API Documentation](#api-documentation)
11. [Authentication Flow](#authentication-flow)
12. [Authorization Flow](#authorization-flow)
13. [Frontend–Backend Communication](#frontendbacked-communication)
14. [Installation & Setup](#installation--setup)
15. [Environment Variables](#environment-variables)
16. [How to Run the Project](#how-to-run-the-project)
17. [Seeding Demo Data](#seeding-demo-data)
18. [How to Test the Project](#how-to-test-the-project)
19. [Sample API Requests & Responses](#sample-api-requests--responses)
20. [Security Considerations](#security-considerations)
21. [Challenges Faced](#challenges-faced)
22. [Solutions Implemented](#solutions-implemented)
23. [Project Findings](#project-findings)
24. [Future Improvements](#future-improvements)
25. [Conclusion](#conclusion)
26. [License](#license)

---

## Project Overview

**TaskFlow** is a full-stack task management web application that allows individual users to create, organise, prioritise, and track their tasks through a clean browser-based interface. An **Admin** role provides an elevated control panel to oversee all registered users and platform-wide statistics.

The project is designed to mirror real-world SaaS application architecture: a RESTful JSON API backend that is completely decoupled from a static HTML/CSS/JS frontend. Both halves are served by a single Node.js/Express server, making deployment straightforward without the need for a separate frontend build tool or framework.

Key highlights:
- Stateless JWT-based authentication (no server-side sessions)
- Mongoose ODM with schema-level validation, indexing, and pre-save hooks
- Role-based access control enforced at the middleware layer
- Input validation on every mutating API route via `express-validator`
- Centralized error handling and structured JSON responses throughout

---

## Problem Statement

In academic and professional settings, individuals often struggle to track multiple responsibilities across different categories — assignments, personal errands, work deliverables, and learning goals. Generic to-do tools either lack priority management, have no account system, or offer no administrative visibility.

There is a need for a lightweight, self-hostable task manager that:
- Supports multiple user accounts with isolated task data
- Provides priority, category, and due-date tracking
- Gives administrators oversight of the user base
- Can be run locally or deployed to a cloud environment with minimal configuration

---

## Objectives

1. Build a secure, token-based authentication system using **JWT** and **bcryptjs**.
2. Design a normalized **MongoDB** database with proper relationships between Users and Tasks.
3. Expose a fully documented **RESTful API** covering authentication, task management, and admin operations.
4. Develop a multi-page **frontend** using only HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript — no frontend framework required.
5. Implement **role-based authorization** so that admin-only routes are protected at the middleware level.
6. Apply software engineering best practices: MVC-like separation of concerns, centralized error handling, environment-based configuration, and input sanitization.
7. Produce a project that can be explained confidently in an interview and demonstrated live in under five minutes.

---

## Features

### User Features

- **Register & Login** — Create an account with name, email, and password; log in to receive a JWT.
- **Dashboard** — At-a-glance stats: total tasks, pending, in-progress, completed counts, and overdue tasks.
- **Task Management (CRUD)** — Create, view, edit, and delete personal tasks.
- **Task Filtering & Sorting** — Filter by status, priority, category; sort by due date or creation date.
- **Status Updates** — Quickly move a task between `Pending → In Progress → Completed` with a single action.
- **Priority Levels** — Mark tasks as Low, Medium, or High priority.
- **Categories & Tags** — Organise tasks by category (Work, Personal, Learning, Health, etc.) and free-form tags.
- **Due Dates** — Assign a due date; overdue tasks are visually highlighted.
- **Profile Management** — Update display name and avatar URL.
- **Change Password** — Securely update password after verifying the current one.
- **Persistent Login** — JWT stored in `localStorage`; session survives browser refresh.

### Admin Features

- **Admin Dashboard** — Platform-wide statistics: total users, active users, total tasks, and per-status task counts.
- **User Management** — View all registered users with registration date and status.
- **Activate / Deactivate Users** — Toggle a user's `isActive` flag; deactivated users cannot log in.
- **Delete Users** — Permanently remove a user account.
- **Protected Admin Routes** — All admin API endpoints require both a valid JWT **and** the `admin` role.

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18.x | JavaScript runtime |
| Express | ^4.18.2 | HTTP server & routing framework |
| MongoDB | ≥ 6.x | NoSQL document database |
| Mongoose | ^8.0.3 | ODM — schema definition, validation, queries |
| jsonwebtoken | ^9.0.2 | JWT generation & verification |
| bcryptjs | ^2.4.3 | Password hashing (bcrypt, salt rounds 12) |
| express-validator | ^7.0.1 | Request body validation & sanitization |
| dotenv | ^16.3.1 | Environment variable management |
| cors | ^2.8.5 | Cross-Origin Resource Sharing headers |
| morgan | ^1.10.0 | HTTP request logger (development) |
| nodemon | ^3.0.2 | Auto-restart server on file changes (dev) |

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Custom styling, variables, responsive layout |
| Bootstrap 5 | Component library — grid, cards, modals, badges |
| Vanilla JavaScript (ES6+) | DOM manipulation, Fetch API, routing logic |

### Tools & Infrastructure

| Tool | Purpose |
|---|---|
| MongoDB Atlas / Local | Database hosting |
| Git | Version control |
| npm | Package management |
| Postman / curl | API testing |

---

## System Requirements

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.x LTS or higher |
| npm | 9.x or higher (bundled with Node) |
| MongoDB | 6.x (local) **or** a free MongoDB Atlas cluster |
| Git | Any recent version |
| Browser | Chrome 90+, Firefox 88+, Edge 90+ |
| OS | Windows 10+, macOS 12+, Ubuntu 20.04+ |

---

## Project Architecture

TaskFlow follows an **MVC-like layered architecture**:

```
Request → Express Router → Middleware (auth, validate) → Controller → Model → MongoDB
                                                              ↓
                                                         JSON Response
```

| Layer | Directory | Responsibility |
|---|---|---|
| **Routes** | `server/routes/` | Maps HTTP method + URL to the correct controller function; attaches middleware chain |
| **Middleware** | `server/middleware/` | Cross-cutting concerns: JWT verification, role checks, input validation, error handling |
| **Controllers** | `server/controllers/` | Business logic — reads from request, calls model methods, sends response |
| **Models** | `server/models/` | Mongoose schema definitions, field validation, indexes, pre-save hooks |
| **Config** | `server/config/` | Database connection setup |
| **Utils** | `server/utils/` | Helper utilities — JWT generation, database seeding |
| **Frontend** | `client/` | Static HTML pages, JavaScript modules (one per page), and CSS |

**Data flow example — creating a task:**

1. Browser calls `POST /api/tasks` with `Authorization: Bearer <token>` header and a JSON body.
2. `protect` middleware extracts and verifies the JWT; attaches the user document to `req.user`.
3. `express-validator` rules run; if invalid, a `400` response is returned immediately.
4. `createTask` controller reads `req.body` and `req.user._id`, calls `Task.create(...)`.
5. Mongoose validates the document against the schema, runs the pre-save hook, and writes to MongoDB.
6. Controller sends back `201 { success: true, task: {...} }`.
7. Frontend JS receives the response and dynamically inserts the new task card into the DOM.

---

## Folder Structure

```
TaskFlow/                            ← Project root
├── .env.example                     ← Template for environment variables
├── .env                             ← Local secrets (NOT committed to Git)
├── package.json                     ← npm metadata & scripts
├── README.md                        ← This file
│
├── client/                          ← All frontend static files
│   ├── index.html                   ← Root landing page (redirects to login/dashboard)
│   ├── css/
│   │   └── style.css                ← Global custom styles, CSS variables, utilities
│   ├── js/
│   │   ├── api.js                   ← Centralised Fetch API wrapper (all HTTP calls)
│   │   ├── auth.js                  ← Login & Register page logic
│   │   ├── dashboard.js             ← Dashboard stats & recent tasks
│   │   ├── tasks.js                 ← Full task list with filters, CRUD modals
│   │   ├── profile.js               ← Profile update & change-password forms
│   │   ├── admin.js                 ← Admin dashboard stats
│   │   ├── admin-users.js           ← Admin user management table
│   │   └── utils.js                 ← Shared helpers (token storage, redirects, etc.)
│   └── pages/
│       ├── login.html               ← Login page
│       ├── register.html            ← Registration page
│       ├── dashboard.html           ← User dashboard
│       ├── tasks.html               ← Task list & management
│       ├── profile.html             ← Profile settings
│       ├── admin.html               ← Admin overview dashboard
│       ├── admin-users.html         ← Admin user management
│       └── 404.html                 ← Not-found fallback page
│
└── server/                          ← All backend source files
    ├── server.js                    ← Entry point — loads env, connects DB, starts server
    ├── app.js                       ← Express app setup, middleware, route mounting
    ├── config/
    │   └── db.js                    ← Mongoose connection logic with retry/error logging
    ├── controllers/
    │   ├── authController.js        ← register, login, getMe, updateProfile, changePassword
    │   ├── taskController.js        ← getTasks, createTask, updateTask, deleteTask, stats
    │   └── adminController.js       ← getUsers, getAdminStats, toggleUserStatus, deleteUser
    ├── middleware/
    │   ├── auth.js                  ← protect() — JWT verification middleware
    │   ├── admin.js                 ← authorize() — role-based access control
    │   ├── validate.js              ← handleValidationErrors — express-validator result handler
    │   └── errorHandler.js          ← Global error handler (catches all next(error) calls)
    ├── models/
    │   ├── User.js                  ← User schema, bcrypt hooks, toPublicJSON()
    │   └── Task.js                  ← Task schema, indexes, completedAt hook
    ├── routes/
    │   ├── authRoutes.js            ← /api/auth/* routes with validation rules
    │   ├── taskRoutes.js            ← /api/tasks/* routes (all protected)
    │   └── adminRoutes.js           ← /api/admin/* routes (protected + admin role)
    └── utils/
        ├── jwt.js                   ← generateToken() helper
        └── seed.js                  ← Demo data seeder script
```

---

## Database Design

### User Model

Collection: `users`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | Auto | — | MongoDB primary key |
| `name` | String | Yes | — | 2–50 characters, trimmed |
| `email` | String | Yes | — | Unique, lowercase, regex-validated |
| `password` | String | Yes | — | Hashed with bcrypt (salt 12); `select: false` |
| `role` | String | No | `"user"` | Enum: `"user"` \| `"admin"` |
| `avatar` | String | No | `""` | URL string for profile image |
| `isActive` | Boolean | No | `true` | Admins can deactivate accounts |
| `lastLogin` | Date | No | — | Updated on every successful login |
| `createdAt` | Date | Auto | — | Mongoose `timestamps` |
| `updatedAt` | Date | Auto | — | Mongoose `timestamps` |

**Indexes:** `email` (unique index, auto-created by Mongoose)

**Instance methods:**
- `comparePassword(plain)` — compares a plain-text password with the stored hash using bcrypt
- `toPublicJSON()` — returns a safe user object with the password field omitted

---

### Task Model

Collection: `tasks`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | Auto | — | MongoDB primary key |
| `title` | String | Yes | — | 3–100 characters, trimmed |
| `description` | String | No | `""` | Max 1000 characters |
| `status` | String | No | `"Pending"` | Enum: `"Pending"` \| `"In Progress"` \| `"Completed"` |
| `priority` | String | No | `"Medium"` | Enum: `"Low"` \| `"Medium"` \| `"High"` |
| `category` | String | No | `"General"` | Free text, max 50 characters |
| `dueDate` | Date | No | `null` | Optional deadline |
| `user` | ObjectId | Yes | — | Reference to `User._id` (owner) |
| `tags` | [String] | No | `[]` | Array of free-form tag strings |
| `completedAt` | Date | No | `null` | Auto-set by pre-save hook when status → `Completed` |
| `createdAt` | Date | Auto | — | Mongoose `timestamps` |
| `updatedAt` | Date | Auto | — | Mongoose `timestamps` |

**Compound Indexes:**
- `{ user: 1, status: 1 }` — fast filtering by status for a given user
- `{ user: 1, priority: 1 }` — fast filtering by priority for a given user
- `{ user: 1, dueDate: 1 }` — fast sorting by due date for a given user

**Pre-save hook:** Automatically sets `completedAt = new Date()` when `status` changes to `"Completed"`, and clears it when status changes away from `"Completed"`.

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

All responses follow the envelope format:
```json
{ "success": true|false, "message": "...", "data": { ... } }
```

Protected routes require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### Auth APIs

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create a new user account |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Yes (any role) | Get the currently authenticated user's profile |
| `PUT` | `/api/auth/profile` | Yes (any role) | Update name and/or avatar |
| `PUT` | `/api/auth/change-password` | Yes (any role) | Change password after verifying current password |

#### Request/Response Details

**`POST /api/auth/register`**

Request body:
```json
{ "name": "Alice Smith", "email": "alice@example.com", "password": "secret123" }
```
Response `201`:
```json
{ "success": true, "message": "Account created successfully.", "token": "<JWT>", "user": { "_id": "...", "name": "Alice Smith", "email": "alice@example.com", "role": "user", ... } }
```

**`POST /api/auth/login`**

Request body:
```json
{ "email": "alice@example.com", "password": "secret123" }
```
Response `200`:
```json
{ "success": true, "message": "Login successful.", "token": "<JWT>", "user": { ... } }
```

---

### Task APIs

All task routes require a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for the logged-in user (supports query filters) |
| `GET` | `/api/tasks/stats` | Get task count grouped by status for the logged-in user |
| `GET` | `/api/tasks/:id` | Get a single task by ID (must belong to the user) |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Full update of a task |
| `PATCH` | `/api/tasks/:id/status` | Update only the `status` field |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**Query parameters for `GET /api/tasks`:**

| Parameter | Type | Example | Description |
|---|---|---|---|
| `status` | String | `?status=Pending` | Filter by task status |
| `priority` | String | `?priority=High` | Filter by priority |
| `category` | String | `?category=Work` | Filter by category |
| `search` | String | `?search=report` | Search title/description |
| `sort` | String | `?sort=dueDate` | Sort field |
| `order` | String | `?order=asc` | Sort direction: `asc` \| `desc` |

---

### Admin APIs

All admin routes require a valid JWT **and** the `admin` role. A regular user calling these routes receives `403 Forbidden`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Get a list of all registered users |
| `GET` | `/api/admin/stats` | Get platform-wide stats (user count, task counts) |
| `PATCH` | `/api/admin/users/:id/status` | Toggle a user's `isActive` flag |
| `DELETE` | `/api/admin/users/:id` | Permanently delete a user account |

---

## Authentication Flow

TaskFlow uses **stateless JWT authentication**. No session data is stored on the server.

**Step-by-step flow:**

1. **Registration** — User submits name, email, and password to `POST /api/auth/register`.
2. **Password Hashing** — The Mongoose `pre('save')` hook hashes the password with bcrypt (salt rounds: 12) before storing it.
3. **Token Generation** — On successful register or login, the server calls `generateToken(userId)` which signs a JWT containing `{ id: userId }` using `JWT_SECRET`, with an expiry of `JWT_EXPIRES_IN` (default: 7 days).
4. **Token Delivery** — The token is returned in the JSON response body.
5. **Client Storage** — The frontend JavaScript stores the token in `localStorage` under the key `taskflow_token`.
6. **Subsequent Requests** — Every API call from the frontend includes the header `Authorization: Bearer <token>`.
7. **Token Verification** — The `protect` middleware calls `jwt.verify(token, JWT_SECRET)`. If valid, it fetches the user document from MongoDB and attaches it to `req.user`.
8. **Account Status Check** — `protect` also checks `user.isActive`; deactivated accounts receive `401`.
9. **Token Expiry** — If the token has expired, `jwt.verify` throws `TokenExpiredError` and the client receives a `401` with the message *"Session expired. Please log in again."* The frontend then redirects to the login page.
10. **Logout** — The client removes the token from `localStorage`. No server-side invalidation is needed (stateless design).

---

## Authorization Flow

TaskFlow implements **Role-Based Access Control (RBAC)** with two roles: `user` and `admin`.

**Middleware chain for admin routes:**

```
Request → protect (verify JWT, attach req.user) → authorize('admin') (check role) → Controller
```

**`protect` middleware** (`server/middleware/auth.js`):
- Reads the `Authorization` header.
- Verifies the JWT signature and expiry.
- Loads the full user document and attaches it to `req.user`.
- Rejects with `401` if token is missing, invalid, expired, or the account is deactivated.

**`authorize(...roles)` middleware** (`server/middleware/admin.js`):
- A higher-order function that accepts one or more allowed roles.
- Checks `req.user.role` against the allowed list.
- Returns `403 Forbidden` with a descriptive message if the role is not permitted.
- Returns `401` if `req.user` is somehow not set (defensive check).

**Route-level protection:**

```js
// Admin routes — requires authentication AND admin role
router.use(protect);
router.use(authorize('admin'));
```

This means every route registered on the admin router is automatically doubly protected.

---

## Frontend–Backend Communication

The frontend is a collection of static HTML pages. Each page loads one or more JavaScript modules from `client/js/`. There is no build step — files are served directly by Express via `express.static`.

**`client/js/api.js` — Centralised HTTP layer**

All HTTP calls go through a single `api.js` module that:
1. Reads the JWT from `localStorage`.
2. Attaches `Authorization: Bearer <token>` to every request.
3. Sets `Content-Type: application/json`.
4. Uses the Fetch API to call the backend.
5. Parses the JSON response and returns it.
6. Redirects to the login page automatically on `401` responses.

Example pattern:
```js
// In api.js
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('taskflow_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem('taskflow_token');
    window.location.href = '/pages/login.html';
  }
  return data;
};
```

**Page-specific JS modules** (e.g. `dashboard.js`, `tasks.js`) call functions exported from `api.js` and update the DOM using vanilla JavaScript — `document.createElement`, `innerHTML`, `classList`, etc.

---

## Installation & Setup

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js 18+ LTS](https://nodejs.org/)
- [MongoDB 6+ Community](https://www.mongodb.com/try/download/community) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com/)

### 1. Clone or Download the Project

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

Or download and extract the ZIP, then open a terminal in the `taskflow` folder.

### 2. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json` (Express, Mongoose, JWT, bcryptjs, etc.).

### 3. MongoDB Setup

**Option A — Local MongoDB:**

Make sure your MongoDB service is running:
```bash
# Windows (run as Administrator, or check Services)
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

**Option B — MongoDB Atlas (Cloud):**

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user with read/write permissions.
3. Whitelist your IP address (or use `0.0.0.0/0` for development).
4. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow`.

### 4. Create Your `.env` File

```bash
cp .env.example .env
```

Open `.env` and fill in your values (see [Environment Variables](#environment-variables) below).

### 5. (Optional) Seed Demo Data

```bash
node server/utils/seed.js
```

This creates two demo accounts and 10 sample tasks. See [Seeding Demo Data](#seeding-demo-data) for credentials.

---

## Environment Variables

Copy `.env.example` to `.env` and set these values before starting the server:

| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | The port the Express server listens on |
| `MONGODB_URI` | `mongodb://localhost:27017/taskflow` | Full MongoDB connection string |
| `JWT_SECRET` | `mySuperSecret_ChangeThis_InProd!` | Secret key used to sign and verify JWTs — must be long and random in production |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime — accepts `7d`, `24h`, `1h`, etc. |
| `NODE_ENV` | `development` | `development` enables Morgan HTTP logging; `production` disables it |

> **Security note:** Never commit your `.env` file to source control. The `.env.example` file serves as the public template with placeholder values only.

---

## How to Run the Project

### Development Mode (auto-restart on file changes)

```bash
npm run dev
```

Starts the server with **nodemon**. Any change to a `server/**` file automatically restarts the process.

### Production Mode

```bash
npm start
```

Starts the server with plain `node`. No auto-restart.

### Open the App

Once the server is running, open your browser and navigate to:

```
http://localhost:5000
```

The Express server serves the frontend static files from the `client/` directory, so no separate frontend server is needed.

**Available pages:**

| URL | Page |
|---|---|
| `http://localhost:5000` | Root (redirects) |
| `http://localhost:5000/pages/login.html` | Login |
| `http://localhost:5000/pages/register.html` | Register |
| `http://localhost:5000/pages/dashboard.html` | User Dashboard |
| `http://localhost:5000/pages/tasks.html` | Task Management |
| `http://localhost:5000/pages/profile.html` | Profile Settings |
| `http://localhost:5000/pages/admin.html` | Admin Dashboard |
| `http://localhost:5000/pages/admin-users.html` | Admin User Management |

---

## Seeding Demo Data

Run the seed script to populate the database with two accounts and 10 sample tasks:

```bash
node server/utils/seed.js
```

Expected output:
```
Connected to MongoDB…
Cleared existing data.
Created admin: admin@taskflow.com
Created user: user@taskflow.com
Created 10 sample tasks.

✅ Seed complete!
   Admin: admin@taskflow.com / admin123
   User:  user@taskflow.com  / user123
```

> **Warning:** The seed script calls `User.deleteMany({})` and `Task.deleteMany({})` at the start. **Do not run it against a database that contains real data you want to keep.**

**Demo credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@taskflow.com` | `admin123` |
| User | `user@taskflow.com` | `user123` |

---

## How to Test the Project

### 1. Manual Testing via Browser

1. Run `npm run dev` and open `http://localhost:5000/pages/register.html`.
2. Create a new account.
3. Log in — you will be redirected to the dashboard.
4. Navigate to **Tasks** and create, edit, filter, and delete tasks.
5. Navigate to **Profile** and update your name or change your password.
6. Log out (clears the token from localStorage).
7. Log in as `admin@taskflow.com / admin123` (after seeding) and visit the **Admin** pages.

### 2. API Testing via Postman

1. Import the following request collection manually, or use the curl examples in the next section.
2. First call `POST /api/auth/login` to obtain a JWT.
3. Copy the token and paste it into the **Authorization** tab → **Bearer Token** field in Postman.
4. Test each endpoint as described in the [API Documentation](#api-documentation) section.

### 3. API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "success": true, "message": "TaskFlow API is running", "timestamp": "...", "environment": "development" }
```

---

## Sample API Requests & Responses

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass1234"}'
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### Log In

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass1234"}'
```

### Create a Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "title": "Finish README",
    "description": "Write the full project README",
    "priority": "High",
    "category": "Work",
    "dueDate": "2024-12-31"
  }'
```

Response:
```json
{
  "success": true,
  "task": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "Finish README",
    "status": "Pending",
    "priority": "High",
    "category": "Work",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": "64f1a2b3c4d5e6f7a8b9c0d1",
    "tags": [],
    "completedAt": null,
    "createdAt": "2024-01-15T10:05:00.000Z"
  }
}
```

### Update Task Status

```bash
curl -X PATCH http://localhost:5000/api/tasks/<TASK_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"status":"In Progress"}'
```

### Get Task Stats

```bash
curl http://localhost:5000/api/tasks/stats \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

Response:
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "pending": 4,
    "inProgress": 3,
    "completed": 3,
    "overdue": 1
  }
}
```

### Admin — Get All Users

```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Validation Error Example

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"not-an-email","password":"123"}'
```

Response `400`:
```json
{
  "success": false,
  "errors": [
    { "field": "name", "message": "Name must be 2–50 characters" },
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

## Security Considerations

| Concern | How TaskFlow Addresses It |
|---|---|
| **Password Storage** | bcrypt with salt rounds of 12; raw passwords are never stored or logged |
| **Password Exposure** | The `password` field has `select: false` in Mongoose — it is never returned in any query by default |
| **JWT Secret** | Stored in `.env`, never hard-coded; production should use a 256-bit random string |
| **Token Expiry** | Configurable via `JWT_EXPIRES_IN`; expired tokens are rejected with `401` |
| **Input Validation** | `express-validator` validates and sanitizes all incoming request bodies before controllers run |
| **Request Size Limit** | `express.json({ limit: '10kb' })` prevents large payload attacks |
| **Role Enforcement** | Admin routes are protected by two independent middleware layers (JWT + role check) |
| **Account Deactivation** | `protect` middleware checks `isActive` on every request; deactivated users cannot use valid tokens |
| **CORS** | `cors()` middleware is included; should be configured with an explicit `origin` whitelist in production |
| **Environment Secrets** | `.env` is excluded from source control via `.gitignore`; `.env.example` provides a safe public template |
| **Error Leakage** | The global `errorHandler` middleware catches all uncaught errors; in production (`NODE_ENV=production`) it should suppress stack traces from responses |

---

## Challenges Faced

1. **Stateless Authentication Design** — Understanding how JWT eliminates the need for server-side session storage while still providing secure, user-specific access was conceptually challenging at first.

2. **Password Field Exclusion** — The `select: false` pattern on the `password` field in Mongoose means the password is never accidentally returned, but it also requires explicitly selecting it (`.select('+password')`) when needed for login and password-change operations.

3. **Middleware Ordering** — Express middleware executes in registration order. Getting the sequence right — especially ensuring `protect` always runs before `authorize`, and the global `errorHandler` is always the last middleware — required careful attention.

4. **Route Ordering with Express** — The `/api/tasks/stats` route had to be registered *before* `/api/tasks/:id` in the router, because Express treats `stats` as a potential `:id` parameter if the more specific route is not declared first.

5. **Frontend State Without a Framework** — Managing authentication state (token, user object, redirect logic) across multiple HTML pages using only `localStorage` and vanilla JS required clear conventions around which module is responsible for what.

6. **pre-save Hook Complexity** — The `completedAt` auto-timestamp logic required careful use of `this.isModified('status')` to avoid overwriting the field on unrelated updates.

7. **CORS in Development** — During development, the frontend was served from the same Express server as the API, which avoids CORS issues in most cases. Configuring CORS correctly for separate frontend/backend deployments would require additional setup.

---

## Solutions Implemented

1. **JWT Utility Module** — Encapsulated `generateToken()` in `server/utils/jwt.js` to keep controller code clean and make the signing logic easy to update in one place.

2. **Centralised API Layer** — `client/js/api.js` is the single point of truth for all HTTP calls. Token injection, error handling, and `401` redirects are handled once here rather than in every page script.

3. **Global Error Handler** — `server/middleware/errorHandler.js` catches all errors forwarded via `next(error)`, preventing uncaught exceptions from crashing the server and ensuring consistent JSON error responses.

4. **Mongoose Compound Indexes** — Added `{ user: 1, status: 1 }`, `{ user: 1, priority: 1 }`, and `{ user: 1, dueDate: 1 }` indexes on the Task collection to ensure filtered queries remain fast even as the dataset grows.

5. **express-validator Middleware** — A shared `handleValidationErrors` middleware reads the validation result and returns a structured error array, keeping controller code free of manual validation logic.

6. **toPublicJSON() Instance Method** — Instead of manually deleting fields from user objects before sending responses, a dedicated method always returns a safe, consistent public profile object.

7. **Seed Script** — `server/utils/seed.js` provides reproducible demo data, making it fast to reset the database to a known state during development and testing.

---

## Project Findings

- **MongoDB with Mongoose** is an excellent fit for a task management domain: the flexible document model handles optional fields (tags, dueDate, completedAt) cleanly without requiring NULL columns or complex migrations.
- **JWT stateless auth** scales horizontally without any shared session store — all state needed to authenticate a request is self-contained in the token.
- **express-validator** significantly reduces boilerplate by separating validation logic from business logic. Defining rules as arrays of middleware makes them reusable and testable in isolation.
- **Bootstrap 5** enabled a responsive, professional-looking UI without writing a large custom CSS codebase. Custom CSS variables layered on top of Bootstrap were sufficient to give the app its own visual identity.
- **Vanilla JavaScript** with a well-structured module split (one JS file per page, shared `api.js` and `utils.js`) is highly maintainable at this project scale and avoids the overhead of a frontend framework like React or Vue.
- **Role-based access control** implemented as composable middleware is clean and extensible — adding a new role (e.g. `moderator`) only requires adding a new `authorize('moderator')` call on the relevant routes.

---

## Future Improvements

| Feature | Description |
|---|---|
| **Refresh Tokens** | Issue short-lived access tokens + long-lived refresh tokens to improve security without degrading UX |
| **Email Verification** | Send a verification link on registration using Nodemailer + a transactional email service |
| **Password Reset via Email** | Generate a time-limited reset token and email a reset link |
| **File Attachments** | Allow users to attach files to tasks using Multer + cloud storage (e.g. AWS S3 or Cloudinary) |
| **Task Sharing / Collaboration** | Allow tasks to be assigned to other users, with a `collaborators` array on the Task model |
| **Notifications** | In-app or email alerts for approaching due dates using a background job scheduler (e.g. node-cron) |
| **Pagination** | Add cursor-based or page-based pagination to `GET /api/tasks` and `GET /api/admin/users` |
| **Rate Limiting** | Use `express-rate-limit` to throttle authentication endpoints and prevent brute-force attacks |
| **Unit & Integration Tests** | Write automated tests with Jest + Supertest for all API routes |
| **Docker Support** | Add `Dockerfile` and `docker-compose.yml` for one-command local setup and cloud deployment |
| **Frontend Framework Migration** | Migrate the frontend to React or Next.js for better state management as feature complexity grows |
| **Audit Logging** | Log all user actions (task created/deleted, admin actions) to a separate collection for auditability |

---

## Conclusion

TaskFlow demonstrates the design and implementation of a production-style full-stack web application from scratch. The project covers every major layer of modern web development: database modelling, RESTful API design, secure authentication, role-based authorization, and a responsive multi-page frontend — all wired together without relying on a managed backend service or frontend framework.

The architectural decisions made throughout the project — stateless JWT auth, Mongoose schema hooks, centralised frontend API module, composable middleware — are patterns found in real-world Node.js applications and are directly applicable to professional projects and technical interviews.

For a B.Tech student, this project demonstrates:
- End-to-end understanding of how a web request flows from browser to database and back
- Practical knowledge of authentication and authorization, which are core concerns in almost every real application
- Ability to structure a codebase with separation of concerns and maintainability in mind
- Familiarity with industry-standard tools: Node.js, Express, MongoDB, JWT, bcrypt, Bootstrap

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 TaskFlow Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*Built with Node.js · Express · MongoDB · Bootstrap 5 · Vanilla JavaScript*
