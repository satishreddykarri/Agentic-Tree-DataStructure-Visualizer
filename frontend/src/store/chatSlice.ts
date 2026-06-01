import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ChatState, ChatMessage, TreeData } from '@/types'
import { sendMessage } from '@/api/chatApi'
import { setTree } from './treeSlice'
import { v4 as uuidv4 } from 'uuid'

// ---------- Async Thunks ----------

export const sendMessageThunk = createAsyncThunk<
  ChatMessage,           // what we return on success (the assistant message)
  { sessionId: string; message: string; treeState: TreeData },
  { rejectValue: string }
>('chat/sendMessage', async ({ sessionId, message, treeState }, { dispatch, rejectWithValue }) => {
  try {
    const response = await sendMessage({ session_id: sessionId, message, tree_state: treeState })

    // If the AI returned an updated tree, sync it to Redux immediately
    if (response.updated_tree) {
      dispatch(setTree(response.updated_tree))
    }

    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: response.explanation,
      timestamp: new Date().toISOString(),
    }

    return assistantMessage
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send message'
    return rejectWithValue(message)
  }
})

// ---------- Initial State ----------

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  error: null,
}

// ---------- Slice ----------

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload)
    },

    setTyping(state, action: PayloadAction<boolean>) {
      state.isTyping = action.payload
    },

    clearChat(state) {
      state.messages = []
      state.error = null
    },

    // Load chat history from backend when a session is loaded
    loadChatHistory(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload
    },

    clearChatError(state) {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.isTyping = true
        state.error = null
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.isTyping = false
        state.messages.push(action.payload)
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.isTyping = false
        state.error = action.payload ?? 'Something went wrong'
      })
  },
})

export const {
  addMessage,
  setTyping,
  clearChat,
  loadChatHistory,
  clearChatError,
} = chatSlice.actions

export default chatSlice.reducer
