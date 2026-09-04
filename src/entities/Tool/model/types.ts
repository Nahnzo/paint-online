export type Point = { x: number; y: number }

export interface BaseToolSettings {
  size: number
  color: string
  backgroundColor?: string
}

export interface ShapeToolSettings extends BaseToolSettings {
  borderWidth: number
}

export interface SprayToolSettings extends BaseToolSettings {
  density: number
}

export interface EraserToolSettings {
  size: number
  hardness: number
}

export interface PaintRollerToolSettings {
  color: string
  tolerance?: number
}

export interface ToolSettingsMap {
  brush: BaseToolSettings
  spray: SprayToolSettings
  path: ShapeToolSettings
  rectangle: ShapeToolSettings
  circle: ShapeToolSettings
  triangle: ShapeToolSettings
  square: ShapeToolSettings
  eraser: EraserToolSettings
  paintRoller: PaintRollerToolSettings
}
export type ToolType =
  | 'brush'
  | 'spray'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'square'
  | 'triangle'
  | 'paintRoller'

export type ToolCategory = 'drawing' | 'shape' | 'eraser' | 'paintRoller'
