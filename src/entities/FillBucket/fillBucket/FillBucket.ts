import { Point, ToolStrategy } from 'entities/Tool'
import { ToolSettings } from 'entities/Tool/model/types'

export class FillBucket implements ToolStrategy {
  constructor(private settings: ToolSettings) {}

  onStart(baseCtx: CanvasRenderingContext2D, _overlayCtx: CanvasRenderingContext2D, point: Point) {
    const { width, height } = baseCtx.canvas
    const { color } = this.settings

    const imageData = baseCtx.getImageData(0, 0, width, height)
    const { data } = imageData

    const getIndex = (x: number, y: number) => (y * width + x) * 4

    const startX = Math.floor(point.x)
    const startY = Math.floor(point.y)

    if (startX < 0 || startY < 0 || startX >= width || startY >= height) return

    const startIndex = getIndex(startX, startY)

    const oldColor = [
      data[startIndex],
      data[startIndex + 1],
      data[startIndex + 2],
      data[startIndex + 3],
    ]

    const newColor = this.hexToRgba(color)

    if (
      oldColor[0] === newColor[0] &&
      oldColor[1] === newColor[1] &&
      oldColor[2] === newColor[2] &&
      oldColor[3] === newColor[3]
    ) {
      return
    }

    const queue: [number, number][] = [[startX, startY]]

    while (queue.length) {
      const [x, y] = queue.shift()!

      if (x < 0 || y < 0 || x >= width || y >= height) continue

      const index = getIndex(x, y)

      if (
        data[index] !== oldColor[0] ||
        data[index + 1] !== oldColor[1] ||
        data[index + 2] !== oldColor[2] ||
        data[index + 3] !== oldColor[3]
      ) {
        continue
      }

      data[index] = newColor[0]
      data[index + 1] = newColor[1]
      data[index + 2] = newColor[2]
      data[index + 3] = newColor[3]

      queue.push([x + 1, y])
      queue.push([x - 1, y])
      queue.push([x, y + 1])
      queue.push([x, y - 1])
    }

    baseCtx.putImageData(imageData, 0, 0)
  }

  onMove() {}
  onEnd() {}

  private hexToRgba(hex: string): [number, number, number, number] {
    const cleanHex = hex.replace('#', '')

    const bigint = parseInt(cleanHex, 16)

    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return [r, g, b, 255]
  }
}
