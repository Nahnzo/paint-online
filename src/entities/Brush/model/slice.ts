import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tool } from './types'
import { AnyToolSettings, ToolType } from 'entities/Tool'
import { TOOL_DEFAULTS } from './defaults'

const initialState: Tool<ToolType> = TOOL_DEFAULTS.brush

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setToolType(state, action: PayloadAction<ToolType>) {
      return TOOL_DEFAULTS[action.payload]
    },
    updateSettings(state, action: PayloadAction<Partial<AnyToolSettings>>) {
      Object.assign(state.settings, action.payload)
    },
  },
})
export const brushActions = toolSlice.actions
export const brushReducer = toolSlice.reducer
