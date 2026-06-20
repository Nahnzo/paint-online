import { ToolCategory, ToolSettingsMap, ToolType } from 'entities/Tool'

export interface Tool<T extends ToolType = ToolType> {
  type: T
  category: ToolCategory
  settings: ToolSettingsMap[T]
}

export type DrawingTool = Tool<'brush' | 'spray'>
export type ShapeTool = Tool<'rectangle' | 'circle' | 'triangle'>
export type EraserTool = Tool<'eraser'>
export type FillBucketTool = Tool<'fillBucket'>
