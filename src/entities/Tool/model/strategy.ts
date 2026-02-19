import { Point } from './types'

export interface ToolStrategy {
  onStart(
    baseCtx: CanvasRenderingContext2D,
    overlayCtx: CanvasRenderingContext2D,
    point: Point,
  ): void

  onMove(
    baseCtx: CanvasRenderingContext2D,
    overlayCtx: CanvasRenderingContext2D,
    point: Point,
  ): void

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D): void
}
