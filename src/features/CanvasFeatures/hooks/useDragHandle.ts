import { useEffect, useRef } from 'react'
import {
  getSelectedIdsSelector,
  getNodesSelector,
  isPointInsideNodeBounds,
  isPointOnHandle,
  getGroupBounds,
  getBoxHandles,
} from 'entities/Scene'
import { Point } from 'entities/Tool'
import { useAppSelector } from 'shared/hooks/hooks'
import { isPointInsideFrame } from 'entities/Scene/lib/geometry'

type Node = ReturnType<typeof getNodesSelector>[number]

export type DragHandlers = {
  onDragStart?: (handle: string, point: Point, nodes: Node[]) => void
  onDrag: (handle: string, dx: number, dy: number, point: Point, nodes: Node[]) => void
  onDragEnd?: (snapshot: Node[]) => void
}

export const useDragHandle = (
  overlayRef: React.RefObject<HTMLCanvasElement>,
  { onDragStart, onDrag, onDragEnd }: DragHandlers,
) => {
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const nodes = useAppSelector(getNodesSelector)

  const nodesRef = useRef(nodes)
  const selectedIdsRef = useRef(selectedIds)
  const activeHandleRef = useRef<string | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const snapshotRef = useRef(nodes)

  const handlersRef = useRef({ onDragStart, onDrag, onDragEnd })

  useEffect(() => {
    handlersRef.current = { onDragStart, onDrag, onDragEnd }
  }, [onDragStart, onDrag, onDragEnd])

  useEffect(() => {
    nodesRef.current = nodes
    snapshotRef.current = nodes
  }, [nodes])

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const findSelectedNodes = () => {
      const result = nodesRef.current.filter((n) => selectedIdsRef.current.includes(n.id))
      return result || []
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      const nodes = findSelectedNodes()

      if (nodes.length === 0) return

      const handles = getBoxHandles(nodes)

      if (!handles) return

      const hit = Object.entries(handles).find(([, h]) => isPointOnHandle(point, h))

      if (!hit) return
      snapshotRef.current = nodesRef.current
      activeHandleRef.current = hit[0]
      lastPointRef.current = point
      handlersRef.current.onDragStart?.(hit[0], point, nodes)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)
      const nodes = findSelectedNodes()

      if (nodes.length > 0) {
        const handles = getBoxHandles(nodes)
        const hit = handles && Object.values(handles).find((h) => isPointOnHandle(point, h))

        const isInside =
          nodes.length === 1
            ? isPointInsideNodeBounds(point, nodes[0])
            : isPointInsideFrame(point, getGroupBounds(nodes))

        canvas.style.cursor = hit ? hit.cursor : isInside ? 'grab' : 'crosshair'
      }

      if (!activeHandleRef.current || !lastPointRef.current || nodes.length === 0) return

      const dx = point.x - lastPointRef.current.x
      const dy = point.y - lastPointRef.current.y

      handlersRef.current.onDrag(activeHandleRef.current, dx, dy, point, nodes)
      lastPointRef.current = point
    }

    const onMouseUp = () => {
      if (!activeHandleRef.current) return
      handlersRef.current.onDragEnd?.(snapshotRef.current)
      activeHandleRef.current = null
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [overlayRef])
}
