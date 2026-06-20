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
  let centerX: number, centerY: number

  switch (node.type) {
    case 'rectangle':
      centerX = bounds.left + (bounds.right - bounds.left) / 2
      centerY = bounds.top + (bounds.bottom - bounds.top) / 2
      break
    case 'circle':
      centerX = bounds.left + (bounds.right - bounds.left) / 2
      centerY = bounds.top + (bounds.bottom - bounds.top) / 2
      break
    case 'path':
      if (node.points.length > 1) {
        const startPoint = node.points[0]
        const endPoint = node.points[node.points.length - 1]
        centerX = (startPoint.x + startPoint.x) / 2
        centerY = (endPoint.y + endPoint.y) / 2
      } else {
        const startPoint = node.points[0]
        const endPoint = node.points[node.points.length - 1]
        centerX = startPoint.x
        centerY = endPoint.y
      }
      break
  }

  const rotatedX =
    Math.cos(-angle) * (point.x - centerX) - Math.sin(-angle) * (point.y - centerY) + centerX
  const rotatedY =
    Math.sin(-angle) * (point.x - centerX) + Math.cos(-angle) * (point.y - centerY) + centerY

  switch (node.type) {
    case 'rectangle':
      return (
        rotatedX >= bounds.left &&
        rotatedX <= bounds.right &&
        rotatedY >= bounds.top &&
        rotatedY <= bounds.bottom
      )

    case 'circle': {
      const radius = node.radius
      const circleCenterX = bounds.left + radius
      const circleCenterY = bounds.top + radius
      const dx = rotatedX - circleCenterX
      const dy = rotatedY - circleCenterY
      return dx * dx + dy * dy <= radius * radius
    }

    case 'path': {
      if (node.points.length < 1) return false
      const distance = distanceToSegment(
        { x: rotatedX, y: rotatedY },
        node.points[0],
        node.points[node.points.length - 1],
      )
      return distance <= 5
    }

    default:
      return false
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

export function isPointInsideBounds(
  point: Point,
  bounds: Bounds,
  angle: number,
  centerX: number,
  centerY: number,
) {
  const newX =
    Math.cos(-angle) * (point.x - centerX) - Math.sin(-angle) * (point.y - centerY) + centerX
  const newY =
    Math.sin(-angle) * (point.x - centerX) + Math.cos(-angle) * (point.y - centerY) + centerY
  return newX >= bounds.left && newX <= bounds.right && newY >= bounds.top && newY <= bounds.bottom
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
