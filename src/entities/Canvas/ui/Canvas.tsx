import { useAppSelector } from 'shared/hooks/hooks'
import { getCanvasBackgroundColor } from '../model/selectors'
import {
  useCanvasResize,
  useDragObject,
  useMouseDrawing,
  useResizeObject,
  useSelectObject,
} from 'features/CanvasFeatures'
import { useRenderBase } from 'features/SceneFeatures'

interface CanvasProps {
  baseRef: React.RefObject<HTMLCanvasElement>
  overlayRef: React.RefObject<HTMLCanvasElement>
}

const Canvas = ({ baseRef, overlayRef }: CanvasProps) => {
  const canvasBackgroundColor = useAppSelector(getCanvasBackgroundColor)

  useCanvasResize(baseRef)
  useCanvasResize(overlayRef)
  useMouseDrawing(baseRef, overlayRef)
  useRenderBase(baseRef)
  useResizeObject(overlayRef)
  useDragObject(baseRef, overlayRef)
  useSelectObject(overlayRef)

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
          pointerEvents: 'auto',
        }}
      />
    </>
  )
}

export default Canvas
