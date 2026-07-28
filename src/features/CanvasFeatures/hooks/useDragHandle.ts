import { useEffect, useRef } from 'react'
import {
  getSelectedIdsSelector,
  getNodesSelector,
  getShapeHandles,
  isPointInsideNodeBounds,
  isPointOnHandle,
} from 'entities/Scene'
import { Point } from 'entities/Tool'
import { useAppSelector } from 'shared/hooks/hooks'

type Node = ReturnType<typeof getNodesSelector>[number]

export type DragHandlers = {
  onDragStart?: (handle: string, point: Point, node: Node) => void
  onDrag: (handle: string, dx: number, dy: number, point: Point, node: Node) => void
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

    const findSelected = () => nodesRef.current.find((n) => selectedIdsRef.current.includes(n.id))

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      const node = findSelected()
      if (!node) return

      const handles = getShapeHandles(node)
      const hit = Object.entries(handles).find(([, h]) => isPointOnHandle(point, h))
      if (!hit) return

      snapshotRef.current = nodesRef.current
      activeHandleRef.current = hit[0]
      lastPointRef.current = point
      handlersRef.current.onDragStart?.(hit[0], point, node)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)
      const node = findSelected()

      if (node) {
        const handles = getShapeHandles(node)
        const hit = Object.values(handles).find((h) => isPointOnHandle(point, h))
        const onShape = isPointInsideNodeBounds(point, node)

        canvas.style.cursor = hit ? hit.cursor : onShape ? 'grab' : 'crosshair'
      }

      if (!activeHandleRef.current || !lastPointRef.current || !node) return

      const dx = point.x - lastPointRef.current.x
      const dy = point.y - lastPointRef.current.y

      handlersRef.current.onDrag(activeHandleRef.current, dx, dy, point, node)
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
