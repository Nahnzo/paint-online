import { getShapesSelector } from 'entities/Scene'
import { SceneNode } from 'entities/Scene/model/types'
import { useEffect } from 'react'
import { useAppSelector } from 'shared/hooks/hooks'

export function renderNodes(ctx: CanvasRenderingContext2D, nodes: SceneNode[]) {
  nodes.forEach((node) => {
    const x = node.coordinates?.x
    const y = node.coordinates?.y
    const color = node.settings?.color ?? '#c50d0d'
    const size = node.settings?.size ?? 1

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = size

    if (node.type === 'rectangle') {
      const width = node.width ?? 0
      const height = node.height ?? 0
      const centerX = node.coordinates.x + (node.width ?? 0) / 2
      const centerY = node.coordinates.y + (node.height ?? 0) / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(node.rotation ?? 1)
      ctx.strokeRect(-width / 2, -height / 2, width, height)
      ctx.restore()
    }

    if (node.type === 'circle') {
      const radius = node.radius ?? 0
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    if (node.type === 'path') {
      console.log(node)
      if (node.points && node.points.length > 1) {
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
      const x2 = x + width
      const y2 = y + height
      const centerX = (x + x2) / 2

      ctx.beginPath()
      ctx.moveTo(centerX, y)
      ctx.lineTo(x, y2)
      ctx.lineTo(x2, y2)
      ctx.closePath()
      ctx.stroke()
    }

    ctx.restore()
  })
}

export const useRenderBase = (baseRef: React.RefObject<HTMLCanvasElement>) => {
  const nodes = useAppSelector(getShapesSelector)

  useEffect(() => {
    const canvas = baseRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    renderNodes(ctx, nodes)
  }, [nodes, baseRef])
}
