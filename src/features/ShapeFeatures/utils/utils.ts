import { SceneNode } from 'entities/Scene'
import { Point } from 'entities/Tool'
import { Bounds } from 'features/CanvasFeatures/utils/utils'
import { RefObject } from 'react'

export function getNodeBounds(node: SceneNode): Bounds {
  switch (node.type) {
    case 'rectangle': {
      const { coordinates = { x: 0, y: 0 }, width = 0, height = 0 } = node
      return {
        left: coordinates.x,
        top: coordinates.y,
        right: coordinates.x + width,
        bottom: coordinates.y + height,
      }
    }

    case 'circle': {
      const { coordinates = { x: 0, y: 0 }, radius = 0 } = node
      return {
        left: coordinates.x,
        top: coordinates.y,
        right: coordinates.x + radius * 2,
        bottom: coordinates.y + radius * 2,
      }
    }

    case 'path': {
      const startPoint = node.points[0]
      const endPoint = node.points[node.points.length - 1]
      if (!endPoint) {
        return {
          left: startPoint.x,
          top: startPoint.y,
          right: startPoint.x,
          bottom: startPoint.y,
        }
      }
      return {
        left: Math.min(startPoint.x, endPoint.x),
        top: Math.min(startPoint.y, endPoint.y),
        right: Math.max(startPoint.x, endPoint.x),
        bottom: Math.max(startPoint.y, endPoint.y),
      }
    }
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

const HANDLE_HIT_SIZE = 16

export const isPointOnHandle = (point: Point, handle: { x: number; y: number }) => {
  return (
    point.x >= handle.x - HANDLE_HIT_SIZE / 2 &&
    point.x <= handle.x + HANDLE_HIT_SIZE / 2 &&
    point.y >= handle.y - HANDLE_HIT_SIZE / 2 &&
    point.y <= handle.y + HANDLE_HIT_SIZE / 2
  )
}

export const getShapeHandles = (node: SceneNode) => {
  if (node.type === 'path') return 1
  const padding = 10
  const x = node.coordinates.x
  const y = node.coordinates.y
  const width = node.width ?? 0
  const height = node.height ?? 0
  const rotation = node.rotation ?? 0
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

export function createPathFrame(
  pathPoints: RefObject<{
    lowestX: number
    lowestY: number
    highestX: number
    highestY: number
  }>,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) {
  const overlayCanvas = overlayRef.current
  if (!overlayCanvas) return

  const overlayCtx = overlayCanvas.getContext('2d')!

  const x = Math.min(pathPoints.current.highestX, pathPoints.current.lowestX)
  const y = Math.min(pathPoints.current.highestY, pathPoints.current.lowestY)
  const w = Math.abs(pathPoints.current.highestX - pathPoints.current.lowestX)
  const h = Math.abs(pathPoints.current.highestY - pathPoints.current.lowestY)
  const padding = 10

  overlayCtx.save()
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  overlayCtx.strokeStyle = 'blue'
  overlayCtx.lineWidth = 1
  overlayCtx.strokeRect(x - padding, y - padding, w + padding * 2, h + padding * 2)
  overlayCtx.restore()
}

export function createShapeFrame(
  hitShape: SceneNode,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')!
  const shape = hitShape

  if (!shape) return

  if (shape.type === 'rectangle') {
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
    overlayCtx.rotate(shape.rotation ?? 1)

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
    const cx = shape.coordinates.x
    const cy = shape.coordinates.y
    const radius = shape.radius ?? 0
    const padding = 10
    const handleSize = 8
    const size = radius * 2

    overlayCtx.save()
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    overlayCtx.translate(cx, cy)
    overlayCtx.rotate(shape.rotation ?? 0)

    overlayCtx.strokeStyle = 'blue'
    overlayCtx.lineWidth = 1
    overlayCtx.strokeRect(
      -size / 2 - padding,
      -size / 2 - padding,
      size + padding * 2,
      size + padding * 2,
    )

    const handles = [
      { x: -size / 2 - padding, y: -size / 2 - padding },
      { x: size / 2 + padding, y: -size / 2 - padding },
      { x: size / 2 + padding, y: size / 2 + padding },
      { x: -size / 2 - padding, y: size / 2 + padding },
    ]

    handles.forEach(({ x, y }) => {
      overlayCtx.fillStyle = 'white'
      overlayCtx.strokeStyle = 'blue'
      overlayCtx.lineWidth = 1
      overlayCtx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
      overlayCtx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
    })

    overlayCtx.beginPath()
    overlayCtx.moveTo(0, -size / 2 - padding)
    overlayCtx.lineTo(0, -size / 2 - padding - 20)
    overlayCtx.stroke()

    overlayCtx.beginPath()
    overlayCtx.arc(0, -size / 2 - padding - 20, 5, 0, Math.PI * 2)
    overlayCtx.fillStyle = 'white'
    overlayCtx.fill()
    overlayCtx.strokeStyle = 'blue'
    overlayCtx.stroke()

    overlayCtx.restore()
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
