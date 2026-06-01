import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadSessionThunk } from '@/store/treeSlice'
import { loadChatHistory } from '@/store/chatSlice'
import { getChatHistory } from '@/api/chatApi'
import { listSessions } from '@/api/treeApi'
import Navbar from '@/components/Navbar/Navbar'
import LeftSidebar from '@/components/LeftSidebar/LeftSidebar'
import TreeCanvas from '@/components/TreeCanvas/TreeCanvas'
import ChatPanel from '@/components/ChatPanel/ChatPanel'
import type { TreeSession, ChatMessage } from '@/types'

export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector((s) => s.tree)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [sessions, setSessions] = useState<TreeSession[]>([])

  // Load session + chat history on mount
  useEffect(() => {
    if (!sessionId) return

    dispatch(loadSessionThunk(sessionId))

    getChatHistory(sessionId)
      .then((history: ChatMessage[]) => dispatch(loadChatHistory(history)))
      .catch(() => { /* no history yet is fine */ })
  }, [sessionId, dispatch])

  // Load sessions list for the Load Tree modal
  const handleOpenLoadModal = async () => {
    try {
      const data = await listSessions()
      setSessions(data)
      setShowLoadModal(true)
    } catch { /* silent */ }
  }

  const handleLoadSession = (id: string) => {
    setShowLoadModal(false)
    navigate(`/workspace/${id}`)
  }

  if (error) {
    return (
      <div style={s.errorPage}>
        <p style={{ color: '#f87171' }}>{error}</p>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div style={s.root}>
      {/* Top Navbar */}
      <Navbar onLoadTree={handleOpenLoadModal} />

      {/* Three-panel layout */}
      <div style={s.body}>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar */}
        <div style={{ ...s.sidebarWrap, ...(sidebarOpen ? s.sidebarOpen : {}) }}>
          <LeftSidebar />
        </div>

        {/* Center Canvas */}
        <main style={s.main}>
          {/* Mobile hamburger */}
          <button style={s.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {isLoading ? (
            <div style={s.loadingWrap}>
              <p style={{ color: 'var(--text-muted)' }}>Loading session...</p>
            </div>
          ) : (
            <TreeCanvas />
          )}
        </main>

        {/* Right Chat Panel */}
        <ChatPanel />
      </div>

      {/* Load Tree Modal */}
      {showLoadModal && (
        <div style={s.modalOverlay} onClick={() => setShowLoadModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Load Session</span>
              <button style={s.modalClose} onClick={() => setShowLoadModal(false)}>✕</button>
            </div>
            {sessions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No sessions found.</p>
            ) : (
              <div style={s.sessionList}>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    style={s.sessionItem}
                    onClick={() => handleLoadSession(session.id)}
                  >
                    <span style={s.sessionName}>{session.name}</span>
                    <span style={s.sessionDate}>
                      {new Date(session.updated_at).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'var(--bg)',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  sidebarWrap: {
    display: 'flex',
    flexShrink: 0,
  },
  sidebarOpen: {
    position: 'fixed' as const,
    top: '60px',
    left: 0,
    bottom: 0,
    zIndex: 200,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 199,
  },
  main: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  hamburger: {
    display: 'none',
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 10,
    backgroundColor: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    width: '36px',
    height: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text)',
  },
  loadingWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorPage: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg)',
    gap: '16px',
  },
  backBtn: {
    backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalBox: {
    backgroundColor: 'var(--panel)', border: '1px solid var(--border)',
    borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '24px',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',
  },
  modalTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--text)' },
  modalClose: {
    background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer',
  },
  sessionList: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' },
  sessionItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px 14px', cursor: 'pointer',
    width: '100%', textAlign: 'left',
  },
  sessionName: { fontSize: '14px', color: 'var(--text)', fontWeight: 500 },
  sessionDate: { fontSize: '12px', color: 'var(--text-muted)' },
}
