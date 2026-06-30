import { Point } from 'entities/Tool'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'

import { getSelectionBounds, isBoundsInside, isPointInsideNodeBounds } from '../utils/utils'

import { getNodesSelector, getSelectedIdsSelector, sceneActions } from 'entities/Scene'
import { getCanvasMode } from 'entities/Canvas'
import {
  getNodeBounds,
  createMultiFrame,
  createNodeFrame,
  getGroupBounds,
  getShapeHandles,
  isPointOnHandle,
} from 'features/ShapeFeatures'

export const useSelectObject = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const nodes = useAppSelector(getNodesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const canvasMode = useAppSelector(getCanvasMode)

  const { selectMultiNode, selectNode, clearSelection } = useActionCreators(sceneActions)

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
      [...nodes].reverse().find((node) => isPointInsideNodeBounds(point, node))

    const onMouseDown = (e: MouseEvent) => {
      if (canvasMode !== 'select') return
      const point = getPoint(e)

      const currentNode = nodes.find((s) => selectedIds.includes(s.id))
      if (currentNode) {
        const handles = getShapeHandles(currentNode)
        const hitHandle = Object.values(handles).find((handle) => isPointOnHandle(point, handle))
        if (hitHandle) return
      }

      const hitShape = findHitShape(point)
      if (hitShape) {
        if (!selectedIds.includes(hitShape.id)) {
          selectNode(hitShape.id)
        }
        canvas.style.cursor = 'grabbing'
        return
      }

      clearSelection()
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

      const selectedNodes = nodes.filter((node) =>
        isBoundsInside(getNodeBounds(node), selectionBounds),
      )

      if (selectedNodes.length > 0) {
        selectMultiNode(selectedNodes.map((s) => s.id))
      } else {
        clearSelection()
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
  }, [canvasMode, nodes, selectedIds, overlayRef, clearSelection, selectNode, selectMultiNode])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!selectedIds.length) return

    if (selectedIds.length === 1) {
      const selectedNode = nodes.find((node) => node.id === selectedIds[0])

      if (!selectedNode) return
      if (selectedNode) createNodeFrame(selectedNode, overlayRef)
    } else {
      const selectedNodes = nodes.filter((s) => selectedIds.includes(s.id))
      const groupBounds = getGroupBounds(selectedNodes)
      createMultiFrame(groupBounds, overlayRef)
    }
  })
  useEffect(() => {
    if (!overlayRef.current) return
    overlayRef.current.style.cursor = canvasMode === 'draw' ? 'crosshair' : 'default'
  }, [canvasMode, overlayRef])
}
