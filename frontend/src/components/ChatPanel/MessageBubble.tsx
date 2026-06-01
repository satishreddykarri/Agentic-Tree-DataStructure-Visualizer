import type { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div style={{ ...s.row, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {/* AI avatar */}
      {!isUser && (
        <div style={s.aiAvatar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L9 7H3L7.5 11L5.5 17L12 13.5L18.5 17L16.5 11L21 7H15L12 2Z" fill="#1da1f2" />
          </svg>
        </div>
      )}

      <div style={{ maxWidth: '80%' }}>
        <div style={isUser ? s.userBubble : s.aiBubble}>
          {message.content}
        </div>
        <p style={{ ...s.timestamp, textAlign: isUser ? 'right' : 'left' }}>{time}</p>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '12px',
  },
  aiAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--panel-alt)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userBubble: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    borderRadius: '12px 12px 2px 12px',
    padding: '10px 14px',
    fontSize: '13px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  aiBubble: {
    backgroundColor: 'var(--panel-alt)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '12px 12px 12px 2px',
    padding: '10px 14px',
    fontSize: '13px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    margin: '4px 2px 0',
  },
}
