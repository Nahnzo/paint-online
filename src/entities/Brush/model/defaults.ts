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
      size: 1,
      density: 20,
    },
  },
  eraser: {
    category: 'eraser',
    type: 'eraser',
    settings: {
      size: 1,
      hardness: 20,
    },
  },
  rectangle: {
    category: 'shape',
    type: 'rectangle',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
  },
  square: {
    category: 'shape',
    type: 'square',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
  },
  circle: {
    category: 'shape',
    type: 'circle',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
  },
  triangle: {
    category: 'shape',
    type: 'triangle',
    settings: {
      color: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
  },
  paintRoller: {
    category: 'paintRoller',
    type: 'paintRoller',
    settings: { color: DEFAULT_COLOR_BRUSH_VALUE },
  },
}
