import { createSlice } from '@reduxjs/toolkit'
import type { TreeState } from '@/types'

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

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {},
})

export default treeSlice.reducer
