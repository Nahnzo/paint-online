import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tool } from './types'
import { ToolType } from 'entities/Tool'
import { TOOL_DEFAULTS } from './defaults'

const initialState: Tool<ToolType> = TOOL_DEFAULTS.brush

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setToolType(state, action: PayloadAction<ToolType>) {
      return TOOL_DEFAULTS[action.payload]
    },
    setSize(state, action: PayloadAction<number>) {
      if ('size' in state.settings) {
        state.settings.size = action.payload
      }
    },
    setColor(state, action: PayloadAction<string>) {
      if ('color' in state.settings) {
        state.settings.color = action.payload
      }
    },
    setSprayDensity(state, action: PayloadAction<number>) {
      if (state.type === 'spray' && 'density' in state.settings) {
        state.settings.density = action.payload
      }
    },
    setHardness(state, action: PayloadAction<number>) {
      if (state.type === 'eraser' && 'hardness' in state.settings) {
        state.settings.hardness = action.payload
      }
    },
  },
})
export const brushActions = toolSlice.actions
export const brushReducer = toolSlice.reducer
