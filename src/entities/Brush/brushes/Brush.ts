import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettings } from 'entities/Tool/model/types'

export class Brush implements ToolStrategy {
  private lastPoint: Point | null = null

  constructor(private settings: ToolSettings) {}

  onStart(baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.lastPoint = point
  }

  onMove(baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    if (!this.lastPoint) return
    const { color, size } = this.settings

    baseCtx.strokeStyle = color
    baseCtx.lineWidth = size
    baseCtx.lineCap = 'round'

    baseCtx.beginPath()
    baseCtx.moveTo(this.lastPoint.x, this.lastPoint.y)
    baseCtx.lineTo(point.x, point.y)
    baseCtx.stroke()

    this.lastPoint = point
  }

  onEnd() {
    this.lastPoint = null
  }
}
