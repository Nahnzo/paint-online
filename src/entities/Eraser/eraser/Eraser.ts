import { ToolStrategy, Point } from 'entities/Tool'
import { ToolSettings } from 'entities/Tool/model/types'

export class Eraser implements ToolStrategy {
  constructor(private settings: ToolSettings) {}

  onMove(baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { size, hardness = 1 } = this.settings

    baseCtx.save()
    baseCtx.globalCompositeOperation = 'destination-out'

    const gradient = baseCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size)

    gradient.addColorStop(0, `rgba(0,0,0,${hardness})`)
    gradient.addColorStop(1, `rgba(0,0,0,0)`)

    baseCtx.fillStyle = gradient
    baseCtx.beginPath()
    baseCtx.arc(point.x, point.y, size, 0, Math.PI * 2)
    baseCtx.fill()

    baseCtx.restore()
  }

  onStart() {}
  onEnd() {}
}
