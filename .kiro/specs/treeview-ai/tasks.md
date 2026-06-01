# Implementation Plan

- [x] 1. Initialize project structure and tooling
  - Create `frontend/`, `backend/`, `database/`, `docker/`, `docs/` directories
  - Initialize frontend with `npm create vite@latest` using React + TypeScript template
  - Initialize backend Python project with `requirements.txt` and `alembic.ini`
  - Create root `.env.example` with all required environment variable keys
  - _Requirements: 11.3_

- [x] 2. Configure frontend build tooling and base dependencies
- [x] 2.1 Install and configure frontend dependencies
  - Install: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `reactstrap`, `bootstrap`, `reactflow`, `axios`, `uuid`
  - Install dev deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`
  - Configure `vite.config.ts` with path aliases and test setup
  - Configure `tsconfig.json` with strict mode
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Set up global styles and theme tokens
  - Create `src/styles/global.css` with CSS variables for dark and light theme colors
  - Apply dark theme defaults: `--bg: #07121c`, `--sidebar: #0b1824`, `--panel: #0f1f2d`, `--border: #1e3446`, `--primary: #1da1f2`
  - Import Bootstrap and override with theme variables
  - _Requirements: 10.1_

- [ ] 3. Set up Redux store and slices
- [ ] 3.1 Create Redux store with authSlice
  - Create `src/store/index.ts` with `configureStore`
  - Create `src/store/authSlice.ts` with `user`, `token`, `isLoading`, `error` state
  - Implement `loginThunk`, `registerThunk`, `logoutAction` async thunks
  - Persist token to `localStorage` via store subscriber
  - _Requirements: 1.1, 1.2_

- [ ] 3.2 Create treeSlice
  - Create `src/store/treeSlice.ts` with full `TreeState` interface
  - Implement reducers: `setTree`, `addNode`, `deleteNode`, `editNode`, `resetTree`, `setHighlight`, `setTraversalSequence`
  - Implement async thunks: `saveSessionThunk`, `loadSessionThunk`
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.5_

- [ ] 3.3 Create chatSlice
  - Create `src/store/chatSlice.ts` with `messages`, `isTyping`, `error` state
  - Implement reducers: `addMessage`, `setTyping`, `clearChat`
  - Implement async thunk: `sendMessageThunk` that calls `/chat/message` and dispatches tree updates
  - _Requirements: 6.1, 6.2, 6.3, 9.1_

- [ ] 4. Create API client layer
  - Create `src/api/axiosClient.ts` with base URL from `VITE_API_BASE_URL` env var
  - Add request interceptor to attach JWT `Authorization: Bearer` header
  - Add response interceptor to dispatch logout on 401
  - Create `src/api/authApi.ts`, `src/api/treeApi.ts`, `src/api/chatApi.ts` with typed functions
  - _Requirements: 1.4, 1.5_

- [ ] 5. Build authentication pages
- [ ] 5.1 Create AuthPage with Login and Register forms
  - Create `src/pages/AuthPage.tsx` with tab-based Login/Register toggle
  - Login form: email + password fields with validation
  - Register form: name + email + password fields with validation
  - Dispatch `loginThunk` / `registerThunk` on submit, show loading state and errors
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5.2 Create ProtectedRoute component
  - Create `src/components/ProtectedRoute.tsx` that reads `auth.token` from Redux
  - Redirect unauthenticated users to `/auth`
  - _Requirements: 1.4, 1.5_

- [ ] 5.3 Set up React Router with routes
  - Configure routes in `src/App.tsx`: `/auth`, `/dashboard`, `/workspace/:sessionId`
  - Wrap `/dashboard` and `/workspace/:sessionId` with `ProtectedRoute`
  - _Requirements: 1.4_

- [ ] 6. Build the Dashboard page
  - Create `src/pages/DashboardPage.tsx` that fetches and lists user sessions via `GET /tree/sessions`
  - Render session cards with name, created date, Edit (rename) and Delete actions
  - Add "New Session" button that calls `POST /tree/session` and navigates to workspace
  - _Requirements: 8.1, 8.4, 8.5_

- [ ] 7. Build the Navbar component
  - Create `src/components/Navbar/Navbar.tsx` with 60px fixed height
  - Left: TreeView AI snowflake logo SVG + app name
  - Right: Save Tree button, Load Tree button, theme toggle icon, settings icon, user avatar, logout button
  - Save Tree dispatches `saveSessionThunk`; Logout dispatches `logoutAction`
  - Theme toggle reads/writes theme preference to `localStorage` and toggles CSS class on `<body>`
  - _Requirements: 2.1, 10.2, 10.3_

