import { RootState } from 'app/providers/StoreProvider/store'
import { ToolType } from 'entities/Tool'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'

export const getBrushSize = (state: RootState) => state.brush.settings.size ?? 1

export const getBrushColor = (state: RootState) =>
  state.brush.settings.color ?? DEFAULT_COLOR_BRUSH_VALUE

export const getBrushType = (state: RootState) => (state.brush.type as ToolType) ?? 'brush'

export const getToolSettings = (state: RootState) => state.brush.settings
