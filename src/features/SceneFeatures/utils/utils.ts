import { getNodesSelector } from 'entities/Scene'
import { SceneNode } from 'entities/Scene/model/types'
import { getNodeBounds } from 'features/ShapeFeatures'
import { useEffect } from 'react'
import { useAppSelector } from 'shared/hooks/hooks'

export function renderNodes(ctx: CanvasRenderingContext2D, nodes: SceneNode[]) {
  nodes.forEach((node) => {
    const coordinates = node.coordinates ?? { x: 0, y: 0 }
    const color = node.settings?.color
    const size = node.settings?.size

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = size

    if (node.type === 'rectangle') {
      const width = node.width ?? 0
      const height = node.height ?? 0
      const centerX = coordinates.x + (node.width ?? 0) / 2
      const centerY = coordinates.y + (node.height ?? 0) / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(node.rotation ?? 1)
      ctx.strokeRect(-width / 2, -height / 2, width, height)
      ctx.restore()
    }

    if (node.type === 'circle') {
      const radius = node.radius ?? 0
      ctx.beginPath()
      ctx.arc(coordinates.x, coordinates.y, radius, 0, Math.PI * 2)
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
      ctx.stroke()
    }

    ctx.restore()
  })
}

export const useRenderBase = (baseRef: React.RefObject<HTMLCanvasElement>) => {
  const nodes = useAppSelector(getNodesSelector)

  useEffect(() => {
    const canvas = baseRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    renderNodes(ctx, nodes)
  }, [nodes, baseRef])
}
