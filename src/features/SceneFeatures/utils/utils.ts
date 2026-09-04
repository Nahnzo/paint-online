import { getCanvasViewport } from 'entities/Canvas/model/selectors'
import { getNodeBounds, getNodeSettings, getNodesSelector, SceneNode } from 'entities/Scene'
import { useEffect } from 'react'
import { useAppSelector } from 'shared/hooks/hooks'

export function renderNodes(ctx: CanvasRenderingContext2D, nodes: SceneNode[]) {
  nodes.forEach((node) => {
    const coordinates = node.coordinates ?? { x: 0, y: 0 }
    const { color, borderWidth, size, backgroundColor } = getNodeSettings(node)

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = backgroundColor
    ctx.lineWidth = node.type === 'path' ? size : borderWidth

    if (node.type === 'rectangle') {
      const width = node.width ?? 0
      const height = node.height ?? 0
      const centerX = coordinates.x + width / 2
      const centerY = coordinates.y + height / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(node.rotation ?? 0)
      ctx.fillRect(-width / 2, -height / 2, width, height)
      ctx.strokeRect(-width / 2, -height / 2, width, height)
    }

    if (node.type === 'square') {
      const width = node.width ?? 0
      const height = node.height ?? 0
      const centerX = coordinates.x + width / 2
      const centerY = coordinates.y + height / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(node.rotation ?? 0)
      ctx.fillRect(-width / 2, -height / 2, width, height)
      ctx.strokeRect(-width / 2, -height / 2, width, height)
    }

    if (node.type === 'circle') {
      const radius = node.radius ?? 0
      ctx.beginPath()
      ctx.arc(coordinates.x, coordinates.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    if (node.type === 'path') {
      if (node.points && node.points.length > 1) {
        const bounds = getNodeBounds(node)
        const centerX = (bounds.left + bounds.right) / 2
        const centerY = (bounds.top + bounds.bottom) / 2

        ctx.translate(centerX, centerY)
        ctx.rotate(node.rotation ?? 0)
        ctx.translate(-centerX, -centerY)

        ctx.beginPath()
        ctx.moveTo(node.points[0].x, node.points[0].y)
        for (let i = 1; i < node.points.length; i++) {
          ctx.lineTo(node.points[i].x, node.points[i].y)
        }
        ctx.stroke()
      }
    }

    if (node.type === 'triangle') {
      const width = node.width ?? 0
      const height = node.height ?? 0
      const centerX = coordinates.x + width / 2
      const centerY = coordinates.y + height / 2

      ctx.translate(centerX, centerY)
      ctx.rotate(node.rotation ?? 0)
      ctx.beginPath()
      ctx.moveTo(0, -height / 2)
      ctx.lineTo(-width / 2, height / 2)
      ctx.lineTo(width / 2, height / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
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
