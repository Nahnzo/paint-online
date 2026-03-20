import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialSceneState, ShapeBase } from './types'

const initialState: InitialSceneState = {
  selectedShapeIds: [],
  shapes: [],
  pastScene: [],
  futureScene: [],
}
export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addShape(state, action: PayloadAction<ShapeBase>) {
      state.pastScene = [...state.pastScene, [...state.shapes]]
      state.shapes = [...state.shapes, action.payload]
      state.futureScene = []
    },
    moveSelectedShapes(state, action: PayloadAction<{ ids: string[]; dx: number; dy: number }>) {
      const { dx, dy, ids } = action.payload
      state.shapes.forEach((shape) => {
        if (ids.includes(shape.id)) {
          shape.coordinates.x += dx
          shape.coordinates.y += dy
        }
      })
    },
    resizeShape(
      state,
      action: PayloadAction<{ id: string; dx: number; dy: number; handle: string; angle: number }>,
    ) {
      const shape = state.shapes.find((s) => s.id === action.payload.id)
      if (!shape) return

      const { dx, dy, handle, angle } = action.payload

      switch (handle) {
        case 'bottomRight':
          shape.width = (shape.width ?? 0) + dx
          shape.height = (shape.height ?? 0) + dy
          break
        case 'topLeft':
          shape.coordinates.x += dx
          shape.coordinates.y += dy
          shape.width = (shape.width ?? 0) - dx
          shape.height = (shape.height ?? 0) - dy
          break
        case 'topRight':
          shape.coordinates.y += dy
          shape.width = (shape.width ?? 0) + dx
          shape.height = (shape.height ?? 0) - dy
          break
        case 'bottomLeft':
          shape.coordinates.x += dx
          shape.width = (shape.width ?? 0) - dx
          shape.height = (shape.height ?? 0) + dy
          break
        case 'rotate':
          shape.rotation = angle
          break
      }
    },
    undo(state) {
      if (!state.pastScene.length) return
      const previous = state.pastScene[state.pastScene.length - 1]
      state.futureScene = [...state.futureScene, [...state.shapes]]
      state.shapes = previous
      state.pastScene = state.pastScene.slice(0, state.pastScene.length - 1)
    },
    redo(state) {
      if (!state.futureScene.length) return
      const next = state.futureScene[state.futureScene.length - 1]

      state.pastScene = [...state.pastScene, [...state.shapes]]
      state.shapes = next
      state.futureScene = state.futureScene.slice(0, state.futureScene.length - 1)
    },
    commitMove(state, action) {
      state.pastScene = [...state.pastScene, action.payload]
    },
    selectShape(state, action: PayloadAction<string>) {
      state.selectedShapeIds = [action.payload]
    },
    selectMultiShape(state, action: PayloadAction<string[]>) {
      state.selectedShapeIds = [...action.payload]
    },
    clearSelection(state) {
      state.selectedShapeIds = []
    },
    clearShapes(state) {
      state.shapes = []
    },
  },
})

export const sceneActions = sceneSlice.actions
export const sceneReducer = sceneSlice.reducer
