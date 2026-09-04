import { Bounds, SceneNode } from '../model/types'
import { getNodeBounds } from './getNodeBounds'

export function createMultiFrame(
  bounds: Bounds,
  overlayRef: React.RefObject<HTMLCanvasElement>,
  zoomState?: { scale: number; offsetX: number; offsetY: number },
) {
  const overlayCanvas = overlayRef.current
  const overlayCtx = overlayCanvas.getContext('2d')!
  const handleSize = 8

  const padding = 10

  const x = bounds.left - padding
  const y = bounds.top - padding
  const width = bounds.right - bounds.left + padding * 2
  const height = bounds.bottom - bounds.top + padding * 2

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  overlayCtx.save()
  if (zoomState)
    overlayCtx.setTransform(
      zoomState.scale,
      0,
      0,
      zoomState.scale,
      zoomState.offsetX,
      zoomState.offsetY,
    )
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
  zoomState?: { scale: number; offsetX: number; offsetY: number },
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
  if (zoomState)
    overlayCtx.setTransform(
      zoomState.scale,
      0,
      0,
      zoomState.scale,
      zoomState.offsetX,
      zoomState.offsetY,
    )
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
