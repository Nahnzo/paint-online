import { ToolMeta, ToolType } from './types'
import {
  BrushIcon,
  CircleIcon,
  EraserIcon,
  SprayCanIcon,
  SquareIcon,
  TriangleIcon,
} from 'lucide-react'
import { ToolSettings, TOOL_SETTINGS_CONFIG } from 'widgets/ToolSettings'
import { BRUSH_TOOL_OPTIONS, SHAPE_TOOL_OPTIONS } from 'features/ChangeToolType/model/config'
import { ChangeToolType } from 'features/ChangeToolType'

export const TOOL_UI: Record<ToolType, ToolMeta> = {
  brush: {
    changeTypeComponent: <ChangeToolType options={BRUSH_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.brush} />,
    activeToolIcon: <BrushIcon />,
  },
  spray: {
    changeTypeComponent: <ChangeToolType options={BRUSH_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.spray} />,
    activeToolIcon: <SprayCanIcon />,
  },
  eraser: {
    changeTypeComponent: <ChangeToolType options={BRUSH_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.eraser} />,
    activeToolIcon: <EraserIcon />,
  },
  rectangle: {
    changeTypeComponent: <ChangeToolType options={SHAPE_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.rectangle} />,
    activeToolIcon: <SquareIcon />,
  },
  circle: {
    changeTypeComponent: <ChangeToolType options={SHAPE_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.circle} />,
    activeToolIcon: <CircleIcon />,
  },
  triangle: {
    changeTypeComponent: <ChangeToolType options={SHAPE_TOOL_OPTIONS} />,
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.triangle} />,
    activeToolIcon: <TriangleIcon />,
  },
  paintRoller: {
    settingsComponent: <ToolSettings fields={TOOL_SETTINGS_CONFIG.paintRoller} />,
  },
}
