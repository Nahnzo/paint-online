import { SceneNode } from 'entities/Scene'
import { Point } from 'entities/Tool'

export type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
}
export function isPointInsideNodeBounds(point: Point, bounds: Bounds, node: SceneNode): boolean {
  const angle = node.rotation ?? 0
  const center = getNodeCenter(node, bounds)

  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const rotatedX = cos * (point.x - center.x) - sin * (point.y - center.y) + center.x
  const rotatedY = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y

  switch (node.type) {
    case 'rectangle':
      return (
        rotatedX >= bounds.left &&
        rotatedX <= bounds.right &&
        rotatedY >= bounds.top &&
        rotatedY <= bounds.bottom
      )

    case 'circle': {
      const radius = (bounds.right - bounds.left) / 2
      const cx = bounds.left + radius
      const cy = bounds.top + radius
      const dx = rotatedX - cx
      const dy = rotatedY - cy
      return dx * dx + dy * dy <= radius * radius
    }

    case 'path': {
      const points = node.points ?? []
      if (points.length === 0) return false
      if (points.length === 1) {
        const dx = rotatedX - points[0].x
        const dy = rotatedY - points[0].y
        return dx * dx + dy * dy <= 25
      }

      for (let i = 0; i < points.length - 1; i++) {
        if (distanceToSegment({ x: rotatedX, y: rotatedY }, points[i], points[i + 1]) <= 5) {
          return true
        }
      }
      return false
    }

    default:
      return false
  }
}
function getNodeCenter(node: SceneNode, bounds: Bounds): Point {
  switch (node.type) {
    case 'rectangle':
    case 'circle':
      return {
        x: bounds.left + (bounds.right - bounds.left) / 2,
        y: bounds.top + (bounds.bottom - bounds.top) / 2,
      }

    case 'path': {
      const points = node.points
      if (!points || points.length === 0) {
        return {
          x: bounds.left + (bounds.right - bounds.left) / 2,
          y: bounds.top + (bounds.bottom - bounds.top) / 2,
        }
      }
      const first = points[0]
      const last = points[points.length - 1]
      return {
        x: (first.x + last.x) / 2,
        y: (first.y + last.y) / 2,
      }
    }

    default:
      return {
        x: bounds.left + (bounds.right - bounds.left) / 2,
        y: bounds.top + (bounds.bottom - bounds.top) / 2,
      }
  }
}

function distanceToSegment(point: Point, a: Point, b: Point): number {
  const ax = point.x - a.x
  const ay = point.y - a.y
  const bx = b.x - a.x
  const by = b.y - a.y

  const dot = ax * bx + ay * by
  const len2 = bx * bx + by * by

  if (len2 === 0) return Math.sqrt(ax * ax + ay * ay)

  let t = dot / len2
  t = Math.max(0, Math.min(1, t))

  const projX = a.x + t * bx
  const projY = a.y + t * by

  const dx = point.x - projX
  const dy = point.y - projY

  return Math.sqrt(dx * dx + dy * dy)
}

export function isBoundsInside(inner: Bounds, outer: Bounds): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  )
}

export const getSelectionBounds = (a: Point, b: Point): Bounds => ({
  left: Math.min(a.x, b.x),
  top: Math.min(a.y, b.y),
  right: Math.max(a.x, b.x),
  bottom: Math.max(a.y, b.y),
})
