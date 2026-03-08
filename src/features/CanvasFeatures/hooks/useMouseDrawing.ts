/* eslint-disable react-hooks/exhaustive-deps */
import { getBrushType, getToolSettings } from 'entities/Brush'
import { getCanvasMode } from 'entities/Canvas/model/selectors'
import { sceneActions, ShapeBase } from 'entities/Scene'
import { ToolStrategy, Point, createTool } from 'entities/Tool'
import { useEffect } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'

export const useMouseDrawing = (
  baseRef: React.RefObject<HTMLCanvasElement>,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) => {
  const sceneAction = useActionCreators(sceneActions)
  const brushType = useAppSelector(getBrushType)
  const toolSettings = useAppSelector(getToolSettings)
  const canvasMode = useAppSelector(getCanvasMode)

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

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)

      drawing = true
      brush = createTool(brushType, toolSettings, handleFinishShape)
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      if (!drawing || !brush) return
      brush.onMove(baseCtx, overlayCtx, point)
    }

    const onMouseUp = () => {
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
