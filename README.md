# Advanced Backend + React Frontend Starter (Production-ready scaffold)

This repository contains a production-ready starter for the Backend Developer assignment:
- Express + Mongoose backend with JWT authentication and role-based middleware
- React frontend (simple SPA) that supports register/login, protected dashboard and task CRUD
- Docker + docker-compose that runs MongoDB and the backend
- Postgres schema file for reference (if you prefer SQL DB)
- Swagger & Postman placeholders

**Assignment brief referenced:** fileciteturn0file0

## Quick start (development)
1. Copy `.env.example` to `backend/.env` and set a secure `JWT_SECRET`.
2. Run with Docker (recommended):
   - `docker compose up --build`
   - Backend will be at http://localhost:5000
3. Or run locally:
   - `cd backend && npm install`
   - `cp .env.example .env` and edit
   - `npm run dev`

## Frontend
A pre-built React app is available in the `frontend` folder. To start:
- `cd frontend && npm install && npm start`

## Notes
- Postgres schema is in `backend/config/postgres_schema.sql`
- Add production-ready secrets and use a managed DB in production.
