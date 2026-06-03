import axios from 'axios'
import { store } from '@/store'
import { logout } from '@/store/authSlice'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://agentic-tree-datastructure-visualizer.onrender.com/'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401 — but NOT for auth endpoints (login/register failures are expected 401s)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      store.dispatch(logout())
    }
    // Normalize error message for rejectWithValue
    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      'An error occurred'
    return Promise.reject(new Error(message))
  },
)

export default axiosClient
