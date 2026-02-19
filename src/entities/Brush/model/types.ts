import { ToolSettings } from 'entities/Tool'

export type ToolCategory = 'brush' | 'shape' | 'eraser' | 'fill-bucket'

export interface ToolBase {
  category: ToolCategory
  settings: ToolSettings
}

export interface BrushTool extends ToolBase {
  category: 'brush'
  type: 'brush' | 'spray'
}

export interface ShapeTool extends ToolBase {
  category: 'shape'
  type: 'square' | 'circle' | 'triangle'
}

export interface EraserTool extends ToolBase {
  category: 'eraser'
  type: 'eraser'
}
export interface FillBucketTool extends ToolBase {
  category: 'fill-bucket'
  type: 'fill-bucket'
}

export type Tool = BrushTool | ShapeTool | EraserTool | FillBucketTool
