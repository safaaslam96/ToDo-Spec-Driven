---
title: Todo Evolution Backend
emoji: ✅
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# The Evolution of Todo - Backend API

FastAPI backend for The Evolution of Todo application (Phase II).

## Features

- **RESTful API** with full CRUD operations for tasks
- **JWT Authentication** with Better Auth integration
- **PostgreSQL Database** via Neon Serverless
- **User Isolation** - All tasks are user-scoped
- **Async/Await** - High-performance async operations
- **Auto Documentation** - Swagger UI and ReDoc

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Environment Variables

Required environment variables for Hugging Face Spaces:

```bash
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
```

Configure these in your Space settings under "Variables and secrets".

## Tech Stack

- **FastAPI** 0.115+ - Modern Python web framework
- **SQLModel** - SQL databases with Python type annotations
- **Asyncpg** - PostgreSQL async driver
- **Python-JOSE** - JWT token handling
- **Uvicorn** - ASGI server

## Documentation

Once deployed, access:
- Swagger UI: `https://your-space.hf.space/docs`
- ReDoc: `https://your-space.hf.space/redoc`

## Local Development

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure your environment variables
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── api/routes/          # API route handlers
│   ├── auth/                # JWT authentication
│   ├── database/            # Database connection
│   └── models/              # SQLModel schemas
├── tests/                   # Test suite
├── Dockerfile               # Hugging Face Spaces container
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## License

MIT License - See LICENSE file for details
