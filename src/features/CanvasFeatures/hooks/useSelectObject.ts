import { Point } from 'entities/Tool'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'

import { getSelectionBounds, isBoundsInside, isPointInsideBounds } from '../utils/utils'

import { getShapesSelector, getSelectedIdsSelector, sceneActions } from 'entities/Scene'
import { getCanvasMode } from 'entities/Canvas'
import { getNodeBounds, createShapeFrame } from 'features/ShapeFeatures'
import {
  createMultiFrame,
  getGroupBounds,
  getShapeHandles,
  isPointOnHandle,
} from 'features/ShapeFeatures/utils/utils'

export const useSelectObject = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const shapes = useAppSelector(getShapesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const canvasMode = useAppSelector(getCanvasMode)

  const sceneAction = useActionCreators(sceneActions)

  const selectionStartRef = useRef<Point | null>(null)

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const clearOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setLineDash([])
    }

    const findHitShape = (point: Point) =>
      [...shapes]
        .reverse()
        .find((shape) =>
          isPointInsideBounds(
            point,
            getNodeBounds(shape),
            shape.rotation ?? 0,
            shape.coordinates.x + (shape.width ?? 0) / 2,
            shape.coordinates.y + (shape.height ?? 0) / 2,
          ),
        )

    const onMouseDown = (e: MouseEvent) => {
      if (canvasMode !== 'select') return
      const point = getPoint(e)

      const currentShape = shapes.find((s) => selectedIds.includes(s.id))
      if (currentShape) {
        const handles = getShapeHandles(currentShape)
        const hitHandle = Object.values(handles).find((handle) => isPointOnHandle(point, handle))
        if (hitHandle) return
      }

      const hitShape = findHitShape(point)
      if (hitShape) {
        if (!selectedIds.includes(hitShape.id)) {
          sceneAction.selectShape(hitShape.id)
        }
        canvas.style.cursor = 'grabbing'
        return
      }

      sceneAction.clearSelection()
      selectionStartRef.current = point
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)
      if (canvasMode === 'select') {
        const hitShape = findHitShape(point)
        const isSelectedShape = hitShape && selectedIds.includes(hitShape.id)
        canvas.style.cursor = isSelectedShape ? 'grab' : 'default'
      }

      if (!selectionStartRef.current) return

      const x = Math.min(selectionStartRef.current.x, point.x)
      const y = Math.min(selectionStartRef.current.y, point.y)
      const width = Math.abs(point.x - selectionStartRef.current.x)
      const height = Math.abs(point.y - selectionStartRef.current.y)

      clearOverlay()
      ctx.fillStyle = 'rgba(0,0,255,0.2)'
      ctx.fillRect(x, y, width, height)
      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 0])
      ctx.strokeRect(x, y, width, height)
    }

    const onMouseUp = (e: MouseEvent) => {
      if (canvasMode === 'select') {
        canvas.style.cursor = 'default'
      }

      if (!selectionStartRef.current) return

      const point = getPoint(e)
      const selectionBounds = getSelectionBounds(selectionStartRef.current, point)

      const selectedShapes = shapes.filter((shape) =>
        isBoundsInside(getNodeBounds(shape), selectionBounds),
      )

      if (selectedShapes.length > 0) {
        sceneAction.selectMultiShape(selectedShapes.map((s) => s.id))
      } else {
        sceneAction.clearSelection()
      }

      selectionStartRef.current = null
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [canvasMode, shapes, selectedIds, sceneAction, overlayRef])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!selectedIds.length) return

    if (selectedIds.length === 1) {
      const selectedShape = shapes.find((shape) => shape.id === selectedIds[0])
      if (selectedShape) createShapeFrame(selectedShape, overlayRef)
    } else {
      const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
      const groupBounds = getGroupBounds(selectedShapes)
      createMultiFrame(groupBounds, overlayRef)
    }
  })
  useEffect(() => {
    if (!overlayRef.current) return
    overlayRef.current.style.cursor = canvasMode === 'draw' ? 'crosshair' : 'default'
  }, [canvasMode, overlayRef])
}
