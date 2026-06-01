import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setHighlightedNodes, setTraversalSequence } from '@/store/treeSlice'
import { preorder, inorder, postorder } from '@/utils/traversal'

const STEP_DELAY = 600 // ms between each node highlight

type TraversalType = 'preorder' | 'inorder' | 'postorder'

export default function TraversalPanel() {
  const dispatch = useAppDispatch()
  const { nodes, rootId } = useAppSelector((s) => s.tree)
  const [running, setRunning] = useState(false)
  const [activeType, setActiveType] = useState<TraversalType | null>(null)

  const hasNodes = Object.keys(nodes).length > 0

  const runTraversal = (type: TraversalType) => {
    if (running || !hasNodes) return

    // Get ordered node IDs
    let sequence: string[] = []
    if (type === 'preorder') sequence = preorder(nodes, rootId)
    else if (type === 'inorder') sequence = inorder(nodes, rootId)
    else sequence = postorder(nodes, rootId)

    // Show the full sequence immediately
    const values = sequence.map((id) => String(nodes[id]?.value ?? id))
    dispatch(setTraversalSequence(values))

    setRunning(true)
    setActiveType(type)

    // Animate step by step
    sequence.forEach((id, i) => {
      setTimeout(() => {
        dispatch(setHighlightedNodes([id]))

        // After last step, clear highlights
        if (i === sequence.length - 1) {
          setTimeout(() => {
            dispatch(setHighlightedNodes([]))
            setRunning(false)
            setActiveType(null)
          }, STEP_DELAY)
        }
      }, i * STEP_DELAY)
    })
  }

  const traversals: { type: TraversalType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'preorder',
      label: 'Pre-order Traversal',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
    },
    {
      type: 'inorder',
      label: 'In-order Traversal',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      ),
    },
    {
      type: 'postorder',
      label: 'Post-order Traversal',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="7 1 3 5 7 9" />
          <path d="M21 11V9a4 4 0 0 0-4-4H3" />
          <polyline points="17 23 21 19 17 15" />
          <path d="M3 13v2a4 4 0 0 0 4 4h14" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ marginTop: '24px' }}>
      <p style={s.sectionLabel}>Traversal Animations</p>
      <p style={s.sectionSub}>Visualize algorithms</p>

      {traversals.map(({ type, label, icon }) => (
        <button
          key={type}
          style={{
            ...s.travBtn,
            ...(activeType === type ? s.travBtnActive : {}),
            ...((!hasNodes || running) ? s.travBtnDisabled : {}),
          }}
          onClick={() => runTraversal(type)}
          disabled={!hasNodes || running}
        >
          <span style={s.travIcon}>{icon}</span>
          {label}
          {activeType === type && running && <span style={s.runningDot} />}
        </button>
      ))}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  sectionLabel: {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px',
  },
  sectionSub: { fontSize: '11px', color: 'var(--text-dim)', marginBottom: '10px' },
  travBtn: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    backgroundColor: 'transparent', border: 'none', color: 'var(--text)',
    padding: '9px 10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
    textAlign: 'left', transition: 'background-color 0.15s', marginBottom: '2px',
    position: 'relative',
  },
  travBtnActive: { backgroundColor: 'rgba(29,161,242,0.1)', color: 'var(--primary)' },
  travBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
  travIcon: { color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 },
  runningDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    backgroundColor: 'var(--primary)', marginLeft: 'auto',
    animation: 'pulse 1s infinite',
  },
}
