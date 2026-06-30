import { Tool } from './types'
import { ToolType } from 'entities/Tool'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'

export const TOOL_DEFAULTS: Record<ToolType, Tool<ToolType>> = {
  brush: {
    category: 'drawing',
    type: 'brush',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      size: 1,
    },
  },
  spray: {
    category: 'drawing',
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
  rectangle: {
    category: 'shape',
    type: 'rectangle',
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
  paintRoller: {
    category: 'paintRoller',
    type: 'paintRoller',
    settings: { color: DEFAULT_COLOR_BRUSH_VALUE },
  },
}