- [ ] 8. Build the Left Sidebar component
- [ ] 8.1 Create TreeOperationsPanel
  - Create `src/components/LeftSidebar/TreeOperationsPanel.tsx`
  - Render Add Node, Delete Node, Edit Node, Search Node, Connect Nodes buttons with icons
  - Each button opens a modal or inline form for input
  - On submit, dispatch the corresponding treeSlice action and call the backend API
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8.2 Create TraversalPanel
  - Create `src/components/LeftSidebar/TraversalPanel.tsx`
  - Render Pre-order, In-order, Post-order buttons with directional arrow icons
  - On click, call traversal utility, set `traversalSequence` in Redux, animate node highlights with `setTimeout` delays
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8.3 Assemble LeftSidebar with pinned Reset button
  - Create `src/components/LeftSidebar/LeftSidebar.tsx` composing both panels
  - Use flexbox column with `justify-content: space-between` to pin Reset Tree button to bottom
  - Reset Tree button dispatches `resetTree` and calls `PUT /tree/session/{id}` with empty tree
  - _Requirements: 2.2, 4.5_

- [ ] 9. Build tree utility functions
  - Create `src/utils/treeLayout.ts` with `computeLayout(nodes, rootId)` returning React Flow node positions
  - Create `src/utils/traversal.ts` with `preorder`, `inorder`, `postorder` functions returning ordered node ID arrays
  - _Requirements: 3.4, 5.1, 5.2, 5.3_

- [ ] 10. Build the Tree Canvas component
- [ ] 10.1 Create CustomTreeNode and CustomEdge
  - Create `src/components/TreeCanvas/CustomTreeNode.tsx` as a React Flow custom node
  - Render circular node with value, apply highlight class based on `data.highlight` prop
  - Create `src/components/TreeCanvas/CustomEdge.tsx` with themed edge styling
  - _Requirements: 3.1, 3.2, 5.1_

- [ ] 10.2 Create TreeCanvas with React Flow
  - Create `src/components/TreeCanvas/TreeCanvas.tsx`
  - Subscribe to `treeSlice` state, convert to React Flow `nodes` and `edges` arrays using `computeLayout`
  - Render `<ReactFlow>` with custom node/edge types, zoom controls, pan on drag
  - Show `EmptyState` component when `rootId` is null
  - _Requirements: 2.3, 3.1, 3.4, 3.5_

- [ ] 10.3 Create EmptyState component
  - Create `src/components/TreeCanvas/EmptyState.tsx`
  - Render tree icon SVG, "Start building your tree" heading, subtitle text, and "Add Root Node" button
  - Match the mockup layout exactly
  - _Requirements: 3.5_

- [ ] 11. Build the Chat Panel component
- [ ] 11.1 Create MessageBubble and MessageList
  - Create `src/components/ChatPanel/MessageBubble.tsx` with user/assistant styling and timestamp
  - Create `src/components/ChatPanel/MessageList.tsx` that maps `chatSlice.messages` to bubbles
  - Auto-scroll to bottom on new message using `useEffect` + `scrollIntoView`
  - _Requirements: 6.4, 9.5_

- [ ] 11.2 Create ChatInputFooter and TypingIndicator
  - Create `src/components/ChatPanel/ChatInputFooter.tsx` with text input and Send button
  - On send, dispatch `sendMessageThunk` with message text and current tree state
  - Create `src/components/ChatPanel/TypingIndicator.tsx` with animated dots shown when `isTyping` is true
  - _Requirements: 6.3, 6.1_

- [ ] 11.3 Assemble ChatPanel
  - Create `src/components/ChatPanel/ChatPanel.tsx` composing header, message list, typing indicator, and input footer
  - Add Export Chat button that serializes `chatSlice.messages` to JSON and triggers browser download
  - Add Clear Chat button that dispatches `clearChat` and calls `DELETE /chat/history/{sessionId}`
  - _Requirements: 2.4, 9.3, 9.4_

- [ ] 12. Assemble WorkspacePage
  - Create `src/pages/WorkspacePage.tsx` with three-panel CSS Grid layout
  - Load session on mount via `loadSessionThunk` using `sessionId` from URL params
  - Compose `<Navbar>`, `<LeftSidebar>`, `<TreeCanvas>`, `<ChatPanel>`
  - Implement responsive breakpoints: collapse sidebar on tablet, full-screen chat on mobile
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.3_

