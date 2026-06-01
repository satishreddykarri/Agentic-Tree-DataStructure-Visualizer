import { useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { sendMessageThunk, addMessage } from '@/store/chatSlice'
import { v4 as uuidv4 } from 'uuid'
import type { TreeData } from '@/types'

export default function ChatInputFooter() {
  const dispatch = useAppDispatch()
  const { sessionId, nodes, rootId } = useAppSelector((s) => s.tree)
  const isTyping = useAppSelector((s) => s.chat.isTyping)

  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || isTyping || !sessionId) return

    // Add user message to chat immediately
    dispatch(addMessage({
      id: uuidv4(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }))

    setText('')

    const treeState: TreeData = { rootId, nodes }
    dispatch(sendMessageThunk({ sessionId, message: trimmed, treeState }))

    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={s.footer}>
      <input
        ref={inputRef}
        style={s.input}
        type="text"
        placeholder="Type a command..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isTyping || !sessionId}
      />
      <button
        style={{ ...s.sendBtn, opacity: (!text.trim() || isTyping || !sessionId) ? 0.5 : 1 }}
        onClick={handleSend}
        disabled={!text.trim() || isTyping || !sessionId}
      >
        Send
      </button>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--panel)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '9px 12px',
    color: 'var(--text)',
    fontSize: '13px',
    outline: 'none',
  },
  sendBtn: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
}
