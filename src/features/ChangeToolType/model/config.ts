import {
  BrushIcon,
  SprayCan,
  EraserIcon,
  RectangleHorizontalIcon,
  CircleIcon,
  TriangleIcon,
} from 'lucide-react'
import { ToolTypeOption } from './types'

export const BRUSH_TOOL_OPTIONS: ToolTypeOption[] = [
  { type: 'brush', icon: BrushIcon, ariaLabel: 'Brush-icon' },
  { type: 'spray', icon: SprayCan, ariaLabel: 'Spray-icon' },
  { type: 'eraser', icon: EraserIcon, ariaLabel: 'Eraser-icon' },
]

export const SHAPE_TOOL_OPTIONS: ToolTypeOption[] = [
  { type: 'rectangle', icon: RectangleHorizontalIcon, ariaLabel: 'Rectangle-icon' },
  { type: 'circle', icon: CircleIcon, ariaLabel: 'Circle-icon' },
  { type: 'triangle', icon: TriangleIcon, ariaLabel: 'Triangle-icon' },
]
