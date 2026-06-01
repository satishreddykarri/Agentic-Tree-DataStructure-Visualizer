import { memo } from 'react'
import { getBezierPath } from 'reactflow'
import type { EdgeProps } from 'reactflow'

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <path
      id={id}
      d={edgePath}
      fill="none"
      stroke="var(--border)"
      strokeWidth={2}
      strokeOpacity={0.8}
    />
  )
}

export default memo(CustomEdge)
