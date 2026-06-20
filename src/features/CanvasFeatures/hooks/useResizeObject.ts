import { getSelectedIdsSelector, getShapesSelector, sceneActions } from 'entities/Scene'
import { Point } from 'entities/Tool'
import { getNodeBounds, getShapeHandles, isPointOnHandle } from 'features/ShapeFeatures'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { isPointInsideBounds, isPointInsideNodeBounds } from '../utils/utils'

export const useResizeObject = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const shapes = useAppSelector(getShapesSelector)
  const sceneAction = useActionCreators(sceneActions)

  const activeHandleRef = useRef<string | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const initialAngleRef = useRef<number>(0)
  const initialRotationRef = useRef<number>(0)

  const snapshotRef = useRef(shapes)

  useEffect(() => {
    snapshotRef.current = shapes
  }, [shapes])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)

      const currentShape = shapes.find((s) => selectedIds.includes(s.id))
      if (!currentShape) return

      const handles = getShapeHandles(currentShape)
      const hitHandle = Object.entries(handles).find(([_, handle]) =>
        isPointOnHandle(point, handle),
      )

      if (hitHandle) {
        snapshotRef.current = shapes
        activeHandleRef.current = hitHandle[0]
        lastPointRef.current = point

        if (hitHandle[0] === 'rotate') {
          const centerX = currentShape.coordinates.x + (currentShape.width ?? 0) / 2
          const centerY = currentShape.coordinates.y + (currentShape.height ?? 0) / 2
          initialAngleRef.current = Math.atan2(point.y - centerY, point.x - centerX)
          initialRotationRef.current = currentShape.rotation ?? 0
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      const currentShape = shapes.find((s) => selectedIds.includes(s.id))

      if (currentShape) {
        const handles = getShapeHandles(currentShape)
        const hitHandle = Object.values(handles).find((handle) => isPointOnHandle(point, handle))
        const shapeBounds = getNodeBounds(currentShape)
        const pointOnShape = isPointInsideNodeBounds(point, shapeBounds, currentShape)

        if (hitHandle) {
          canvas.style.cursor = hitHandle.cursor
        } else if (pointOnShape) {
          canvas.style.cursor = 'grab'
        } else {
          canvas.style.cursor = 'crosshair'
        }
      }

      if (!activeHandleRef.current || !lastPointRef.current || !currentShape) return

      const dx = point.x - lastPointRef.current.x
      const dy = point.y - lastPointRef.current.y

      let angleDelta: number | undefined

      if (activeHandleRef.current === 'rotate') {
        canvas.style.cursor = 'grab'
        const centerX = currentShape.coordinates.x + (currentShape.width ?? 0) / 2
        const centerY = currentShape.coordinates.y + (currentShape.height ?? 0) / 2

        const currentAngle = Math.atan2(point.y - centerY, point.x - centerX)
        angleDelta = currentAngle - initialAngleRef.current + initialRotationRef.current
      }

      sceneAction.resizeShape({
        id: currentShape.id,
        dx,
        dy,
        angle: activeHandleRef.current === 'rotate' ? angleDelta! : 0,
        handle: activeHandleRef.current,
      })

      lastPointRef.current = point
    }

    const onMouseUp = () => {
      if (!activeHandleRef.current || !lastPointRef.current) return

      sceneAction.commitMove(snapshotRef.current)

      activeHandleRef.current = null
      lastPointRef.current = null
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [overlayRef, shapes, selectedIds, sceneAction])
}
