import { Bounds, SceneNode } from '../model/types'

export function getNodeBounds(node: SceneNode): Bounds {
  const coordinates = node.coordinates ?? { x: 0, y: 0 }
  switch (node.type) {
    case 'rectangle':
    case 'triangle':
    case 'square':
      return {
        left: coordinates.x ?? 0,
        top: coordinates.y ?? 0,
        right: (coordinates.x ?? 0) + (node.width ?? 0),
        bottom: (coordinates.y ?? 0) + (node.height ?? 0),
      }

    case 'circle':
      return {
        left: (coordinates.x ?? 0) - (node.radius ?? 0),
        top: (coordinates.y ?? 0) - (node.radius ?? 0),
        right: (coordinates.x ?? 0) + (node.radius ?? 0),
        bottom: (coordinates.y ?? 0) + (node.radius ?? 0),
      }

    case 'path': {
      const points = node.points ?? []
      if (points.length === 0) {
        return { left: 0, top: 0, right: 0, bottom: 0 }
      }

      let minX = points[0].x
      let minY = points[0].y
      let maxX = points[0].x
      let maxY = points[0].y

      for (let i = 1; i < points.length; i++) {
        minX = Math.min(minX, points[i].x)
        minY = Math.min(minY, points[i].y)
        maxX = Math.max(maxX, points[i].x)
        maxY = Math.max(maxY, points[i].y)
      }

      return { left: minX, top: minY, right: maxX, bottom: maxY }
    }

    default:
      return { left: 0, top: 0, right: 0, bottom: 0 }
  }
}

export const getGroupBounds = (nodes: SceneNode[]): Bounds => ({
  left: Math.min(...nodes.map((s) => getNodeBounds(s)!.left)),
  right: Math.max(...nodes.map((s) => getNodeBounds(s)!.right)),
  top: Math.min(...nodes.map((s) => getNodeBounds(s)!.top)),
  bottom: Math.max(...nodes.map((s) => getNodeBounds(s)!.bottom)),
})
