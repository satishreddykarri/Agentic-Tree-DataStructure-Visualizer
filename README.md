# Agentic Tree — AI-Powered Binary Tree Visualizer

An AI-powered web application for creating, visualizing, and analyzing Binary Tree data structures through natural language commands and a real-time interactive canvas.

---

## Features

- **Visual Tree Builder** — Create and manipulate binary trees with drag-free node placement
- **AI Chat Assistant** — Use natural language: *"insert node 5 as left child of node 10"*
- **Traversal Animations** — Visualize Preorder, Inorder, and Postorder traversals
- **Multi-Agent AI** — LangGraph workflow with Supervisor, Operation, Query, and Explanation agents
- **Session Persistence** — Save, load, rename, and delete tree sessions
- **Chat History** — Full chat history per session
- **JWT Authentication** — Secure user accounts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, React Flow |
| Backend | FastAPI, SQLAlchemy, PostgreSQL, Alembic |
| AI | LangGraph, LangChain, Groq (Llama 3.3) |
| Deployment | Docker, Docker Compose, AWS EC2 |

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker Desktop

### 1. Clone the repository
```bash
git clone https://github.com/satishreddykarri/Agentic-Tree-DataStructure-Visualizer.git
cd Agentic-Tree-DataStructure-Visualizer
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Start with Docker Compose
```bash
docker-compose up --build
```

Visit `http://localhost` for the app and `http://localhost:8000/docs` for the API.

### 4. Or run locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database:**
```bash
docker run -d --name agentic-tree-db \
  -e POSTGRES_DB=agentic_tree \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `GROQ_API_KEY` | Groq API key (get from console.groq.com) |
| `CORS_ORIGINS` | Allowed frontend origins |
| `VITE_API_BASE_URL` | Backend API URL for frontend |

---

## Running Tests

**Backend:**
```bash
cd backend
venv\Scripts\activate
pytest tests/ -v
```

**Frontend:**
```bash
cd frontend
npx vitest --run
```

**E2E:**
```bash
cd frontend
npx playwright test
```

---

## Deployment

See [docs/deployment.md](docs/deployment.md) for full AWS EC2 deployment instructions.

---

## Project Structure

```
agentic-tree/
├── frontend/          # React + Vite frontend
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── agents/    # LangGraph multi-agent system
│   │   ├── routers/   # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── models/    # SQLAlchemy models
│   │   └── schemas/   # Pydantic schemas
├── docs/              # Documentation
└── docker-compose.yml
```
