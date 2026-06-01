import { createSlice } from '@reduxjs/toolkit'
import type { ChatState } from '@/types'

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
})

export default chatSlice.reducer
