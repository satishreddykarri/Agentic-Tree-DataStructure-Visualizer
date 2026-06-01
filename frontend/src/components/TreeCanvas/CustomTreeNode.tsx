import { memo } from 'react'
import { Handle, Position } from 'reactflow'

interface CustomTreeNodeData {
  value: number
  highlight: boolean
  found: boolean
}

interface CustomTreeNodeProps {
  data: CustomTreeNodeData
  isConnectable: boolean
}

function CustomTreeNode({ data, isConnectable }: CustomTreeNodeProps) {
  const { value, highlight, found } = data

  const borderColor = found
    ? 'var(--node-found)'
    : highlight
    ? 'var(--node-highlight)'
    : 'var(--border)'

  const boxShadow = found
    ? '0 0 0 3px rgba(34,197,94,0.35)'
    : highlight
    ? '0 0 0 3px rgba(29,161,242,0.35)'
    : 'none'

  const bgColor = highlight || found ? 'var(--panel-alt)' : 'var(--node-bg)'

  return (
    <div style={{ ...nodeStyle, borderColor, boxShadow, backgroundColor: bgColor }}>
      {/* Top handle — receives edges from parent */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={handleStyle}
      />

      <span style={valueStyle}>{value}</span>

      {/* Bottom handle — sends edges to children */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={handleStyle}
      />
    </div>
  )
}

const nodeStyle: React.CSSProperties = {
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  border: '2px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  cursor: 'default',
}

const valueStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--node-text)',
  userSelect: 'none',
}

const handleStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  width: '1px',
  height: '1px',
}

export default memo(CustomTreeNode)
