import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { sceneActions } from 'entities/Scene/model/slice'
import { Point } from 'entities/Tool'
import { createShapeFrame, getShapeBounds, isPointInsideBounds } from '../utils/utils'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'

export const useDragObject = (
  baseRef: React.RefObject<HTMLCanvasElement>,
  overlayRef: React.RefObject<HTMLCanvasElement>,
) => {
  const selectedIds = useAppSelector((state) => state.scene.selectedShapeIds)
  const shapes = useAppSelector((state) => state.scene.shapes)
  const sceneAction = useActionCreators(sceneActions)
  const sceneActionRef = useRef(sceneAction)

  const isDragging = useRef(false)
  const lastPoint = useRef<Point | null>(null)
  const shapesRef = useRef(shapes)
  const snapshotRef = useRef(shapes)
  const selectedIdsRef = useRef(selectedIds)

  useEffect(() => {
    sceneActionRef.current = sceneAction
  }, [sceneAction])

  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  useEffect(() => {
    const base = baseRef.current
    const overlay = overlayRef.current
    if (!base || !overlay) return

    const baseCtx = base.getContext('2d')
    const overlayCtx = overlay.getContext('2d')
    if (!baseCtx || !overlayCtx) return

    const getPoint = (e: MouseEvent) => {
      const rect = overlay.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const drawOverlay = (currentShapes: typeof shapes) => {
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
      const selectedShape = currentShapes.find((s) => selectedIdsRef.current.includes(s.id))
      if (!selectedShape) return

      const { x, y } = selectedShape.coordinates
      const width = selectedShape.width
      const height = selectedShape.height
      overlayCtx.fillStyle = DEFAULT_BACKGROUND_CANVAS_VALUE
      overlayCtx.fillRect(x, y, width, height)
      createShapeFrame(selectedShape, overlayRef)
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      const currentShapes = shapesRef.current
      const currentIds = selectedIdsRef.current
      snapshotRef.current = shapesRef.current
      const hovered = currentShapes.find(
        (s) => currentIds.includes(s.id) && isPointInsideBounds(point, getShapeBounds(s)),
      )
      if (!hovered) return
      isDragging.current = true
      lastPoint.current = point
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !lastPoint.current) return

      const point = getPoint(e)
      const dx = point.x - lastPoint.current.x
      const dy = point.y - lastPoint.current.y

      const updatedShapes = shapesRef.current.map((s) =>
        selectedIdsRef.current.includes(s.id)
          ? { ...s, coordinates: { x: s.coordinates.x + dx, y: s.coordinates.y + dy } }
          : s,
      )

      sceneActionRef.current.moveSelectedShapes({ ids: selectedIdsRef.current, dx, dy })

      lastPoint.current = point
      drawOverlay(updatedShapes)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      lastPoint.current = null
      sceneActionRef.current.commitMove(snapshotRef.current)
    }

    overlay.addEventListener('mousedown', onMouseDown)
    overlay.addEventListener('mousemove', onMouseMove)
    overlay.addEventListener('mouseup', onMouseUp)

    return () => {
      overlay.removeEventListener('mousedown', onMouseDown)
      overlay.removeEventListener('mousemove', onMouseMove)
      overlay.removeEventListener('mouseup', onMouseUp)
    }
  }, [baseRef, overlayRef])
}
