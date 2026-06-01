import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import { setSession } from '@/store/treeSlice'
import { listSessions, createSession, deleteSession, renameSession } from '@/api/treeApi'
import type { TreeSession } from '@/types'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)

  const [sessions, setSessions] = useState<TreeSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const data = await listSessions()
      setSessions(data)
    } catch {
      setError('Failed to load sessions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchSessions() }, [])

  const handleNewSession = async () => {
    try {
      setCreating(true)
      const session = await createSession('Untitled Session')
      dispatch(setSession({ sessionId: session.id, sessionName: session.name }))
      navigate(`/workspace/${session.id}`)
    } catch {
      setError('Failed to create session')
    } finally {
      setCreating(false)
    }
  }

  const handleLoad = (session: TreeSession) => {
    dispatch(setSession({ sessionId: session.id, sessionName: session.name }))
    navigate(`/workspace/${session.id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this session? This cannot be undone.')) return
    try {
      await deleteSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setError('Failed to delete session')
    }
  }

  const handleRenameSubmit = async (id: string) => {
    if (!renameValue.trim()) return
    try {
      const updated = await renameSession(id, renameValue.trim())
      setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)))
      setRenamingId(null)
    } catch {
      setError('Failed to rename session')
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L9 7H3L7.5 11L5.5 17L12 13.5L18.5 17L16.5 11L21 7H15L12 2Z" fill="#1da1f2" />
          </svg>
          <span style={s.logoText}>Agentic Tree</span>
        </div>
        <div style={s.headerRight}>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={s.content}>
        <div style={s.titleRow}>
          <div>
            <h2 style={s.pageTitle}>My Tree Sessions</h2>
            <p style={s.pageSubtitle}>Pick up where you left off or start something new</p>
          </div>
          <button style={s.newBtn} onClick={handleNewSession} disabled={creating}>
            {creating ? 'Creating...' : '+ New Session'}
          </button>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        {isLoading ? (
          <p style={s.muted}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div style={s.emptyState}>
            <p style={s.emptyTitle}>No sessions yet</p>
            <p style={s.muted}>Click "New Session" to get started</p>
          </div>
        ) : (
          <div style={s.grid}>
            {sessions.map((session) => (
              <div key={session.id} style={s.card}>
                {renamingId === session.id ? (
                  <div style={s.renameRow}>
                    <input
                      style={s.renameInput}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit(session.id)
                        if (e.key === 'Escape') setRenamingId(null)
                      }}
                      autoFocus
                    />
                    <button style={s.saveBtn} onClick={() => handleRenameSubmit(session.id)}>Save</button>
                    <button style={s.cancelBtn} onClick={() => setRenamingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <h3 style={s.sessionName}>{session.name}</h3>
                )}
                <p style={s.sessionDate}>Created {formatDate(session.created_at)}</p>
                <div style={s.cardActions}>
                  <button style={s.loadBtn} onClick={() => handleLoad(session)}>Open</button>
                  <button
                    style={s.renameBtn}
                    onClick={() => { setRenamingId(session.id); setRenameValue(session.name) }}
                  >
                    Rename
                  </button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(session.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' },
  header: {
    height: '60px', backgroundColor: 'var(--sidebar)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '18px', fontWeight: 700, color: 'var(--text)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { fontSize: '14px', color: 'var(--text-muted)' },
  logoutBtn: {
    background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
    borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  pageTitle: { fontSize: '24px', fontWeight: 700, margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--text-muted)', margin: 0 },
  newBtn: {
    backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '20px',
  },
  muted: { color: 'var(--text-muted)', fontSize: '14px' },
  emptyState: { textAlign: 'center', padding: '60px 0' },
  emptyTitle: { fontSize: '18px', fontWeight: 600, marginBottom: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: {
    backgroundColor: 'var(--panel)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '20px',
  },
  sessionName: { fontSize: '16px', fontWeight: 600, margin: '0 0 6px', color: 'var(--text)' },
  sessionDate: { fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' },
  cardActions: { display: 'flex', gap: '8px' },
  loadBtn: {
    flex: 1, backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '7px', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
  },
  renameBtn: {
    backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '7px 10px', fontSize: '13px', cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: 'transparent', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px', padding: '7px 10px', fontSize: '13px', cursor: 'pointer',
  },
  renameRow: { display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' },
  renameInput: {
    flex: 1, backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '6px 8px', color: 'var(--text)', fontSize: '13px',
  },
  saveBtn: {
    backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer',
  },
}
