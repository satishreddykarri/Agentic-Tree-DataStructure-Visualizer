import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import treeReducer from './treeSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tree: treeReducer,
    chat: chatReducer,
  },
})

// Inferred types for use throughout the app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
