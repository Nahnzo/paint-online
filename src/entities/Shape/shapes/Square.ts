import { ShapeBase } from 'entities/Scene'
import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettings } from 'entities/Tool/model/types'

export class Square implements ToolStrategy {
  startX = 0
  startY = 0
  width = 0
  height = 0

  constructor(
    private settings: ToolSettings,
    private onFinishShape: (shape: ShapeBase) => void,
  ) {}

  onStart(_baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.startX = point.x
    this.startY = point.y
  }

  onMove(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { color, size } = this.settings
    this.width = point.x - this.startX
    this.height = point.y - this.startY

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    overlayCtx.strokeStyle = color
    overlayCtx.lineWidth = size
    overlayCtx.strokeRect(this.startX, this.startY, this.width, this.height)
  }

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    if (!this.width && !this.height) {
      return
    }
    baseCtx.drawImage(overlayCtx.canvas, 0, 0)

    this.onFinishShape({
      id: crypto.randomUUID(),
      type: 'square',
      coordinates: { x: this.startX, y: this.startY },
      width: this.width,
      height: this.height,
      settings: this.settings,
    })
  }
}
