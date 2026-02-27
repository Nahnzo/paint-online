import { CanvasMode } from 'entities/Canvas/model/types'
import { ShapeBase } from 'entities/Scene'
import { sceneActions } from 'entities/Scene/model/slice'
import { ToolType, ToolSettings, ToolStrategy, Point } from 'entities/Tool'
import { createTool } from 'entities/Tool/model/factory'
import { useEffect } from 'react'
import { useAppSelector, useActionCreators } from 'shared/hooks/hooks'
import {
  Bounds,
  createShapeFrame,
  getShapeBounds,
  isBoundsInside,
  isBoundsIntersecting,
} from '../utils/utils'

export const useMouseDrawing = (
  baseRef: React.RefObject<HTMLCanvasElement>,
  overlayRef: React.RefObject<HTMLCanvasElement>,
  brushType: ToolType,
  settings: ToolSettings,
  canvasMode: CanvasMode,
  handleFinishShape: (shape: ShapeBase) => void,
) => {
  const shapes = useAppSelector((state) => state.scene.shapes)
  const sceneAction = useActionCreators(sceneActions)

  useEffect(() => {
    const baseCanvas = baseRef.current
    const overlayCanvas = overlayRef.current
    if (!baseCanvas || !overlayCanvas) return

    const baseCtx = baseCanvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!baseCtx || !overlayCtx) return

    let drawing = false
    let brush: ToolStrategy | null = null
    let isSelecting = false
    let selectionStart: Point | null = null

    const getPoint = (e: MouseEvent): Point => {
      const rect = overlayCanvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const clearOverlay = () => {
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
      overlayCtx.setLineDash([])
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)

      if (canvasMode === 'select') {
        isSelecting = true
        selectionStart = point
        return
      }

      drawing = true
      brush = createTool(brushType, settings, handleFinishShape)
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      if (isSelecting && selectionStart) {
        const x = Math.min(selectionStart.x, point.x)
        const y = Math.min(selectionStart.y, point.y)
        const width = Math.abs(point.x - selectionStart.x)
        const height = Math.abs(point.y - selectionStart.y)

        clearOverlay()

        overlayCtx.fillStyle = 'rgba(0, 0, 255, 0.2)'
        overlayCtx.fillRect(x, y, width, height)
        overlayCtx.strokeStyle = 'blue'
        overlayCtx.lineWidth = 1
        overlayCtx.setLineDash([4, 4])
        overlayCtx.strokeRect(x, y, width, height)

        return
      }

      if (!drawing || !brush) return
      brush.onMove(baseCtx, overlayCtx, point)
    }

    const onMouseUp = (e: MouseEvent) => {
      const point = getPoint(e)

      if (isSelecting && selectionStart) {
        const x1 = Math.min(selectionStart.x, point.x)
        const y1 = Math.min(selectionStart.y, point.y)
        const x2 = Math.max(selectionStart.x, point.x)
        const y2 = Math.max(selectionStart.y, point.y)

        const selectionBounds: Bounds = { left: x1, top: y1, right: x2, bottom: y2 }
        const isLeftToRight = point.x >= selectionStart.x

        const selected = shapes.filter((shape) => {
          const shapeBounds = getShapeBounds(shape)
          return isLeftToRight
            ? isBoundsInside(shapeBounds, selectionBounds)
            : isBoundsIntersecting(shapeBounds, selectionBounds)
        })

        clearOverlay()

        if (selected.length > 0) {
          sceneAction.selectShape(selected[0].id)
          createShapeFrame(selected[0], overlayRef)
        } else {
          sceneAction.clearSelection()
        }
        isSelecting = false
        selectionStart = null
        return
      }

      if (!drawing || !brush) return
      drawing = false
      brush.onEnd(baseCtx, overlayCtx)
      clearOverlay()
      brush = null
    }

    overlayCanvas.addEventListener('mousedown', onMouseDown)
    overlayCanvas.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      overlayCanvas.removeEventListener('mousedown', onMouseDown)
      overlayCanvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [baseRef, overlayRef, brushType, settings, canvasMode, handleFinishShape, shapes, sceneAction])
}
