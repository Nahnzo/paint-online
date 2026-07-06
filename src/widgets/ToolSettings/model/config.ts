import { ToolType } from 'entities/Tool'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'
import { ToolSettingsField } from './types'

export const TOOL_SETTINGS_CONFIG: Record<ToolType, ToolSettingsField[]> = {
  brush: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, action: 'setSize' },
  ],
  circle: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, action: 'setSize' },
  ],
  rectangle: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, action: 'setSize' },
  ],
  square: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, action: 'setSize' },
  ],
  triangle: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, action: 'setSize' },
  ],
  eraser: [{ kind: 'range', label: 'Stroke width', min: 1, max: 100, action: 'setSize' }],
  paintRoller: [{ kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE }],
  spray: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 100, action: 'setSize' },
    { kind: 'range', label: 'Density', min: 1, max: 100, action: 'setSprayDensity' },
  ],
}
