import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import MessageBubble from './MessageBubble'

export default function MessageList() {
  const messages = useAppSelector((s) => s.chat.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={s.list}>
      {messages.length === 0 ? (
        <div style={s.welcome}>
          <div style={s.welcomeIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L9 7H3L7.5 11L5.5 17L12 13.5L18.5 17L16.5 11L21 7H15L12 2Z" fill="#1da1f2" />
            </svg>
          </div>
          <p style={s.welcomeText}>
            Hello! How can I help you build your tree? Try{' '}
            <em>'insert node 5 as left child of node 10'</em>.
          </p>
        </div>
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  welcome: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    backgroundColor: 'var(--panel-alt)',
    border: '1px solid var(--border)',
    borderRadius: '12px 12px 12px 2px',
    padding: '12px 14px',
  },
  welcomeIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--panel)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  welcomeText: {
    fontSize: '13px',
    color: 'var(--text)',
    lineHeight: 1.6,
    margin: 0,
  },
}
