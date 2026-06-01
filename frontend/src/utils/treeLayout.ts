import type { TreeNode } from '@/types'
import type { Node as FlowNode, Edge as FlowEdge } from 'reactflow'

type NodeMap = Record<string, TreeNode>

const LEVEL_HEIGHT = 100   // vertical gap between levels
const BASE_H_GAP = 280     // horizontal spread at root level

interface LayoutNode {
  id: string
  x: number
  y: number
}

// Recursively assign x/y positions using a simple top-down algorithm.
// Each level halves the horizontal gap to prevent overlap.
function assignPositions(
  nodes: NodeMap,
  id: string | null,
  x: number,
  y: number,
  hGap: number,
  result: LayoutNode[]
): void {
  if (!id || !nodes[id]) return
  result.push({ id, x, y })
  assignPositions(nodes, nodes[id].left,  x - hGap / 2, y + LEVEL_HEIGHT, hGap / 2, result)
  assignPositions(nodes, nodes[id].right, x + hGap / 2, y + LEVEL_HEIGHT, hGap / 2, result)
}

// Convert Redux tree state into React Flow nodes + edges
export function computeLayout(
  nodes: NodeMap,
  rootId: string | null
): { flowNodes: FlowNode[]; flowEdges: FlowEdge[] } {
  if (!rootId || Object.keys(nodes).length === 0) {
    return { flowNodes: [], flowEdges: [] }
  }

  const positions: LayoutNode[] = []
  assignPositions(nodes, rootId, 0, 0, BASE_H_GAP, positions)

  const flowNodes: FlowNode[] = positions.map(({ id, x, y }) => ({
    id,
    type: 'treeNode',
    position: { x, y },
    data: {
      value: nodes[id].value,
      highlight: false,   // will be overridden by TreeCanvas
    },
  }))

  const flowEdges: FlowEdge[] = []
  Object.values(nodes).forEach((node) => {
    if (node.left) {
      flowEdges.push({
        id: `${node.id}-left`,
        source: node.id,
        target: node.left,
        type: 'treeEdge',
      })
    }
    if (node.right) {
      flowEdges.push({
        id: `${node.id}-right`,
        source: node.id,
        target: node.right,
        type: 'treeEdge',
      })
    }
  })

  return { flowNodes, flowEdges }
}
