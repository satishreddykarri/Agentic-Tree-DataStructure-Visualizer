import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addNode, deleteNode, editNode, setHighlightedNodes } from '@/store/treeSlice'
import { saveSessionThunk } from '@/store/treeSlice'
import Modal from '@/components/Modal'
import { v4 as uuidv4 } from 'uuid'
import type { TreeNode, TreeData } from '@/types'

type ActiveModal = 'add' | 'delete' | 'edit' | 'search' | null

export default function TreeOperationsPanel() {
  const dispatch = useAppDispatch()
  const { nodes, rootId, sessionId } = useAppSelector((s) => s.tree)
  const [modal, setModal] = useState<ActiveModal>(null)

  // Form state
  const [nodeValue, setNodeValue] = useState('')
  const [parentValue, setParentValue] = useState('')
  const [position, setPosition] = useState<'left' | 'right'>('left')
  const [deleteValue, setDeleteValue] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [editNewValue, setEditNewValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [formError, setFormError] = useState('')

  const close = () => { setModal(null); setFormError('') }

  // Find node by value
  const findNodeByValue = (val: number): TreeNode | null => {
    return Object.values(nodes).find((n) => n.value === val) ?? null
  }

  const persistTree = (updatedNodes: typeof nodes, updatedRootId: string | null) => {
    if (!sessionId) return
    const treeData: TreeData = { rootId: updatedRootId, nodes: updatedNodes }
    dispatch(saveSessionThunk({ sessionId, treeData }))
  }

  // Add Node
  const handleAddNode = () => {
    setFormError('')
    const val = parseInt(nodeValue)
    if (isNaN(val)) { setFormError('Enter a valid number'); return }

    // Check for duplicate value
    if (findNodeByValue(val)) { setFormError(`Node with value ${val} already exists`); return }

    // Adding root
    if (!rootId) {
      const newNode: TreeNode = { id: uuidv4(), value: val, left: null, right: null, parentId: null }
      dispatch(addNode({ node: newNode, parentId: null, position: null }))
      persistTree({ ...nodes, [newNode.id]: newNode }, newNode.id)
      close()
      return
    }

    // Adding child
    const parentVal = parseInt(parentValue)
    if (isNaN(parentVal)) { setFormError('Enter a valid parent value'); return }
    const parent = findNodeByValue(parentVal)
    if (!parent) { setFormError(`Node with value ${parentVal} not found`); return }
    if (parent[position]) { setFormError(`Node ${parentVal} already has a ${position} child`); return }

    const newNode: TreeNode = { id: uuidv4(), value: val, left: null, right: null, parentId: parent.id }
    const updatedNodes = {
      ...nodes,
      [newNode.id]: newNode,
      [parent.id]: { ...parent, [position]: newNode.id },
    }
    dispatch(addNode({ node: newNode, parentId: parent.id, position }))
    persistTree(updatedNodes, rootId)
    close()
  }

  // Delete Node
  const handleDeleteNode = () => {
    setFormError('')
    const val = parseInt(deleteValue)
    if (isNaN(val)) { setFormError('Enter a valid number'); return }
    const target = findNodeByValue(val)
    if (!target) { setFormError(`Node with value ${val} not found`); return }
    dispatch(deleteNode(target.id))
    // Persist after deletion — build updated nodes manually
    const toDelete = new Set<string>()
    const collect = (id: string) => {
      toDelete.add(id)
      const n = nodes[id]
      if (n?.left) collect(n.left)
      if (n?.right) collect(n.right)
    }
    collect(target.id)
    const updatedNodes = Object.fromEntries(
      Object.entries(nodes).filter(([id]) => !toDelete.has(id))
    )
    // Unlink from parent
    if (target.parentId && updatedNodes[target.parentId]) {
      const p = { ...updatedNodes[target.parentId] }
      if (p.left === target.id) p.left = null
      if (p.right === target.id) p.right = null
      updatedNodes[target.parentId] = p
    }
    const newRoot = rootId === target.id ? null : rootId
    persistTree(updatedNodes, newRoot)
    close()
  }

  // Edit Node
  const handleEditNode = () => {
    setFormError('')
    const targetVal = parseInt(editTarget)
    const newVal = parseInt(editNewValue)
    if (isNaN(targetVal) || isNaN(newVal)) { setFormError('Enter valid numbers'); return }
    const target = findNodeByValue(targetVal)
    if (!target) { setFormError(`Node with value ${targetVal} not found`); return }
    if (findNodeByValue(newVal) && newVal !== targetVal) {
      setFormError(`Node with value ${newVal} already exists`); return
    }
    dispatch(editNode({ nodeId: target.id, value: newVal }))
    const updatedNodes = { ...nodes, [target.id]: { ...target, value: newVal } }
    persistTree(updatedNodes, rootId)
    close()
  }

  // Search Node
  const handleSearch = () => {
    setFormError('')
    const val = parseInt(searchValue)
    if (isNaN(val)) { setFormError('Enter a valid number'); return }
    const found = findNodeByValue(val)
    if (!found) { setFormError(`Node with value ${val} not found`); return }
    dispatch(setHighlightedNodes([found.id]))
    // Clear highlight after 3 seconds
    setTimeout(() => dispatch(setHighlightedNodes([])), 3000)
    close()
  }

  const hasNodes = Object.keys(nodes).length > 0

  return (
    <div>
      <p style={s.sectionLabel}>Tree Operations</p>

      {/* Add Node */}
      <button style={s.opBtn} onClick={() => setModal('add')}>
        <span style={s.opIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </span>
        Add Node
      </button>

      {/* Delete Node */}
      <button style={s.opBtn} onClick={() => setModal('delete')} disabled={!hasNodes}>
        <span style={s.opIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </span>
        Delete Node
      </button>

      {/* Edit Node */}
      <button style={s.opBtn} onClick={() => setModal('edit')} disabled={!hasNodes}>
        <span style={s.opIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
        Edit Node
      </button>

      {/* Search Node */}
      <button style={s.opBtn} onClick={() => setModal('search')} disabled={!hasNodes}>
        <span style={s.opIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        Search Node
      </button>

      {/* Modals */}
      {modal === 'add' && (
        <Modal title={rootId ? 'Add Node' : 'Add Root Node'} onClose={close}>
          <div style={s.formGroup}>
            <label style={s.label}>Node Value</label>
            <input style={s.input} type="number" placeholder="e.g. 42" value={nodeValue}
              onChange={(e) => setNodeValue(e.target.value)} autoFocus />
          </div>
          {rootId && (
            <>
              <div style={s.formGroup}>
                <label style={s.label}>Parent Node Value</label>
                <input style={s.input} type="number" placeholder="e.g. 10" value={parentValue}
                  onChange={(e) => setParentValue(e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Position</label>
                <div style={s.radioRow}>
                  {(['left', 'right'] as const).map((p) => (
                    <label key={p} style={s.radioLabel}>
                      <input type="radio" value={p} checked={position === p}
                        onChange={() => setPosition(p)} style={{ marginRight: 6 }} />
                      {p.charAt(0).toUpperCase() + p.slice(1)} Child
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          {formError && <p style={s.error}>{formError}</p>}
          <button style={s.submitBtn} onClick={handleAddNode}>Add Node</button>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Node" onClose={close}>
          <div style={s.formGroup}>
            <label style={s.label}>Node Value to Delete</label>
            <input style={s.input} type="number" placeholder="e.g. 42" value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)} autoFocus />
          </div>
          <p style={{ ...s.label, color: 'var(--text-muted)', marginBottom: 12 }}>
            This will also delete all child nodes.
          </p>
          {formError && <p style={s.error}>{formError}</p>}
          <button style={{ ...s.submitBtn, backgroundColor: '#ef4444' }} onClick={handleDeleteNode}>
            Delete Node
          </button>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Node" onClose={close}>
          <div style={s.formGroup}>
            <label style={s.label}>Current Node Value</label>
            <input style={s.input} type="number" placeholder="e.g. 10" value={editTarget}
              onChange={(e) => setEditTarget(e.target.value)} autoFocus />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>New Value</label>
            <input style={s.input} type="number" placeholder="e.g. 99" value={editNewValue}
              onChange={(e) => setEditNewValue(e.target.value)} />
          </div>
          {formError && <p style={s.error}>{formError}</p>}
          <button style={s.submitBtn} onClick={handleEditNode}>Update Node</button>
        </Modal>
      )}

      {modal === 'search' && (
        <Modal title="Search Node" onClose={close}>
          <div style={s.formGroup}>
            <label style={s.label}>Node Value</label>
            <input style={s.input} type="number" placeholder="e.g. 42" value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)} autoFocus />
          </div>
          {formError && <p style={s.error}>{formError}</p>}
          <button style={s.submitBtn} onClick={handleSearch}>Search</button>
        </Modal>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  sectionLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
  opBtn: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    backgroundColor: 'transparent', border: 'none', color: 'var(--text)',
    padding: '9px 10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
    textAlign: 'left', transition: 'background-color 0.15s', marginBottom: '2px',
  },
  opIcon: { color: 'var(--text-muted)', display: 'flex', alignItems: 'center' },
  formGroup: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 },
  input: {
    width: '100%', backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none',
  },
  radioRow: { display: 'flex', gap: '16px' },
  radioLabel: { fontSize: '13px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  error: { color: '#f87171', fontSize: '12px', marginBottom: '10px' },
  submitBtn: {
    width: '100%', backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
}
