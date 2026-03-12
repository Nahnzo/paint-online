import { getBrushType, getToolSettings } from 'entities/Brush'
import { getCanvasMode } from 'entities/Canvas/model/selectors'
import { sceneActions, ShapeBase } from 'entities/Scene'
import { ToolStrategy, Point, createTool } from 'entities/Tool'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { getShapesSelector, getSelectedIdsSelector } from 'entities/Scene'
import { getShapeBounds, isPointInsideBounds } from '../utils/utils'

export const useMouseDrawing = (
  baseRef: React.RefObject<HTMLCanvasElement>,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) => {
  const sceneAction = useActionCreators(sceneActions)
  const brushType = useAppSelector(getBrushType)
  const toolSettings = useAppSelector(getToolSettings)
  const canvasMode = useAppSelector(getCanvasMode)
  const shapes = useAppSelector(getShapesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)

  const shapesRef = useRef(shapes)
  const selectedIdsRef = useRef(selectedIds)

  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])
  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  const handleFinishShape = (shape: ShapeBase) => {
    sceneAction.addShape(shape)
    sceneAction.selectShape(shape.id)
  }

  useEffect(() => {
    if (canvasMode !== 'draw') return

    const baseCanvas = baseRef.current
    const overlayCanvas = overlayRef.current
    if (!baseCanvas || !overlayCanvas) return

    const baseCtx = baseCanvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!baseCtx || !overlayCtx) return

    let drawing = false
    let brush: ToolStrategy | null = null

    const getPoint = (e: MouseEvent): Point => {
      const rect = overlayCanvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const isOverSelectedShape = (point: Point): boolean => {
      const currentShapes = shapesRef.current
      const currentIds = selectedIdsRef.current

      return currentShapes.some(
        (s) => currentIds.includes(s.id) && isPointInsideBounds(point, getShapeBounds(s)),
      )
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)

      if (isOverSelectedShape(point)) {
        overlayCanvas.style.cursor = 'grabbing'
        return
      }

      drawing = true
      brush = createTool(brushType, toolSettings, handleFinishShape)
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      overlayCanvas.style.cursor = isOverSelectedShape(point) ? 'grab' : 'crosshair'

      if (!drawing || !brush) return
      brush.onMove(baseCtx, overlayCtx, point)
    }

    const onMouseUp = () => {
      overlayCanvas.style.cursor = 'crosshair'
      if (!drawing || !brush) return
      drawing = false
      brush.onEnd(baseCtx, overlayCtx)
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
  }, [baseRef, overlayRef, brushType, toolSettings, canvasMode])
}
