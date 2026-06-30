import { useCallback, useEffect, useRef } from 'react'
import { getBrushType, getToolSettings } from 'entities/Brush'
import { ToolStrategy, Point, createTool } from 'entities/Tool'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { getNodesSelector, getSelectedIdsSelector, sceneActions, SceneNode } from 'entities/Scene'
import { isPointInsideNodeBounds } from '../utils/utils'
import { getShapeHandles, isPointOnHandle } from 'features/ShapeFeatures'
import { CanvasProps, getCanvasMode } from 'entities/Canvas'

export const useMouseDrawing = ({ baseRef, overlayRef }: CanvasProps) => {
  const { addNode, selectNode, clearSelection } = useActionCreators(sceneActions)

  const brushType = useAppSelector(getBrushType)
  const toolSettings = useAppSelector(getToolSettings)
  const canvasMode = useAppSelector(getCanvasMode)
  const nodes = useAppSelector(getNodesSelector)
  const selectedIds = useAppSelector(getSelectedIdsSelector)

  const selectedIdsRef = useRef(selectedIds)
  const nodesRef = useRef(nodes)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

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
    if (canvasMode !== 'draw') return

    const baseCanvas = baseRef.current
    const overlayCanvas = overlayRef.current
    if (!baseCanvas || !overlayCanvas) return

    const baseCtx = baseCanvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!baseCtx || !overlayCtx) return

    let drawing = false
    let brush: ToolStrategy | null = null

    const getPoint = (e: MouseEvent): Point => {
      const rect = overlayCanvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
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
      const currentNode = nodesRef.current.find((node) => selectedIdsRef.current.includes(node.id))
      if (currentNode) {
        const handles = getShapeHandles(currentNode)
        const hitHandle = Object.values(handles).find((handle) => isPointOnHandle(point, handle))
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
      brush.onStart(baseCtx, overlayCtx, point)
    }

    const onMouseMove = (e: MouseEvent) => {
      const point = getPoint(e)
      overlayCanvas.style.cursor = isOverSelectedNode(point) ? 'grab' : 'crosshair'
      if (!drawing || !brush) return
      brush.onMove(baseCtx, overlayCtx, point)
    }

    const onMouseUp = () => {
      overlayCanvas.style.cursor = 'crosshair'
      if (!drawing || !brush) return
      drawing = false
      brush.onEnd(baseCtx, overlayCtx)
      brush = null
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
