# Deployment Guide — Agentic Tree

## Live Deployment

| Service | URL |
|---------|-----|
| Frontend | https://agentic-tree-datastructure-visualizer-1.onrender.com |
| Backend API | https://agentic-tree-datastructure-visualizer.onrender.com |
| API Docs | https://agentic-tree-datastructure-visualizer.onrender.com/docs |

---

## Deployment Platform: Render

The application is deployed on [Render](https://render.com) using Docker containers.

---

## Backend Deployment on Render

### Steps

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `agentic-tree-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Port**: `8000`

4. Add Environment Variables:
```
DATABASE_URL=your-neon-postgresql-connection-string
SECRET_KEY=your-strong-secret-key
GROQ_API_KEY=your-groq-api-key
CORS_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:5173
```

5. Click **Deploy**

The `entrypoint.sh` automatically runs `alembic upgrade head` to create database tables on first deploy.

---

## Frontend Deployment on Render

### Steps

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `agentic-tree-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Port**: `80`

4. Add Environment Variables (Build Args):
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

5. Click **Deploy**

---

## Database: Neon PostgreSQL

The application uses [Neon](https://neon.tech) as the managed PostgreSQL database.

1. Create a free account at neon.tech
2. Create a new project
3. Copy the connection string
4. Set it as `DATABASE_URL` in Render environment variables

---

## Local Development

### Prerequisites
- Node.js 18+, Python 3.11+, Docker Desktop

### Run with Docker Compose
```bash
git clone https://github.com/satishreddykarri/Agentic-Tree-DataStructure-Visualizer.git
cd Agentic-Tree-DataStructure-Visualizer
cp .env.example .env
# Edit .env with your keys
docker-compose up --build
```

Visit `http://localhost` for the app.

### Run locally (dev mode)

**Terminal 1 — Database:**
```bash
docker run -d --name agentic-tree-db \
  -e POSTGRES_DB=agentic_tree \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15
```

**Terminal 2 — Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT signing secret (min 32 chars) | Yes |
| `GROQ_API_KEY` | Groq API key from console.groq.com | Yes |
| `CORS_ORIGINS` | Comma-separated allowed frontend URLs | Yes |
| `VITE_API_BASE_URL` | Backend URL for frontend build | Yes |

---

## Health Check

```
GET https://agentic-tree-datastructure-visualizer.onrender.com/health
```
Response: `{"status": "ok", "app": "Agentic Tree API"}`
