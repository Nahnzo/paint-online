import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { Point } from 'entities/Tool'
import { isPointInsideNodeBounds } from '../utils/utils'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'
import { createNodeFrame, getGroupBounds } from 'features/ShapeFeatures'
import { getNodesSelector, getSelectedIdsSelector, sceneActions } from 'entities/Scene'
import { CanvasProps } from 'entities/Canvas'

export const useDragObject = ({ baseRef, overlayRef }: CanvasProps) => {
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const nodes = useAppSelector(getNodesSelector)
  const { moveSelectedNodes, commitMove } = useActionCreators(sceneActions)

  const isDragging = useRef(false)
  const lastPoint = useRef<Point | null>(null)
  const nodesRef = useRef(nodes)
  const snapshotRef = useRef(nodes)
  const selectedIdsRef = useRef(selectedIds)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

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

    const drawOverlay = (currentNodes: typeof nodes) => {
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
      const selectedNode = currentNodes.find((s) => selectedIdsRef.current.includes(s.id))
      if (!selectedNode) return
      const coordinates = selectedNode.coordinates ?? { x: 0, y: 0 }
      if ('width' in selectedNode && 'height' in selectedNode) {
        const width = selectedNode.width ?? 1
        const height = selectedNode.height ?? 1
        overlayCtx.fillStyle = DEFAULT_BACKGROUND_CANVAS_VALUE
        overlayCtx.fillRect(coordinates.x, coordinates.y, width, height)
      }

      createNodeFrame(selectedNode, overlayRef)
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      const currentNodes = nodesRef.current
      const currentIds = selectedIdsRef.current
      snapshotRef.current = nodesRef.current

      const hovered = currentNodes.find(
        (s) => currentIds.includes(s.id) && isPointInsideNodeBounds(point, s),
      )

      if (!hovered) {
        if (currentIds.length > 1) {
          const selectedNodes = currentNodes.filter((s) => currentIds.includes(s.id))
          const groupBounds = getGroupBounds(selectedNodes)
          const inGroup =
            point.x >= groupBounds.left &&
            point.x <= groupBounds.right &&
            point.y >= groupBounds.top &&
            point.y <= groupBounds.bottom
          if (!inGroup) return
        } else {
          return
        }
      }

      isDragging.current = true
      lastPoint.current = point
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !lastPoint.current) return

      const point = getPoint(e)
      const dx = point.x - lastPoint.current.x
      const dy = point.y - lastPoint.current.y

      const updatedNodes = nodesRef.current.map((s) => {
        if (!selectedIdsRef.current.includes(s.id)) return s

        if (s.type === 'path') {
          return {
            ...s,
            points:
              s.points?.map((p) => ({
                x: p.x + dx,
                y: p.y + dy,
              })) ?? [],
          }
        }

        return {
          ...s,
          coordinates: {
            x: (s.coordinates?.x ?? 0) + dx,
            y: (s.coordinates?.y ?? 0) + dy,
          },
        }
      })

      moveSelectedNodes({ ids: selectedIdsRef.current, dx, dy })

      lastPoint.current = point
      drawOverlay(updatedNodes)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      lastPoint.current = null
      commitMove(snapshotRef.current)
    }

    overlay.addEventListener('mousedown', onMouseDown)
    overlay.addEventListener('mousemove', onMouseMove)
    overlay.addEventListener('mouseup', onMouseUp)

    return () => {
      overlay.removeEventListener('mousedown', onMouseDown)
      overlay.removeEventListener('mousemove', onMouseMove)
      overlay.removeEventListener('mouseup', onMouseUp)
    }
  }, [baseRef, commitMove, moveSelectedNodes, overlayRef])
}
