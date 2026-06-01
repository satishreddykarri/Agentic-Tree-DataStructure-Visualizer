# Requirements Document

## Introduction

Agentic-Tree is a full-stack AI-powered web application that enables users to create, visualize, manipulate, analyze, and manage Binary Tree data structures through manual UI operations, natural language commands, and AI-powered analysis. The application features a three-panel dark-themed developer workspace layout with real-time tree visualization, an integrated AI chat assistant powered by a LangGraph multi-agent system, JWT-based authentication, and full session/chat history persistence backed by PostgreSQL.

## Glossary

- **Agentic-Tree**: The name of the application being built
- **Binary Tree**: A tree data structure where each node has at most two children, referred to as left child and right child
- **Generic Binary Tree**: A binary tree where node placement is explicitly defined by the user (not auto-sorted like a BST)
- **Node**: A single element in the binary tree containing a numeric value, an ID, and optional left/right child references
- **Root Node**: The topmost node in the tree with no parent
- **Leaf Node**: A node with no children
- **Traversal**: A method of visiting all nodes in a tree in a specific order (Preorder, Inorder, Postorder)
- **React Flow**: A React library used to render interactive node-based diagrams
- **Redux Toolkit**: A state management library for React applications
- **LangGraph**: A framework for building stateful multi-agent AI workflows
- **LangChain**: A framework for building LLM-powered applications
- **Gemini**: Google's large language model used as the AI backend
- **Supervisor Agent**: The LangGraph agent responsible for classifying user intent and routing to the appropriate sub-agent
- **Tree Operation Agent**: The LangGraph agent that handles structural tree modifications
- **Tree Query Agent**: The LangGraph agent that handles read-only tree analysis
- **Explanation Agent**: The LangGraph agent that converts structured results into human-readable responses
- **Session**: A named workspace containing a tree state and associated chat history
- **JWT**: JSON Web Token used for stateless authentication
- **FastAPI**: The Python web framework used for the backend API
- **SQLAlchemy**: The Python ORM used for database interactions
- **Alembic**: The database migration tool for SQLAlchemy
- **Docker**: Containerization platform used to package and run services
- **EC2**: Amazon Elastic Compute Cloud, the AWS service used for deployment
- **authSlice**: Redux slice managing authentication state
- **treeSlice**: Redux slice managing tree state
- **chatSlice**: Redux slice managing chat history state

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a developer, I want to register and log in to the application, so that my tree sessions and chat history are securely saved and associated with my account.

#### Acceptance Criteria

1. WHEN a user submits a registration form with a unique email, name, and password, THE System SHALL create a new user account with a bcrypt-hashed password and return a JWT access token.
2. WHEN a user submits a login form with valid credentials, THE System SHALL validate the credentials against the stored bcrypt hash and return a signed JWT access token.
3. WHEN a user submits a login form with invalid credentials, THE System SHALL return an HTTP 401 response with an error message.
4. WHILE a user holds a valid JWT token, THE System SHALL allow access to all protected API endpoints.
5. IF a request is made to a protected endpoint without a valid JWT token, THEN THE System SHALL return an HTTP 401 Unauthorized response.

---

### Requirement 2: Three-Panel Workspace Layout

**User Story:** As a user, I want a professional three-panel dark-themed workspace, so that I can simultaneously view tree controls, the tree canvas, and the AI chat panel.

#### Acceptance Criteria

1. THE System SHALL render a fixed top navbar of 60px height containing the TreeView AI logo, application name, Save Tree button, Load Tree button, theme toggle, settings button, user avatar, and logout button.
2. THE System SHALL render a left sidebar of 250px width containing tree operation controls and traversal animation controls with a pinned Reset Tree button at the bottom.
3. THE System SHALL render a center panel using React Flow for tree visualization with zoom controls, pan controls, and an empty state message when no nodes exist.
4. THE System SHALL render a right chat panel of 320px to 380px width containing the AI Assistant header, chat message area, and a message input footer.
5. WHEN the viewport width is below 768px, THE System SHALL collapse the sidebar into a hamburger menu drawer and allow the chat panel to occupy the full screen.

