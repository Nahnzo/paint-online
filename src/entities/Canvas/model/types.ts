import { ToolType } from 'entities/Tool'

export type CanvasMode = 'select' | 'draw' | 'zoom'

export interface Canvas {
  canvasMode: CanvasMode
  tool: ToolType
  backgroundColor: string
}
