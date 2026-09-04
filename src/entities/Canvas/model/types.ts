import { RefObject } from 'react'
import { ToolType } from 'entities/Tool'

export type CanvasMode = 'select' | 'draw' | 'zoom'

export interface Canvas {
  canvasMode: CanvasMode
  tool: ToolType
  zoom: {
    percent: number
    offsetX: number
    offsetY: number
  }
  backgroundColor: string
}

export interface CanvasProps {
  baseRef: RefObject<HTMLCanvasElement>
  overlayRef: RefObject<HTMLCanvasElement>
}
