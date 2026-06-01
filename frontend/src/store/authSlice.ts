import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types'
import { loginRequest, registerRequest, fetchProfile } from '@/api/authApi'

// ---------- Constants ----------
const TOKEN_KEY = 'treeview-ai-token'

// ---------- Async Thunks ----------

export const loginThunk = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginRequest(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    return data
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return rejectWithValue(message)
  }
})

export const registerThunk = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerRequest(payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    return data
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    return rejectWithValue(message)
  }
})

export const fetchProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await fetchProfile()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile'
    return rejectWithValue(message)
  }
})

// ---------- Initial State ----------
const storedToken = localStorage.getItem(TOKEN_KEY)

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isLoading: false,
  error: null,
}

// ---------- Slice ----------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem(TOKEN_KEY)
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Login failed'
      })

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Registration failed'
      })

    // Fetch Profile
    builder
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchProfileThunk.rejected, (state) => {
        // Token is invalid — clear it
        state.user = null
        state.token = null
        localStorage.removeItem(TOKEN_KEY)
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
