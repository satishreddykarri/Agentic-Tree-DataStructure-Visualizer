import axiosClient from './axiosClient'
import type { User } from '@/types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  user: User
  token: string
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await axiosClient.post<{ access_token: string }>('/auth/login', {
    email: payload.email,
    password: payload.password,
  })

  const token = res.data.access_token
  const profileRes = await axiosClient.get<User>('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })

  return { user: profileRes.data, token }
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await axiosClient.post<{ access_token: string }>('/auth/register', payload)
  const token = res.data.access_token

  const profileRes = await axiosClient.get<User>('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })

  return { user: profileRes.data, token }
}

export async function fetchProfile(): Promise<User> {
  const res = await axiosClient.get<User>('/auth/profile')
  return res.data
}
