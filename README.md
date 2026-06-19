# ✅ Task Manager API

A RESTful API for managing users and their tasks, built with **Node.js**, **Express**, and **MongoDB**. Includes JWT authentication, avatar image uploads, automated transactional emails, and a full **Jest/Supertest** test suite.

📦 **Repository:** [task-manager-api](https://github.com/a7med2yman/task-manager-api)
📬 **API Collection (Postman):** [Open in Postman](https://aerospace-engineer-75392970-s-team.postman.co/workspace/My-Workspace~bc6e80ac-8c71-43cd-8f89-dca8d53f1aaf/collection/26114821-c4d8c05f-b701-4f94-ab5a-4f40baa9aaf3?action=share&creator=26114821&active-environment=26114821-16a3caab-777e-48d9-8b6c-7102165d18a5)

---

## ✨ Features

- 🔐 **Authentication** — JWT auth with multi-session token management, plus single-device and all-device logout
- 👤 **User profiles** — read, update, and delete your own account, with task ownership tied to each user
- 🖼️ **Avatar uploads** — upload, replace, and delete a profile avatar using **Multer** and **Sharp** (automatic resizing)
- ✅ **Task management** — full CRUD for tasks, scoped to the authenticated owner
- 🔎 **Advanced querying** — filtering by completion status, pagination, and dynamic sorting
- 🧬 **Robust data layer** — Mongoose schemas with custom validators, `bcrypt` password hashing, and pre-save hooks
- 🗑️ **Cascade deletion** — a user's tasks are automatically removed via a Mongoose `pre('deleteOne')` middleware hook when the account is deleted
- ✉️ **Transactional emails** — welcome email on signup and a cancellation email on account deletion, sent via **SendGrid**
- 🧪 **Automated tests** — unit/integration tests with **Jest** and **Supertest**, covering both user and task endpoints
- 🗄️ **MongoDB** — data persistence with **Mongoose** schemas/models

---

## 🛠️ Tech Stack

| Layer            | Technology |
|-------------------|------------|
| Runtime           | Node.js |
| Framework         | Express |
| Database          | MongoDB (Mongoose) |
| Auth              | JWT (`jsonwebtoken`) + `bcrypt` |
| File Uploads      | Multer + Sharp |
| Emails            | SendGrid (`@sendgrid/mail`) |
| Validation        | `validator` |
| Testing           | Jest + Supertest |
| Dev Tools         | Nodemon, `env-cmd` |

---

## 📁 Project Structure

```
.
├── db/            # MongoDB connection setup (Mongoose)
├── emails/        # Email sending logic (welcome / account cancellation via SendGrid)
├── middleware/    # Auth middleware (JWT verification)
├── models/        # Mongoose schemas (User, Task)
├── routes/        # Express route handlers (users, tasks)
├── tests/         # Jest/Supertest test suites
├── app.js         # Express app configuration (middleware & routes)
├── index.js       # Server entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- SendGrid account & API key (for sending emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/a7med2yman/task-manager-api.git
cd task-manager-api

# Install dependencies
npm install
```

### Environment Variables

The project loads environment variables via `env-cmd` from `config/dev.env` (development) and `config/test.env` (testing). Create these files at the project root with variables such as:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
```

> ⚠️ Adjust variable names to match exactly what's referenced in the code if they differ.

### Running the Project

```bash
# Development (with nodemon + env-cmd)
npm run dev

# Tests (with Jest + env-cmd, using config/test.env)
npm test
```

> ℹ️ The `start` script in `package.json` is currently named `star` — either run `node index.js` directly or fix the script name to `start` to use `npm start` normally.

---

## 📡 API Endpoints

### Users

| Method | Endpoint              | Description |
|--------|------------------------|-------------|
| POST   | `/users`               | Sign up a new user |
| POST   | `/users/login`         | Log in |
| POST   | `/users/logout`        | Log out from the current session |
| POST   | `/users/logoutAll`     | Log out from all sessions |
| GET    | `/users/me`            | Get current user's profile |
| PATCH  | `/users/me`            | Update current user's profile |
| DELETE | `/users/me`            | Delete current user's account |
| POST   | `/users/me/avatar`     | Upload/update profile avatar |
| DELETE | `/users/me/avatar`     | Delete profile avatar |
| GET    | `/users/:id/avatar`    | Get a user's avatar |

### Tasks

| Method | Endpoint        | Description |
|--------|------------------|-------------|
| POST   | `/tasks`         | Create a new task |
| GET    | `/tasks`         | List tasks (supports `?completed=`, `?limit=`, `?skip=`, `?sortBy=`) |
| GET    | `/tasks/:id`     | Get a single task by ID |
| PATCH  | `/tasks/:id`     | Update a task |
| DELETE | `/tasks/:id`     | Delete a task |

> Most endpoints require an `Authorization: Bearer <token>` header. Adjust the table above if your actual routes differ.

---

## 📡 API Documentation (Postman)

A full collection of API requests (auth, profile, avatar, tasks) is available on Postman:

👉 [**Postman Collection**](https://aerospace-engineer-75392970-s-team.postman.co/workspace/My-Workspace~bc6e80ac-8c71-43cd-8f89-dca8d53f1aaf/collection/26114821-c4d8c05f-b701-4f94-ab5a-4f40baa9aaf3?action=share&creator=26114821&active-environment=26114821-16a3caab-777e-48d9-8b6c-7102165d18a5)

Import the collection (and its environment) into Postman to explore and test the available endpoints.

---

## 🧪 Testing

```bash
npm test
```

Runs the Jest test suite (with Supertest for HTTP assertions) using the `config/test.env` environment.

---

## 👤 Author

**a7med2yman** — [GitHub Profile](https://github.com/a7med2yman)

---

## 📄 License

ISC
