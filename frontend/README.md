# School Management System

A responsive full-stack school management system built with React + Vite + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend.

## Project structure

```text
frontend/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── src/config/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── schoolmanagement/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Features

- Principal/Admin dashboard
- Student management
- Teacher management
- Class management
- Subject management
- Fee records and summaries
- Teacher dashboard and roster
- Bulk attendance marking
- Student attendance history
- Student fee history
- Teacher and student profile editing
- JWT authentication with role-based route protection
- Responsive sidebar/navigation for mobile, tablet and desktop
- Centralized frontend API service
- Loading, error and empty states
- Password hashing with bcryptjs
- MongoDB/Mongoose persistence

## Run locally

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
PORT=5000
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
ALLOW_ADMIN_SEED=false
```

Start the API:

```bash
npm start
```

The API should be available at `http://localhost:5000`.

### 2. Frontend

```bash
cd schoolmanagement
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## First admin account

The `/api/auth/seed-admin` endpoint is disabled by default. If you intentionally need it for first-time setup, temporarily set:

```env
ALLOW_ADMIN_SEED=true
```

Then send a POST request with `name`, `email`, and `password`. Disable the flag again after setup.

## Important security notes

- Never commit `.env` files or real MongoDB/JWT credentials.
- `backend/.env.example` contains placeholders only.
- `node_modules`, build output and Git metadata should not be included in deployment ZIPs.
- Configure MongoDB Atlas network access and a database user before starting the backend.

## Quality checks

Frontend lint:

```bash
cd schoolmanagement
npm run lint
```

Frontend production build:

```bash
npm run build
```

If a local environment cannot build because Vite's platform-specific optional native dependency is missing, remove `node_modules` and the lockfile only if necessary and run a clean `npm install` for that operating system.