---

### Requirement 3: Binary Tree Visualization

**User Story:** As a user, I want to visually build and view a generic binary tree on a canvas, so that I can understand the structure of my tree in real time.

#### Acceptance Criteria

1. WHEN a user adds the first node, THE System SHALL render that node as the root at the center of the React Flow canvas.
2. WHEN a user inserts a node specifying an explicit parent and child position (left or right), THE System SHALL add the node to the tree and re-render the canvas with updated layout.
3. IF a user attempts to insert a node into an already-occupied child position, THEN THE System SHALL display an error message and reject the operation.
4. WHEN a node is added or removed, THE System SHALL automatically recalculate and apply a hierarchical layout to all nodes on the canvas.
5. WHILE the tree contains no nodes, THE System SHALL display the empty state UI with the message "Start building your tree" and an "Add Root Node" button.

---

### Requirement 4: Tree Operations via UI

**User Story:** As a user, I want to add, delete, edit, search, and connect nodes through the sidebar controls, so that I can manually build and modify my binary tree.

#### Acceptance Criteria

1. WHEN a user clicks "Add Node" and submits the node form with a value, parent ID, and position (left/right), THE System SHALL insert the node into the tree state and persist it to the backend.
2. WHEN a user clicks "Delete Node" and selects a node, THE System SHALL remove that node and all its descendants from the tree state and persist the change.
3. WHEN a user clicks "Edit Node" and submits a new value for an existing node, THE System SHALL update that node's value in the tree state and persist the change.
4. WHEN a user clicks "Search Node" and enters a value, THE System SHALL highlight the matching node on the canvas and display its position information.
5. WHEN a user clicks "Reset Tree", THE System SHALL clear all nodes from the tree state and persist the empty tree to the backend.

---

### Requirement 5: Traversal Animations

**User Story:** As a user, I want to animate tree traversals visually, so that I can understand how Preorder, Inorder, and Postorder algorithms work.

#### Acceptance Criteria

1. WHEN a user clicks "Pre-order Traversal", THE System SHALL animate node highlighting in root→left→right order with a visible delay between each step.
2. WHEN a user clicks "In-order Traversal", THE System SHALL animate node highlighting in left→root→right order with a visible delay between each step.
3. WHEN a user clicks "Post-order Traversal", THE System SHALL animate node highlighting in left→right→root order with a visible delay between each step.
4. WHILE a traversal animation is running, THE System SHALL display the traversal sequence as an ordered list below the canvas or in a status area.
5. WHEN a traversal animation completes, THE System SHALL reset all node highlight states to their default appearance.

---

### Requirement 6: AI Chat Assistant

**User Story:** As a user, I want to type natural language commands and questions into the chat panel, so that I can build and analyze my tree without using the manual UI controls.

#### Acceptance Criteria

1. WHEN a user sends a natural language tree operation command (e.g., "Insert node 8 as left child of node 4"), THE System SHALL parse the intent, execute the tree operation, update the Redux state, and return a confirmation message.
2. WHEN a user sends a tree query (e.g., "What is the height of the tree?"), THE System SHALL compute the answer from the current tree state and return a human-readable explanation.
3. WHEN a user sends a message, THE System SHALL display a typing indicator in the chat panel while the AI response is being generated.
4. WHILE the chat panel is open, THE System SHALL auto-scroll to the latest message after each new message is added.
5. IF the AI cannot parse or execute a user command, THEN THE System SHALL return a helpful error message explaining what went wrong and suggesting correct syntax.

---

### Requirement 7: LangGraph Multi-Agent Workflow

**User Story:** As a developer, I want the AI backend to use a LangGraph multi-agent architecture, so that user intents are correctly classified and routed to specialized agents.

#### Acceptance Criteria

