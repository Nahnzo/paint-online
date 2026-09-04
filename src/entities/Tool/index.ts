import { ToolStrategy } from './model/strategy'
import { ToolType, Point, ToolSettingsMap, ToolCategory, BaseToolSettings } from './model/types'

import { createTool } from './model/factory'
import { AnyToolSettings, AnyToolSettingsKey } from './model/factory'

export type {
  Point,
  ToolStrategy,
  ToolType,
  ToolSettingsMap,
  ToolCategory,
  AnyToolSettings,
  BaseToolSettings,
  AnyToolSettingsKey,
}

export { createTool }
