import axiosClient from './axiosClient'
import type { ChatMessage, ChatResponse, TreeData } from '@/types'

interface SendMessagePayload {
  session_id: string
  message: string
  tree_state: TreeData
}

export async function sendMessage(payload: SendMessagePayload): Promise<ChatResponse> {
  const res = await axiosClient.post<ChatResponse>('/chat/message', payload)
  return res.data
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const res = await axiosClient.get<ChatMessage[]>(`/chat/history/${sessionId}`)
  return res.data
}

export async function clearChatHistory(sessionId: string): Promise<void> {
  await axiosClient.delete(`/chat/history/${sessionId}`)
}
