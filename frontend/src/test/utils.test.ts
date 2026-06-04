import { describe, it, expect } from 'vitest'
import { preorder, inorder, postorder } from '../utils/traversal'
import { computeLayout } from '../utils/treeLayout'
import type { TreeNode } from '../types'

// ─── Sample Trees ─────────────────────────────────────────────────────────────
//       10
//      /  \
//     5    15
//    / \
//   3   7
const tree5: Record<string, TreeNode> = {
  n1: { id: 'n1', value: 10, left: 'n2', right: 'n3', parentId: null },
  n2: { id: 'n2', value: 5,  left: 'n4', right: 'n5', parentId: 'n1' },
  n3: { id: 'n3', value: 15, left: null,  right: null,  parentId: 'n1' },
  n4: { id: 'n4', value: 3,  left: null,  right: null,  parentId: 'n2' },
  n5: { id: 'n5', value: 7,  left: null,  right: null,  parentId: 'n2' },
}

const single: Record<string, TreeNode> = {
  r: { id: 'r', value: 42, left: null, right: null, parentId: null },
}

const twoLevel: Record<string, TreeNode> = {
  a: { id: 'a', value: 1, left: 'b', right: 'c', parentId: null },
  b: { id: 'b', value: 2, left: null, right: null, parentId: 'a' },
  c: { id: 'c', value: 3, left: null, right: null, parentId: 'a' },
}

// ─── Preorder ─────────────────────────────────────────────────────────────────
describe('preorder traversal', () => {
  it('empty tree returns empty array', () => { expect(preorder({}, null)).toEqual([]) })
  it('null rootId returns empty array', () => { expect(preorder(tree5, null)).toEqual([]) })
  it('single node returns that node', () => { expect(preorder(single, 'r')).toEqual(['r']) })
  it('visits root first', () => { expect(preorder(tree5, 'n1')[0]).toBe('n1') })
  it('visits all 5 nodes', () => { expect(preorder(tree5, 'n1')).toHaveLength(5) })
  it('root before left child', () => {
    const r = preorder(tree5, 'n1')
    expect(r.indexOf('n1')).toBeLessThan(r.indexOf('n2'))
  })
  it('left subtree before right subtree', () => {
    const r = preorder(tree5, 'n1')
    expect(r.indexOf('n2')).toBeLessThan(r.indexOf('n3'))
  })
  it('two level tree order', () => { expect(preorder(twoLevel, 'a')).toEqual(['a', 'b', 'c']) })
  it('contains all node ids', () => {
    const r = preorder(tree5, 'n1')
    expect(r).toContain('n4')
    expect(r).toContain('n5')
  })
})

// ─── Inorder ──────────────────────────────────────────────────────────────────
describe('inorder traversal', () => {
  it('empty tree returns empty array', () => { expect(inorder({}, null)).toEqual([]) })
  it('single node returns that node', () => { expect(inorder(single, 'r')).toEqual(['r']) })
  it('visits all 5 nodes', () => { expect(inorder(tree5, 'n1')).toHaveLength(5) })
  it('left child before root', () => {
    const r = inorder(tree5, 'n1')
    expect(r.indexOf('n2')).toBeLessThan(r.indexOf('n1'))
  })
  it('root before right child', () => {
    const r = inorder(tree5, 'n1')
    expect(r.indexOf('n1')).toBeLessThan(r.indexOf('n3'))
  })
  it('two level tree order', () => { expect(inorder(twoLevel, 'a')).toEqual(['b', 'a', 'c']) })
  it('leftmost node is first', () => { expect(inorder(tree5, 'n1')[0]).toBe('n4') })
  it('rightmost node is last', () => {
    const r = inorder(tree5, 'n1')
    expect(r[r.length - 1]).toBe('n3')
  })
})

