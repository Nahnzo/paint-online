import { SceneNode } from 'entities/Scene'
import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettingsMap } from 'entities/Tool/model/types'

export class TriangleNode implements ToolStrategy {
  startX = 0
  startY = 0
  width = 0
  height = 0

  constructor(
    private settings: ToolSettingsMap['triangle'],
    private onFinishNode: (node: SceneNode) => void,
  ) {}

  onStart(_baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.startX = point.x
    this.startY = point.y
  }

  onMove(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { color = 'white', size = 1 } = this.settings

    this.width = point.x - this.startX
    this.height = point.y - this.startY

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    overlayCtx.strokeStyle = color
    overlayCtx.lineWidth = size

    const x1 = this.startX
    const y1 = this.startY
    const x2 = this.startX + this.width
    const y2 = this.startY + this.height
    const centerX = (x1 + x2) / 2

    overlayCtx.beginPath()
    overlayCtx.moveTo(centerX, y1)
    overlayCtx.lineTo(x1, y2)
    overlayCtx.lineTo(x2, y2)
    overlayCtx.closePath()
    overlayCtx.stroke()
  }

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    if (!this.width && !this.height) {
      return
    }
    baseCtx.drawImage(overlayCtx.canvas, 0, 0)
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height) // 👈 добавить

    this.onFinishNode({
      id: crypto.randomUUID(),
      type: 'triangle',
      coordinates: { x: this.startX, y: this.startY },
      width: this.width,
      height: this.height,
      rotation: 0,
      settings: this.settings,
    })
  }
}
