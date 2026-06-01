import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearChat } from '@/store/chatSlice'
import { clearChatHistory } from '@/api/chatApi'
import MessageList from './MessageList'
import TypingIndicator from './TypingIndicator'
import ChatInputFooter from './ChatInputFooter'

export default function ChatPanel() {
  const dispatch = useAppDispatch()
  const { messages, isTyping } = useAppSelector((s) => s.chat)
  const sessionId = useAppSelector((s) => s.tree.sessionId)

  const handleClearChat = async () => {
    if (!confirm('Clear all chat history?')) return
    dispatch(clearChat())
    if (sessionId) {
      try { await clearChatHistory(sessionId) } catch { /* silent */ }
    }
  }

  const handleExportChat = () => {
    if (messages.length === 0) return
    const content = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-history-${sessionId ?? 'session'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerDot} />
          <span style={s.headerTitle}>AI Assistant</span>
        </div>
        <div style={s.headerActions}>
          <button style={s.iconBtn} onClick={handleExportChat} title="Export chat" disabled={messages.length === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button style={s.iconBtn} onClick={handleClearChat} title="Clear chat" disabled={messages.length === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}

      {/* Input */}
      <ChatInputFooter />
    </aside>
  )
}

const s: Record<string, React.CSSProperties> = {
  panel: {
    width: '340px',
    flexShrink: 0,
    backgroundColor: 'var(--panel)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    height: '48px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  headerDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    backgroundColor: 'var(--success)',
  },
  headerTitle: { fontSize: '13px', fontWeight: 600, color: 'var(--text)' },
  headerActions: { display: 'flex', gap: '4px' },
  iconBtn: {
    background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
    borderRadius: '6px', width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
}
