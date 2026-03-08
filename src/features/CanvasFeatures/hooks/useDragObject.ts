import { sceneActions } from 'entities/Scene/model/slice'
import { Point } from 'entities/Tool'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'shared/hooks/hooks'
import { Bounds, getShapeBounds, isPointInsideBounds } from '../utils/utils'
interface UseDragObject {
  overlayRef: React.RefObject<HTMLCanvasElement>
}

export const useDragObject = ({ overlayRef }: UseDragObject) => {
  const selectedIds = useAppSelector((state) => state.scene.selectedShapeIds)
  const shapes = useAppSelector((state) => state.scene.shapes)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    let isDragging = false
    let lastPoint: Point | null = null

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)

      const hoveredShape = shapes.find((shape) => {
        const bounds = getShapeBounds(shape)
        return isPointInsideBounds(point, bounds)
      })

      if (!hoveredShape) return
      if (!selectedIds.includes(hoveredShape.id)) return

      isDragging = true
      lastPoint = point
      canvas.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !lastPoint) return

      const point = getPoint(e)
      const dx = point.x - lastPoint.x
      const dy = point.y - lastPoint.y

      dispatch(
        sceneActions.moveSelectedShapes({
          ids: selectedIds,
          dx,
          dy,
        }),
      )

      lastPoint = point
    }

    const onMouseUp = () => {
      isDragging = false
      lastPoint = null
      canvas.style.cursor = 'default'
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [overlayRef, selectedIds, dispatch])
}
