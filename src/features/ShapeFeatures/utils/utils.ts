import { ShapeBase } from 'entities/Scene'
import { Point } from 'entities/Tool'
import { Bounds } from 'features/CanvasFeatures/utils/utils'

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

export const getGroupBounds = (shapes: ShapeBase[]): Bounds => ({
  left: Math.min(...shapes.map((s) => getShapeBounds(s).left)),
  right: Math.max(...shapes.map((s) => getShapeBounds(s).right)),
  top: Math.min(...shapes.map((s) => getShapeBounds(s).top)),
  bottom: Math.max(...shapes.map((s) => getShapeBounds(s).bottom)),
})

const HANDLE_HIT_SIZE = 16

export const isPointOnHandle = (point: Point, handle: { x: number; y: number }) => {
  return (
    point.x >= handle.x - HANDLE_HIT_SIZE / 2 &&
    point.x <= handle.x + HANDLE_HIT_SIZE / 2 &&
    point.y >= handle.y - HANDLE_HIT_SIZE / 2 &&
    point.y <= handle.y + HANDLE_HIT_SIZE / 2
  )
}

export const getShapeHandles = (shape: ShapeBase) => {
  const padding = 10
  const x = shape.coordinates.x
  const y = shape.coordinates.y
  const width = shape.width ?? 0
  const height = shape.height ?? 0
  const rotation = shape.rotation ?? 0

  const left = Math.min(x, x + width) - padding
  const top = Math.min(y, y + height) - padding
  const w = Math.abs(width) + padding * 2
  const h = Math.abs(height) + padding * 2

  const centerX = x + width / 2
  const centerY = y + height / 2

  const rotate = (px: number, py: number) => ({
    x: Math.cos(rotation) * (px - centerX) - Math.sin(rotation) * (py - centerY) + centerX,
    y: Math.sin(rotation) * (px - centerX) + Math.cos(rotation) * (py - centerY) + centerY,
  })

  const tl = rotate(left, top)
  const tr = rotate(left + w, top)
  const br = rotate(left + w, top + h)
  const bl = rotate(left, top + h)
  const rot = rotate(left + w / 2, top - 20)

  return {
    topLeft: { ...tl, cursor: 'nwse-resize' },
    topRight: { ...tr, cursor: 'nesw-resize' },
    bottomRight: { ...br, cursor: 'nwse-resize' },
    bottomLeft: { ...bl, cursor: 'nesw-resize' },
    rotate: { ...rot, cursor: 'grab' },
  }
}
export function createMultiFrame(bounds: Bounds, overlayRef: React.RefObject<HTMLCanvasElement>) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')

  const padding = 10

  const x = bounds.left - padding
  const y = bounds.top - padding
  const width = bounds.right - bounds.left + padding * 2
  const height = bounds.bottom - bounds.top + padding * 2

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  overlayCtx.strokeStyle = 'blue'
  overlayCtx.lineWidth = 1
  overlayCtx.strokeRect(x, y, width, height)
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
    const width = shape.width ?? 0
    const height = shape.height ?? 0

    const w = Math.abs(width)
    const h = Math.abs(height)

    const padding = 10
    const handleSize = 8
    const centerX = shape.coordinates.x + (shape.width ?? 0) / 2
    const centerY = shape.coordinates.y + (shape.height ?? 0) / 2
    overlayCtx.save()
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    overlayCtx.translate(centerX, centerY)
    overlayCtx.rotate(shape.rotation)

    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.strokeRect(-w / 2 - padding, -h / 2 - padding, w + padding * 2, h + padding * 2)

    const handles = [
      { x: -w / 2 - padding, y: -h / 2 - padding },
      { x: w / 2 + padding, y: -h / 2 - padding },
      { x: w / 2 + padding, y: h / 2 + padding },
      { x: -w / 2 - padding, y: h / 2 + padding },
    ]

    handles.forEach(({ x, y }) => {
      overlayCtx.fillStyle = 'white'
      overlayCtx.strokeStyle = 'blue'
      overlayCtx.lineWidth = 1
      overlayCtx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
      overlayCtx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
    })

    overlayCtx.beginPath()
    overlayCtx.moveTo(0, -h / 2 - padding)
    overlayCtx.lineTo(0, -h / 2 - padding - 20)
    overlayCtx.stroke()

    overlayCtx.beginPath()
    overlayCtx.arc(0, -h / 2 - padding - 20, 5, 0, Math.PI * 2)
    overlayCtx.fillStyle = 'white'
    overlayCtx.fill()
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.stroke()

    overlayCtx.restore()
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
