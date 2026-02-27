import { ShapeBase } from 'entities/Scene'

export type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
}

export function getShapeBounds(shape: ShapeBase): Bounds {
  switch (shape.type) {
    case 'square': {
      const x = shape.coordinates.x
      const y = shape.coordinates.y
      const w = shape.width ?? 0
      const h = shape.height ?? 0

      return {
        left: Math.min(x, x + w),
        right: Math.max(x, x + w),
        top: Math.min(y, y + h),
        bottom: Math.max(y, y + h),
      }
    }

    case 'circle': {
      const cx = shape.coordinates.x
      const cy = shape.coordinates.y
      const r = shape.radius ?? 0

      return {
        left: cx - r,
        right: cx + r,
        top: cy - r,
        bottom: cy + r,
      }
    }

    case 'triangle': {
      const x = shape.coordinates.x
      const y = shape.coordinates.y
      const w = shape.width ?? 0
      const h = shape.height ?? 0

      return {
        left: Math.min(x, x + w),
        right: Math.max(x, x + w),
        top: Math.min(y, y + h),
        bottom: Math.max(y, y + h),
      }
    }
  }
}

export function isBoundsIntersecting(a: Bounds, b: Bounds): boolean {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

export function isBoundsInside(inner: Bounds, outer: Bounds): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  )
}
export function createShapeFrame(
  hitShape: ShapeBase,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')
  const shape = hitShape

  if (!shape) return

  if (shape.type === 'square') {
    const x = shape.coordinates.x
    const y = shape.coordinates.y
    const width = shape.width ?? 0
    const height = shape.height ?? 0

    const left = Math.min(x, x + width)
    const top = Math.min(y, y + height)
    const w = Math.abs(width)
    const h = Math.abs(height)

    const padding = 10

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.strokeRect(left - padding, top - padding, w + padding * 2, h + padding * 2)
  }
  if (shape.type === 'circle') {
    const x = shape.coordinates.x
    const y = shape.coordinates.y
    const radius = shape.radius ?? 0

    const left = x - radius
    const top = y - radius
    const size = radius * 2

    const padding = 10

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.strokeRect(left - padding, top - padding, size + padding * 2, size + padding * 2)
  }
  if (shape.type === 'triangle') {
    const x1 = shape.coordinates.x
    const y1 = shape.coordinates.y
    const x2 = x1 + (shape.width ?? 0)
    const y2 = y1 + (shape.height ?? 0)

    const centerX = (x1 + x2) / 2

    const points = [
      { x: centerX, y: y1 },
      { x: x1, y: y2 },
      { x: x2, y: y2 },
    ]

    const left = Math.min(...points.map((p) => p.x))
    const right = Math.max(...points.map((p) => p.x))
    const top = Math.min(...points.map((p) => p.y))
    const bottom = Math.max(...points.map((p) => p.y))

    const padding = 10

    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.strokeRect(
      left - padding,
      top - padding,
      right - left + padding * 2,
      bottom - top + padding * 2,
    )
  }
}
