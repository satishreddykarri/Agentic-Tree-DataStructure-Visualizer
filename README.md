# Agentic Tree — AI-Powered Binary Tree Visualizer

An AI-powered web application for creating, visualizing, and analyzing Binary Tree data structures through natural language commands and a real-time interactive canvas.

## Live Demo

| | URL |
|-|-----|
| Frontend | https://agentic-tree-datastructure-visualizer-1.onrender.com |
| Backend API | https://agentic-tree-datastructure-visualizer.onrender.com |
| API Docs | https://agentic-tree-datastructure-visualizer.onrender.com/docs |

---

## Features

- **Visual Tree Builder** — Create and manipulate binary trees with explicit node placement
- **AI Chat Assistant** — Natural language commands: *"insert node 5 as left child of node 10"*
- **Traversal Animations** — Visualize Preorder, Inorder, and Postorder traversals step by step
- **Multi-Agent AI** — LangGraph workflow with Supervisor, Operation, Query, and Explanation agents powered by Groq Llama 3.3
- **Session Persistence** — Save, load, rename, and delete tree sessions
- **Chat History** — Full chat history per session, exportable
- **JWT Authentication** — Secure user accounts with bcrypt password hashing

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, React Flow, Bootstrap |
| Backend | FastAPI, SQLAlchemy, PostgreSQL, Alembic, JWT |
| AI | LangGraph, LangChain, Groq (Llama 3.3-70b) |
| Database | Neon PostgreSQL (cloud) |
| Deployment | Render (Docker), Docker Compose |
| Testing | Pytest, Vitest, Playwright |

---

## Local Development

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
# Edit .env and add your GROQ_API_KEY and DATABASE_URL
```

### 3. Start with Docker Compose
```bash
docker-compose up --build
```
Visit `http://localhost`

### 4. Or run locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`

---

## Running Tests

**Backend unit + API tests:**
```bash
cd backend
venv\Scripts\activate
python -m pytest tests/ -v
```

**Frontend utility tests:**
```bash
cd frontend
npx vitest --run
```

**E2E tests** (requires frontend + backend running):
```bash
cd frontend
npx playwright test
npx playwright show-report
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `GROQ_API_KEY` | Groq API key (console.groq.com) |
| `CORS_ORIGINS` | Allowed frontend origins |
| `VITE_API_BASE_URL` | Backend API URL |

---

## Project Structure

```
agentic-tree/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # AuthPage, DashboardPage, WorkspacePage
│   │   ├── components/    # Navbar, LeftSidebar, TreeCanvas, ChatPanel
│   │   ├── store/         # Redux slices (auth, tree, chat)
│   │   ├── api/           # Axios API client
│   │   └── utils/         # treeLayout, traversal algorithms
│   └── e2e/               # Playwright tests
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── agents/        # LangGraph multi-agent system
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── models/        # SQLAlchemy models
│   │   └── schemas/       # Pydantic schemas
│   └── tests/             # Pytest tests
├── docs/                  # Deployment documentation
└── docker-compose.yml
```

---

## Deployment

See [docs/deployment.md](docs/deployment.md) for full deployment instructions on Render.
