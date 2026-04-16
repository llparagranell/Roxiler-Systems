# Store Rating Application

A full-stack project featuring role-based dashboards for administrators, store owners, and regular users. Built as part of a coding challenge to demonstrate clean architecture and modern UI/UX principles.

## Demo

[View the Application Walkthrough (Demo.mp4)](./Demo.mp4)

## Features

### Role-Based Access
- **Admin**: Manage users and stores, view platform-wide stats.
- **Store Owner**: Monitor performance data and customer feedback for assigned stores.
- **User**: General store discovery and interactive rating system.

### Technical Implementation
- **Frontend**: React + Vite + Tailwind CSS. Uses a dark theme with custom glass-morphism effects.
- **Backend**: Node.js/Express.js with JWT authentication and request validation.
- **Database**: PostgreSQL with normalized schema and relational integrity.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL

### 2. Installation
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup
Create a PostgreSQL database named `internship` and run the initialization script:
```bash
cd backend
node init-db.js
```

### 4. Configuration
Create a `.env` file in the `backend` directory (referencing `.env.example`):
```dotenv
PORT=4000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=internship
JWT_SECRET=your_secret_key
```

### 5. Running the App
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## Default Admin Credentials
- **Email**: `sysadmin@example.com`
- **Password**: `Admin@1234`

## API Reference
- Base URL: `http://localhost:4000`
- `POST /auth/signup`: User registration
- `POST /auth/login`: Authentication -> returns JWT
- `GET /auth/me`: Fetch current user profile
