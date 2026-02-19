import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { getCanvasBackgroundColor, getCanvasMode } from '../model/selectors'
import { useCanvasResize, useMouseDrawing } from 'features/CanvasFeatures'
import { getBrushType, getToolSettings } from 'entities/Brush/model/selectors'
import { sceneActions } from 'entities/Scene/model/slice'
import { ShapeBase } from 'entities/Scene'

interface CanvasProps {
  baseRef: React.RefObject<HTMLCanvasElement>
  overlayRef: React.RefObject<HTMLCanvasElement>
}

const Canvas = ({ baseRef, overlayRef }: CanvasProps) => {
  const canvasBackgroundColor = useAppSelector(getCanvasBackgroundColor)
  const brushType = useAppSelector(getBrushType)
  const toolSettings = useAppSelector(getToolSettings)
  const sceneAction = useActionCreators(sceneActions)
  const canvasMode = useAppSelector(getCanvasMode)

  const handleFinishShape = (shape: ShapeBase) => {
    sceneAction.addShape(shape)
  }

  useCanvasResize(baseRef)
  useCanvasResize(overlayRef)
  useMouseDrawing(baseRef, overlayRef, brushType, toolSettings, canvasMode, handleFinishShape)

  return (
    <>
      <canvas
        ref={baseRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: canvasBackgroundColor,
        }}
      />
      <canvas
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          cursor: canvasMode === 'select' ? '' : 'crosshair',
          pointerEvents: 'auto',
        }}
      />
    </>
  )
}

export default Canvas
