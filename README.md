# Employee Directory

Full-stack app to manage employees (create, edit, delete, search, filter by role, and paginate).

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios, react-hot-toast
- **Backend:** Express, TypeScript, Mongoose, MongoDB

## Project structure

```
agaentis-test/
├── frontend/                 # React client
│   └── src/
│       ├── api/              # Axios client + employee API calls
│       ├── components/       # Form, FormModal, EmployeeTable, Pagination
│       ├── App.tsx           # App state, search, filters, CRUD
│       └── types.ts          # Shared frontend types
│
└── backend/                  # Express API
    └── src/
        ├── config/           # Env + MongoDB connection
        ├── controllers/      # Employee request handlers
        ├── models/           # Mongoose Employee schema
        ├── routes/           # /api/employees routes
        ├── types/            # Employee + API types
        ├── app.ts            # Express app setup
        └── index.ts          # Server entry
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # set PORT and MONGODB_URI if needed
npm install
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. API base URL is in `frontend/.env` (`VITE_API_URL`).

## API overview

Base: `http://localhost:5000/api`

| Method   | Endpoint          | Description                          |
|----------|-------------------|--------------------------------------|
| `GET`    | `/employees`      | List (search, role, page, limit=5)   |
| `POST`   | `/employees`      | Create employee                      |
| `PUT`   | `/employees/:id`  | Update employee                      |
| `DELETE` | `/employees/:id`  | Delete employee                      |

**Query params (GET):** `search`, `role`, `page`, `limit`

**Roles:** `Frontend Developer` | `Backend Developer` | `Full Stack Developer` | `UI/UX`

## Features

- Add / edit / delete employees
- Toast feedback on create, update, delete
- Search by name or email
- Filter by role dropdown
- Pagination (5 employees per page)
