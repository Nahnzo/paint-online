import { Tool } from './types'
import { ToolType } from 'entities/Tool'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'

export const TOOL_DEFAULTS: Record<ToolType, Tool> = {
  brush: {
    category: 'brush',
    type: 'brush',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      size: 1,
    },
  },
  spray: {
    category: 'brush',
    type: 'spray',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      size: 10,
      density: 20,
    },
  },
  eraser: {
    category: 'eraser',
    type: 'eraser',
    settings: {
      size: 10,
      hardness: 20,
    },
  },
  square: {
    category: 'shape',
    type: 'square',
    settings: {
      size: 1,
      color: DEFAULT_COLOR_BRUSH_VALUE,
    },
  },
  circle: {
    category: 'shape',
    type: 'circle',
    settings: {
      size: 1,
      color: DEFAULT_COLOR_BRUSH_VALUE,
    },
  },
  triangle: {
    category: 'shape',
    type: 'triangle',
    settings: {
      size: 1,
      color: DEFAULT_COLOR_BRUSH_VALUE,
    },
  },
  'fill-bucket': {
    category: 'fill-bucket',
    type: 'fill-bucket',
    settings: { color: DEFAULT_COLOR_BRUSH_VALUE },
  },
}
