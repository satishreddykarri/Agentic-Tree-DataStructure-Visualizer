interface EmptyStateProps {
  onAddRoot: () => void
}

export default function EmptyState({ onAddRoot }: EmptyStateProps) {
  return (
    <div style={s.container}>
      {/* Tree icon */}
      <div style={s.iconWrap}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="24" y="4" width="16" height="16" rx="2" stroke="#1da1f2" strokeWidth="2" fill="none" />
          <rect x="4" y="44" width="16" height="16" rx="2" stroke="#1da1f2" strokeWidth="2" fill="none" />
          <rect x="44" y="44" width="16" height="16" rx="2" stroke="#1da1f2" strokeWidth="2" fill="none" />
          <line x1="32" y1="20" x2="32" y2="32" stroke="#1da1f2" strokeWidth="2" />
          <line x1="32" y1="32" x2="12" y2="44" stroke="#1da1f2" strokeWidth="2" />
          <line x1="32" y1="32" x2="52" y2="44" stroke="#1da1f2" strokeWidth="2" />
        </svg>
      </div>

      <h3 style={s.title}>Start building your tree</h3>
      <p style={s.subtitle}>
        Click 'Add Node' on the left or use the chat on the right to begin.
      </p>

      <button style={s.btn} onClick={onAddRoot}>
        Add Root Node
      </button>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  iconWrap: { marginBottom: '8px', opacity: 0.7 },
  title: { fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: 0 },
  subtitle: { fontSize: '13px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', maxWidth: '280px' },
  btn: {
    marginTop: '8px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '8px',
    padding: '9px 20px',
    fontSize: '13px',
    cursor: 'pointer',
    pointerEvents: 'all',
    transition: 'border-color 0.15s',
  },
}
