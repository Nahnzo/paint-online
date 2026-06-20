import { SceneNode } from 'entities/Scene'
import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettingsMap } from 'entities/Tool/model/types'

export class CircleNode implements ToolStrategy {
  startX = 0
  startY = 0
  radius = 0

  constructor(
    private settings: ToolSettingsMap['circle'],
    private onFinishNode: (node: SceneNode) => void,
  ) {}

  onStart(_baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.startX = point.x
    this.startY = point.y
  }

  onMove(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { color = 'white', size = 1 } = this.settings

    const dx = point.x - this.startX
    const dy = point.y - this.startY
    this.radius = Math.sqrt(dx * dx + dy * dy)

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    overlayCtx.strokeStyle = color
    overlayCtx.lineWidth = size

    overlayCtx.beginPath()
    overlayCtx.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI)
    overlayCtx.stroke()
  }

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    if (!this.radius) {
      return
    }
    baseCtx.drawImage(overlayCtx.canvas, 0, 0)
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height) // 👈 добавить

    this.onFinishNode({
      id: crypto.randomUUID(),
      type: 'circle',
      coordinates: { x: this.startX, y: this.startY },
      rotation: 0,
      radius: this.radius,
      settings: this.settings,
    })
  }
}
