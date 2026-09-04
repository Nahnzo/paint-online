import { ToolType } from 'entities/Tool'
import { DEFAULT_BACKGROUND_CANVAS_VALUE, DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'
import { ToolSettingsField } from './types'

export const TOOL_SETTINGS_CONFIG: Record<ToolType, ToolSettingsField[]> = {
  brush: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, settingsKey: 'size' },
  ],
  circle: [
    {
      kind: 'color',
      label: 'Stroke color',
      defaultValue: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
    },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, settingsKey: 'borderWidth' },
  ],
  rectangle: [
    {
      kind: 'color',
      label: 'Stroke color',
      defaultValue: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
      borderWidth: 1,
    },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, settingsKey: 'borderWidth' },
  ],
  square: [
    {
      kind: 'color',
      label: 'Stroke color',
      defaultValue: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
    },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, settingsKey: 'borderWidth' },
  ],
  triangle: [
    {
      kind: 'color',
      label: 'Stroke color',
      defaultValue: DEFAULT_COLOR_BRUSH_VALUE,
      backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
    },
    { kind: 'range', label: 'Stroke width', min: 1, max: 20, settingsKey: 'borderWidth' },
  ],
  eraser: [{ kind: 'range', label: 'Stroke width', min: 1, max: 100, settingsKey: 'size' }],
  paintRoller: [{ kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE }],
  spray: [
    { kind: 'color', label: 'Stroke color', defaultValue: DEFAULT_COLOR_BRUSH_VALUE },
    { kind: 'range', label: 'Stroke width', min: 1, max: 100, settingsKey: 'size' },
    { kind: 'range', label: 'Density', min: 1, max: 100, settingsKey: 'density' },
  ],
}
