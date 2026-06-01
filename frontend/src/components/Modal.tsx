import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.box} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <span style={s.title}>{title}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.body}>{children}</div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  box: {
    backgroundColor: 'var(--panel)', border: '1px solid var(--border)',
    borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '24px',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '16px', fontWeight: 600, color: 'var(--text)' },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontSize: '16px', cursor: 'pointer', lineHeight: 1,
  },
  body: {},
}
