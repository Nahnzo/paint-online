import { SceneNode } from '../model/types'

export type NodeStyle = {
  color: string
  size: number
  backgroundColor: string
  borderWidth: number
}

export function getNodeSettings(node: SceneNode): NodeStyle {
  return {
    color: node.settings?.color ?? '#ffffff',
    size: node.settings?.size ?? 1,
    backgroundColor: node.settings?.backgroundColor ?? 'transparent',
    borderWidth: node.settings?.borderWidth ?? 1,
  }
}
