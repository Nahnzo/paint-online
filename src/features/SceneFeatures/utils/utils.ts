import { ShapeBase, getShapesSelector } from 'entities/Scene'
import { useEffect } from 'react'
import { useAppSelector } from 'shared/hooks/hooks'

export function renderShapes(ctx: CanvasRenderingContext2D, shapes: ShapeBase[]) {
  shapes.forEach((shape) => {
    const { x, y } = shape.coordinates
    const { color = '#000000', size = 1 } = shape.settings

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = size

    if (shape.type === 'square') {
      const width = shape.width ?? 0
      const height = shape.height ?? 0
      const centerX = shape.coordinates.x + (shape.width ?? 0) / 2
      const centerY = shape.coordinates.y + (shape.height ?? 0) / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(shape.rotation ?? 1)
      ctx.strokeRect(-width / 2, -height / 2, width, height)
      ctx.restore()
    }

    if (shape.type === 'circle') {
      const radius = shape.radius ?? 0
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    if (shape.type === 'triangle') {
      const width = shape.width ?? 0
      const height = shape.height ?? 0
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
  const shapes = useAppSelector(getShapesSelector)

  useEffect(() => {
    const canvas = baseRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    renderShapes(ctx, shapes)
  }, [shapes, baseRef])
}
