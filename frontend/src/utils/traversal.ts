import type { TreeNode } from '@/types'

type NodeMap = Record<string, TreeNode>

// Preorder: root → left → right
export function preorder(nodes: NodeMap, rootId: string | null): string[] {
  const result: string[] = []
  const traverse = (id: string | null) => {
    if (!id || !nodes[id]) return
    result.push(id)
    traverse(nodes[id].left)
    traverse(nodes[id].right)
  }
  traverse(rootId)
  return result
}

// Inorder: left → root → right
export function inorder(nodes: NodeMap, rootId: string | null): string[] {
  const result: string[] = []
  const traverse = (id: string | null) => {
    if (!id || !nodes[id]) return
    traverse(nodes[id].left)
    result.push(id)
    traverse(nodes[id].right)
  }
  traverse(rootId)
  return result
}

// Postorder: left → right → root
export function postorder(nodes: NodeMap, rootId: string | null): string[] {
  const result: string[] = []
  const traverse = (id: string | null) => {
    if (!id || !nodes[id]) return
    traverse(nodes[id].left)
    traverse(nodes[id].right)
    result.push(id)
  }
  traverse(rootId)
  return result
}
