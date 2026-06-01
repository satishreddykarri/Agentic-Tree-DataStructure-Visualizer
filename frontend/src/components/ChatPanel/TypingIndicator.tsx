export default function TypingIndicator() {
  return (
    <div style={s.row}>
      <div style={s.avatar}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L9 7H3L7.5 11L5.5 17L12 13.5L18.5 17L16.5 11L21 7H15L12 2Z" fill="#1da1f2" />
        </svg>
      </div>
      <div style={s.bubble}>
        <span style={{ ...s.dot, animationDelay: '0ms' }} />
        <span style={{ ...s.dot, animationDelay: '150ms' }} />
        <span style={{ ...s.dot, animationDelay: '300ms' }} />
      </div>
      <style>{dotAnimation}</style>
    </div>
  )
}

const dotAnimation = `
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-5px); opacity: 1; }
}
`

const s: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '0 16px 8px',
  },
  avatar: {
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
  bubble: {
    backgroundColor: 'var(--panel-alt)',
    border: '1px solid var(--border)',
    borderRadius: '12px 12px 12px 2px',
    padding: '10px 14px',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  dot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--text-muted)',
    animation: 'typingBounce 1s infinite',
  },
}
