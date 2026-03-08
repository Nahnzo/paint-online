export type ToolType =
  | 'brush'
  | 'spray'
  | 'eraser'
  | 'square'
  | 'circle'
  | 'triangle'
  | 'fill-bucket'

export type Point = { x: number; y: number }

export interface ToolSettings {
  color?: string
  size?: number
  hardness?: number
  density?: number
}
