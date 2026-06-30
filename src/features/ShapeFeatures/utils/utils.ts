import { SceneNode } from 'entities/Scene'
import { Point } from 'entities/Tool'
import { Bounds } from 'features/CanvasFeatures/utils/utils'

const HANDLE_HIT_SIZE = 16

export function getNodeBounds(node: SceneNode): Bounds {
  const coordinates = node.coordinates ?? { x: 0, y: 0 }
  switch (node.type) {
    case 'rectangle':
    case 'triangle':
      return {
        left: coordinates.x ?? 0,
        top: coordinates.y ?? 0,
        right: (coordinates.x ?? 0) + (node.width ?? 0),
        bottom: (coordinates.y ?? 0) + (node.height ?? 0),
      }

    case 'circle':
      return {
        left: (coordinates.x ?? 0) - (node.radius ?? 0),
        top: (coordinates.y ?? 0) - (node.radius ?? 0),
        right: (coordinates.x ?? 0) + (node.radius ?? 0),
        bottom: (coordinates.y ?? 0) + (node.radius ?? 0),
      }

    case 'path': {
      const points = node.points ?? []
      if (points.length === 0) {
        return { left: 0, top: 0, right: 0, bottom: 0 }
      }

      let minX = points[0].x
      let minY = points[0].y
      let maxX = points[0].x
      let maxY = points[0].y

      for (let i = 1; i < points.length; i++) {
        minX = Math.min(minX, points[i].x)
        minY = Math.min(minY, points[i].y)
        maxX = Math.max(maxX, points[i].x)
        maxY = Math.max(maxY, points[i].y)
      }

      return { left: minX, top: minY, right: maxX, bottom: maxY }
    }

    default:
      return { left: 0, top: 0, right: 0, bottom: 0 }
  }
}

export const getResizeCursor = (baseCursor: string, rotation: number) => {
  const cursors = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize']
  const degrees = ((rotation * 180) / Math.PI + 360) % 360
  const shift = Math.round(degrees / 45) % cursors.length
  const index = cursors.indexOf(baseCursor)
  return cursors[(index + shift) % cursors.length]
}

export const getGroupBounds = (nodes: SceneNode[]): Bounds => ({
  left: Math.min(...nodes.map((s) => getNodeBounds(s)!.left)),
  right: Math.max(...nodes.map((s) => getNodeBounds(s)!.right)),
  top: Math.min(...nodes.map((s) => getNodeBounds(s)!.top)),
  bottom: Math.max(...nodes.map((s) => getNodeBounds(s)!.bottom)),
})

export const isPointOnHandle = (point: Point, handle: { x: number; y: number }) => {
  return (
    point.x >= handle.x - HANDLE_HIT_SIZE / 2 &&
    point.x <= handle.x + HANDLE_HIT_SIZE / 2 &&
    point.y >= handle.y - HANDLE_HIT_SIZE / 2 &&
    point.y <= handle.y + HANDLE_HIT_SIZE / 2
  )
}

export const getShapeHandles = (node: SceneNode) => {
  const bounds = getNodeBounds(node)
  const padding = 10

  const left = bounds.left - padding
  const top = bounds.top - padding
  const right = bounds.right + padding
  const bottom = bounds.bottom + padding

  const width = right - left
  const height = bottom - top
  const centerX = left + width / 2
  const centerY = top + height / 2
  const rotation = node.rotation ?? 0

  const rotate = (px: number, py: number) => ({
    x: Math.cos(rotation) * (px - centerX) - Math.sin(rotation) * (py - centerY) + centerX,
    y: Math.sin(rotation) * (px - centerX) + Math.cos(rotation) * (py - centerY) + centerY,
  })

  const tl = rotate(left, top)
  const tr = rotate(right, top)
  const br = rotate(right, bottom)
  const bl = rotate(left, bottom)

  const rot = rotate(left + width / 2, top - 20)

  return {
    topLeft: { ...tl, cursor: getResizeCursor('nwse-resize', rotation) },
    topRight: { ...tr, cursor: getResizeCursor('nesw-resize', rotation) },
    bottomRight: { ...br, cursor: getResizeCursor('nwse-resize', rotation) },
    bottomLeft: { ...bl, cursor: getResizeCursor('nesw-resize', rotation) },
    rotate: { ...rot, cursor: 'grab' },
  }
}

export function createMultiFrame(bounds: Bounds, overlayRef: React.RefObject<HTMLCanvasElement>) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')!
  const handleSize = 8

  const padding = 10

  const x = bounds.left - padding
  const y = bounds.top - padding
  const width = bounds.right - bounds.left + padding * 2
  const height = bounds.bottom - bounds.top + padding * 2

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  overlayCtx.strokeStyle = 'blue'
  overlayCtx.lineWidth = 1
  overlayCtx.strokeRect(x, y, width, height)
  const handles = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ]

  handles.forEach(({ x, y }) => {
    overlayCtx.fillStyle = 'white'
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
    overlayCtx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
  })
}

export function createNodeFrame(
  hitNode: SceneNode,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) {
  const overlayCanvas = overlayRef.current
  if (!overlayCanvas) return

  const overlayCtx = overlayCanvas.getContext('2d')
  if (!overlayCtx) return

  const bounds = getNodeBounds(hitNode)

  const padding = 10
  const handleSize = 8
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top
  const centerX = bounds.left + width / 2
  const centerY = bounds.top + height / 2

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

  overlayCtx.save()
  overlayCtx.translate(centerX, centerY)
  overlayCtx.rotate(hitNode.rotation ?? 0)

  overlayCtx.strokeStyle = 'blue'
  overlayCtx.lineWidth = 1
  overlayCtx.strokeRect(
    -width / 2 - padding,
    -height / 2 - padding,
    width + padding * 2,
    height + padding * 2,
  )

  const handles = [
    { x: -width / 2 - padding, y: -height / 2 - padding },
    { x: width / 2 + padding, y: -height / 2 - padding },
    { x: width / 2 + padding, y: height / 2 + padding },
    { x: -width / 2 - padding, y: height / 2 + padding },
  ]

  handles.forEach(({ x, y }) => {
    overlayCtx.fillStyle = 'white'
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
    overlayCtx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
  })

  overlayCtx.beginPath()
  overlayCtx.moveTo(0, -height / 2 - padding)
  overlayCtx.lineTo(0, -height / 2 - padding - 20)
  overlayCtx.stroke()

  overlayCtx.beginPath()
  overlayCtx.arc(0, -height / 2 - padding - 20, 5, 0, Math.PI * 2)
  overlayCtx.fillStyle = 'white'
  overlayCtx.fill()
  overlayCtx.strokeStyle = 'blue'
  overlayCtx.stroke()

  overlayCtx.restore()
}
