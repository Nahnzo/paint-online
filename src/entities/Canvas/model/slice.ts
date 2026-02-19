import { createSlice } from '@reduxjs/toolkit'
import { Canvas } from './types'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'

const initialState: Canvas = {
  canvasMode: 'draw',
  tool: 'brush',
  backgroundColor: DEFAULT_BACKGROUND_CANVAS_VALUE,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasMode(state, action) {
      state.canvasMode = action.payload
    },
    setBackgroundColor(state, action) {
      state.backgroundColor = action.payload
    },
  },
})

export const canvasActions = canvasSlice.actions
export const canvasReducer = canvasSlice.reducer
