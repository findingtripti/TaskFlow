# TaskFlow – Full-Stack Task Management System

A full-stack task management web application with JWT authentication, role-based access control (User and Admin), a responsive SaaS-style interface, and persistent Dark/Light mode. It is built with Node.js, Express, MongoDB, and a Vanilla JavaScript frontend.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Why TaskFlow](#why-taskflow)
3. [Key Features](#key-features)
4. [User Roles](#user-roles)
5. [Tech Stack](#tech-stack)
6. [System Architecture](#system-architecture)
7. [Project Structure](#project-structure)
8. [Authentication and Authorization](#authentication-and-authorization)
9. [Task Management Workflow](#task-management-workflow)
10. [Dashboard Features](#dashboard-features)
11. [Admin Features](#admin-features)
12. [Dark/Light Mode](#darklight-mode)
13. [Responsive Design](#responsive-design)
14. [REST API Overview](#rest-api-overview)
15. [Database Models](#database-models)
16. [Installation and Setup](#installation-and-setup)
17. [Environment Variables](#environment-variables)
18. [Seed / Demo Data](#seed--demo-data)
19. [Demo Credentials](#demo-credentials)
20. [Screenshots](#screenshots)
21. [Testing / Verified Functionality](#testing--verified-functionality)
22. [Security Considerations](#security-considerations)
23. [Future Improvements](#future-improvements)
24. [Learning Outcomes](#learning-outcomes)
25. [Project Highlights](#project-highlights)
26. [Author](#author)

---

## Project Overview

TaskFlow is a task management system where users can create, organize, and track their tasks, while administrators can monitor platform activity and manage user accounts.

The backend is a REST API built with Express.js and MongoDB (through Mongoose). The frontend is a multi-page application written in HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript. The same Express server serves the frontend as static files from the `client/` folder, and the pages communicate with the API using JWT-based authentication.

---

## Why TaskFlow

This project was built to practice how a complete full-stack application fits together without a frontend framework. It focuses on:

- Designing a REST API with a clear separation of routes, controllers, middleware, and models
- Implementing authentication and role-based authorization
- Building a responsive interface using only HTML, CSS, Bootstrap, and plain JavaScript
- Handling practical concerns such as input validation, centralized error handling, pagination, filtering, and theme persistence

---

## Key Features

### For All Users

- Registration and login with JWT authentication
- Passwords hashed with `bcryptjs` before storage
- Personal dashboard with task statistics
- Full task CRUD (create, read, update, delete)
- Quick task status updates
- Search, filter, sort, and pagination on the task list
- Task fields: title, description, status, priority, category, due date, and tags
- Profile management and password change
- Toast notifications for user feedback
- Persistent Dark/Light mode
- Responsive layout with a sidebar and off-canvas mobile navigation

### For Admins

- Dedicated admin dashboard with platform statistics
- User management: view users, activate/deactivate accounts, delete users
- Admin-only API routes protected by role-based middleware

---

## User Roles

| Role | Access |
|------|--------|
| **User** | Register, log in, manage own tasks, view personal dashboard, update profile, change password |
| **Admin** | Everything a user can do, plus the admin dashboard and user management |

Roles are stored on the `User` model (`user` or `admin`, default `user`) and are enforced on the server through middleware, not only in the UI.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Backend framework | Express.js 4 |
| Database | MongoDB |
| ODM | Mongoose 8 |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcryptjs` |
| Validation | `express-validator` |
| Other packages | `cors`, `morgan` (request logging in development), `dotenv` |
| Dev tooling | `nodemon` |
| Frontend markup | HTML5 |
| Styling | CSS3, Bootstrap 5 |
| Frontend logic | Vanilla JavaScript |
| API style | REST (JSON) |

---

## System Architecture

```text
┌────────────────────────────────────────────────┐
│                    Browser                     │
│   HTML pages + Bootstrap 5 + Vanilla JS        │
│   localStorage:  tf_token (JWT)                │
│                  tf_theme (light / dark)       │
└───────────────────────┬────────────────────────┘
                        │  Fetch API
                        │  Authorization: Bearer <token>
                        ▼
┌────────────────────────────────────────────────┐
│                Express.js Server               │
│                                                │
│  Static frontend files (client/)               │
│                                                │
│  /api/auth   /api/tasks   /api/admin           │
│       │           │            │               │
│       ▼           ▼            ▼               │
│  Routes ──► Middleware ──► Controllers         │
│              • protect (JWT verification)      │
│              • authorize('admin')              │
│              • handleValidationErrors          │
│              • errorHandler (global)           │
└───────────────────────┬────────────────────────┘
                        │  Mongoose
                        ▼
┌────────────────────────────────────────────────┐
│                    MongoDB                     │
│            users  |  tasks collections         │
└────────────────────────────────────────────────┘
```

**Request flow:**

1. The browser sends a request with the JWT in the `Authorization` header.
2. The route passes the request through authentication, role, and validation middleware as required.
3. The controller runs the business logic and talks to MongoDB through the Mongoose models.
4. A JSON response is returned. Errors go through the global error handler.

---

## Project Structure

```text
TaskFlow/
├── client/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── theme.js          # Single source of truth for dark/light mode
│   │   ├── api.js            # API request helper
│   │   ├── auth.js           # Auth guards, logout, sidebar/user info
│   │   ├── dashboard.js      # Dashboard statistics
│   │   ├── tasks.js          # Task CRUD, filters, sorting, pagination
│   │   ├── profile.js        # Profile update and password change
│   │   ├── admin.js          # Admin dashboard statistics
│   │   ├── admin-users.js    # Admin user management
│   │   └── utils.js          # Shared UI/helper functions
│   └── pages/
│       ├── login.html
│       ├── register.html
│       ├── dashboard.html
│       ├── tasks.html
│       ├── profile.html
│       ├── admin.html
│       ├── admin-users.html
│       └── 404.html
├── server/
│   ├── server.js             # Entry point: loads env, connects DB, starts server
│   ├── app.js                # Express setup, middleware, routes, static files
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js           # protect: JWT verification
│   │   ├── admin.js          # authorize: role check
│   │   ├── validate.js       # handleValidationErrors
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   └── utils/
│       ├── jwt.js            # Token helpers
│       └── seed.js           # Demo data seeder
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── SETUP.md
```

### Frontend Script Responsibilities

| File | Responsibility |
|------|----------------|
| `theme.js` | Dark/Light theme handling and persistence (loaded first on every page) |
| `api.js` | Shared helper for calling the backend API |
| `auth.js` | Authentication guards, logout, sidebar and user information |
| `dashboard.js` | Loads and renders dashboard statistics |
| `tasks.js` | Task CRUD, filters, sorting, pagination |
| `profile.js` | Profile update and password change |
| `admin.js` | Admin dashboard statistics |
| `admin-users.js` | Admin user list and management actions |
| `utils.js` | Shared UI helpers |

> The login page contains its login logic inline in `login.html`.

---

## Authentication and Authorization

### Authentication Flow

1. A user registers or logs in through `/api/auth/register` or `/api/auth/login`.
2. Passwords are hashed with `bcryptjs` (12 salt rounds) in a Mongoose `pre('save')` hook. Plain-text passwords are never stored.
3. On a successful login, the server issues a signed JWT.
4. The client stores the token in `localStorage` under the key `tf_token`.
5. Protected requests send the token as `Authorization: Bearer <token>`.
6. The `protect` middleware verifies the token before the request reaches a controller.
7. On logout, the client clears the stored session and returns to the login page.

### Authorization

- **`protect`** (`server/middleware/auth.js`) guards all private routes. All task routes and admin routes are behind it.
- **`authorize('admin')`** (`server/middleware/admin.js`) restricts every `/api/admin` route to users with the `admin` role.
- **Client-side guards** in `auth.js` redirect unauthenticated visitors to the login page.
- Tasks belong to a user through the `user` field on the `Task` model.

### Request Validation

| Route | Rules |
|-------|-------|
| `POST /api/auth/register` | Name 2–50 characters, valid email, password of at least 6 characters |
| `POST /api/auth/login` | Valid email, password required |
| `POST` / `PUT /api/tasks` | Title 3–100 characters; priority must be `Low`, `Medium`, or `High`; status must be `Pending`, `In Progress`, or `Completed` |
| `PATCH /api/tasks/:id/status` | Status must be `Pending`, `In Progress`, or `Completed` |

---

## Task Management Workflow

1. **Create** – The user adds a task with a title and optional description, status, priority, category, due date, and tags.
2. **View** – Tasks are listed with pagination.
3. **Search, filter, and sort** – The list can be searched, filtered, and sorted to find specific tasks.
4. **Edit** – A task can be fully updated through `PUT /api/tasks/:id`.
5. **Update status** – The status can be changed on its own through `PATCH /api/tasks/:id/status`.
6. **Delete** – A task can be removed permanently.
7. **Feedback** – Actions show toast notifications for success or failure.

When a task's status changes to `Completed`, the `Task` model sets `completedAt` automatically. If the status changes to anything else, `completedAt` is cleared.

Frontend logic lives in `client/js/tasks.js`, and the matching server logic lives in `server/controllers/taskController.js`.

---

## Dashboard Features

- Task statistics for the logged-in user, loaded from `GET /api/tasks/stats`
- Data rendered dynamically by `client/js/dashboard.js`
- Card-based layout that adapts to screen size
- Consistent look in both Light and Dark themes

---

## Admin Features

Available only to users with the Admin role:

- **Admin dashboard** – Platform statistics from `GET /api/admin/stats` (handled by `admin.js`)
- **User management** (handled by `admin-users.js`):
  - View all registered users
  - Activate or deactivate user accounts
  - Delete users
- **Protected access** – Admin API routes require both a valid JWT and the `admin` role

---

## Dark/Light Mode

TaskFlow supports persistent Dark and Light themes.

- `client/js/theme.js` is the **single source of truth** for theme management. It is loaded first on every page, so the saved theme is applied before the page paints and there is no flash of the wrong theme.
- The selected theme is stored in the browser's `localStorage` under the key **`tf_theme`**. The value is `light` or `dark`, and `light` is the default.
- The dark theme is applied through a `dark-mode` CSS class on the `<html>` and `<body>` elements.
- Toggle buttons (`.theme-toggle`) call `toggleTheme()`, which switches the theme, saves it, and updates the button icon and tooltip.
- Form input text remains readable in dark mode.

---

## Responsive Design

- Built with Bootstrap 5 and custom styles in `client/css/style.css`
- Fixed sidebar navigation on desktop
- Off-canvas sidebar navigation on smaller screens
- Cards, tables, and forms adapt to different screen widths
- Consistent SaaS-style look in both themes

---

## REST API Overview

The API is served by the same Express server as the frontend. Base URL (local): `http://localhost:5000/api`

All responses are JSON. Errors are returned through the global error handler, and unknown `/api` routes return a JSON 404 response.

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |
| GET | `/api/auth/me` | Get the current user | Private |
| PUT | `/api/auth/profile` | Update profile details | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Task Routes (`/api/tasks`)

All task routes require authentication.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | List tasks (search, filter, sort, pagination) | Private |
| GET | `/api/tasks/stats` | Task statistics for the dashboard | Private |
| GET | `/api/tasks/:id` | Get a single task | Private |
| POST | `/api/tasks` | Create a task | Private |
| PUT | `/api/tasks/:id` | Update a task | Private |
| PATCH | `/api/tasks/:id/status` | Update only the task status | Private |
| DELETE | `/api/tasks/:id` | Delete a task | Private |

> `/api/tasks/stats` is declared before `/:id` so it is not treated as a task ID.

### Admin Routes (`/api/admin`)

All admin routes require authentication and the `admin` role.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/stats` | Platform statistics | Admin |
| PATCH | `/api/admin/users/:id/status` | Activate or deactivate a user | Admin |
| DELETE | `/api/admin/users/:id` | Delete a user | Admin |

### Utility Route

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Confirms the API is running | Public |

---

## Database Models

TaskFlow uses two Mongoose models. Both have `timestamps` enabled, so `createdAt` and `updatedAt` are added automatically.

### User (`server/models/User.js`)

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required, trimmed, 2–50 characters |
| `email` | String | Required, unique, lowercase, validated by a regex |
| `password` | String | Required, minimum 6 characters, hashed on save, excluded from queries by default (`select: false`) |
| `role` | String | `user` or `admin`, default `user` |
| `avatar` | String | Default empty string |
| `isActive` | Boolean | Default `true` |
| `lastLogin` | Date | Last login time |

**Methods:**

- `comparePassword(enteredPassword)` compares a plain password with the stored hash.
- `toPublicJSON()` returns the user data without the password.

### Task (`server/models/Task.js`)

| Field | Type | Details |
|-------|------|---------|
| `title` | String | Required, trimmed, 3–100 characters |
| `description` | String | Optional, up to 1000 characters |
| `status` | String | `Pending`, `In Progress`, or `Completed`; default `Pending` |
| `priority` | String | `Low`, `Medium`, or `High`; default `Medium` |
| `category` | String | Up to 50 characters; default `General` |
| `dueDate` | Date | Optional, default `null` |
| `user` | ObjectId | Required reference to the owning `User` |
| `tags` | [String] | Default empty array |
| `completedAt` | Date | Set automatically when the status becomes `Completed` |

**Indexes:** `{ user, status }`, `{ user, priority }`, and `{ user, dueDate }` for faster queries.

### Relationship

```text
User (1) ────────< Task (many)
```

Each task belongs to exactly one user, and a user can own many tasks.

---

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally (MongoDB Compass is optional)
- Git

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/findingtripti/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create the environment file**

   Copy `.env.example` to a new file named `.env`:

   ```bash
   # macOS / Linux
   cp .env.example .env

   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

4. **Set your environment values**

   Open `.env` and update the values. See [Environment Variables](#environment-variables).

5. **Make sure MongoDB is running**

   Start your local MongoDB service, or confirm that it is running as a Windows service.

6. **Seed the demo data** (recommended)

   ```bash
   npm run seed
   ```

7. **Start the application**

   ```bash
   # Development (auto-restart with nodemon)
   npm run dev

   # Or standard start
   npm start
   ```

8. **Open the app**

   The server runs at `http://localhost:5000`. Open the login page at:

   ```text
   http://localhost:5000/pages/login.html
   ```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `node server/server.js` | Start the server |
| `npm run dev` | `nodemon server/server.js` | Start with auto-restart |
| `npm run seed` | `node server/utils/seed.js` | Seed demo data |
| `npm test` | `echo` message only | Prints a reminder on how to run the app. It is **not** an automated test suite. |

> For additional setup notes, see [SETUP.md](SETUP.md).

---

## Environment Variables

Create a `.env` file in the project root, using `.env.example` as a template. The server loads it from the project root using `dotenv`.

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on (defaults to `5000` if not set) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `NODE_ENV` | Runtime environment, such as `development` |

Example with placeholders:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Important:** Never commit your real `.env` file. It is excluded through `.gitignore`. Use a long, random value for `JWT_SECRET`.

> Request logging with `morgan` is enabled only when `NODE_ENV` is `development`.

---

## Seed / Demo Data

The project includes a seed script at `server/utils/seed.js` that prepares demo accounts so the application can be explored right away.

```bash
npm run seed
```

Make sure MongoDB is running before you run the command.

---

## Demo Credentials

> **Demo credentials only.** These accounts come from the seed script and are meant for local development and demonstration. **Do not use these credentials in production.**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@taskflow.com` | `admin123` |
| User | `user@taskflow.com` | `user123` |

---

## Screenshots

Screenshots will be added here.

<!-- Add screenshot: Login Page -->
<!-- Add screenshot: Register Page -->
<!-- Add screenshot: User Dashboard (Light Mode) -->
<!-- Add screenshot: User Dashboard (Dark Mode) -->
<!-- Add screenshot: Tasks Page with filters and pagination -->
<!-- Add screenshot: Create / Edit Task form -->
<!-- Add screenshot: Profile Page -->
<!-- Add screenshot: Admin Dashboard -->
<!-- Add screenshot: Admin User Management -->
<!-- Add screenshot: Mobile view with off-canvas sidebar -->

| Page | Preview |
|------|---------|
| Login | _Coming soon_ |
| Dashboard | _Coming soon_ |
| Tasks | _Coming soon_ |
| Admin Dashboard | _Coming soon_ |
| Mobile View | _Coming soon_ |

---

## Testing / Verified Functionality

The application was tested manually on a local development setup. This repository does **not** include an automated unit or integration test suite. The `npm test` script only prints a reminder message.

The following functionality was verified:

- [x] Application starts successfully
- [x] MongoDB connection works
- [x] Seed command works
- [x] Admin login works
- [x] User login works
- [x] User registration works
- [x] Dashboard loads
- [x] Task creation works
- [x] Task editing works
- [x] Task deletion works
- [x] Task filtering and sorting works
- [x] Admin user activation/deactivation works
- [x] Admin user deletion works
- [x] Profile page loads
- [x] Logout works
- [x] Dark/Light theme switching works
- [x] Dark-mode form input text remains visible while typing
- [x] Responsive navigation and UI work

---

## Security Considerations

- **Password hashing** – Passwords are hashed with `bcryptjs` (12 salt rounds) and are excluded from query results by default.
- **JWT authentication** – Protected routes require a valid signed token.
- **Role-based access control** – All admin routes require the `admin` role, enforced by server middleware.
- **Input validation** – Register, login, and task requests are validated with `express-validator`.
- **Request size limit** – JSON request bodies are limited to 10 KB.
- **Centralized error handling** – Errors are handled by a global error handler.
- **Environment configuration** – Secrets are kept in `.env`, which is excluded from version control.

### Known Limitations

- The JWT is stored in `localStorage`, which is simple but readable by JavaScript on the page. A production application should consider `httpOnly` cookies.
- CORS is currently open to all origins (`cors()` with default settings). Restrict it before any real deployment.
- Demo credentials are intended for local use only.
- The project has not been through a formal security audit.

---

## Future Improvements

- Automated unit and integration tests
- Rate limiting and additional security headers
- Restricted CORS configuration
- Email verification and password reset
- Refresh tokens and `httpOnly` cookie-based sessions
- Task reminders and notifications
- File attachments for tasks
- Activity log for admin actions
- API documentation with Swagger/OpenAPI
- Deployment configuration

---

## Learning Outcomes

Through this project, I practiced:

- Structuring a Node.js/Express application with routes, controllers, middleware, and models
- Designing and implementing a REST API
- Implementing JWT authentication and role-based authorization
- Modeling data with MongoDB and Mongoose, including indexes and model hooks
- Validating input and handling errors centrally
- Building a responsive multi-page interface with Bootstrap 5 and Vanilla JavaScript
- Managing client-side state such as the auth token and theme preference
- Implementing pagination, search, filtering, and sorting
- Using Git and GitHub to manage and publish a project

---

## Project Highlights

- Complete full-stack application without a frontend framework
- Clear separation of concerns on both frontend and backend
- Role-based access for Users and Admins
- Persistent Dark/Light mode managed from a single file (`theme.js`, key `tf_theme`)
- Responsive SaaS-style interface with off-canvas mobile navigation
- Search, filter, sort, and pagination for tasks
- Automatic `completedAt` tracking on tasks
- Seed script for quick demo setup

---

## Author

**Tripti Singh**

- GitHub: [@findingtripti](https://github.com/findingtripti)

---
