import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetTree, saveSessionThunk } from '@/store/treeSlice'
import TreeOperationsPanel from './TreeOperationsPanel'
import TraversalPanel from './TraversalPanel'
import type { TreeData } from '@/types'

export default function LeftSidebar() {
  const dispatch = useAppDispatch()
  const { sessionId, rootId } = useAppSelector((s) => s.tree)

  const handleReset = () => {
    if (!confirm('Reset the tree? All nodes will be removed.')) return
    dispatch(resetTree())
    if (sessionId) {
      const emptyTree: TreeData = { rootId: null, nodes: {} }
      dispatch(saveSessionThunk({ sessionId, treeData: emptyTree }))
    }
  }

  return (
    <aside style={s.sidebar}>
      {/* Scrollable top section */}
      <div style={s.scrollArea}>
        <div style={s.section}>
          <p style={s.sectionTitle}>Controls</p>
          <TreeOperationsPanel />
        </div>
        <div style={s.divider} />
        <div style={s.section}>
          <TraversalPanel />
        </div>
      </div>

      {/* Pinned Reset button at bottom */}
      <div style={s.bottom}>
        <div style={s.divider} />
        <button
          style={s.resetBtn}
          onClick={handleReset}
          disabled={!rootId}
        >
          Reset Tree
        </button>
      </div>
    </aside>
  )
}

const s: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '250px',
    flexShrink: 0,
    backgroundColor: 'var(--sidebar)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
  },
  section: { marginBottom: '8px' },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '4px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '12px 0',
  },
  bottom: {
    padding: '0 12px 16px',
    flexShrink: 0,
  },
  resetBtn: {
    width: '100%',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    opacity: 1,
  },
}
