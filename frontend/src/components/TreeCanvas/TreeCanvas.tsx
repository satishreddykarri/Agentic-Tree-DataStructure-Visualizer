import { useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addNode } from '@/store/treeSlice'
import { saveSessionThunk } from '@/store/treeSlice'
import { computeLayout } from '@/utils/treeLayout'
import CustomTreeNode from './CustomTreeNode'
import CustomEdge from './CustomEdge'
import EmptyState from './EmptyState'
import { v4 as uuidv4 } from 'uuid'
import type { TreeNode, TreeData } from '@/types'

const nodeTypes = { treeNode: CustomTreeNode }
const edgeTypes = { treeEdge: CustomEdge }

function TreeCanvasInner() {
  const dispatch = useAppDispatch()
  const { nodes, rootId, sessionId, highlightedNodeIds } = useAppSelector((s) => s.tree)

  // Compute layout and inject highlight state into node data
  const { flowNodes: baseNodes, flowEdges } = useMemo(
    () => computeLayout(nodes, rootId),
    [nodes, rootId]
  )

  const flowNodes = useMemo(
    () =>
      baseNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          highlight: highlightedNodeIds.includes(n.id),
          found: false,
        },
      })),
    [baseNodes, highlightedNodeIds]
  )

  const [rfNodes, , onNodesChange] = useNodesState(flowNodes)
  const [rfEdges, , onEdgesChange] = useEdgesState(flowEdges)

  // Sync layout changes back when tree state changes
  const syncedNodes = flowNodes.length > 0 ? flowNodes : rfNodes
  const syncedEdges = flowEdges.length > 0 ? flowEdges : rfEdges

  // Add root node from empty state button
  const handleAddRoot = useCallback(() => {
    const value = prompt('Enter root node value:')
    if (value === null) return
    const num = parseInt(value)
    if (isNaN(num)) { alert('Please enter a valid number'); return }

    const newNode: TreeNode = { id: uuidv4(), value: num, left: null, right: null, parentId: null }
    dispatch(addNode({ node: newNode, parentId: null, position: null }))

    if (sessionId) {
      const treeData: TreeData = {
        rootId: newNode.id,
        nodes: { ...nodes, [newNode.id]: newNode },
      }
      dispatch(saveSessionThunk({ sessionId, treeData }))
    }
  }, [dispatch, nodes, sessionId])

  const isEmpty = !rootId || Object.keys(nodes).length === 0

  return (
    <div style={s.canvas}>
      {isEmpty ? (
        <EmptyState onAddRoot={handleAddRoot} />
      ) : (
        <ReactFlow
          nodes={syncedNodes}
          edges={syncedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="var(--border)"
          />
          <Controls
            style={s.controls}
            showInteractive={false}
          />
        </ReactFlow>
      )}

      {/* Traversal sequence display */}
      <TraversalSequence />
    </div>
  )
}

function TraversalSequence() {
  const { traversalSequence } = useAppSelector((s) => s.tree)
  if (traversalSequence.length === 0) return null

  return (
    <div style={s.sequenceBar}>
      <span style={s.sequenceLabel}>Traversal: </span>
      {traversalSequence.map((val, i) => (
        <span key={i} style={s.sequenceItem}>
          {val}{i < traversalSequence.length - 1 ? ' → ' : ''}
        </span>
      ))}
    </div>
  )
}

export default function TreeCanvas() {
  return (
    <ReactFlowProvider>
      <TreeCanvasInner />
    </ReactFlowProvider>
  )
}

const s: Record<string, React.CSSProperties> = {
  canvas: {
    flex: 1,
    backgroundColor: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
  },
  controls: {
    bottom: '20px',
    right: '20px',
    left: 'auto',
    top: 'auto',
    backgroundColor: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  sequenceBar: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    color: 'var(--text)',
    maxWidth: '80%',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
  sequenceLabel: { color: 'var(--text-muted)', marginRight: '4px', fontWeight: 600 },
  sequenceItem: { color: 'var(--primary)' },
}
