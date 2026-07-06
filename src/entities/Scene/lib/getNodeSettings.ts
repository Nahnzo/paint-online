import { SceneNode } from '../model/types'

export type NodeStyle = {
  color: string
  size: number
}

export function getNodeSettings(node: SceneNode): NodeStyle {
  return {
    color: node.settings?.color ?? '#ffffff',
    size: node.settings?.size ?? 1,
  }
}
