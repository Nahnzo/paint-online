import { CanvasMode } from 'entities/Canvas/model/types'
import { ShapeBase } from 'entities/Scene'
import { sceneActions } from 'entities/Scene/model/slice'
import { ToolType, ToolSettings, ToolStrategy, Point } from 'entities/Tool'
import { createTool } from 'entities/Tool/model/factory'
import { useEffect } from 'react'
import { useAppSelector, useActionCreators } from 'shared/hooks/hooks'
import { createShapeFrame, isPointInsideShape } from '../utils/utils'

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

    const getPoint = (e: MouseEvent): Point => ({
      x: e.clientX,
      y: e.clientY,
    })

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      if (canvasMode === 'select') {
        const hitShape = shapes.find((shape) => isPointInsideShape(point, shape))
        createShapeFrame(hitShape, overlayRef)
        if (hitShape) {
          sceneAction.selectShape(hitShape.id)
        } else {
          sceneAction.clearSelection()
        }
        return
      }

      drawing = true
      brush = createTool(brushType, settings, handleFinishShape)
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!drawing || !brush) return
      brush.onMove(baseCtx, overlayCtx, getPoint(e))
    }

    const onMouseUp = () => {
      if (!drawing || !brush) return
      drawing = false
      brush.onEnd(baseCtx, overlayCtx)
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
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
