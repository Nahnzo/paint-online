import { SprayBrush } from 'entities/Brush'
import { EraserBrush as Eraser } from 'entities/Eraser'
import { ToolStrategy } from './strategy'
import { ToolSettingsMap, ToolType } from './types'
import { CircleNode, PathNode, RectangleNode, TriangleNode } from 'entities/Node'
import { PaintRollerTool } from 'entities/PaintRoller'
import { SceneNode } from 'entities/Scene'

export type AnyToolSettings = ToolSettingsMap[keyof ToolSettingsMap]

export const createTool = (
  tool: ToolType,
  settings: AnyToolSettings,
  onFinishNode: (node: SceneNode) => void,
): ToolStrategy => {
  switch (tool) {
    case 'brush':
      return new PathNode(settings as ToolSettingsMap['brush'], onFinishNode)
    case 'spray':
      return new SprayBrush(settings as ToolSettingsMap['spray'])
    case 'eraser':
      return new Eraser(settings as ToolSettingsMap['eraser'])
    case 'rectangle':
      return new RectangleNode(settings as ToolSettingsMap['rectangle'], onFinishNode)
    case 'circle':
      return new CircleNode(settings as ToolSettingsMap['circle'], onFinishNode)
    case 'triangle':
      return new TriangleNode(settings as ToolSettingsMap['triangle'], onFinishNode)
    case 'paintRoller':
      return new PaintRollerTool(settings as ToolSettingsMap['paintRoller'])
    default:
      return new PathNode(settings as ToolSettingsMap['brush'], onFinishNode)
  }
}
