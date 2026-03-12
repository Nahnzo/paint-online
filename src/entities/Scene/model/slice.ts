import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialSceneState, ShapeBase } from './types'

const initialState: InitialSceneState = {
  selectedShapeIds: [],
  shapes: [],
}

export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addShape(state, action: PayloadAction<ShapeBase>) {
      state.shapes = [...state.shapes, action.payload]
    },
    selectShape(state, action: PayloadAction<string>) {
      state.selectedShapeIds = [action.payload]
    },
    toggleShapeSelection(state, action: PayloadAction<string>) {
      if (state.selectedShapeIds.includes(action.payload)) {
        state.selectedShapeIds = state.selectedShapeIds.filter((id) => id !== action.payload)
      } else {
        state.selectedShapeIds.push(action.payload)
      }
    },

    clearSelection(state) {
      state.selectedShapeIds = []
    },

    clearShapes(state) {
      state.shapes = []
    },
    moveSelectedShapes(state, action: PayloadAction<{ ids; dx: number; dy: number }>) {
      console.log(action.payload)
      const { dx, dy, ids } = action.payload
      state.shapes.forEach((shape) => {
        if (ids.includes(shape.id)) {
          shape.coordinates.x += dx
          shape.coordinates.y += dy
        }
      })
    },
    removeShape(state, action: PayloadAction<string>) {
      state.shapes = state.shapes.filter((shape) => shape.id !== action.payload)
      state.selectedShapeIds = state.selectedShapeIds.filter((id) => id !== action.payload)
    },
  },
})

export const sceneActions = sceneSlice.actions
export const sceneReducer = sceneSlice.reducer
