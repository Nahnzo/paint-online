import { getNodeBounds, SceneNode } from 'entities/Scene'

type NodeOfType<T extends SceneNode['type']> = Extract<SceneNode, { type: T }>

export const renderRectangleNode = (
  ctx: CanvasRenderingContext2D,
  node: NodeOfType<'rectangle' | 'square'>,
) => {
  const coordinates = node.coordinates ?? { x: 0, y: 0 }
  const width = node.width ?? 0
  const height = node.height ?? 0
  const centerX = coordinates.x + width / 2
  const centerY = coordinates.y + height / 2
  ctx.translate(centerX, centerY)
  ctx.rotate(node.rotation ?? 0)
  ctx.fillRect(-width / 2, -height / 2, width, height)
  ctx.strokeRect(-width / 2, -height / 2, width, height)
}

export const renderCircleNode = (ctx: CanvasRenderingContext2D, node: NodeOfType<'circle'>) => {
  const coordinates = node.coordinates ?? { x: 0, y: 0 }
  const radius = node.radius ?? 0
  ctx.beginPath()
  ctx.arc(coordinates.x, coordinates.y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
}

export const renderPathNode = (ctx: CanvasRenderingContext2D, node: NodeOfType<'path'>) => {
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

export const renderTriangleNode = (ctx: CanvasRenderingContext2D, node: NodeOfType<'triangle'>) => {
  const coordinates = node.coordinates ?? { x: 0, y: 0 }
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