- [ ] 13. Set up backend project
- [ ] 13.1 Create FastAPI app entry point and config
  - Create `backend/app/main.py` with FastAPI app, CORS middleware, and router includes
  - Create `backend/app/config.py` using `pydantic-settings` for env var loading (`DATABASE_URL`, `SECRET_KEY`, `GEMINI_API_KEY`, `CORS_ORIGINS`)
  - Create `backend/requirements.txt` with pinned versions: `fastapi==0.111.0`, `uvicorn==0.29.0`, `sqlalchemy==2.0.30`, `alembic==1.13.1`, `psycopg2-binary==2.9.9`, `python-jose==3.3.0`, `passlib[bcrypt]==1.7.4`, `pydantic-settings==2.2.1`, `langchain==0.2.5`, `langgraph==0.1.5`, `langchain-google-genai==1.0.6`, `httpx==0.27.0`, `pytest==8.2.2`, `pytest-asyncio==0.23.7`
  - _Requirements: 11.2_

- [ ] 13.2 Set up SQLAlchemy database connection
  - Create `backend/app/database.py` with engine, `SessionLocal`, and `Base`
  - Create `backend/app/dependencies.py` with `get_db` and `get_current_user` dependency functions
  - _Requirements: 11.3_

- [ ] 14. Create database models and run migrations
- [ ] 14.1 Create SQLAlchemy models
  - Create `backend/app/models/user.py` with `User` model (id UUID, name, email, password_hash, timestamps)
  - Create `backend/app/models/tree_session.py` with `TreeSession` model (id UUID, user_id FK, name, tree_json JSONB, timestamps)
  - Create `backend/app/models/chat_history.py` with `ChatHistory` model (id UUID, user_id FK, session_id FK, role, message, timestamp)
  - _Requirements: 8.1, 9.1_

- [ ] 14.2 Configure Alembic and create initial migration
  - Configure `alembic.ini` and `alembic/env.py` to use `DATABASE_URL` from config
  - Generate initial migration with `alembic revision --autogenerate -m "initial schema"`
  - _Requirements: 11.3_

- [ ] 15. Implement authentication backend
- [ ] 15.1 Create auth schemas and service
  - Create `backend/app/schemas/auth.py` with `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UserResponse` Pydantic models
  - Create `backend/app/services/auth_service.py` with `hash_password`, `verify_password`, `create_access_token`, `decode_token` functions
  - Create `backend/app/repositories/user_repository.py` with `create_user`, `get_user_by_email` functions
  - _Requirements: 1.1, 1.2_

- [ ] 15.2 Create auth router
  - Create `backend/app/routers/auth.py` with `POST /auth/register`, `POST /auth/login`, `GET /auth/profile` endpoints
  - Register: validate unique email, hash password, create user, return JWT
  - Login: verify credentials, return JWT
  - Profile: return current user from JWT dependency
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 16. Implement tree session backend
- [ ] 16.1 Create tree schemas and repository
  - Create `backend/app/schemas/tree.py` with `SessionCreateRequest`, `SessionUpdateRequest`, `SessionResponse` Pydantic models
  - Create `backend/app/repositories/tree_repository.py` with `create_session`, `get_session`, `update_session`, `delete_session`, `list_sessions` functions
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 16.2 Create tree service and router
  - Create `backend/app/services/tree_service.py` with business logic wrapping the repository
  - Create `backend/app/routers/tree.py` with all session CRUD endpoints
  - Enforce ownership check: users can only access their own sessions
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 17. Implement LangGraph multi-agent system
- [ ] 17.1 Define AgentState and graph skeleton
  - Create `backend/app/agents/graph.py` with `AgentState` TypedDict and `StateGraph` definition
  - Wire nodes: `supervisor → tree_operation | tree_query | explanation → END`
  - Export `compiled_graph = graph.compile()`
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 17.2 Implement Supervisor Agent
  - Create `backend/app/agents/supervisor.py` with `supervisor_node` function
  - Use Gemini with a few-shot classification prompt to set `state["intent"]`
  - Return routing decision: `TREE_OPERATION`, `TREE_QUERY`, or `UNKNOWN`
  - _Requirements: 7.1, 7.5_

