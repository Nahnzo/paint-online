import { ShapeBase } from 'entities/Scene'
import { Point } from 'entities/Tool'

export function sign(p1: Point, p2: Point, p3: Point) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
}

export function isPointInsideShape(point: Point, shape: ShapeBase) {
  switch (shape.type) {
    case 'square':
      return (
        point.x >= shape.coordinates.x &&
        point.x <= shape.coordinates.x + (shape.width ?? 0) &&
        point.y >= shape.coordinates.y &&
        point.y <= shape.coordinates.y + (shape.height ?? 0)
      )
    case 'circle': {
      const dx = point.x - shape.coordinates.x
      const dy = point.y - shape.coordinates.y
      return dx * dx + dy * dy <= (shape.radius ?? 0) ** 2
    }
    case 'triangle':
      {
        const x1 = shape.coordinates.x
        const y1 = shape.coordinates.y

        const width = shape.width ?? 0
        const height = shape.height ?? 0

        const x2 = x1 + width
        const y2 = y1 + height

        const centerX = (x1 + x2) / 2

        const v1 = { x: centerX, y: y1 }
        const v2 = { x: x1, y: y2 }
        const v3 = { x: x2, y: y2 }

        const b1 = sign(point, v1, v2) < 0
        const b2 = sign(point, v2, v3) < 0
        const b3 = sign(point, v3, v1) < 0

        return b1 === b2 && b2 === b3
      }
      break
  }
}

export function createShapeFrame(
  hitShape: ShapeBase,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')
  const shape = hitShape

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
