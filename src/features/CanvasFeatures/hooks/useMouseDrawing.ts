import { useCallback, useEffect, useRef } from 'react'
import { getBrushType, getToolSettings } from 'entities/Brush'
import { ToolStrategy, Point, createTool } from 'entities/Tool'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import {
  getNodesSelector,
  getSelectedIdsSelector,
  isPointInsideNodeBounds,
  isPointOnHandle,
  sceneActions,
  SceneNode,
  getBoxHandles,
} from 'entities/Scene'
import { CanvasProps, getCanvasMode } from 'entities/Canvas'
import { getCanvasViewport } from 'entities/Canvas/model/selectors'

export const useMouseDrawing = ({ baseRef, overlayRef }: CanvasProps) => {
  const { addNode, selectNode, clearSelection } = useActionCreators(sceneActions)

  const brushType = useAppSelector(getBrushType)
  const toolSettings = useAppSelector(getToolSettings)
  const canvasMode = useAppSelector(getCanvasMode)
  const nodes = useAppSelector(getNodesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)
  const viewport = useAppSelector(getCanvasViewport)

  const selectedIdsRef = useRef(selectedIds)
  const nodesRef = useRef(nodes)
  const viewportRef = useRef(viewport)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  useEffect(() => {
    viewportRef.current = viewport
  }, [viewport])

  const handleFinishNode = useCallback(
    (node: SceneNode) => {
      addNode(node)
      if (node.type !== 'path') {
        selectNode(node.id)
      } else {
        clearSelection()
      }
    },
    [addNode, clearSelection, selectNode],
  )

  useEffect(() => {
    const overlayCanvas = overlayRef.current
    if (!overlayCanvas) return
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!overlayCtx) return

    overlayCtx.setTransform(1, 0, 0, 1, 0, 0)
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  }, [overlayRef, viewport])

  useEffect(() => {
    if (canvasMode !== 'draw') return

    const baseCanvas = baseRef.current
    const overlayCanvas = overlayRef.current
    if (!baseCanvas || !overlayCanvas) return

    const baseCtx = baseCanvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!baseCtx || !overlayCtx) return

    let drawing = false
    let brush: ToolStrategy | null = null

    const applyOverlayTransform = () => {
      const { percent, offsetX, offsetY } = viewportRef.current
      const scale = percent / 100
      overlayCtx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
    }

    const clearOverlay = () => {
      overlayCtx.setTransform(1, 0, 0, 1, 0, 0)
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
      applyOverlayTransform()
    }

    const getPoint = (e: MouseEvent): Point => {
      const rect = overlayCanvas.getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top

      const { percent, offsetX, offsetY } = viewportRef.current
      const scale = percent / 100

      return {
        x: (screenX - offsetX) / scale,
        y: (screenY - offsetY) / scale,
      }
    }

    const isOverSelectedNode = (point: Point): boolean => {
      const currentNodes = nodesRef.current
      const currentIds = selectedIdsRef.current

      return currentNodes.some(
        (node) => currentIds.includes(node.id) && isPointInsideNodeBounds(point, node),
      )
    }

    const onMouseDown = (e: MouseEvent) => {
      const point = getPoint(e)
      const selectedNodes = nodesRef.current.filter((n) => selectedIdsRef.current.includes(n.id))

      if (selectedNodes.length > 0) {
        const handles = getBoxHandles(selectedNodes)
        const hitHandle = handles && Object.values(handles).find((h) => isPointOnHandle(point, h))
        if (hitHandle) return
      }

      const hitNode = [...nodesRef.current]
        .reverse()
        .find((node) => isPointInsideNodeBounds(point, node))

      if (hitNode) {
        selectNode(hitNode.id)
        return
      }

      drawing = true
      brush = createTool(brushType, toolSettings, handleFinishNode)

      applyOverlayTransform()
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)
      overlayCanvas.style.cursor = isOverSelectedNode(point) ? 'grab' : 'crosshair'
      if (!drawing || !brush) return

      applyOverlayTransform()
      brush.onMove(baseCtx, overlayCtx, point)
    }

    const onMouseUp = () => {
      overlayCanvas.style.cursor = 'crosshair'
      if (!drawing || !brush) return
      drawing = false
      brush.onEnd(baseCtx, overlayCtx)
      brush = null

      clearOverlay()
    }

    overlayCanvas.addEventListener('mousedown', onMouseDown)
    overlayCanvas.addEventListener('mousemove', onMouseMove)
    overlayCanvas.addEventListener('mouseup', onMouseUp)

    return () => {
      overlayCanvas.removeEventListener('mousedown', onMouseDown)
      overlayCanvas.removeEventListener('mousemove', onMouseMove)
      overlayCanvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [baseRef, overlayRef, brushType, toolSettings, canvasMode, handleFinishNode, selectNode])
}
