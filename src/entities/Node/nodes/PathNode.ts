import { SceneNode } from 'entities/Scene'
import { ToolStrategy, Point, ToolSettingsMap } from 'entities/Tool'

export class PathNode implements ToolStrategy {
  private points: Point[] = []
  private currentPathId: string = ''

  constructor(
    private settings: ToolSettingsMap['brush'],
    private onFinishNode: (node: SceneNode) => void,
  ) {}

  onStart(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.points = [point]
    this.currentPathId = crypto.randomUUID()

    const { color = 'white' } = this.settings

    overlayCtx.beginPath()
    overlayCtx.arc(point.x, point.y, 2, 0, Math.PI * 2)
    overlayCtx.fillStyle = color
    overlayCtx.fill()
  }

  onMove(_baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D, point: Point) {
    this.points.push(point)
    const { color = 'white', size = 1 } = this.settings

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    overlayCtx.strokeStyle = color
    overlayCtx.lineWidth = size
    overlayCtx.lineCap = 'round'

    overlayCtx.beginPath()
    overlayCtx.moveTo(this.points[0].x, this.points[0].y)

    for (let i = 1; i < this.points.length; i++) {
      overlayCtx.lineTo(this.points[i].x, this.points[i].y)
    }
    overlayCtx.stroke()
  }

  onEnd(baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    if (this.points.length < 2) {
      return
    }
    baseCtx.drawImage(overlayCtx.canvas, 0, 0)
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height)

    this.onFinishNode({
      type: 'path',
      id: this.currentPathId,
      points: this.points,
      isStart: false,
      settings: this.settings,
    })
  }
}
