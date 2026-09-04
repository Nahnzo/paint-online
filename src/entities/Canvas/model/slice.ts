import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Canvas } from './types'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'

const initialState: Canvas = {
  canvasMode: 'draw',
  tool: 'brush',
  zoom: {
    percent: 100,
    offsetX: 0,
    offsetY: 0,
  },
  backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasMode(state, action) {
      state.canvasMode = action.payload
    },
    setViewport(
      state,
      action: PayloadAction<{ percent: number; offsetX: number; offsetY: number }>,
    ) {
      state.zoom = action.payload
    },
    setBackgroundColor(state, action) {
      state.backgroundColor = action.payload
    },
  },
})

export const canvasActions = canvasSlice.actions
export const canvasReducer = canvasSlice.reducer
