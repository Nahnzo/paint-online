import { Point } from 'entities/Tool'
import { useEffect } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'

import {
  createShapeFrame,
  getSelectionBounds,
  getShapeBounds,
  isBoundsInside,
} from '../utils/utils'

import { getShapesSelector, getSelectedIdsSelector, sceneActions } from 'entities/Scene'
import { getCanvasMode } from 'entities/Canvas'

export const useSelectObject = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const shapes = useAppSelector(getShapesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const canvasMode = useAppSelector(getCanvasMode)

  const sceneAction = useActionCreators(sceneActions)

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let selectionStart: Point | null = null

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

    const onMouseDown = (e: MouseEvent) => {
      if (canvasMode !== 'select') return

      selectionStart = getPoint(e)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)

      if (!selectionStart) return

      const x = Math.min(selectionStart.x, point.x)
      const y = Math.min(selectionStart.y, point.y)
      const width = Math.abs(point.x - selectionStart.x)
      const height = Math.abs(point.y - selectionStart.y)

      clearOverlay()

      ctx.fillStyle = 'rgba(0,0,255,0.2)'
      ctx.fillRect(x, y, width, height)

      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 0])
      ctx.strokeRect(x, y, width, height)
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!selectionStart) return

      const point = getPoint(e)

      const selectionBounds = getSelectionBounds(selectionStart, point)

      const selectedShapes = shapes.filter((shape) =>
        isBoundsInside(getShapeBounds(shape), selectionBounds),
      )

      if (selectedShapes.length > 0) {
        sceneAction.selectShape(selectedShapes[0].id)
      } else {
        sceneAction.clearSelection()
      }

      selectionStart = null
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

    const selectedShape = shapes.find((shape) => shape.id === selectedIds[0])

    if (selectedShape) {
      createShapeFrame(selectedShape, overlayRef)
    }
  }, [selectedIds, shapes, overlayRef])
}
