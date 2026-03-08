import { useAppSelector } from 'shared/hooks/hooks'
import { getCanvasBackgroundColor, getCanvasMode } from '../model/selectors'
import { useCanvasResize, useMouseDrawing, useSelectObject } from 'features/CanvasFeatures'

interface CanvasProps {
  baseRef: React.RefObject<HTMLCanvasElement>
  overlayRef: React.RefObject<HTMLCanvasElement>
}

const Canvas = ({ baseRef, overlayRef }: CanvasProps) => {
  const canvasBackgroundColor = useAppSelector(getCanvasBackgroundColor)

  const canvasMode = useAppSelector(getCanvasMode)

  useCanvasResize(baseRef)
  useCanvasResize(overlayRef)
  useMouseDrawing(baseRef, overlayRef)
  useSelectObject(overlayRef)
  // useDragObject({ overlayRef })

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