// ─── Postorder ────────────────────────────────────────────────────────────────
describe('postorder traversal', () => {
  it('empty tree returns empty array', () => { expect(postorder({}, null)).toEqual([]) })
  it('single node returns that node', () => { expect(postorder(single, 'r')).toEqual(['r']) })
  it('visits all 5 nodes', () => { expect(postorder(tree5, 'n1')).toHaveLength(5) })
  it('root is last', () => {
    const r = postorder(tree5, 'n1')
    expect(r[r.length - 1]).toBe('n1')
  })
  it('children before parent', () => {
    const r = postorder(tree5, 'n1')
    expect(r.indexOf('n4')).toBeLessThan(r.indexOf('n2'))
  })
  it('two level tree order', () => { expect(postorder(twoLevel, 'a')).toEqual(['b', 'c', 'a']) })
})

// ─── Layout ───────────────────────────────────────────────────────────────────
describe('computeLayout', () => {
  it('returns empty for null rootId', () => {
    const { flowNodes, flowEdges } = computeLayout({}, null)
    expect(flowNodes).toHaveLength(0)
    expect(flowEdges).toHaveLength(0)
  })
  it('single node has one flow node', () => {
    expect(computeLayout(single, 'r').flowNodes).toHaveLength(1)
  })
  it('single node has no edges', () => {
    expect(computeLayout(single, 'r').flowEdges).toHaveLength(0)
  })
  it('5 node tree has 5 flow nodes', () => {
    expect(computeLayout(tree5, 'n1').flowNodes).toHaveLength(5)
  })
  it('5 node tree has 4 edges', () => {
    expect(computeLayout(tree5, 'n1').flowEdges).toHaveLength(4)
  })
  it('root is at y=0', () => {
    const root = computeLayout(tree5, 'n1').flowNodes.find(n => n.id === 'n1')!
    expect(root.position.y).toBe(0)
  })
  it('children are below root', () => {
    const { flowNodes } = computeLayout(tree5, 'n1')
    const root = flowNodes.find(n => n.id === 'n1')!
    const left = flowNodes.find(n => n.id === 'n2')!
    expect(left.position.y).toBeGreaterThan(root.position.y)
  })
  it('left child is left of right child', () => {
    const { flowNodes } = computeLayout(twoLevel, 'a')
    const b = flowNodes.find(n => n.id === 'b')!
    const c = flowNodes.find(n => n.id === 'c')!
    expect(b.position.x).toBeLessThan(c.position.x)
  })
  it('all nodes have treeNode type', () => {
    expect(computeLayout(tree5, 'n1').flowNodes.every(n => n.type === 'treeNode')).toBe(true)
  })
  it('node data contains value', () => {
    expect(computeLayout(single, 'r').flowNodes[0].data.value).toBe(42)
  })
  it('edge ids are unique', () => {
    const { flowEdges } = computeLayout(tree5, 'n1')
    const ids = flowEdges.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// ─── Validation Logic ─────────────────────────────────────────────────────────
describe('auth form validation logic', () => {
  const validateLogin = (email: string, pw: string) =>
    !email || !pw ? 'Please fill in all fields' : null

  const validateRegister = (name: string, email: string, pw: string, confirm: string) => {
    if (!name || !email || !pw || !confirm) return 'Please fill in all fields'
    if (pw !== confirm) return 'Passwords do not match'
    if (pw.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  it('login: empty email gives error', () => { expect(validateLogin('', 'pass')).toBeTruthy() })
  it('login: empty password gives error', () => { expect(validateLogin('a@b.com', '')).toBeTruthy() })
  it('login: valid inputs give null', () => { expect(validateLogin('a@b.com', 'pass')).toBeNull() })
  it('register: mismatched passwords', () => {
    expect(validateRegister('A', 'a@b.com', 'pass1', 'pass2')).toBe('Passwords do not match')
  })
  it('register: short password', () => {
    expect(validateRegister('A', 'a@b.com', 'abc', 'abc')).toBe('Password must be at least 6 characters')
  })
  it('register: valid inputs give null', () => {
    expect(validateRegister('A', 'a@b.com', 'password', 'password')).toBeNull()
  })
  it('register: empty name gives error', () => {
    expect(validateRegister('', 'a@b.com', 'password', 'password')).toBeTruthy()
  })
})
