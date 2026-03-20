import { Point } from 'entities/Tool'

export type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
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
