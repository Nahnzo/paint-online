export type Point = { x: number; y: number }

export interface BaseToolSettings {
  size: number
}

export interface ColorToolSettings extends BaseToolSettings {
  color: string
}

export interface SprayToolSettings extends ColorToolSettings {
  density: number
}

export interface EraserToolSettings extends BaseToolSettings {
  hardness: number
}

export interface FillBucketToolSettings {
  color: string
  tolerance?: number
}

export type ToolType =
  | 'brush'
  | 'spray'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'fillBucket'

export type ToolCategory = 'drawing' | 'shape' | 'eraser' | 'fillBucket'

export interface ToolSettingsMap {
  brush: ColorToolSettings
  spray: SprayToolSettings
  path: ColorToolSettings
  rectangle: ColorToolSettings
  circle: ColorToolSettings
  triangle: ColorToolSettings
  eraser: EraserToolSettings
  fillBucket: FillBucketToolSettings
}
