import { useAppSelector } from 'shared/hooks/hooks'
import { getCanvasBackgroundColor } from '../model/selectors'
import {
  useCanvasResize,
  useDragNode,
  useMouseDrawing,
  useResizeNode,
  useSelectNode,
  // useZoom,
} from 'features/CanvasFeatures'
import { useRenderBase } from 'features/SceneFeatures'
import { CanvasProps } from '../model/types'

const Canvas = ({ baseRef, overlayRef }: CanvasProps) => {
  const canvasBackgroundColor = useAppSelector(getCanvasBackgroundColor)

  // useZoom({ baseRef, overlayRef })
  useCanvasResize(baseRef)
  useCanvasResize(overlayRef)
  useMouseDrawing({ baseRef, overlayRef })
  useRenderBase(baseRef)
  useResizeNode(overlayRef)
  useDragNode({ baseRef, overlayRef })
  useSelectNode(overlayRef)

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
