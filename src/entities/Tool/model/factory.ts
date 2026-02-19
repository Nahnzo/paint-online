import { PenBrush as Brush, SprayBrush } from 'entities/Brush'
import { EraserBrush as Eraser } from 'entities/Eraser'
import { ToolStrategy } from './strategy'
import { ToolSettings, ToolType } from './types'
import { Square } from 'entities/Shape/shapes/Square'
import { Circle } from 'entities/Shape/shapes/Circle'
import { FillBucketTool } from 'entities/FillBucket'
import { Triangle } from 'entities/Shape/shapes/Triangle'
import { ShapeBase } from 'entities/Scene'

export const createTool = (
  tool: ToolType,
  settings: ToolSettings,
  onFinishShape: (shape: ShapeBase) => void,
): ToolStrategy => {
  switch (tool) {
    case 'brush':
      return new Brush(settings)
    case 'spray':
      return new SprayBrush(settings)
    case 'eraser':
      return new Eraser(settings)
    case 'square':
      return new Square(settings, onFinishShape)
    case 'circle':
      return new Circle(settings, onFinishShape)
    case 'triangle':
      return new Triangle(settings, onFinishShape)
    case 'fill-bucket':
      return new FillBucketTool(settings)
    default:
      return new Brush(settings)
  }
}
