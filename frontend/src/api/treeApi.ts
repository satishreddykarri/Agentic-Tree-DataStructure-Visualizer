import axiosClient from './axiosClient'
import type { TreeData, TreeSession } from '@/types'

export async function createSession(name: string): Promise<TreeSession> {
  const res = await axiosClient.post<TreeSession>('/tree/session', { name })
  return res.data
}

export async function loadSession(sessionId: string): Promise<TreeSession> {
  const res = await axiosClient.get<TreeSession>(`/tree/session/${sessionId}`)
  return res.data
}

export async function saveSession(sessionId: string, treeData: TreeData): Promise<TreeSession> {
  const res = await axiosClient.put<TreeSession>(`/tree/session/${sessionId}`, {
    tree_json: treeData,
  })
  return res.data
}

export async function deleteSession(sessionId: string): Promise<void> {
  await axiosClient.delete(`/tree/session/${sessionId}`)
}

export async function listSessions(): Promise<TreeSession[]> {
  const res = await axiosClient.get<TreeSession[]>('/tree/sessions')
  return res.data
}

export async function renameSession(sessionId: string, name: string): Promise<TreeSession> {
  const res = await axiosClient.put<TreeSession>(`/tree/session/${sessionId}`, { name })
  return res.data
}
