// ============================================================
// Shared TypeScript types for TreeView AI
// ============================================================

// ---------- Auth ----------
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// ---------- Tree ----------
export interface TreeNode {
  id: string
  value: number
  left: string | null   // child node id
  right: string | null  // child node id
  parentId: string | null
}

export interface TreeData {
  rootId: string | null
  nodes: Record<string, TreeNode>
}

export interface TreeState {
  nodes: Record<string, TreeNode>
  rootId: string | null
  sessionId: string | null
  sessionName: string
  isLoading: boolean
  traversalSequence: string[]
  highlightedNodeIds: string[]
  error: string | null
}

export interface TreeSession {
  id: string
  name: string
  tree_json: TreeData
  created_at: string
  updated_at: string
}

// ---------- Chat ----------
export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  error: string | null
}

// ---------- Agent Action (returned by AI) ----------
export type ActionType = 'INSERT' | 'DELETE' | 'EDIT' | 'RESET' | 'QUERY'

export interface AgentAction {
  type: ActionType
  nodeValue?: number
  parentValue?: number
  position?: 'left' | 'right'
  targetNodeValue?: number
  queryResult?: unknown
}

export interface ChatResponse {
  explanation: string
  action: AgentAction | null
  updated_tree: TreeData | null
}
