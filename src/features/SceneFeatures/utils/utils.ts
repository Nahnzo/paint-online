import { getCanvasViewport } from 'entities/Canvas/model/selectors'
import { getNodeSettings, getNodesSelector, SceneNode } from 'entities/Scene'
import { useEffect } from 'react'
import { useAppSelector } from 'shared/hooks/hooks'
import {
  renderCircleNode,
  renderPathNode,
  renderRectangleNode,
  renderTriangleNode,
} from './renderNodes'

export function renderNodes(ctx: CanvasRenderingContext2D, nodes: SceneNode[]) {
  nodes.forEach((node) => {
    const { color, borderWidth, size, backgroundColor } = getNodeSettings(node)
    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = backgroundColor
    ctx.lineWidth = node.type === 'path' ? size : borderWidth

    switch (node.type) {
      case 'rectangle':
      case 'square':
        renderRectangleNode(ctx, node)
        break
      case 'circle':
        renderCircleNode(ctx, node)
        break
      case 'path':
        renderPathNode(ctx, node)
        break
      case 'triangle':
        renderTriangleNode(ctx, node)
        break
    }
    ctx.restore()
  })
}

export const useRenderBase = (baseRef: React.RefObject<HTMLCanvasElement>) => {
  const { percent, offsetX, offsetY } = useAppSelector(getCanvasViewport)
  const scale = percent / 100
  const nodes = useAppSelector(getNodesSelector)

  useEffect(() => {
    const canvas = baseRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)

    renderNodes(ctx, nodes)
  }, [nodes, baseRef, scale, offsetX, offsetY])
}