- [ ] 17.3 Implement Tree Operation Agent
  - Create `backend/app/agents/tree_operation.py` with `tree_operation_node` function
  - Use Gemini to parse the user message into a structured action dict
  - Validate the action against the current `tree_state` (e.g., check parent exists, position is free)
  - Set `state["action"]` with the parsed operation
  - _Requirements: 7.2, 6.1_

- [ ] 17.4 Implement Tree Query Agent
  - Create `backend/app/agents/tree_query.py` with `tree_query_node` function
  - Implement pure Python functions: `get_height`, `get_leaf_nodes`, `get_node_count`, `get_traversal`, `get_parent`
  - Compute answer from `state["tree_state"]` without calling Gemini
  - Set `state["action"]` with the query result
  - _Requirements: 7.3, 6.2_

- [ ] 17.5 Implement Explanation Agent
  - Create `backend/app/agents/explanation.py` with `explanation_node` function
  - Use Gemini to generate a friendly, educational explanation from `state["action"]`
  - Set `state["explanation"]` with the final response text
  - _Requirements: 7.4, 7.5_

- [ ] 18. Implement chat backend
- [ ] 18.1 Create chat schemas and repository
  - Create `backend/app/schemas/chat.py` with `ChatMessageRequest`, `ChatMessageResponse`, `ChatHistoryItem` Pydantic models
  - Create `backend/app/repositories/chat_repository.py` with `save_message`, `get_history`, `delete_history` functions
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 18.2 Create chat service and router
  - Create `backend/app/services/chat_service.py` that invokes `compiled_graph` with the user message and tree state
  - Persist user message and AI response to `chat_history` table
  - Create `backend/app/routers/chat.py` with `POST /chat/message`, `GET /chat/history/{sessionId}`, `DELETE /chat/history/{sessionId}`
  - _Requirements: 6.1, 6.2, 9.1, 9.2, 9.3_

- [ ] 19. Create Dockerfiles and Docker Compose
- [ ] 19.1 Create frontend Dockerfile
  - Multi-stage: Stage 1 Node 20 Alpine builds with `npm ci && npm run build`; Stage 2 Nginx Alpine serves `/dist` with SPA fallback
  - Create `frontend/nginx.conf` with `try_files $uri /index.html`
  - _Requirements: 11.1_

- [ ] 19.2 Create backend Dockerfile
  - Python 3.11 slim base, install deps, copy app, create `entrypoint.sh` that runs `alembic upgrade head` then starts uvicorn
  - _Requirements: 11.2_

- [ ] 19.3 Create docker-compose.yml
  - Define `postgres`, `backend`, `frontend` services with correct `depends_on`, env vars, port mappings, and named volume for postgres data
  - _Requirements: 11.3, 11.4, 11.5_

- [ ] 20. Write backend tests
- [ ] 20.1 Write unit tests for tree algorithms and auth service
  - Create `backend/tests/unit/test_tree_algorithms.py` testing `get_height`, `get_leaf_nodes`, `get_traversal` with sample tree dicts
  - Create `backend/tests/unit/test_auth_service.py` testing password hashing and JWT encode/decode
  - _Requirements: 12.1_

- [ ] 20.2 Write API tests for auth, tree, and chat endpoints
  - Create `backend/tests/api/test_auth.py` using `httpx.AsyncClient` with `pytest-asyncio`
  - Create `backend/tests/api/test_tree.py` covering session CRUD with authenticated requests
  - Create `backend/tests/api/test_chat.py` covering message endpoint with mocked LangGraph
  - _Requirements: 12.2_

- [ ] 21. Write frontend component tests
  - Create `frontend/src/pages/AuthPage.test.tsx` testing form rendering and submit behavior
  - Create `frontend/src/components/TreeCanvas/TreeCanvas.test.tsx` testing empty state rendering
  - Create `frontend/src/components/ChatPanel/ChatPanel.test.tsx` testing message display
  - _Requirements: 12.3_

- [ ]* 22. Write Playwright end-to-end tests
  - Create `frontend/e2e/auth.spec.ts` covering register and login flow against running app
  - Create `frontend/e2e/tree_workflow.spec.ts` covering session creation, adding nodes via chat, and verifying canvas
  - _Requirements: 12.4, 12.5_

- [ ] 23. Create deployment documentation
  - Create `docs/deployment.md` with step-by-step EC2 setup: launch instance, install Docker, clone repo, configure `.env`, run `docker-compose up -d --build`
  - Create root `README.md` with project overview, local dev setup commands, and environment variable reference
  - _Requirements: 11.4_
