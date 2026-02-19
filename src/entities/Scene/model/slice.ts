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
      console.log(state.shapes)
    },
    selectShape(state, action: PayloadAction<string>) {
      if (!state.selectedShapeIds.includes(action.payload)) {
        state.selectedShapeIds = [action.payload]
      }
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
    moveSelectedShapes(state, action: PayloadAction<{ dx: number; dy: number }>) {
      const { dx, dy } = action.payload
      state.shapes = state.shapes.map((shape) => {
        if (state.selectedShapeIds.includes(shape.id)) {
          return {
            ...shape,
            coordinates: {
              x: shape.coordinates.x + dx,
              y: shape.coordinates.y + dy,
            },
          }
        }
        return shape
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
