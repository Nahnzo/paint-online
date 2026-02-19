import { ToolStrategy, Point } from 'entities/Tool'
import { ToolSettings } from 'entities/Tool'

export class SprayBrush implements ToolStrategy {
  constructor(private settings: ToolSettings) {}

  onStart() {}

  onMove(baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { color, size, density } = this.settings

    baseCtx.fillStyle = color

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * size

      baseCtx.fillRect(point.x + Math.cos(angle) * r, point.y + Math.sin(angle) * r, 1, 1)
    }
  }

  onEnd() {}
}
