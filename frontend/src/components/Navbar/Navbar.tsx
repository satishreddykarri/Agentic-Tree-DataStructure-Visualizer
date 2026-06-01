import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import { saveSessionThunk } from '@/store/treeSlice'
import { applyTheme, getStoredTheme } from '@/styles/theme'
import type { TreeData } from '@/types'

interface NavbarProps {
  onLoadTree?: () => void
}

export default function Navbar({ onLoadTree }: NavbarProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { sessionId, nodes, rootId, isLoading } = useAppSelector((s) => s.tree)

  const handleSave = () => {
    if (!sessionId) return
    const treeData: TreeData = { rootId, nodes }
    dispatch(saveSessionThunk({ sessionId, treeData }))
  }

  const handleThemeToggle = () => {
    const current = getStoredTheme()
    applyTheme(current === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => dispatch(logout())

  // User initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav style={s.navbar}>
      {/* Left — Logo */}
      <div style={s.left}>
        <div style={s.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L9 7H3L7.5 11L5.5 17L12 13.5L18.5 17L16.5 11L21 7H15L12 2Z"
              fill="#1da1f2"
            />
          </svg>
        </div>
        <span style={s.appName}>TreeView AI</span>
      </div>

      {/* Right — Actions */}
      <div style={s.right}>
        {/* Save Tree */}
        <button style={s.btnPrimary} onClick={handleSave} disabled={!sessionId || isLoading}>
          {isLoading ? 'Saving...' : 'Save Tree'}
        </button>

        {/* Load Tree */}
        <button style={s.btnOutline} onClick={onLoadTree}>
          Load Tree
        </button>

        {/* Theme Toggle */}
        <button style={s.iconBtn} onClick={handleThemeToggle} title="Toggle theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        {/* Settings */}
        <button style={s.iconBtn} title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* Avatar */}
        <div style={s.avatar} title={user?.name ?? ''}>
          {initials}
        </div>

        {/* Logout */}
        <button style={s.logoutBtn} onClick={handleLogout} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

const s: Record<string, React.CSSProperties> = {
  navbar: {
    height: '60px',
    backgroundColor: 'var(--sidebar)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    flexShrink: 0,
    zIndex: 100,
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    width: '32px', height: '32px', backgroundColor: 'var(--panel)',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border)',
  },
  appName: { fontSize: '16px', fontWeight: 700, color: 'var(--text)' },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  btnPrimary: {
    backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', transition: 'background-color 0.15s',
  },
  btnOutline: {
    backgroundColor: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
  },
  iconBtn: {
    backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
    borderRadius: '6px', width: '34px', height: '34px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    backgroundColor: 'var(--primary)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, cursor: 'default', flexShrink: 0,
  },
  logoutBtn: {
    backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
    borderRadius: '6px', width: '34px', height: '34px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
}