1. WHEN a chat message is received by the backend, THE System SHALL pass it through the Supervisor Agent which classifies the intent as TREE_OPERATION, TREE_QUERY, or SESSION_MANAGEMENT.
2. WHEN the intent is TREE_OPERATION, THE System SHALL route the message to the Tree Operation Agent which returns a structured action payload.
3. WHEN the intent is TREE_QUERY, THE System SHALL route the message to the Tree Query Agent which returns a structured analysis result.
4. WHEN either the Tree Operation Agent or Tree Query Agent produces a result, THE System SHALL pass that result to the Explanation Agent which generates a human-readable response.
5. IF the Supervisor Agent cannot classify the intent with sufficient confidence, THEN THE System SHALL route to the Explanation Agent directly to request clarification from the user.

---

### Requirement 8: Session Management

**User Story:** As a user, I want to create, save, load, rename, and delete named tree sessions, so that I can work on multiple trees and resume my work later.

#### Acceptance Criteria

1. WHEN a user creates a new session, THE System SHALL initialize an empty tree state and empty chat history associated with that session and persist both to the database.
2. WHEN a user saves a session, THE System SHALL serialize the current Redux tree state to JSON and persist it to the tree_sessions table in the database.
3. WHEN a user loads a session, THE System SHALL retrieve the tree JSON and chat history from the database and restore both into the Redux store.
4. WHEN a user renames a session, THE System SHALL update the session name in the database and reflect the change in the session list UI.
5. WHEN a user deletes a session, THE System SHALL remove the session record and all associated chat history records from the database.

---

### Requirement 9: Chat History Persistence

**User Story:** As a user, I want my chat history to be saved per session, so that I can review past AI interactions when I reload a session.

#### Acceptance Criteria

1. WHEN a user sends a message or receives an AI response, THE System SHALL persist both the user message and AI response to the chat_history table with the correct session ID, role, and timestamp.
2. WHEN a user loads a session, THE System SHALL retrieve and display all chat messages for that session in chronological order.
3. WHEN a user clicks "Clear Chat", THE System SHALL delete all chat_history records for the current session and clear the chat panel UI.
4. WHEN a user clicks "Export Chat", THE System SHALL generate a downloadable text or JSON file containing the full chat history for the current session.
5. WHILE a session is active, THE System SHALL display message timestamps alongside each chat message.

---

### Requirement 10: Theme System

**User Story:** As a user, I want to toggle between dark and light themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE System SHALL default to dark theme with background color #07121c, sidebar color #0b1824, panel color #0f1f2d, border color #1e3446, primary color #1da1f2, white text, and muted text #8fa6b8.
2. WHEN a user clicks the theme toggle button, THE System SHALL switch between dark and light themes and apply the new theme across all panels immediately.
3. WHEN a user sets a theme preference, THE System SHALL persist that preference to localStorage and restore it on the next application load.

---

### Requirement 11: Dockerization

**User Story:** As a DevOps engineer, I want the entire application to run via Docker Compose, so that it can be deployed consistently across environments.

#### Acceptance Criteria

1. THE System SHALL provide a Dockerfile for the frontend that builds the React application and serves it via a production-grade web server.
2. THE System SHALL provide a Dockerfile for the backend that installs Python dependencies and runs the FastAPI application.
3. THE System SHALL provide a docker-compose.yml that defines frontend, backend, and postgres services with correct networking, environment variable injection, and volume mounts for database persistence.
4. WHEN `docker-compose up` is executed, THE System SHALL start all three services and make the application accessible on the configured host port.
5. IF any service fails to start, THE System SHALL log the error to stdout so it is visible via `docker-compose logs`.

---

### Requirement 12: Automated Testing

**User Story:** As a QA engineer, I want automated tests covering authentication, tree operations, session persistence, and the chat system, so that regressions are caught before deployment.

#### Acceptance Criteria

1. THE System SHALL include Pytest unit tests covering the tree operation logic, JWT authentication, and database model interactions.
2. THE System SHALL include Pytest API tests covering all REST endpoints for auth, tree, and chat routes.
3. THE System SHALL include React Testing Library component tests covering the login form, tree canvas empty state, and chat panel rendering.
4. THE System SHALL include at least one Playwright end-to-end test covering the full flow of registering, creating a tree session, adding nodes via chat, and verifying the canvas updates.
5. WHERE the CI environment supports it, THE System SHALL run all backend tests via `pytest` and all frontend tests via `vitest --run` without requiring a live database connection for unit tests.
