import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TreeState, TreeNode, TreeData } from '@/types'
import { saveSession, loadSession } from '@/api/treeApi'

// ---------- Async Thunks ----------

export const saveSessionThunk = createAsyncThunk<
  void,
  { sessionId: string; treeData: TreeData },
  { rejectValue: string }
>('tree/saveSession', async ({ sessionId, treeData }, { rejectWithValue }) => {
  try {
    await saveSession(sessionId, treeData)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save session'
    return rejectWithValue(message)
  }
})

export const loadSessionThunk = createAsyncThunk<
  { sessionId: string; sessionName: string; treeData: TreeData },
  string,
  { rejectValue: string }
>('tree/loadSession', async (sessionId, { rejectWithValue }) => {
  try {
    const session = await loadSession(sessionId)
    return {
      sessionId: session.id,
      sessionName: session.name,
      treeData: session.tree_json,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load session'
    return rejectWithValue(message)
  }
})

// ---------- Initial State ----------

const initialState: TreeState = {
  nodes: {},
  rootId: null,
  sessionId: null,
  sessionName: 'Untitled Session',
  isLoading: false,
  traversalSequence: [],
  highlightedNodeIds: [],
  error: null,
}

// ---------- Slice ----------

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    // Set the entire tree from a loaded session or AI response
    setTree(state, action: PayloadAction<TreeData>) {
      state.nodes = action.payload.nodes
      state.rootId = action.payload.rootId
      state.error = null
    },

    // Add a new node to the tree
    addNode(
      state,
      action: PayloadAction<{
        node: TreeNode
        parentId: string | null
        position: 'left' | 'right' | null
      }>
    ) {
      const { node, parentId, position } = action.payload
      state.nodes[node.id] = node

      // If it's the first node, set as root
      if (!parentId) {
        state.rootId = node.id
        return
      }

      // Link to parent
      const parent = state.nodes[parentId]
      if (parent && position) {
        parent[position] = node.id
      }
    },

    // Delete a node and all its descendants
    deleteNode(state, action: PayloadAction<string>) {
      const nodeId = action.payload

      // Collect all descendant IDs recursively
      const toDelete: string[] = []
      const collect = (id: string) => {
        toDelete.push(id)
        const node = state.nodes[id]
        if (node?.left) collect(node.left)
        if (node?.right) collect(node.right)
      }
      collect(nodeId)

      // Unlink from parent
      const node = state.nodes[nodeId]
      if (node?.parentId) {
        const parent = state.nodes[node.parentId]
        if (parent) {
          if (parent.left === nodeId) parent.left = null
          if (parent.right === nodeId) parent.right = null
        }
      }

      // Remove all collected nodes
      toDelete.forEach((id) => delete state.nodes[id])

      // Update root if needed
      if (state.rootId === nodeId) {
        state.rootId = null
      }
    },

    // Edit a node's value
    editNode(state, action: PayloadAction<{ nodeId: string; value: number }>) {
      const { nodeId, value } = action.payload
      if (state.nodes[nodeId]) {
        state.nodes[nodeId].value = value
      }
    },

    // Reset the entire tree
    resetTree(state) {
      state.nodes = {}
      state.rootId = null
      state.traversalSequence = []
      state.highlightedNodeIds = []
      state.error = null
    },

    // Set highlighted nodes during traversal animation
    setHighlightedNodes(state, action: PayloadAction<string[]>) {
      state.highlightedNodeIds = action.payload
    },

    // Set the traversal sequence display
    setTraversalSequence(state, action: PayloadAction<string[]>) {
      state.traversalSequence = action.payload
    },

    // Set session metadata
    setSession(state, action: PayloadAction<{ sessionId: string; sessionName: string }>) {
      state.sessionId = action.payload.sessionId
      state.sessionName = action.payload.sessionName
    },

    clearTreeError(state) {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    // Save session
    builder
      .addCase(saveSessionThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(saveSessionThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(saveSessionThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to save'
      })

    // Load session
    builder
      .addCase(loadSessionThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadSessionThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.sessionId = action.payload.sessionId
        state.sessionName = action.payload.sessionName
        state.nodes = action.payload.treeData.nodes ?? {}
        state.rootId = action.payload.treeData.rootId
        state.traversalSequence = []
        state.highlightedNodeIds = []
      })
      .addCase(loadSessionThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load session'
      })
  },
})

export const {
  setTree,
  addNode,
  deleteNode,
  editNode,
  resetTree,
  setHighlightedNodes,
  setTraversalSequence,
  setSession,
  clearTreeError,
} = treeSlice.actions

export default treeSlice.reducer
