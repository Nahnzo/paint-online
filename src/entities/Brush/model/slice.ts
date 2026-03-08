import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tool } from './types'
import { TOOL_DEFAULTS } from './defaults'
import { ToolType } from 'entities/Tool'

const initialState: Tool = TOOL_DEFAULTS.brush

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setToolType(state, action: PayloadAction<ToolType>) {
      return TOOL_DEFAULTS[action.payload]
    },
    setSize(state, action: PayloadAction<number>) {
      state.settings.size = action.payload
    },
    setColor(state, action: PayloadAction<string>) {
      if (
        state.category === 'brush' ||
        state.category === 'shape' ||
        state.category === 'fill-bucket'
      ) {
        state.settings.color = action.payload
      }
    },
    setSprayDensity(state, action: PayloadAction<number>) {
      if (state.type !== 'spray') return
      state.settings.density = action.payload
    },
  },
})
export const brushActions = toolSlice.actions
export const brushReducer = toolSlice.reducer
