import { getSelectedIdsSelector, getNodesSelector, sceneActions } from 'entities/Scene'
import { Point } from 'entities/Tool'
import { getNodeBounds, getShapeHandles, isPointOnHandle } from 'features/ShapeFeatures'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { isPointInsideNodeBounds } from '../utils/utils'

export const useResizeObject = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const nodes = useAppSelector(getNodesSelector)
  const { commitMove, resizeNode } = useActionCreators(sceneActions)

  const activeHandleRef = useRef<string | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const initialAngleRef = useRef<number>(0)
  const initialRotationRef = useRef<number>(0)
  const lastAngleRef = useRef<number>(0)

  const snapshotRef = useRef(nodes)

  useEffect(() => {
    snapshotRef.current = nodes
  }, [nodes])

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

      const currentShape = nodes.find((s) => selectedIds.includes(s.id))
      if (!currentShape) return

      const handles = getShapeHandles(currentShape)
      const hitHandle = Object.entries(handles).find(([_, handle]) =>
        isPointOnHandle(point, handle),
      )

      if (hitHandle) {
        snapshotRef.current = nodes
        activeHandleRef.current = hitHandle[0]
        lastPointRef.current = point

        if (hitHandle[0] === 'rotate') {
          const bounds = getNodeBounds(currentShape)
          const center = {
            x: (bounds.left + bounds.right) / 2,
            y: (bounds.top + bounds.bottom) / 2,
          }
          initialAngleRef.current = Math.atan2(point.y - center.y, point.x - center.x)
          initialRotationRef.current = currentShape.rotation ?? 0
          lastAngleRef.current = initialAngleRef.current
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      const currentShape = nodes.find((s) => selectedIds.includes(s.id))

      if (currentShape) {
        const handles = getShapeHandles(currentShape)
        const hitHandle = Object.values(handles).find((handle) => isPointOnHandle(point, handle))
        const pointOnShape = isPointInsideNodeBounds(point, currentShape)

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

      let angle = 0

      if (activeHandleRef.current === 'rotate') {
        const bounds = getNodeBounds(currentShape)
        const center = {
          x: (bounds.left + bounds.right) / 2,
          y: (bounds.top + bounds.bottom) / 2,
        }
        canvas.style.cursor = 'grab'
        const currentAngle = Math.atan2(point.y - center.y, point.x - center.x)
        angle = currentAngle - initialAngleRef.current + initialRotationRef.current
        lastAngleRef.current = currentAngle
      }

      resizeNode({
        id: currentShape.id,
        dx,
        dy,
        angle,
        handle: activeHandleRef.current,
      })

      lastPointRef.current = point
    }

    const onMouseUp = () => {
      if (!activeHandleRef.current || !lastPointRef.current) return

      commitMove(snapshotRef.current)

      activeHandleRef.current = null
      lastPointRef.current = null
      lastAngleRef.current = 0
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [overlayRef, nodes, selectedIds, resizeNode, commitMove])
}
