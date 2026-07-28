import { SceneNode } from 'entities/Scene'
import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettingsMap } from 'entities/Tool/model/types'

export class SquareNode implements ToolStrategy {
  startX = 0
  startY = 0
  width = 0
  height = 0

  constructor(
    private settings: ToolSettingsMap['square'],
    private onFinishNode: (node: SceneNode) => void,
  ) {}

  onStart(_baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.startX = point.x
    this.startY = point.y
  }

  onMove(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { color = 'white', size = 1, backgroundColor = 'transparent' } = this.settings

    const side = Math.max(Math.abs(point.x - this.startX), Math.abs(point.y - this.startY))
    this.width = point.x < this.startX ? -side : side
    this.height = point.y < this.startY ? -side : side

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)
    overlayCtx.fillStyle = backgroundColor
    overlayCtx.fillRect(this.startX, this.startY, this.width, this.height)
    overlayCtx.strokeStyle = color
    overlayCtx.lineWidth = size
    overlayCtx.strokeRect(this.startX, this.startY, this.width, this.height)
  }

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    if (!this.width && !this.height) {
      return
    }
    baseCtx.drawImage(overlayCtx.canvas, 0, 0)
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    this.onFinishNode({
      id: crypto.randomUUID(),
      type: 'square',
      coordinates: { x: this.startX, y: this.startY },
      width: this.width,
      height: this.height,
      rotation: 0,
      settings: this.settings,
    })
  }
}
